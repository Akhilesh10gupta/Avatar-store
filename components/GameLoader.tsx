'use client';

import { motion } from 'framer-motion';
import { Gamepad2 } from 'lucide-react';

interface GameLoaderProps {
    className?: string;
    text?: string;
    fullScreen?: boolean;
}

const GameLoader = ({ className = "", text = "Loading World...", fullScreen = false }: GameLoaderProps) => {
    const loaderContent = (
        <div className={`flex flex-col items-center justify-center gap-6 ${className}`}>
            <div className="relative">
                {/* Rotating Glow Ring */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-[-20px] rounded-full border-2 border-primary/30 border-t-primary shadow-[0_0_15px_rgba(var(--primary),0.5)]"
                />

                {/* Pulsing Background */}
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 bg-primary/20 blur-xl rounded-full"
                />

                {/* Gamepad Icon */}
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        rotate: [-5, 5, -5]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="relative z-10"
                >
                    <Gamepad2 className="w-12 h-12 text-primary" />
                </motion.div>
            </div>

            <motion.p
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    repeatType: "reverse"
                }}
                className="text-lg font-bold tracking-wider text-white font-mono"
            >
                {text}
            </motion.p>
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0a]">
                {loaderContent}
            </div>
        );
    }

    return loaderContent;
};

export default GameLoader;
