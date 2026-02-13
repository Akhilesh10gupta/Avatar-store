'use client';

import { Button } from "@/components/ui/Button";
import { incrementDownloadAction } from "@/app/actions/gameActions";
import { addUserXPAction, incrementUserDownloadAction } from "@/app/actions/userActions";
import { Monitor, Smartphone } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

interface DownloadButtonProps {
    gameId: string;
    href: string;
    platform: 'PC' | 'Android';
}

export default function DownloadButton({ gameId, href, platform }: DownloadButtonProps) {
    const { user } = useAuth();

    const handleClick = async () => {
        await incrementDownloadAction(gameId);
        if (user) {
            // Run in background to avoid blocking download, but handle result for UI
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
    };

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClick}
        >
            <Button
                size="lg"
                className={platform === 'Android'
                    ? "px-8 shadow-lg shadow-green-500/20 bg-green-600 hover:bg-green-700 text-white border-none"
                    : "px-8 shadow-lg shadow-primary/20"
                }
            >
                {platform === 'Android' ? <Smartphone className="w-5 h-5 mr-2" /> : <Monitor className="w-5 h-5 mr-2" />}
                Download for {platform === 'PC' ? 'PC' : 'Android'}
            </Button>
        </a>
    );
}
