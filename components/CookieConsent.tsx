'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, X } from 'lucide-react';
import { Button } from './ui/Button';

export default function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('avatar-play-cookie-consent');
        if (!consent) {
            // Delay rendering slightly for smooth entrance
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAcceptAll = () => {
        localStorage.setItem('avatar-play-cookie-consent', 'all');
        setIsVisible(false);
    };

    const handleAcceptEssential = () => {
        localStorage.setItem('avatar-play-cookie-consent', 'essential');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md z-50 animate-in slide-in-from-bottom-5 fade-in duration-500">
            <div className="bg-card/90 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl relative overflow-hidden flex flex-col gap-4">
                {/* Accent line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-indigo-500"></div>
                
                <div className="flex items-start gap-4">
                    <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 shrink-0">
                        <ShieldCheck className="w-6 h-6 text-primary" />
                    </div>
                    <div className="space-y-1 flex-1">
                        <h4 className="font-bold text-white text-base">Cookie Consent</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            We use cookies to personalize advertisements (via Google AdSense), analyze traffic, and support our community platform features. 
                        </p>
                    </div>
                    <button 
                        onClick={handleAcceptEssential} 
                        className="text-muted-foreground hover:text-white transition-colors p-1"
                        aria-label="Close"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <p className="text-[11px] text-muted-foreground">
                    By clicking "Accept All", you consent to our use of all cookies. You can manage preferences or read more in our{' '}
                    <Link href="/legal/cookies" className="text-primary hover:underline font-semibold">
                        Cookie Policy
                    </Link>.
                </p>

                <div className="flex gap-3 justify-end mt-2">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs font-semibold px-4 h-9 bg-transparent border-white/10 hover:bg-white/5"
                        onClick={handleAcceptEssential}
                    >
                        Essential Only
                    </Button>
                    <Button 
                        variant="primary" 
                        size="sm" 
                        className="text-xs font-bold px-5 h-9"
                        onClick={handleAcceptAll}
                    >
                        Accept All
                    </Button>
                </div>
            </div>
        </div>
    );
}
