import { useState, useEffect, useRef } from 'react';
import { Post, toggleLikePost, deletePost, updatePost } from '@/lib/firestore';
import { useAuth } from '@/components/AuthProvider';
import { Heart, MessageCircle, UserCircle, Share2, MoreHorizontal, Pencil, Trash2, X, Check } from 'lucide-react';
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

    // Edit/Delete State
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(post.content);
    const [editedContentDisplay, setEditedContentDisplay] = useState(post.content); // Display updated content after save
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (user) {
            setIsLiked(post.likes.includes(user.uid));
        } else {
            setIsLiked(false);
        }
    }, [user, post.likes]);

    // Handle clicking outside to close menu
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Sync local state with prop when it updates
    useEffect(() => {
        setCommentCount(post.commentCount || 0);
    }, [post.commentCount]);

    const handleLike = async () => {
        if (!user) return;

        const newIsLiked = !isLiked;
        setIsLiked(newIsLiked);
        setLikeCount(prev => newIsLiked ? prev + 1 : prev - 1);

        try {
            await toggleLikePost(post.id!, user.uid);
        } catch (error) {
            console.error("Error toggling like:", error);
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

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this post?")) return;

        setIsDeleting(true);
        try {
            await deletePost(post.id!);
            setIsDeleted(true); // Hide the card
        } catch (error) {
            console.error("Error deleting post:", error);
            alert("Failed to delete post.");
            setIsDeleting(false);
        }
    };

    const handleUpdate = async () => {
        if (!editContent.trim()) return;

        setIsSaving(true);
        try {
            await updatePost(post.id!, editContent);
            setEditedContentDisplay(editContent);
            setIsEditing(false);
            setIsMenuOpen(false);
        } catch (error) {
            console.error("Error updating post:", error);
            alert("Failed to update post.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isDeleted) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#121212] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all relative"
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

                    {/* Options Menu */}
                    {user?.uid === post.userId && (
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="p-2 text-muted-foreground hover:text-white rounded-full hover:bg-white/5 transition-colors"
                            >
                                <MoreHorizontal className="w-5 h-5" />
                            </button>

                            {isMenuOpen && (
                                <div className="absolute right-0 top-full mt-2 w-32 bg-[#1A1A1A] border border-white/10 rounded-xl shadow-xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                    <button
                                        onClick={() => {
                                            setIsEditing(true);
                                            setIsMenuOpen(false);
                                        }}
                                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-white hover:bg-white/5 transition-colors text-left"
                                    >
                                        <Pencil className="w-4 h-4" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-red-500/10 transition-colors text-left"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="mb-4 space-y-4">
                    {isEditing ? (
                        <div className="space-y-3">
                            <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary/50 min-h-[100px] resize-none"
                            />
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-3 py-1.5 text-sm text-muted-foreground hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdate}
                                    disabled={isSaving || !editContent.trim()}
                                    className="px-4 py-1.5 bg-primary text-white text-sm rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50"
                                >
                                    {isSaving ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-white/90 whitespace-pre-wrap leading-relaxed">
                            {editedContentDisplay}
                        </p>
                    )}

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
