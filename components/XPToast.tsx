'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, ChevronUp } from 'lucide-react';

export type XPEventDetail = {
    amount: number;
    source: string; // e.g., 'Daily Login', 'Game Download'
    newLevel?: number; // If set, means level up happened
    newTitle?: string;
};

export default function XPToast() {
    const [events, setEvents] = useState<(XPEventDetail & { id: number })[]>([]);

    useEffect(() => {
        const handleXPEvent = (e: CustomEvent<XPEventDetail>) => {
            const newEvent = { ...e.detail, id: Date.now() };
            setEvents((prev) => [...prev, newEvent]);

            // Auto dismiss after 4 seconds
            setTimeout(() => {
                setEvents((prev) => prev.filter((ev) => ev.id !== newEvent.id));
            }, 4000);
        };

        window.addEventListener('xp-gained' as any, handleXPEvent as any);
        return () => window.removeEventListener('xp-gained' as any, handleXPEvent as any);
    }, []);

    return (
        <div className="fixed top-24 right-4 z-50 flex flex-col gap-2 pointer-events-none">
            <AnimatePresence>
                {events.map((event) => (
                    <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: 50, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 20, scale: 0.8 }}
                        layout
                        className={`pointer-events-auto flex items-center gap-3 p-4 rounded-xl border shadow-2xl backdrop-blur-md min-w-[280px] overflow-hidden relative ${event.newLevel
                            ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/50'
                            : 'bg-black/80 border-white/10'
                            }`}
                    >
                        {/* Background Effect for Level Up */}
                        {event.newLevel && (
                            <div className="absolute inset-0 bg-yellow-500/10 animate-pulse" />
                        )}

                        <div className={`p-2 rounded-lg ${event.newLevel ? 'bg-yellow-500 text-black' : 'bg-primary/20 text-primary'}`}>
                            {event.newLevel ? <Trophy className="w-6 h-6" /> : <Star className="w-5 h-5" />}
                        </div>

                        <div className="flex-1">
                            {event.newLevel ? (
                                <>
                                    <h4 className="font-black text-yellow-400 text-lg uppercase leading-none mb-1">Level Up!</h4>
                                    <p className="text-xs text-white/80 font-medium">You are now level <span className="text-white font-bold text-sm">{event.newLevel}</span></p>
                                    {event.newTitle && <p className="text-[10px] text-yellow-500/80 uppercase tracking-widest mt-1">{event.newTitle}</p>}
                                </>
                            ) : (
                                <>
                                    <h4 className="font-bold text-white text-sm leading-tight">+{event.amount} XP</h4>
                                    <p className="text-xs text-muted-foreground">{event.source}</p>
                                </>
                            )}
                        </div>

                        {event.newLevel && (
                            <div className="absolute -right-2 -bottom-2 text-yellow-500/10 transform rotate-12">
                                <Trophy className="w-24 h-24" />
                            </div>
                        )}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
