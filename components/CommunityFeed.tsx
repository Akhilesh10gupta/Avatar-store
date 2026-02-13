'use client';

import { useState, useEffect, useRef } from 'react';
import { getPostsAction, addPostAction } from '@/app/actions/communityActions';
import { Post } from '@/lib/firestore';
import PostCard from './PostCard';
import { Plus, UserCircle, Image as ImageIcon, Loader2, Link as LinkIcon, X, ShieldCheck, Send } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { Button } from './ui/Button';
import Link from 'next/link';
import { uploadFile } from '@/lib/storage';
import GameLoader from './GameLoader';
import { checkImageSafety } from '@/lib/contentSafety';

export default function CommunityFeed() {
    const { user } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [newPostContent, setNewPostContent] = useState('');
    const [imageUrls, setImageUrls] = useState<string[]>([]); // For manually added URLs
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [isPosting, setIsPosting] = useState(false);
    const [isCheckingSafety, setIsCheckingSafety] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        const fetchedPosts = await getPostsAction();
        setPosts(fetchedPosts);
        setLoading(false);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setSelectedFiles(prev => [...prev, ...files]);

            const newPreviews = files.map(file => URL.createObjectURL(file));
            setPreviewUrls(prev => [...prev, ...newPreviews]);
        }
    };

    const removeMedia = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        setPreviewUrls(prev => {
            const newPreviews = prev.filter((_, i) => i !== index);
            return newPreviews;
        });
    };

    const clearMedia = () => {
        setSelectedFiles([]);
        setPreviewUrls([]);
        setImageUrls([]);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };


    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || (!newPostContent.trim() && selectedFiles.length === 0 && imageUrls.length === 0)) return;

        setIsPosting(true);
        try {
            // 1. Content Safety Check
            if (selectedFiles.length > 0) {
                setIsCheckingSafety(true);
                for (const file of selectedFiles) {
                    const safetyResult = await checkImageSafety(file);
                    if (!safetyResult.safe) {
                        alert(safetyResult.reason || "Image violates content guidelines.");
                        setIsCheckingSafety(false);
                        setIsPosting(false);
                        return; // Stop the process
                    }
                }
                setIsCheckingSafety(false);
            }

            const uploadedUrls = await Promise.all(
                selectedFiles.map(file => uploadFile(file, 'community_posts'))
            );

            const finalImageUrls = [...imageUrls, ...uploadedUrls];

            await addPostAction({
                userId: user.uid,
                userName: user.displayName || 'Anonymous',
                userAvatar: user.photoURL || null,
                content: newPostContent.trim(),
                imageUrls: finalImageUrls.length > 0 ? finalImageUrls : undefined,
                imageUrl: finalImageUrls[0], // Backward compatibility
                createdAt: new Date().toISOString()
            });

            // Award XP
            const { addUserXPAction } = await import('@/app/actions/userActions');
            addUserXPAction(user.uid, 50).then((result: any) => {
                if (result && typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('xp-gained', {
                        detail: {
                            amount: result.amount,
                            source: 'Created Post',
                            newLevel: result.newLevel,
                            newTitle: result.newTitle
                        }
                    }));
                }
            });

            setNewPostContent('');
            clearMedia();
            await loadPosts(); // Refresh feed
        } catch (error) {
            console.error("Failed to create post:", error);
            alert("Failed to create post. Please try again.");
        } finally {
            setIsPosting(false);
        }
    };

    if (loading) {
        return (
            <div className="py-12">
                <GameLoader />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-4">


            {/* Create Post Widget */}
            <div className="bg-[#121212] border border-white/5 rounded-2xl p-4 md:p-6 shadow-xl">
                {user ? (
                    <form onSubmit={handleCreatePost} className="space-y-4">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center overflow-hidden shrink-0">
                                {user.photoURL ? (
                                    <img src={user.photoURL} alt="Me" className="w-full h-full object-cover" />
                                ) : (
                                    <UserCircle className="w-6 h-6 text-muted-foreground" />
                                )}
                            </div>
                            <div className="flex-1 space-y-4">
                                <textarea
                                    value={newPostContent}
                                    onChange={(e) => setNewPostContent(e.target.value)}
                                    placeholder="What's on your mind?"
                                    className="w-full bg-transparent border-none text-white text-lg placeholder:text-muted-foreground focus:ring-0 resize-none min-h-[80px]"
                                />

                                {/* Media Preview Grid */}
                                {previewUrls.length > 0 && (
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        {previewUrls.map((url, index) => (
                                            <div key={index} className="relative rounded-xl overflow-hidden group border border-white/10 aspect-video">
                                                <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeMedia(index)}
                                                    className="absolute top-2 right-2 bg-black/70 p-1.5 rounded-full text-white hover:bg-red-500/80 transition-colors"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                            <div className="flex gap-2">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileSelect}
                                    accept="image/*"
                                    multiple // Enable multiple files
                                    className="hidden"
                                />
                                {/* Image Upload Button */}
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="text-muted-foreground hover:text-primary hover:bg-white/5"
                                >
                                    <ImageIcon className="w-5 h-5 mr-2" />
                                    Image
                                </Button>
                                {/* Link Button */}
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        const url = prompt('Enter image URL:');
                                        if (url) {
                                            setImageUrls(prev => [...prev, url]);
                                        }
                                    }}
                                    className="text-muted-foreground hover:text-primary hover:bg-white/5"
                                >
                                    <LinkIcon className="w-5 h-5 mr-2" />
                                    Link
                                </Button>
                            </div>


                            <Button
                                type="submit"
                                disabled={(!newPostContent.trim() && selectedFiles.length === 0 && imageUrls.length === 0) || isPosting || isCheckingSafety}
                                className={`px-6 rounded-full transition-all duration-300 ${isCheckingSafety ? 'bg-purple-500/80' : ''}`}
                            >
                                {isCheckingSafety ? (
                                    <>
                                        <ShieldCheck className="w-4 h-4 mr-2 animate-pulse" />
                                        <span className="animate-pulse">Scanning...</span>
                                    </>
                                ) : isPosting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Posting...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4 mr-2" />
                                        Post
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                ) : (
                    <div className="text-center py-6">
                        <h3 className="text-xl font-bold mb-2 text-white">Join the Community</h3>
                        <p className="text-muted-foreground mb-4">Log in to share your gaming moments and connect with others.</p>
                        <Link href="/login">
                            <Button>Log In / Sign Up</Button>
                        </Link>
                    </div>
                )}
            </div>

            {/* Feed */}
            <div className="space-y-6">
                {posts.map(post => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>
        </div>
    );
}
