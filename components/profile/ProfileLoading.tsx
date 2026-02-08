'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export const ProfileLoading = () => {
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState('INITIALIZING SYSTEM...');

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                // Random jumps for "hacking" feel
                return prev + Math.random() * 15;
            });
        }, 150);

        const msgs = [
            'CONNECTING TO NEURAL NET...',
            'FETCHING PLAYER DATA...',
            'DECRYPTING BADGES...',
            'SYNCING ACHIEVEMENTS...',
            'LOADING HOLOGRAPHIC INTERFACE...',
            'SYSTEM READY.'
        ];

        let msgIndex = 0;
        const msgInterval = setInterval(() => {
            msgIndex = (msgIndex + 1) % msgs.length;
            if (progress < 100) {
                setMessage(msgs[msgIndex]);
            }
        }, 600);

        return () => {
            clearInterval(interval);
            clearInterval(msgInterval);
        };
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background text-violet-500 font-mono">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-20" />

            <div className="relative w-64 text-center space-y-4">
                {/* Rotating Loader */}
                <div className="relative w-16 h-16 mx-auto mb-8">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-t-2 border-r-2 border-violet-500 rounded-full"
                    />
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-2 border-b-2 border-l-2 border-fuchsia-500 rounded-full opacity-70"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    </div>
                </div>

                {/* Text Glitch Effect */}
                <div className="h-6 overflow-hidden">
                    <motion.p
                        key={message}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm tracking-widest font-bold text-violet-400"
                    >
                        {message}
                    </motion.p>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden mt-4 border border-zinc-700">
                    <motion.div
                        animate={{ width: `${Math.min(100, progress)}%` }}
                        className="h-full bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.8)]"
                    />
                </div>

                <div className="flex justify-between text-[10px] text-zinc-500 uppercase tracking-wider mt-1">
                    <span>Sys.v.2.0</span>
                    <span>{Math.round(Math.min(100, progress))}%</span>
                </div>
            </div>
        </div>
    );
};
