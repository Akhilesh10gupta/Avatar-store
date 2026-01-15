'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Home, Gamepad2, XCircle, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function NotFound() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth - 0.5) * 20,
                y: (e.clientY / window.innerHeight - 0.5) * 20,
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden font-mono">
            {/* CRT Overlay */}
            <div className="absolute inset-0 z-50 pointer-events-none crt" />

            {/* Retro Grid Background */}
            <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(transparent 95%, #a855f7 95%),
                                      linear-gradient(90deg, transparent 95%, #a855f7 95%)`,
                    backgroundSize: '40px 40px',
                    transform: `perspective(500px) rotateX(60deg) translateY(${mousePosition.y}px) translateX(${mousePosition.x}px) scale(2)`,
                    transformOrigin: 'center 0%'
                }}
            />

            {/* Glowing Orbs */}
            <motion.div
                animate={{
                    x: [0, 100, -100, 0],
                    y: [0, -50, 50, 0],
                    scale: [1, 1.2, 1]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/4 left-1/3 w-96 h-96 bg-primary/20 rounded-full blur-[120px]"
            />
            <motion.div
                animate={{
                    x: [0, -50, 50, 0],
                    y: [0, 100, -100, 0],
                    scale: [1, 1.5, 1]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px]"
            />

            {/* Content Container */}
            <div className="relative z-10 text-center space-y-8 p-4">
                {/* 404 Glitch Text */}
                <div className="relative">
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-[12rem] font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 select-none"
                        style={{ textShadow: '4px 4px 0px #a855f7' }}
                    >
                        404
                    </motion.h1>
                    <motion.div
                        animate={{ opacity: [0, 1, 0, 1, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
                        className="absolute inset-0 text-[12rem] font-black leading-none text-red-500 mix-blend-screen opacity-50 translate-x-1"
                    >
                        404
                    </motion.div>
                </div>

                {/* Game Over Message */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-2"
                >
                    <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-widest text-red-500 glow-text">
                        Game Over
                    </h2>
                    <p className="text-xl text-primary font-bold tracking-wider animate-pulse">
                        INSERT COIN TO CONTINUE
                    </p>
                </motion.div>

                {/* Stats / Details */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="flex justify-center gap-8 text-sm text-green-400 font-mono bg-black/50 p-4 border border-green-500/30 rounded inline-block backdrop-blur-sm"
                >
                    <div>
                        <span className="opacity-50">ERROR_CODE:</span>
                        <span className="ml-2">LEVEL_NOT_FOUND</span>
                    </div>
                    <div>
                        <span className="opacity-50">SCORE:</span>
                        <span className="ml-2">000000</span>
                    </div>
                </motion.div>

                {/* Interactive Buttons */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="flex flex-col sm:flex-row gap-6 justify-center pt-8"
                >
                    <Link href="/">
                        <Button
                            size="lg"
                            className="bg-primary hover:bg-primary/90 text-white min-w-[200px] h-14 text-lg font-bold border-b-4 border-primary-foreground/20 active:border-b-0 active:translate-y-1 transition-all group"
                        >
                            <RotateCcw className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                            TRY AGAIN
                        </Button>
                    </Link>

                    <Link href="/browse">
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-green-500 text-green-500 hover:bg-green-500/10 min-w-[200px] h-14 text-lg font-bold border-b-4 active:border-b-0 active:translate-y-1 transition-all"
                        >
                            <Gamepad2 className="w-5 h-5 mr-2" />
                            SELECT LEVEL
                        </Button>
                    </Link>
                </motion.div>
            </div>

            {/* Floating Debris/Particles */}
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full opacity-20"
                    initial={{
                        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                        y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
                    }}
                    animate={{
                        y: [null, Math.random() * -100],
                        opacity: [0.2, 0],
                    }}
                    transition={{
                        duration: Math.random() * 5 + 5,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />
            ))}
        </div>
    );
}
