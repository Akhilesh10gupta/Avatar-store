'use client';

import { Button } from "@/components/ui/Button";
import { incrementDownload } from "@/lib/firestore";
import { Monitor, Smartphone } from "lucide-react";

interface DownloadButtonProps {
    gameId: string;
    href: string;
    platform: 'PC' | 'Android';
}

export default function DownloadButton({ gameId, href, platform }: DownloadButtonProps) {
    const handleClick = () => {
        incrementDownload(gameId);
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
