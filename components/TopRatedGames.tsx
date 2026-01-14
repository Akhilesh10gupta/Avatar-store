'use client';

import { useRef, useState, useEffect } from 'react';
import Link from "next/link";
import { ChevronLeft, ChevronRight, Trophy } from "lucide-react";
import GameCard from "@/components/GameCard";
import { Game } from "@/lib/firestore";
import { cn } from "@/lib/utils";

interface TopRatedGamesProps {
    games: Game[];
}

export default function TopRatedGames({ games }: TopRatedGamesProps) {
    // Sort games by downloadCount (descending), then by rating
    const sortedGames = [...games].sort((a, b) => {
        const downloadsA = a.downloadCount || 0;
        const downloadsB = b.downloadCount || 0;
        if (downloadsA !== downloadsB) {
            return downloadsB - downloadsA;
        }
        return (b.rating || 0) - (a.rating || 0);
    });

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10); // buffer
        }
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, [games]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const { clientWidth } = scrollContainerRef.current;
            const scrollAmount = clientWidth * 0.8;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between px-1">
                <Link href="/browse" className="group flex items-center gap-1 cursor-pointer">
                    <h2 className="text-xl font-bold text-white group-hover:text-white/90 transition-colors flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-500" />
                        Top Rated Games
                    </h2>
                    <ChevronRight className="w-5 h-5 text-white transform group-hover:translate-x-1 transition-transform" />
                </Link>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => scroll('left')}
                        disabled={!canScrollLeft}
                        className={cn(
                            "w-8 h-8 flex items-center justify-center rounded-full border border-white/20 bg-card/40 transition-colors text-white",
                            !canScrollLeft ? "opacity-30 cursor-not-allowed" : "hover:bg-white hover:text-black hover:border-transparent cursor-pointer"
                        )}
                        aria-label="Scroll left"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        disabled={!canScrollRight}
                        className={cn(
                            "w-8 h-8 flex items-center justify-center rounded-full border border-white/20 bg-card/40 transition-colors text-white",
                            !canScrollRight ? "opacity-30 cursor-not-allowed" : "hover:bg-white hover:text-black hover:border-transparent cursor-pointer"
                        )}
                        aria-label="Scroll right"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Slider */}
            <div className="relative">
                <div
                    ref={scrollContainerRef}
                    onScroll={checkScroll}
                    className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide snap-x snap-mandatory scroll-smooth"
                >
                    {sortedGames.map((game, index) => (
                        <div key={game.id} className="min-w-[240px] md:min-w-[280px] snap-start relative">
                            {/* Rank Badge */}
                            <div className="absolute top-2 left-2 z-10 bg-yellow-500/90 text-black font-bold w-8 h-8 flex items-center justify-center rounded-full shadow-lg text-sm border-2 border-white/20">
                                #{index + 1}
                            </div>
                            <GameCard game={game} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
