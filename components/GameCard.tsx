import Image from 'next/image';
import Link from 'next/link';
import { Download, Monitor, Smartphone, Layers } from 'lucide-react';
import { Game } from '@/lib/firestore'; // Assuming types are exported from here or a types file

import { getOptimizedImage } from '@/lib/cloudinary';

interface GameCardProps {
    game: Game;
}

const GameCard = ({ game }: GameCardProps) => {
    const imageUrl = game.coverImage ? getOptimizedImage(game.coverImage, 600, 800) : 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=2070&auto=format&fit=crop';

    return (
        <Link href={`/game/${game.id}`} className="group block h-full">
            <div className="relative overflow-hidden rounded-xl bg-card border border-border/50 hover:border-primary/50 transition-colors h-full flex flex-col cursor-pointer">
                {/* Image Container */}
                <div className="aspect-[3/4] relative overflow-hidden">
                    <Image
                        src={imageUrl}
                        alt={game.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Hover Overlay - Soft gradient only, no button */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="p-4 space-y-2 flex-grow flex flex-col justify-end">
                    <h3 className="font-bold text-lg leading-tight truncate text-foreground group-hover:text-primary transition-colors">
                        {game.title}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
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
