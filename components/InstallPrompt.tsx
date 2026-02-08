'use client';

import { Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInstall } from './InstallProvider';

export default function InstallPrompt() {
    const { isInstallable, handleInstallClick, showBanner, setShowBanner } = useInstall();

    if (!isInstallable || !showBanner) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="fixed bottom-20 left-4 right-4 md:bottom-8 md:left-auto md:right-8 md:w-auto z-50 flex items-center gap-4 bg-[#1a1a1a]/90 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-2xl"
            >
                <div className="flex-1 ">
                    <h3 className="font-bold text-white text-sm">Install Avatar Play</h3>
                    <p className="text-xs text-muted-foreground">Get the best gaming experience</p>
                </div>
                <button
                    onClick={handleInstallClick}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg shadow-primary/20"
                >
                    Install
                </button>
                <button
                    onClick={() => setShowBanner(false)}
                    className="text-white/40 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </motion.div>
        </AnimatePresence>
    );
}
