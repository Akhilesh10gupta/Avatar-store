'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Game, addGame, updateGame } from '@/lib/firestore';
import { uploadFile, uploadMultipleFiles } from '@/lib/storage';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Loader2, Upload, X, Image as ImageIcon, Monitor, Smartphone, Layers, Sparkles } from 'lucide-react';
import Image from 'next/image';

interface GameFormProps {
    initialData?: Game;
}

export default function GameForm({ initialData }: GameFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Partial<Game>>({
        title: initialData?.title || '',
        description: initialData?.description || '',
        genre: initialData?.genre || '',
        developer: initialData?.developer || '',
        releaseDate: initialData?.releaseDate || '',
        platform: initialData?.platform || 'PC', // Default to PC if missing
        downloadLinkPC: initialData?.downloadLinkPC || initialData?.downloadLink || '', // Fallback to legacy link
        downloadLinkAndroid: initialData?.downloadLinkAndroid || '',
        coverImage: initialData?.coverImage || '',
        cardImage: initialData?.cardImage || '',
        icon: initialData?.icon || '',
        gameplayVideo: initialData?.gameplayVideo || '',
        screenshots: initialData?.screenshots || [],
        systemRequirements: initialData?.systemRequirements || {
            os: 'Windows 10',
            processor: '',
            memory: '',
            graphics: '',
            storage: '',
        },
        systemRequirementsAndroid: initialData?.systemRequirementsAndroid || {
            os: '',
            processor: '',
            memory: '',
            storage: '',
        },
    });

    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [cardFile, setCardFile] = useState<File | null>(null);
    const [iconFile, setIconFile] = useState<File | null>(null);
    const [screenshotFiles, setScreenshotFiles] = useState<File[]>([]);
    const [videoFile, setVideoFile] = useState<File | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name.startsWith('sys_')) {
            const field = name.replace('sys_', '');
            setFormData(prev => ({
                ...prev,
                systemRequirements: {
                    ...prev.systemRequirements!,
                    [field]: value
                }
            }));
        } else if (name.startsWith('android_')) {
            const field = name.replace('android_', '');
            setFormData(prev => ({
                ...prev,
                systemRequirementsAndroid: {
                    ...prev.systemRequirementsAndroid!,
                    os: prev.systemRequirementsAndroid?.os || '',
                    processor: prev.systemRequirementsAndroid?.processor || '',
                    memory: prev.systemRequirementsAndroid?.memory || '',
                    storage: prev.systemRequirementsAndroid?.storage || '',
                    [field]: value
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'card' | 'icon' | 'screenshots' | 'video') => {
        if (e.target.files && e.target.files.length > 0) {
            if (type === 'cover') setCoverFile(e.target.files[0]);
            if (type === 'card') setCardFile(e.target.files[0]);
            if (type === 'icon') setIconFile(e.target.files[0]);
            if (type === 'video') setVideoFile(e.target.files[0]);
            if (type === 'screenshots') setScreenshotFiles(Array.from(e.target.files));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let coverUrl = formData.coverImage;
            let cardUrl = formData.cardImage;
            let iconUrl = formData.icon;
            let gameplayVideoUrl = formData.gameplayVideo;
            let screenshotUrls = formData.screenshots || [];

            if (coverFile) {
                coverUrl = await uploadFile(coverFile, 'covers');
            }
            if (cardFile) {
                console.log("Uploading card file...", cardFile.name);
                cardUrl = await uploadFile(cardFile, 'cards');
                console.log("Card file uploaded, URL:", cardUrl);
            }
            if (iconFile) {
                iconUrl = await uploadFile(iconFile, 'icons');
            }
            if (videoFile) {
                // Upload video with resourceType 'video'
                gameplayVideoUrl = await uploadFile(videoFile, 'videos', 'video');
            }
            if (screenshotFiles.length > 0) {
                const newScreenshots = await uploadMultipleFiles(screenshotFiles, 'screenshots');
                screenshotUrls = [...screenshotUrls, ...newScreenshots];
            }

            // Get current user ID
            const { auth } = await import('@/lib/firebase'); // Dynamic import to avoid SSR issues if any, though regular import is fine too
            const user = auth.currentUser;

            if (!user) {
                alert("You must be logged in to create a game.");
                setLoading(false);
                return;
            }

            const gameData = {
                ...formData,
                coverImage: coverUrl || '',
                cardImage: cardUrl || '',
                icon: iconUrl || '',
                gameplayVideo: gameplayVideoUrl || '',
                screenshots: screenshotUrls,
                // Ensure legacy field is filled if needed, or rely on new fields
                downloadLink: formData.downloadLinkPC || formData.downloadLinkAndroid || '',
                userId: user.uid, // Save owner ID
            } as Game;

            console.log("Submitting game data:", {
                id: initialData?.id,
                cardImageBefore: initialData?.cardImage,
                cardImageNew: cardUrl,
                formDataCard: formData.cardImage
            });

            if (initialData?.id) {
                await updateGame(initialData.id, gameData);
            } else {
                await addGame(gameData);
            }

            router.push('/admin');
            router.refresh();
        } catch (error) {
            console.error("Error saving game:", error);
            alert("Failed to save game. Check console for details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto pb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b border-border/50 pb-2">Basic Info</h3>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Game Title</label>
                        <Input name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Cyberpunk 2077" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Genre</label>
                        <Input name="genre" value={formData.genre} onChange={handleChange} required placeholder="e.g. RPG" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Developer</label>
                        <Input name="developer" value={formData.developer} onChange={handleChange} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Release Date</label>
                            <Input name="releaseDate" value={formData.releaseDate} onChange={handleChange} required placeholder="YYYY" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Platform</label>
                            <div className="relative">
                                <select
                                    name="platform"
                                    value={formData.platform || 'PC'}
                                    onChange={handleChange}
                                    className="flex h-10 w-full rounded-md border border-input bg-secondary/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                >
                                    <option value="PC">PC (Windows)</option>
                                    <option value="Android">Android</option>
                                    <option value="Both">Both (PC & Android)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            className="flex min-h-[120px] w-full rounded-md border border-input bg-secondary/50 px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Game description..."
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b border-border/50 pb-2">Assets & Links</h3>

                    {/* Icon Upload ... (Kept same logic, just minor style check) */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Game Icon</label>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-4">
                                {formData.icon && !iconFile && (
                                    <div className="relative w-12 h-12 rounded bg-secondary overflow-hidden shrink-0">
                                        <Image src={formData.icon} alt="icon" fill className="object-cover" />
                                    </div>
                                )}
                                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'icon')} className="text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/20 file:text-primary hover:file:bg-primary/30 w-full" />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">OR</span>
                                <Input name="icon" value={formData.icon} onChange={handleChange} placeholder="Paste Image URL here" className="text-xs h-8" />
                            </div>
                        </div>
                    </div>

                    {/* Cover Upload */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Cover Image</label>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-4">
                                {formData.coverImage && !coverFile && (
                                    <div className="relative w-24 h-14 rounded bg-secondary overflow-hidden shrink-0">
                                        <Image src={formData.coverImage} alt="cover" fill className="object-cover" />
                                    </div>
                                )}
                                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'cover')} className="text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/20 file:text-primary hover:file:bg-primary/30 w-full" />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">OR</span>
                                <Input name="coverImage" value={formData.coverImage} onChange={handleChange} placeholder="Paste Cover Image URL here" className="text-xs h-8" />
                            </div>
                        </div>
                    </div>

                    {/* Card Image Upload (Optional) */}
                    <div className="space-y-2 pt-2 border-t border-border/50">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium flex items-center gap-2">
                                Card Image <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
                            </label>
                            <span className="text-[10px] text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded">
                                Recommended: 3:4 Ratio (e.g. 600x800)
                            </span>
                        </div>

                        <div className="p-3 bg-secondary/20 rounded-lg border border-border/50">
                            <div className="flex flex-col gap-3">
                                <p className="text-xs text-muted-foreground">
                                    If you upload a specific card image, we will use it directly.
                                    <br />
                                    <span className="text-primary/80">Otherwise, our AI will automatically generate a perfect 3:4 card from your Cover Image.</span>
                                </p>

                                <div className="flex items-center gap-4">
                                    {(formData.cardImage || cardFile) ? (
                                        <div className="relative w-16 h-20 rounded bg-black/40 overflow-hidden shrink-0 border border-white/10 shadow-lg">
                                            {/* Preview: prioritizing local file blob if needed */}
                                            {cardFile ? (
                                                <Image src={URL.createObjectURL(cardFile)} alt="preview" fill className="object-cover" />
                                            ) : (
                                                <Image src={formData.cardImage!} alt="card" fill className="object-cover" />
                                            )}
                                        </div>
                                    ) : (
                                        // "Empty" state showing AI Preview
                                        <div className="relative w-16 h-20 rounded bg-gradient-to-br from-indigo-500/20 to-purple-500/20 overflow-hidden shrink-0 border border-white/5 flex items-center justify-center">
                                            <Sparkles className="w-6 h-6 text-purple-400 opacity-80" />
                                        </div>
                                    )}

                                    <div className="flex-1 flex flex-col gap-2">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, 'card')}
                                            className="text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/20 file:text-primary hover:file:bg-primary/30 w-full"
                                        />
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-muted-foreground">OR</span>
                                            <Input name="cardImage" value={formData.cardImage || ''} onChange={handleChange} placeholder="Paste Card Image URL" className="text-xs h-8" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Dynamic Download Links */}
                    <div className="p-4 bg-secondary/20 rounded-lg border border-border/50 space-y-4">
                        {(formData.platform === 'PC' || formData.platform === 'Both') && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Monitor className="w-4 h-4 text-primary" />
                                    PC Download Link
                                </label>
                                <Input
                                    name="downloadLinkPC"
                                    value={formData.downloadLinkPC}
                                    onChange={handleChange}
                                    required={formData.platform === 'PC'}
                                    placeholder="https://drive.google.com/.../game.exe"
                                />
                            </div>
                        )}

                        {(formData.platform === 'Android' || formData.platform === 'Both') && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Smartphone className="w-4 h-4 text-green-500" />
                                    Android Download Link
                                </label>
                                <Input
                                    name="downloadLinkAndroid"
                                    value={formData.downloadLinkAndroid}
                                    onChange={handleChange}
                                    required={formData.platform === 'Android'}
                                    placeholder="https://drive.google.com/.../game.apk"
                                />
                            </div>
                        )}
                    </div>

                    {/* Gameplay Video Upload */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Gameplay Video</label>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-4">
                                {formData.gameplayVideo && !videoFile && (
                                    <div className="relative w-full max-w-[200px] aspect-video rounded bg-black overflow-hidden shrink-0 flex items-center justify-center">
                                        <video src={formData.gameplayVideo} className="w-full h-full object-cover" muted />
                                    </div>
                                )}
                                <input type="file" accept="video/*" onChange={(e) => handleFileChange(e, 'video')} className="text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/20 file:text-primary hover:file:bg-primary/30 w-full" />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">OR</span>
                                <Input name="gameplayVideo" value={formData.gameplayVideo} onChange={handleChange} placeholder="Paste Video, YouTube or Instagram Reel URL here" className="text-xs h-8" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Screenshots Section */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b border-border/50 pb-2 flex items-center justify-between">
                    <span>Screenshots</span>
                    <span className="text-xs font-normal text-muted-foreground">Upload multiple images</span>
                </h3>
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'screenshots')}
                    className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/20 file:text-primary hover:file:bg-primary/30"
                />

                {/* Existing Screenshots Preview */}
                {formData.screenshots && formData.screenshots.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        {formData.screenshots.map((shot, idx) => (
                            <div key={idx} className="relative aspect-video rounded overflow-hidden group">
                                <Image src={shot} alt="screenshot" fill className="object-cover" />
                                <button
                                    type="button"
                                    className="absolute top-1 right-1 bg-destructive p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => setFormData(prev => ({ ...prev, screenshots: prev.screenshots!.filter((_, i) => i !== idx) }))}
                                >
                                    <X className="w-3 h-3 text-white" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* PC System Requirements */}
            {(formData.platform === 'PC' || formData.platform === 'Both') && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b border-border/50 pb-2 flex items-center gap-2">
                        <Monitor className="w-5 h-5 text-primary" />
                        PC System Requirements
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">OS</label>
                            <Input name="sys_os" value={formData.systemRequirements?.os} onChange={handleChange} placeholder="Windows 10 64-bit" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Processor</label>
                            <Input name="sys_processor" value={formData.systemRequirements?.processor} onChange={handleChange} placeholder="Intel Core i5..." />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Memory</label>
                            <Input name="sys_memory" value={formData.systemRequirements?.memory} onChange={handleChange} placeholder="8 GB RAM" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Graphics</label>
                            <Input name="sys_graphics" value={formData.systemRequirements?.graphics} onChange={handleChange} placeholder="NVIDIA GeForce GTX..." />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Storage</label>
                            <Input name="sys_storage" value={formData.systemRequirements?.storage} onChange={handleChange} placeholder="50 GB available space" />
                        </div>
                    </div>
                </div>
            )}

            {/* Android System Requirements */}
            {(formData.platform === 'Android' || formData.platform === 'Both') && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b border-border/50 pb-2 flex items-center gap-2">
                        <Smartphone className="w-5 h-5 text-green-500" />
                        Android System Requirements
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Android Version (OS)</label>
                            <Input name="android_os" value={formData.systemRequirementsAndroid?.os || ''} onChange={handleChange} placeholder="Android 10+" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Processor (Chipset)</label>
                            <Input name="android_processor" value={formData.systemRequirementsAndroid?.processor || ''} onChange={handleChange} placeholder="Snapdragon 8 Gen 2 / MediaTek..." />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Memory (RAM)</label>
                            <Input name="android_memory" value={formData.systemRequirementsAndroid?.memory || ''} onChange={handleChange} placeholder="8 GB RAM" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Storage Space</label>
                            <Input name="android_storage" value={formData.systemRequirementsAndroid?.storage || ''} onChange={handleChange} placeholder="4 GB available space" />
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-end pt-6">
                <Button type="submit" size="lg" isLoading={loading}>
                    {initialData ? 'Update Game' : 'Create Game'}
                </Button>
            </div>
        </form>
    );
}
