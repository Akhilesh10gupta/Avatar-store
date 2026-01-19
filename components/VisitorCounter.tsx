'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function VisitorCounter() {
    const [count, setCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    // Odometer Digit Component
    const Digit = ({ value }: { value: number }) => (
        <div className="relative h-[1em] w-[0.6em] overflow-hidden">
            <motion.div
                initial={{ y: 0 }}
                animate={{ y: `-${value * 10}%` }}
                transition={{ type: "spring", stiffness: 40, damping: 12 }}
                className="absolute top-0 left-0 flex flex-col w-full h-[1000%]" // 10 items so 1000% height relative to container? No, if we use % of self, standard flow works well if container is fixed.
            // Actually frame-motion 'y' % is usually relative to element size. 
            // If element height is auto (10 digits stacked), and container is 1 digit height.
            // y: -10% should shift by 1/10th of total height. Correct.
            >
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                    <div key={i} className="h-[10%] flex items-center justify-center">
                        {i}
                    </div>
                ))}
            </motion.div>
        </div>
    );

    const CounterDisplay = ({ value }: { value: number }) => {
        // Format with commas, then split
        const chars = value.toLocaleString().split('');
        return (
            <div className="flex items-center font-mono font-bold text-white tracking-widest leading-none drop-shadow-[0_0_8px_rgba(255,255,255,0.2)] text-sm">
                {chars.map((char, i) => {
                    if (/\d/.test(char)) {
                        return <Digit key={i} value={parseInt(char)} />;
                    }
                    return <span key={i} className="w-[0.3em] text-center">{char}</span>;
                })}
            </div>
        );
    };

    useEffect(() => {
        let unsubscribe: (() => void) | undefined;

        const initCounter = async () => {
            try {
                const { subscribeToVisitorCount, incrementVisitorCount } = await import('@/lib/firestore');

                // 1. Check if new visitor and increment if needed
                const hasVisited = sessionStorage.getItem('has_visited_site');
                if (!hasVisited) {
                    await incrementVisitorCount();
                    sessionStorage.setItem('has_visited_site', 'true');
                }

                // 2. Subscribe to real-time updates
                unsubscribe = subscribeToVisitorCount((realTimeCount) => {
                    const totalCount = realTimeCount + 1500; // Add base offset
                    setCount(totalCount);
                    setIsLoading(false);
                });

            } catch (error) {
                console.error("Failed to init visitor counter:", error);
                setIsLoading(false);
            }
        };

        initCounter();

        // Cleanup subscription on unmount
        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, []);

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
                        <CounterDisplay value={count} />
                    )}
                </div>
            </div>
        </div>
    );
}
