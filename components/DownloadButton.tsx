'use client';

import { Button } from "@/components/ui/Button";
import { incrementDownloadAction } from "@/app/actions/gameActions";
import { addUserXP, incrementUserDownload } from "@/lib/firestore"; // User stats might still be client-side allowed? Or need server action too?
// User stats are likely in 'users' collection. Rules were "deny all". So these will fail too.
// I need server actions for user stats too.
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
            addUserXP(user.uid, 50, 'Download Game'); // 50 XP for download
            incrementUserDownload(user.uid);
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
