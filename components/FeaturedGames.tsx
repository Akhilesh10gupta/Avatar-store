'use client';

import { useRef, useState, useEffect } from 'react';
import Link from "next/link";
import { ArrowRight, Gamepad2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import GameCard from "@/components/GameCard";
import { Game } from "@/lib/firestore";
import { cn } from "@/lib/utils";

interface FeaturedGamesProps {
    games: Game[];
}

export default function FeaturedGames({ games }: FeaturedGamesProps) {
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
            const scrollAmount = clientWidth * 0.8; // Scroll 80% of view
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
            // checkScroll will be called by onScroll event
        }
    };

    return (
        <section className="space-y-6 relative group/section">
            <div className="flex items-center justify-between px-1">
                <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
                    <div className="p-2.5 bg-violet-500/10 rounded-xl border border-violet-500/10">
                        <Gamepad2 className="w-6 h-6 text-violet-400" />
                    </div>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        Featured Games
                    </span>
                </h2>
                <Link href="/browse">
                    <Button variant="ghost" className="group text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 transition-all duration-300">
                        View All
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </Link>
            </div>

            <div className="relative group/slider">
                {/* Left Navigation Button */}
                <button
                    onClick={() => scroll('left')}
                    className={cn(
                        "absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white shadow-xl transition-all duration-300 opacity-0 group-hover/slider:opacity-100 disabled:opacity-0 disabled:pointer-events-none hover:bg-black/80 hover:scale-110 -ml-6 hidden md:flex",
                        !canScrollLeft && "hidden"
                    )}
                    disabled={!canScrollLeft}
                    aria-label="Scroll left"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>

                {/* Scroll Container */}
                <div
                    ref={scrollContainerRef}
                    onScroll={checkScroll}
                    className="flex gap-6 overflow-x-auto pb-8 pt-2 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide snap-x snap-mandatory scroll-smooth"
                >
                    {games.map((game) => (
                        <div key={game.id} className="min-w-[280px] md:min-w-[320px] snap-center transform transition-transform duration-300 hover:-translate-y-2">
                            <GameCard game={game} />
                        </div>
                    ))}
                </div>

                {/* Right Navigation Button */}
                <button
                    onClick={() => scroll('right')}
                    className={cn(
                        "absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white shadow-xl transition-all duration-300 opacity-0 group-hover/slider:opacity-100 disabled:opacity-0 disabled:pointer-events-none hover:bg-black/80 hover:scale-110 -mr-6 hidden md:flex",
                        !canScrollRight && "hidden"
                    )}
                    disabled={!canScrollRight}
                    aria-label="Scroll right"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>

                {/* Fade Gradients (Mobile Only) */}
                <div className={cn(
                    "absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-background to-transparent pointer-events-none transition-opacity duration-300 md:hidden",
                    !canScrollLeft ? "opacity-0" : "opacity-100"
                )} />
                <div className={cn(
                    "absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-background to-transparent pointer-events-none transition-opacity duration-300 md:hidden",
                    !canScrollRight ? "opacity-0" : "opacity-100"
                )} />
            </div>
        </section>
    );
}
