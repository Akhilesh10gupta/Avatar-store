import { getGameByIdAdmin } from "@/lib/firestore-admin";
import WebGamePlayer from "@/components/WebGamePlayer";
import AdsterraBanner from "@/components/AdsterraBanner";
import { ArrowLeft, Gamepad2, Info, Share2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const revalidate = 86400;
export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const game = await getGameByIdAdmin(id);

    if (!game) {
        return {
            title: "Game Not Found | Avatar Play",
        };
    }

    const title = `Play ${game.title} Online Free in Browser | Avatar Play`;
    const description = `Play ${game.title} instantly in your web browser on Avatar Play. No installation or download needed.`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: "video.other",
            url: `https://avatarplay.in/play/${id}`,
        }
    };
}

export default async function PlayGamePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const game = await getGameByIdAdmin(id);

    if (!game || !game.webPlayUrl) {
        return notFound();
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-16 max-w-7xl mx-auto">
            {/* Top Navigation & Info Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-2 border-b border-border/50">
                <div className="flex items-center gap-3">
                    <Link
                        href={`/game/${id}`}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/80 hover:bg-secondary text-secondary-foreground text-sm font-medium transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Details
                    </Link>

                    <div className="h-4 w-[1px] bg-border hidden sm:block" />

                    <div>
                        <h1 className="text-xl sm:text-2xl font-black text-foreground flex items-center gap-2">
                            <Gamepad2 className="w-5 h-5 text-cyan-400" />
                            {game.title}
                        </h1>
                        <p className="text-xs text-muted-foreground">
                            {game.genre} • By {game.developer || 'Indie Creator'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Link
                        href={`/game/${id}`}
                        className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                    >
                        <Info className="w-3.5 h-3.5" />
                        About Game
                    </Link>
                </div>
            </div>

            {/* Embedded Game Player (Theatre view with AutoPlay ready) */}
            <WebGamePlayer game={game} autoPlay={false} />

            {/* Ad Banner for monetization while playing */}
            <div className="pt-2">
                <AdsterraBanner />
            </div>

            {/* Game Description & Info */}
            <div className="bg-card rounded-2xl p-6 border border-border/50 space-y-3">
                <h2 className="text-lg font-bold">About {game.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    {game.description}
                </p>
            </div>
        </div>
    );
}

