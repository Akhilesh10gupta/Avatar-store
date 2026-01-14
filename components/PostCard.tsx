'use client';

import { useState, useEffect } from 'react';
import { Post, toggleLikePost } from '@/lib/firestore';
import { useAuth } from '@/components/AuthProvider';
import { Heart, MessageCircle, UserCircle, Share2, MoreHorizontal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import CommentSection from './CommentSection';
import { motion, AnimatePresence } from 'framer-motion';

interface PostCardProps {
    post: Post;
}

export default function PostCard({ post }: PostCardProps) {
    const { user } = useAuth();
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likes.length);
    const [commentCount, setCommentCount] = useState(post.commentCount || 0);
    const [showComments, setShowComments] = useState(false);

    useEffect(() => {
        if (user) {
            setIsLiked(post.likes.includes(user.uid));
        } else {
            setIsLiked(false);
        }
    }, [user, post.likes]);

    // Sync local state with prop when it updates (e.g. after repair)
    useEffect(() => {
        setCommentCount(post.commentCount || 0);
    }, [post.commentCount]);

    const handleLike = async () => {
        if (!user) return; // Add login prompt logic if needed

        // Optimistic update
        const newIsLiked = !isLiked;
        setIsLiked(newIsLiked);
        setLikeCount(prev => newIsLiked ? prev + 1 : prev - 1);

        try {
            await toggleLikePost(post.id!, user.uid);
        } catch (error) {
            console.error("Error toggling like:", error);
            // Revert on error
            setIsLiked(!newIsLiked);
            setLikeCount(prev => !newIsLiked ? prev + 1 : prev - 1);
        }
    };

    const handleShare = async () => {
        const shareData = {
            title: 'Avatar Store Community',
            text: `Check out ${post.userName}'s post: "${post.content.slice(0, 50)}${post.content.length > 50 ? '...' : ''}"`,
            url: window.location.href
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
                alert("Link copied to clipboard!");
            }
        } catch (err) {
            console.error("Error sharing:", err);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#121212] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all"
        >
            <div className="p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                            {post.userAvatar ? (
                                <img src={post.userAvatar} alt={post.userName} className="w-full h-full object-cover" />
                            ) : (
                                <UserCircle className="w-6 h-6 text-muted-foreground" />
                            )}
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">{post.userName}</h3>
                            <p className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="mb-4 space-y-4">
                    <p className="text-white/90 whitespace-pre-wrap leading-relaxed">
                        {post.content}
                    </p>
                    {post.imageUrl && (
                        <div className="rounded-xl overflow-hidden border border-white/5">
                            <img src={post.imageUrl} alt="Post content" className="w-full h-auto" />
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                    <button
                        onClick={handleLike}
                        className={`flex items-center gap-2 text-sm transition-colors ${isLiked ? 'text-red-500' : 'text-muted-foreground hover:text-white'
                            }`}
                    >
                        <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                        <span>{likeCount}</span>
                    </button>

                    <button
                        onClick={() => setShowComments(!showComments)}
                        className={`flex items-center gap-2 text-sm transition-colors ${showComments ? 'text-white' : 'text-muted-foreground hover:text-white'
                            }`}
                    >
                        <MessageCircle className="w-5 h-5" />
                        <span>{commentCount > 0 ? commentCount : 'Comments'}</span>
                    </button>

                    <button
                        onClick={handleShare}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors ml-auto"
                    >
                        <Share2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Comments Section */}
            <AnimatePresence>
                {showComments && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <CommentSection
                            postId={post.id!}
                            onCommentAdded={() => setCommentCount(prev => prev + 1)}
                            onCommentsLoaded={(count: number) => setCommentCount(count)}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
