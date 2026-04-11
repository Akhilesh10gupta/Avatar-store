'use client';

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { incrementDownloadAction } from "@/app/actions/gameActions";
import { addUserXPAction, incrementUserDownloadAction } from "@/app/actions/userActions";
import { Monitor, Smartphone, X, Download } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import AdBanner from "./AdBanner";

interface DownloadButtonProps {
    gameId: string;
    href: string;
    platform: 'PC' | 'Android';
}

export default function DownloadButton({ gameId, href, platform }: DownloadButtonProps) {
    const { user } = useAuth();
    const [showAdModal, setShowAdModal] = useState(false);

    const handleInitialClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setShowAdModal(true);
    };

    const handleFinalDownload = async () => {
        setShowAdModal(false);
        await incrementDownloadAction(gameId);
        
        if (user) {
            // Run in background to avoid blocking download
            incrementUserDownloadAction(user.uid);
            addUserXPAction(user.uid, 50).then((result: any) => {
                if (result && typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('xp-gained', {
                        detail: {
                            amount: result.amount,
                            source: 'Game Download',
                            newLevel: result.newLevel,
                            newTitle: result.newTitle
                        }
                    }));
                }
            });
        }

        // Trigger the actual download in a new tab
        window.open(href, '_blank', 'noopener,noreferrer');
    };

    return (
        <>
            <Button
                onClick={handleInitialClick}
                size="lg"
                className={platform === 'Android'
                    ? "px-8 shadow-lg shadow-green-500/20 bg-green-600 hover:bg-green-700 text-white border-none"
                    : "px-8 shadow-lg shadow-primary/20"
                }
            >
                {platform === 'Android' ? <Smartphone className="w-5 h-5 mr-2" /> : <Monitor className="w-5 h-5 mr-2" />}
                Download for {platform === 'PC' ? 'PC' : 'Android'}
            </Button>

            {/* Verification / Interstitial Modal */}
            {showAdModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pb-20 sm:pb-4 sm:p-6 bg-background/90 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-card w-full max-w-md max-h-[85vh] overflow-y-auto rounded-xl border border-border shadow-2xl p-5 sm:p-6 relative flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
                        <button 
                            onClick={() => setShowAdModal(false)}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary text-muted-foreground transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        
                        <div className="w-12 h-12 bg-primary/20 text-primary rounded-full flex items-center justify-center mb-4">
                            <Download className="w-6 h-6" />
                        </div>
                        
                        <h3 className="text-xl font-bold mb-2">Your link is almost ready!</h3>
                        <p className="text-muted-foreground text-sm mb-6">
                            Please support us by checking out our sponsors below.
                        </p>

                        {/* Ad Placement */}
                        <div className="w-full min-h-[150px] mb-6 border border-dashed border-border/50 rounded-lg flex items-center justify-center bg-background/50">
                            <AdBanner />
                        </div>

                        <Button 
                            size="lg" 
                            className="w-full py-6 font-bold text-lg shadow-primary/30 shadow-xl"
                            onClick={handleFinalDownload}
                        >
                            Continue to Download
                        </Button>
                        <p className="text-xs text-muted-foreground mt-4">
                            Clicking continue will open the file link securely.
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}
