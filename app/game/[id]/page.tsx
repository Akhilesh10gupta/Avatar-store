import { getGameById } from "@/lib/firestore";
import { Button } from "@/components/ui/Button";
import { Download, Monitor, Cpu, HardDrive, MemoryStick, Image as ImageIcon, ArrowLeft, Smartphone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getYouTubeEmbedUrl } from '@/lib/youtube';
import { getOptimizedImage } from "@/lib/cloudinary";

// ... imports

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
                        <div className="flex items-center gap-4 text-muted-foreground mb-6">
                            <span className="bg-secondary px-3 py-1 rounded-full text-sm font-medium text-secondary-foreground flex items-center gap-2">
                                {game.platform === 'Android' ? <Smartphone className="w-3 h-3" /> : <Monitor className="w-3 h-3" />}
                                {game.genre}
                            </span>
                            <span>{game.developer}</span>
                            <span>{game.releaseDate}</span>
                        </div>
                        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                            {game.description}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        {/* PC Download Button */}
                        {(game.platform === 'PC' || game.platform === 'Both') && (game.downloadLinkPC || game.downloadLink) && (
                            <Link href={game.downloadLinkPC || game.downloadLink || '#'} target="_blank" rel="noopener noreferrer">
                                <Button size="lg" className="px-8 shadow-lg shadow-primary/20">
                                    <Monitor className="w-5 h-5 mr-2" />
                                    Download for PC
                                </Button>
                            </Link>
                        )}

                        {/* Android Download Button */}
                        {(game.platform === 'Android' || game.platform === 'Both') && (game.downloadLinkAndroid || game.downloadLink) && (
                            <Link href={game.downloadLinkAndroid || game.downloadLink || '#'} target="_blank" rel="noopener noreferrer">
                                <Button size="lg" className="px-8 shadow-lg shadow-green-500/20 bg-green-600 hover:bg-green-700 text-white border-none">
                                    <Smartphone className="w-5 h-5 mr-2" />
                                    Download for Android
                                </Button>
                            </Link>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {game.screenshots.map((shot, idx) => (
                            <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-border/50 hover:border-primary/50 transition-colors group">
                                <Image
                                    src={shot}
                                    alt={`${game.title} screenshot ${idx + 1}`}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
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
                        <div className="rounded-xl overflow-hidden border border-border/50 shadow-2xl bg-black aspect-video relative">
                            {game.gameplayVideo && getYouTubeEmbedUrl(game.gameplayVideo) ? (
                                <iframe
                                    src={getYouTubeEmbedUrl(game.gameplayVideo)!}
                                    title="Gameplay Video"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="absolute inset-0 w-full h-full"
                                />
                            ) : (
                                <video
                                    src={game.gameplayVideo}
                                    controls
                                    className="w-full h-full"
                                    poster={game.coverImage}
                                >
                                    Your browser does not support the video tag.
                                </video>
                            )}
                        </div>
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
        </div >
    );
}
