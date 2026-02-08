'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface InstallContextType {
    isInstallable: boolean;
    handleInstallClick: () => void;
    showBanner: boolean;
    setShowBanner: (show: boolean) => void;
}

const InstallContext = createContext<InstallContextType | null>(null);

export function InstallProvider({ children }: { children: React.ReactNode }) {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isInstallable, setIsInstallable] = useState(false);
    const [showBanner, setShowBanner] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);

    useEffect(() => {
        // Build PWA Install Prompt
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsInstallable(true);
            setShowBanner(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        // Check for iOS
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

        if (isIosDevice && !isStandalone) {
            setIsIOS(true);
            setIsInstallable(true);
            setShowBanner(true);
        }

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            setDeferredPrompt(null);
            setIsInstallable(false);
            setShowBanner(false);
        } else if (isIOS) {
            setShowInstructions(true);
        }
    };

    return (
        <InstallContext.Provider value={{ isInstallable, handleInstallClick, showBanner, setShowBanner }}>
            {children}
            {/* iOS Instructions Modal */}
            {showInstructions && (
                <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setShowInstructions(false)}>
                    <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 max-w-sm w-full space-y-4" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-start">
                            <h3 className="text-lg font-bold text-white">Install on iOS</h3>
                            <button onClick={() => setShowInstructions(false)} className="text-white/40 hover:text-white">✕</button>
                        </div>
                        <div className="space-y-4 text-sm text-balance text-muted-foreground">
                            <p>To install Avatar Play on your iPhone/iPad:</p>
                            <div className="flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white font-bold shrink-0">1</span>
                                <span>Tap the <strong>Share</strong> button <span className="inline-block mx-1">⎋</span> in your browser menu.</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white font-bold shrink-0">2</span>
                                <span>Scroll down and select <strong>Add to Home Screen</strong> <span className="inline-block mx-1">⊕</span>.</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </InstallContext.Provider>
    );
}

export function useInstall() {
    const context = useContext(InstallContext);
    if (!context) {
        throw new Error('useInstall must be used within an InstallProvider');
    }
    return context;
}
