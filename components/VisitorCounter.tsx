'use client';

import { useState, useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { Users, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function VisitorCounter() {
    const [count, setCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    // Spring animation for the number
    const springCount = useSpring(0, {
        stiffness: 50,
        damping: 20,
        duration: 2000
    });

    const displayCount = useTransform(springCount, (latest) => Math.floor(latest).toLocaleString());

    useEffect(() => {
        const initCounter = async () => {
            try {
                // Dynamic import
                const { getVisitorCount, incrementVisitorCount } = await import('@/lib/firestore');

                // Get current count
                let current = await getVisitorCount();

                // Check session
                const hasVisited = sessionStorage.getItem('has_visited_site');
                if (!hasVisited) {
                    await incrementVisitorCount();
                    current++;
                    sessionStorage.setItem('has_visited_site', 'true');
                }

                // Add base offset of 1500 as requested
                const totalCount = current + 1500;

                setCount(totalCount);
                springCount.set(totalCount);
                setIsLoading(false);
            } catch (error) {
                console.error("Failed to load visitor count:", error);
                setIsLoading(false);
            }
        };

        // Delay slightly for effect
        setTimeout(initCounter, 500);
    }, [springCount]);

    return (
        <div className="relative group">
            {/* Ambient Glow - Toned down */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/40 to-purple-600/40 rounded-full blur opacity-0 group-hover:opacity-50 transition duration-700" />

            {/* Container - Pill Shape */}
            <div className="relative bg-[#0A0A0A] border border-white/10 py-1.5 pl-1.5 pr-4 rounded-full flex items-center gap-3 overflow-hidden transition-all duration-300 hover:bg-white/5 hover:border-primary/30 hover:shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]">

                {/* Cyber Icon Circle */}
                <div className="relative w-7 h-7 flex items-center justify-center bg-white/5 rounded-full border border-white/5 group-hover:border-primary/80 group-hover:bg-primary/20 transition-all duration-300 shrink-0">
                    <Users className="w-3.5 h-3.5 text-white/70 group-hover:text-white transition-colors relative z-10" />

                    {/* Live Indicator Dot */}
                    <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500 border border-black"></span>
                    </span>
                </div>

                {/* Compact Data Display */}
                <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium hidden md:block group-hover:text-white transition-colors duration-300">
                        Players
                    </span>

                    {isLoading ? (
                        <div className="h-4 w-12 bg-white/10 animate-pulse rounded" />
                    ) : (
                        <motion.span className="text-sm font-bold font-mono text-white tracking-widest leading-none drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
                            {displayCount}
                        </motion.span>
                    )}
                </div>
            </div>
        </div>
    );
}
