import { getGameById } from "@/lib/firestore";
import StarRating from "@/components/StarRating";
import ReviewSection from "@/components/ReviewSection";
import DownloadButton from "@/components/DownloadButton";
import { Button } from "@/components/ui/Button";
import { Monitor, Cpu, HardDrive, MemoryStick, Image as ImageIcon, ArrowLeft, Smartphone, Download } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getVideoEmbedUrl } from '@/lib/video';
import { getOptimizedImage } from "@/lib/cloudinary";

// Force dynamic rendering since we are fetching data
export const dynamic = 'force-dynamic';

export default async function GameDetails({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const game = await getGameById(id);

    if (!game) {
        return notFound();
    }

    const coverUrl = game.coverImage ? getOptimizedImage(game.coverImage, 800, 1200) : 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=2070&auto=format&fit=crop';

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Back Button */}
            <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Store
            </Link>

            {/* Header Section */}
            <div className="grid md:grid-cols-[300px_1fr] gap-8">
                {/* Cover Image */}
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-2xl border border-border/50">
                    <Image
                        src={coverUrl}
                        alt={game.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                {/* Info */}
                <div className="flex flex-col justify-between space-y-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-2">{game.title}</h1>
                        <div className="flex items-center gap-4 text-muted-foreground mb-6 flex-wrap">
                            <span className="bg-secondary px-3 py-1 rounded-full text-sm font-medium text-secondary-foreground flex items-center gap-2">
                                {game.platform === 'Android' ? <Smartphone className="w-3 h-3" /> : <Monitor className="w-3 h-3" />}
                                {game.genre}
                            </span>
                            <span>{game.developer}</span>
                            <span>{game.releaseDate}</span>
                            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">
                                <Download className="w-4 h-4" />
                                {(game.downloadCount || 0).toLocaleString()} Downloads
                            </span>
                        </div>
                        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                            {game.description}
                        </p>

                        {/* Rating */}
                        <div className="pt-4">
                            <h3 className="text-sm font-medium text-muted-foreground mb-2">Rate this game</h3>
                            <div className="flex justify-start">
                                <StarRating
                                    gameId={game.id!}
                                    initialRating={game.rating}
                                    initialRatingCount={game.ratingCount}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        {/* PC Download Button */}
                        {(game.platform === 'PC' || game.platform === 'Both') && (game.downloadLinkPC || game.downloadLink) && (
                            <DownloadButton
                                gameId={game.id!}
                                href={game.downloadLinkPC || game.downloadLink || '#'}
                                platform="PC"
                            />
                        )}

                        {/* Android Download Button */}
                        {(game.platform === 'Android' || game.platform === 'Both') && (game.downloadLinkAndroid || game.downloadLink) && (
                            <DownloadButton
                                gameId={game.id!}
                                href={game.downloadLinkAndroid || game.downloadLink || '#'}
                                platform="Android"
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Screenshots */}
            {game.screenshots && game.screenshots.length > 0 && (
                <section>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <ImageIcon className="text-primary" />
                        Screenshots
                    </h2>
                    <div className={`flex md:grid items-center gap-4 md:gap-6 overflow-x-auto md:overflow-visible pb-4 md:pb-0 snap-x snap-mandatory md:snap-none -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide ${game.screenshots.length === 4
                        ? 'md:grid-cols-2 lg:grid-cols-2' // 4 images -> 2x2 grid
                        : game.screenshots.length === 1
                            ? 'md:grid-cols-1 md:max-w-4xl md:mx-auto' // 1 image -> Centered large
                            : 'md:grid-cols-2 lg:grid-cols-3' // Default -> 3 columns
                        }`}>
                        {game.screenshots.map((shot, idx) => (
                            <div key={idx} className="min-w-full md:min-w-0 px-2 md:px-0 flex-shrink-0 snap-center">
                                <div className="relative aspect-video md:aspect-auto rounded-xl overflow-hidden border border-border/50 shadow-2xl bg-black group">
                                    <img
                                        src={shot}
                                        alt={`${game.title} screenshot ${idx + 1}`}
                                        className="absolute md:static inset-0 w-full h-full md:h-auto md:max-h-[500px] object-contain md:object-contain transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Gameplay Video */}
            {
                game.gameplayVideo && (
                    <section>
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <Monitor className="text-primary" />
                            Gameplay Video
                        </h2>
                        {(() => {
                            const embed = game.gameplayVideo ? getVideoEmbedUrl(game.gameplayVideo) : null;
                            const isReel = embed?.type === 'instagram';

                            return (
                                <div className={`rounded-xl overflow-hidden border border-border/50 shadow-2xl bg-black relative mx-auto ${isReel ? 'aspect-[9/16] max-w-sm' : 'aspect-video'}`}>
                                    {(() => {
                                        if (embed?.type === 'youtube' && embed.url) {
                                            return (
                                                <iframe
                                                    src={embed.url}
                                                    title="Gameplay Video"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                    className="absolute inset-0 w-full h-full"
                                                />
                                            );
                                        } else if (embed?.type === 'instagram' && embed.url) {
                                            return (
                                                <iframe
                                                    src={embed.url}
                                                    title="Gameplay Video"
                                                    allow="encrypted-media"
                                                    allowFullScreen
                                                    className="absolute inset-0 w-full h-full"
                                                />
                                            );
                                        } else {
                                            return (
                                                <video
                                                    src={game.gameplayVideo}
                                                    controls
                                                    className="w-full h-full"
                                                    poster={game.coverImage}
                                                >
                                                    Your browser does not support the video tag.
                                                </video>
                                            );
                                        }
                                    })()}
                                </div>
                            );
                        })()}
                    </section>
                )
            }

            {/* System Requirements */}
            {/* PC System Requirements */}
            {
                (game.platform === 'PC' || game.platform === 'Both') && (
                    <section className="bg-card rounded-2xl p-8 border border-border/50">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <Monitor className="text-primary" />
                            PC System Requirements
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="space-y-2">
                                <span className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                                    <Monitor className="w-4 h-4" /> OS
                                </span>
                                <p className="font-semibold">{game.systemRequirements.os || 'Windows 10/11'}</p>
                            </div>
                            <div className="space-y-2">
                                <span className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                                    <Cpu className="w-4 h-4" /> Processor
                                </span>
                                <p className="font-semibold">{game.systemRequirements.processor || 'Intel Core i5 / AMD Ryzen 5'}</p>
                            </div>
                            <div className="space-y-2">
                                <span className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                                    <MemoryStick className="w-4 h-4" /> Memory
                                </span>
                                <p className="font-semibold">{game.systemRequirements.memory || '8 GB RAM'}</p>
                            </div>
                            <div className="space-y-2">
                                <span className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                                    <HardDrive className="w-4 h-4" /> Graphics
                                </span>
                                <p className="font-semibold">{game.systemRequirements.graphics || 'NVIDIA GTX 1060 / AMD RX 580'}</p>
                            </div>
                        </div>
                    </section>
                )
            }

            {/* Android System Requirements */}
            {
                (game.platform === 'Android' || game.platform === 'Both') && (
                    <section className="bg-card rounded-2xl p-8 border border-border/50">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <Smartphone className="text-green-500" />
                            Android System Requirements
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="space-y-2">
                                <span className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                                    <Smartphone className="w-4 h-4" /> Android Version
                                </span>
                                <p className="font-semibold">{game.systemRequirementsAndroid?.os || 'Android 10+'}</p>
                            </div>
                            <div className="space-y-2">
                                <span className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                                    <Cpu className="w-4 h-4" /> Chipset
                                </span>
                                <p className="font-semibold">{game.systemRequirementsAndroid?.processor || 'Snapdragon 8 Gen 2'}</p>
                            </div>
                            <div className="space-y-2">
                                <span className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                                    <MemoryStick className="w-4 h-4" /> RAM
                                </span>
                                <p className="font-semibold">{game.systemRequirementsAndroid?.memory || '8 GB'}</p>
                            </div>
                            <div className="space-y-2">
                                <span className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                                    <HardDrive className="w-4 h-4" /> Storage
                                </span>
                                <p className="font-semibold">{game.systemRequirementsAndroid?.storage || '4 GB Available'}</p>
                            </div>
                        </div>
                    </section>
                )
            }

            {/* User Reviews */}
            <section className="bg-card rounded-2xl p-8 border border-border/50">
                <ReviewSection gameId={game.id!} />
            </section>
        </div>
    );
}
