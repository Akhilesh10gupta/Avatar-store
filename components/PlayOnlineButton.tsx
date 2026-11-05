'use client';

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Play, ExternalLink } from "lucide-react";
import { incrementDownloadAction } from "@/app/actions/gameActions";
import { useAuth } from "@/components/AuthProvider";
import { incrementUserDownloadAction, addUserXPAction } from "@/app/actions/userActions";

interface PlayOnlineButtonProps {
    gameId: string;
    webPlayUrl: string;
    webPlayUrlAlternate?: string;
}

export default function PlayOnlineButton({ gameId, webPlayUrl, webPlayUrlAlternate }: PlayOnlineButtonProps) {
    const { user } = useAuth();
    const [counted, setCounted] = useState(false);

    const trackPlay = async () => {
        if (!gameId || counted) return;
        setCounted(true);
        await incrementDownloadAction(gameId);

        if (user) {
            incrementUserDownloadAction(user.uid);
            addUserXPAction(user.uid, 50).then((result: any) => {
                if (result && typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('xp-gained', {
                        detail: {
                            amount: result.amount,
                            source: 'Played Online Game',
                            newLevel: result.newLevel,
                            newTitle: result.newTitle
                        }
                    }));
                }
            }).catch(() => {});
        }
    };

    const handleScrollToPlayer = () => {
        trackPlay();
        const el = document.getElementById('online-player');
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="flex flex-wrap gap-4">
            <Button
                size="lg"
                onClick={handleScrollToPlayer}
                className="px-8 shadow-lg shadow-cyan-500/25 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold border-none flex items-center gap-2 group animate-pulse hover:animate-none cursor-pointer"
            >
                <Play className="w-5 h-5 fill-current" />
                Play Online (Instant)
            </Button>

            <a
                href={webPlayUrlAlternate || webPlayUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={trackPlay}
            >
                <Button
                    size="lg"
                    variant="outline"
                    className="px-6 border-cyan-500/40 hover:bg-cyan-500/10 text-cyan-400 font-semibold flex items-center gap-2 cursor-pointer"
                    title="Open game directly in a new window"
                >
                    <ExternalLink className="w-4 h-4" />
                    {webPlayUrlAlternate ? 'Alternate Play Link' : 'Play in New Tab'}
                </Button>
            </a>
        </div>
    );
}

