import Image from 'next/image';
import Link from 'next/link';
import { Download, Monitor, Smartphone, Layers, Crown, Medal, Trophy } from 'lucide-react';
import { Game } from '@/lib/firestore'; // Assuming types are exported from here or a types file

import { getOptimizedImage } from '@/lib/cloudinary';

import { cn } from "@/lib/utils";

interface GameCardProps {
    game: Game;
    className?: string;
    variant?: 'default' | 'clean';
    rank?: number;
}

const RankBadge = ({ rank }: { rank: number }) => {
    if (rank > 10) return null; // Only show top 10 badges prominently to avoid clutter, or maybe plain styles for others.

    let bgClass = "bg-black/60 border-white/10 text-white/70";
    let icon = null;
    let glowClass = "";

    if (rank === 1) {
        bgClass = "bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-700 text-black border-yellow-200";
        icon = <Crown className="w-3 h-3 mb-0.5 fill-black/20" />;
        glowClass = "shadow-[0_0_15px_rgba(234,179,8,0.6)]";
    } else if (rank === 2) {
        bgClass = "bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 text-slate-900 border-white/50";
        icon = <Medal className="w-3 h-3 mb-0.5" />;
        glowClass = "shadow-[0_0_15px_rgba(226,232,240,0.4)]";
    } else if (rank === 3) {
        bgClass = "bg-gradient-to-br from-orange-300 via-orange-400 to-amber-700 text-white border-orange-200/50";
        icon = <Trophy className="w-3 h-3 mb-0.5" />;
        glowClass = "shadow-[0_0_15px_rgba(217,119,6,0.4)]";
    }

    return (
        <div className={cn(
            "absolute top-0 left-4 z-20",
            "w-8 h-10", // Banner shape usually taller
            "flex flex-col items-center justify-center",
            "font-black text-sm leading-none",
            "before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:bottom-0 before:bg-inherit before:skew-y-0", // simplified marker
            // Let's do a classic "Ribbon" or "Bookmark" shape with CSS clip-path for that gaming look
            // Using a simple styled box for now that looks premium
        )}>
            {/* The Badge Itself */}
            <div className={cn(
                "relative w-8 h-8 flex items-center justify-center rounded-b-lg border-b-2 border-x-2 border-t-0 shadow-xl",
                bgClass,
                glowClass
            )}>
                <div className="flex flex-col items-center justify-center transform -translate-y-0.5">
                    {icon}
                    <span>{rank}</span>
                </div>

                {/* Top "Hinge" part to look like it's hanging */}
                <div className="absolute -top-3 w-10 h-4 bg-black/40 blur-sm rounded-full -z-10" />
            </div>
        </div>
    );
};

// Alternative simpler "Hexagon" or "Cyber" badge for more direct gaming feel
const CyberBadge = ({ rank }: { rank: number }) => {
    let colors = "from-slate-800 to-slate-950 border-white/10 text-white/50";
    let size = "w-9 h-9"; // Slightly larger base
    let icon = null;

    if (rank === 1) {
        colors = "from-yellow-400 to-yellow-600 border-yellow-200 text-black";
        size = "w-11 h-11 scale-110";
        icon = <Crown className="w-4 h-4 fill-black/10" />;
    } else if (rank === 2) {
        colors = "from-slate-300 to-slate-500 border-white/50 text-slate-900";
        icon = <Medal className="w-3.5 h-3.5" />;
    } else if (rank === 3) {
        colors = "from-amber-600 to-amber-800 border-orange-300/50 text-white";
        icon = <Trophy className="w-3.5 h-3.5" />;
    }

    return (
        <div className={cn(
            "absolute -top-2 -left-2 z-30 flex items-center justify-center filter drop-shadow-lg",
            size
        )}>
            {/* Background Shape (Rotated Square) */}
            <div className={cn(
                "absolute inset-0 bg-gradient-to-br rounded-xl transform rotate-6 shadow-xl border",
                colors
            )} />
            <div className={cn(
                "absolute inset-0 bg-black/30 rounded-xl transform -rotate-3 -z-10"
            )} />

            {/* Content */}
            <div className="relative font-black italic flex flex-col items-center justify-center leading-none w-full h-full pb-0.5 transform -rotate-0">
                {icon}
                <span className="text-xs md:text-sm mt-0.5">{rank}</span>
            </div>
        </div>
    )
}

const GameCard = ({ game, className, variant = 'default', rank }: GameCardProps) => {
    const imageUrl = game.coverImage ? getOptimizedImage(game.coverImage, 600, 800) : 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=2070&auto=format&fit=crop';

    if (variant === 'clean') {
        return (
            <Link href={`/game/${game.id}`} className={cn("group block h-full", className)}>
                <div className="space-y-3">
                    {/* Image Wrapper with Badge */}
                    <div className="relative">
                        <div className="aspect-[3/4] relative overflow-hidden rounded-lg">
                            <Image
                                src={imageUrl}
                                alt={game.title}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                        </div>
                        {/* Badge outside overflow-hidden */}
                        {rank && <CyberBadge rank={rank} />}
                    </div>

                    {/* Text Content */}
                    <div>
                        <div className="text-[10px] md:text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                            Base Game
                        </div>
                        <h3 className="font-bold text-sm md:text-base text-white leading-tight truncate px-0 group-hover:text-primary transition-colors">
                            {game.title}
                        </h3>
                    </div>
                </div>
            </Link>
        );
    }

    return (
        <Link href={`/game/${game.id}`} className={cn("group block h-full", className)}>
            <div className="relative rounded-xl bg-card border border-border/50 hover:border-primary/50 hover:shadow-[0_0_25px_-5px_rgba(139,92,246,0.3)] transition-all duration-300 h-full flex flex-col cursor-pointer">
                {rank && <CyberBadge rank={rank} />}
                {/* Image Container */}
                <div className="aspect-[3/4] relative overflow-hidden rounded-t-xl">
                    <Image
                        src={imageUrl}
                        alt={game.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Hover Overlay - Soft brightness boost instead of shadow */}
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="p-4 space-y-2 flex-grow flex flex-col justify-end">
                    <h3 className="font-bold text-lg leading-tight truncate text-foreground group-hover:text-violet-400 transition-colors">
                        {game.title}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-muted-foreground group-hover:text-muted-foreground/80">
                        <span className="bg-secondary px-2 py-0.5 rounded text-secondary-foreground">{game.genre}</span>
                        <div className="flex items-center gap-1">
                            {game.platform === 'Android' ? (
                                <>
                                    <Smartphone className="w-3 h-3" />
                                    <span>Android</span>
                                </>
                            ) : game.platform === 'Both' ? (
                                <>
                                    <Layers className="w-3 h-3" />
                                    <span>PC + Android</span>
                                </>
                            ) : (
                                <>
                                    <Monitor className="w-3 h-3" />
                                    <span>PC</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default GameCard;
