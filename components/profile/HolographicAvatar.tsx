'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useAuth } from '@/components/AuthProvider';

export const HolographicAvatar = () => {
    const { user } = useAuth();
    const photoURL = user?.photoURL;
    const displayName = user?.displayName || 'User';

    return (
        <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center group">
            {/* Outer Ring - Rotating Slow */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border border-dashed border-violet-500/30 w-full h-full"
            />

            {/* Middle Ring - Rotating Fast Reverse */}
            <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 rounded-full border-[2px] border-t-purple-500/50 border-r-transparent border-b-purple-500/50 border-l-transparent w-[calc(100%-2rem)] h-[calc(100%-2rem)]"
            />

            {/* Inner Ring - Pulsing */}
            <motion.div
                animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-8 rounded-full border border-violet-400/40 w-[calc(100%-4rem)] h-[calc(100%-4rem)] shadow-[0_0_15px_rgba(139,92,246,0.2)]"
            />

            {/* Core Avatar Container */}
            <div className="relative w-28 h-28 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-white/20 z-10 bg-black">
                {/* Glitch Overlay (Hidden by default, visible on hover) */}
                <div className="absolute inset-0 z-20 bg-violet-500/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-100" />
                <div className="absolute inset-0 z-20 bg-[url('/noise.png')] opacity-0 group-hover:opacity-20 animate-noise pointer-events-none" />

                {/* Scanline */}
                <motion.div
                    animate={{ top: ['0%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-1 bg-violet-400/50 blur-[2px] z-20 opacity-0 group-hover:opacity-100"
                />

                {photoURL ? (
                    <Image
                        src={photoURL}
                        alt={displayName}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500 filter group-hover:contrast-125 group-hover:brightness-110"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-white font-bold text-4xl">
                        {displayName.charAt(0)}
                    </div>
                )}
            </div>

            {/* Glowing Emitter Effects */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-cyan-500/50 blur-lg" />
        </div>
    );
};
