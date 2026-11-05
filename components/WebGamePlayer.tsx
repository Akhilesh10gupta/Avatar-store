'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Game } from '@/lib/firestore';
import { Button } from '@/components/ui/Button';
import { 
    Play, 
    Maximize, 
    Minimize, 
    RotateCcw, 
    ExternalLink, 
    Globe, 
    Loader2, 
    Sparkles, 
    Gamepad2,
    ShieldAlert
} from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { addUserXPAction } from '@/app/actions/userActions';

interface WebGamePlayerProps {
    game: Game;
    autoPlay?: boolean;
    className?: string;
}

export default function WebGamePlayer({ game, autoPlay = false, className = '' }: WebGamePlayerProps) {
    const { user } = useAuth();
    const [isPlaying, setIsPlaying] = useState(autoPlay);
    const [isLoading, setIsLoading] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [reloadKey, setReloadKey] = useState(0);
    const [xpAwarded, setXpAwarded] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const playUrl = game.webPlayUrl;

    // Extract domain for source attribution
    const domainName = (() => {
        if (!playUrl) return 'External Site';
        try {
            return new URL(playUrl).hostname.replace(/^www\./, '');
        } catch {
            return 'External Site';
        }
    })();

    // Award XP when the player starts playing
    const handleStartPlaying = () => {
        setIsPlaying(true);
        setIsLoading(true);

        if (user && !xpAwarded) {
            setXpAwarded(true);
            addUserXPAction(user.uid, 50).then((result: any) => {
                if (result && typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('xp-gained', {
                        detail: {
                            amount: result.amount,
                            source: 'Played Web Game',
                            newLevel: result.newLevel,
                            newTitle: result.newTitle
                        }
                    }));
                }
            }).catch(() => {});
        }
    };

    // Toggle Fullscreen using HTML5 Fullscreen API
    const toggleFullscreen = async () => {
        if (!containerRef.current) return;

        try {
            if (!document.fullscreenElement) {
                await containerRef.current.requestFullscreen();
                setIsFullscreen(true);
            } else {
                await document.exitFullscreen();
                setIsFullscreen(false);
            }
        } catch (err) {
            console.error("Fullscreen error:", err);
        }
    };

    // Listen for fullscreen change events (e.g. if user presses Esc key)
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const handleReload = () => {
        setIsLoading(true);
        setReloadKey(prev => prev + 1);
    };

    if (!playUrl) {
        return null;
    }

    return (
        <div className={`space-y-3 ${className}`}>
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-1">
                <div className="flex items-center gap-2 text-sm">
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-semibold text-xs">
                        <Globe className="w-3.5 h-3.5" />
                        Online Web Game
                    </span>
                    <span className="text-muted-foreground text-xs hidden sm:inline">
                        Hosted on <strong className="text-foreground">{domainName}</strong>
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    {/* Reload Button */}
                    {isPlaying && (
                        <button
                            onClick={handleReload}
                            title="Reload Game"
                            className="p-2 rounded-lg bg-secondary/80 hover:bg-secondary text-secondary-foreground text-xs transition-colors border border-border/50 flex items-center gap-1.5"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span className="hidden md:inline">Restart</span>
                        </button>
                    )}

                    {/* Dedicated Full Page Link */}
                    {game.id && (
                        <Link
                            href={`/play/${game.id}`}
                            className="p-2 px-3 rounded-lg bg-secondary/80 hover:bg-secondary text-secondary-foreground text-xs transition-colors border border-border/50 flex items-center gap-1.5 font-medium"
                            title="Dedicated Theatre Screen"
                        >
                            <Gamepad2 className="w-3.5 h-3.5 text-primary" />
                            <span className="hidden sm:inline">Theatre Mode</span>
                        </Link>
                    )}

                    {/* Fullscreen Toggle */}
                    {isPlaying && (
                        <button
                            onClick={toggleFullscreen}
                            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                            className="p-2 px-3 rounded-lg bg-secondary/80 hover:bg-secondary text-secondary-foreground text-xs transition-colors border border-border/50 flex items-center gap-1.5 font-medium"
                        >
                            {isFullscreen ? (
                                <>
                                    <Minimize className="w-3.5 h-3.5" />
                                    <span>Exit Fullscreen</span>
                                </>
                            ) : (
                                <>
                                    <Maximize className="w-3.5 h-3.5 text-cyan-400" />
                                    <span>Fullscreen</span>
                                </>
                            )}
                        </button>
                    )}

                    {/* Hybrid Fallback: Open in New Tab Button */}
                    <a
                        href={playUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 px-3 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-xs transition-colors border border-primary/20 flex items-center gap-1.5 font-medium"
                        title="Open game on external website in a new tab"
                    >
                        <span>Open in New Tab</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                </div>
            </div>

            {/* Game Screen Container */}
            <div
                ref={containerRef}
                className={`relative w-full aspect-video min-h-[380px] sm:min-h-[480px] md:min-h-[580px] rounded-2xl overflow-hidden border border-border/60 bg-black shadow-2xl flex items-center justify-center ${
                    isFullscreen ? 'fixed inset-0 z-[9999] rounded-none border-0 min-h-screen' : ''
                }`}
            >
                {!isPlaying ? (
                    /* Splash Screen before Play */
                    <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden">
                        {/* Background Poster */}
                        {(game.coverImage || game.cardImage) && (
                            <Image
                                src={game.coverImage || game.cardImage || ''}
                                alt={game.title}
                                fill
                                className="object-cover opacity-30 blur-sm scale-105"
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

                        {/* Foreground Action */}
                        <div className="relative z-10 flex flex-col items-center max-w-md space-y-4">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-cyan-500/20 border-2 border-cyan-400/50 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.4)] animate-pulse">
                                <Gamepad2 className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-400" />
                            </div>

                            <div className="space-y-1">
                                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
                                    {game.title}
                                </h3>
                                <p className="text-xs sm:text-sm text-white/70">
                                    Instant browser gameplay. No download or installation required.
                                </p>
                            </div>

                            <Button
                                size="lg"
                                onClick={handleStartPlaying}
                                className="px-8 py-6 rounded-xl font-bold text-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-xl shadow-cyan-500/30 border-none flex items-center gap-2 group transition-all transform hover:scale-105"
                            >
                                <Play className="w-6 h-6 fill-current group-hover:scale-110 transition-transform" />
                                Play Game Now
                            </Button>

                            <p className="text-[11px] text-white/50 flex items-center gap-1.5 pt-2">
                                <Sparkles className="w-3 h-3 text-cyan-400" />
                                Earns +50 XP upon playing
                            </p>
                        </div>
                    </div>
                ) : (
                    /* Active Iframe Embed */
                    <>
                        {isLoading && (
                            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/90 text-white gap-3">
                                <Loader2 className="w-10 h-10 animate-spin text-cyan-400" />
                                <span className="text-sm font-medium text-white/80">Connecting to {domainName}...</span>
                                <span className="text-xs text-white/50">Loading game files into browser cache</span>
                            </div>
                        )}

                        <iframe
                            key={reloadKey}
                            src={playUrl}
                            title={`${game.title} - Online Play`}
                            onLoad={() => setIsLoading(false)}
                            className="w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen; gamepad; xr-spatial-tracking"
                            allowFullScreen
                            loading="eager"
                        />
                    </>
                )}
            </div>

            {/* Hybrid Info & Troubleshooting Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-2 py-2 rounded-xl bg-secondary/30 border border-border/40 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                    If the game screen stays white/blank due to ad-blockers or browser security:
                </span>
                <a
                    href={playUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline font-medium ml-5 sm:ml-0 shrink-0"
                >
                    Click to Open in New Window ({domainName})
                    <ExternalLink className="w-3 h-3" />
                </a>
            </div>
        </div>
    );
}

