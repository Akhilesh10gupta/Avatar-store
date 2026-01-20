'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/Button';
import { ArrowRight, Sparkles, Gamepad2, Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Game } from '@/lib/firestore';
import { getOptimizedImage, getAICardImage } from '@/lib/cloudinary';
import { cn } from '@/lib/utils';


interface HeroProps {
    games: Game[];
}

const Hero = ({ games }: HeroProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [activeMobileIndex, setActiveMobileIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // Filter games to ensure we have content, or use a fallback if empty
    // Logic: Show 3 Latest + 3 Top Rated
    const logicGames = (() => {
        if (games.length === 0) return [];

        // 1. Get 3 Latest (Assumed sorted by createdAt desc from parent)
        const latest = games.slice(0, 3);

        // 2. Get 3 Top Rated (Filter out games already in latest to avoid dups)
        // Clone and sort by rating
        const rated = [...games]
            .filter(g => !latest.some(l => l.id === g.id))
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, 3);

        return [...latest, ...rated];
    })();

    const heroGames = logicGames;

    const handleMobileScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const container = e.currentTarget;
        const scrollPosition = container.scrollLeft;
        const containerWidth = container.offsetWidth;
        const containerCenter = scrollPosition + containerWidth / 2;

        const children = Array.from(container.children) as HTMLElement[];

        let closestIndex = 0;
        let minDistance = Infinity;

        children.forEach((child, index) => {
            const childStart = child.offsetLeft;
            const childWidth = child.offsetWidth;
            const childCenter = childStart + childWidth / 2;

            const distance = Math.abs(containerCenter - childCenter);

            if (distance < minDistance) {
                minDistance = distance;
                closestIndex = index;
            }
        });

        setActiveMobileIndex(closestIndex);
    };

    useEffect(() => {
        if (!isAutoPlaying || heroGames.length === 0) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % heroGames.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [isAutoPlaying, heroGames.length, currentIndex]); // Reset timer on index change

    if (heroGames.length === 0) return null;

    const activeGame = heroGames[currentIndex];

    // Helper to handle manual selection
    const handleSelect = (index: number) => {
        setCurrentIndex(index);
    };

    return (
        <div className="w-full my-6 md:my-8 relative">
            {/* Mobile Hero (Carousel) */}
            <div className="md:hidden w-full relative">
                {/* Cards Container */}
                <div
                    className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-4 px-4 pb-8"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    onScroll={handleMobileScroll}
                >
                    {heroGames.map((game, index) => (
                        <div
                            key={game.id}
                            className="relative min-w-[75vw] h-[55vh] snap-center rounded-[32px] overflow-hidden shrink-0 shadow-xl border border-white/5"
                        >
                            <Link href={`/game/${game.id}`} className="block w-full h-full">
                                <Image
                                    src={
                                        game.cardImage
                                            ? getOptimizedImage(game.cardImage, 600, 800)
                                            : getAICardImage(game.coverImage, 600, 800)
                                    }
                                    alt={game.title}
                                    fill
                                    className="object-cover"
                                    priority={index === 0}
                                />
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                                {/* Content */}
                                <div className="absolute bottom-0 left-0 p-6 w-full flex flex-col items-start gap-2">
                                    {/* Badges */}
                                    <div className="flex gap-2 mb-1">
                                        {game.price !== '0' && game.price ? (
                                            <span className="px-2 py-0.5 rounded-md bg-white/10 backdrop-blur-md text-white text-xs font-medium">
                                                ₹{game.price}
                                            </span>
                                        ) : (
                                            <span className="px-2 py-0.5 rounded-md bg-white/10 backdrop-blur-md text-white text-xs font-medium">
                                                Free
                                            </span>
                                        )}
                                        <span className="px-2 py-0.5 rounded-md bg-white/10 backdrop-blur-md text-white text-xs font-medium">
                                            {game.genre}
                                        </span>
                                    </div>

                                    <h3 className="text-2xl font-bold text-white leading-tight drop-shadow-md">
                                        {game.title}
                                    </h3>

                                    <p className="text-sm text-white/80 line-clamp-2 max-w-[90%] mb-2">
                                        {game.description}
                                    </p>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Pagination Dots (Optional: Simple visual indicator) */}
                <div className="flex justify-center gap-1.5 absolute bottom-0 left-0 right-0">
                    {heroGames.map((_, idx) => (
                        <div
                            key={idx}
                            className={cn(
                                "w-1.5 h-1.5 rounded-full transition-all duration-300",
                                idx === activeMobileIndex ? "bg-white w-4" : "bg-white/20"
                            )}
                        />
                    ))}
                </div>
            </div>

            {/* Desktop Hero (Grid) */}
            <section className="hidden md:grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px] w-full">
                {/* Main Stage (3 cols) */}
                <div className="lg:col-span-3 relative rounded-3xl overflow-hidden group">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeGame.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.7 }}
                            className="absolute inset-0"
                        >
                            {/* Background Image */}
                            <Image
                                src={getAICardImage(activeGame.coverImage, 1200, 800)}
                                alt={activeGame.title}
                                fill
                                className="object-cover"
                                priority
                            />
                            {/* Gradients */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                        </motion.div>
                    </AnimatePresence>

                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 p-8 md:p-12 max-w-2xl flex flex-col items-start gap-4 z-10">
                        <motion.div
                            key={`content-${activeGame.id}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                        >
                            {/* Logo or Title */}
                            <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight drop-shadow-lg text-white">
                                {activeGame.title}
                            </h2>

                            <div className="flex flex-wrap gap-3 mb-6">
                                <span className="px-3 py-1 rounded bg-secondary/80 backdrop-blur-md text-secondary-foreground text-sm font-medium">
                                    {activeGame.genre}
                                </span>
                                <span className="px-3 py-1 rounded bg-primary/80 backdrop-blur-md text-primary-foreground text-sm font-medium">
                                    {activeGame.platform === 'Both' ? 'PC & Android' : activeGame.platform}
                                </span>
                            </div>

                            <p className="text-lg text-white/90 line-clamp-2 md:line-clamp-3 mb-8 max-w-xl drop-shadow-md">
                                {activeGame.description}
                            </p>

                            <div className="flex gap-4 w-full md:w-auto">
                                <Link href={`/game/${activeGame.id}`} className="w-full md:w-auto">
                                    <Button size="lg" className="rounded-xl px-8 py-6 text-lg font-semibold shadow-xl shadow-primary/20 w-full md:w-auto whitespace-nowrap flex items-center justify-center">
                                        Download Now <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>
                                </Link>
                                {/* Wishlist button removed for now */}
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Right List (1 col) */}
                <div className="hidden lg:flex flex-col gap-2 h-full overflow-y-auto pr-2 custom-scrollbar">
                    {heroGames.map((game, index) => (
                        <button
                            key={game.id}
                            onClick={() => handleSelect(index)}
                            className={cn(
                                "relative flex items-center gap-4 p-3 rounded-xl transition-all duration-300 text-left group w-full overflow-hidden",
                                currentIndex === index
                                    ? "scale-[1.02] shadow-lg"
                                    : "hover:bg-secondary/50 hover:pl-4 opacity-70 hover:opacity-100"
                            )}
                        >
                            {/* Progress Fill Background */}
                            {currentIndex === index && (
                                <motion.div
                                    className="absolute inset-0 bg-secondary/80 z-0"
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 5, ease: "linear" }}
                                />
                            )}

                            {/* Thumbnail */}
                            <div className="relative w-12 h-16 rounded-lg overflow-hidden shrink-0 shadow-sm border border-white/5 z-10">
                                <Image
                                    src={
                                        game.cardImage
                                            ? getOptimizedImage(game.cardImage, 200, 300)
                                            : getAICardImage(game.coverImage, 200, 300)
                                    }
                                    alt={game.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {/* Title */}
                            <span className={cn(
                                "font-medium text-sm line-clamp-2 z-10 relative transition-colors",
                                currentIndex === index ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                            )}>
                                {game.title}
                            </span>
                        </button>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Hero;
