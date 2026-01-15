'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { auth } from '@/lib/firebase';
import { addComment, getPostComments, toggleLikeComment, Comment, deleteComment, updateComment } from '@/lib/firestore';
import { Button } from '@/components/ui/Button';
import { Send, UserCircle, Heart, MessageCircle, CornerDownRight, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function CommentSection({ postId, onCommentAdded, onCommentsLoaded }: {
    postId: string,
    onCommentAdded?: () => void,
    onCommentsLoaded?: (count: number) => void
}) {
    const { user } = useAuth();
    const router = useRouter();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyContent, setReplyContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadComments();
    }, [postId]);

    const loadComments = async () => {
        const fetchedComments = await getPostComments(postId);
        setComments(fetchedComments);
        if (onCommentsLoaded) onCommentsLoaded(fetchedComments.length);
        setLoading(false);
    };

    const handleLike = async (commentId: string) => {
        if (!user) {
            router.push('/login');
            return;
        }

        // Optimistic update
        setComments(prev => prev.map(c => {
            if (c.id === commentId) {
                const likes = c.likes || [];
                const hasLiked = likes.includes(user.uid);
                return {
                    ...c,
                    likes: hasLiked ? likes.filter(id => id !== user.uid) : [...likes, user.uid]
                };
            }
            return c;
        }));

        try {
            await toggleLikeComment(commentId, user.uid);
        } catch (error) {
            console.error("Failed to toggle like:", error);
            await loadComments(); // Revert on error
        }
    };

    const handleSubmit = async (e: React.FormEvent, parentId?: string) => {
        e.preventDefault();
        const content = parentId ? replyContent : newComment;

        if (!user) {
            alert("You must be logged in to comment.");
            router.push('/login');
            return;
        }

        if (!content.trim()) return;

        if (!postId) {
            console.error("No post ID found for comment");
            alert("Error: Cannot post comment because Post ID is missing.");
            return;
        }

        setSubmitting(true);
        try {
            console.log("Submitting comment...", { postId, userId: user.uid, content });

            const commentData: any = {
                postId,
                userId: user.uid,
                userName: user.displayName || 'Anonymous',
                content: content.trim(),
                parentId: parentId || null, // Ensure explicit null if undefined
                createdAt: new Date().toISOString()
            };

            if (user.photoURL) {
                commentData.userAvatar = user.photoURL;
            }

            await addComment(commentData);
            console.log("Comment submitted successfully");

            if (parentId) {
                setReplyContent('');
                setReplyingTo(null);
            } else {
                setNewComment('');
            }

            if (onCommentAdded) onCommentAdded();
            await loadComments();
        } catch (error) {
            console.error("Failed to post comment:", error);
            alert(`Failed to post comment. Please try again. Error: ${error}`);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        if (!confirm("Are you sure you want to delete this comment?")) return;

        const commentToDelete = comments.find(c => c.id === commentId);
        // Optimistic remove
        setComments(prev => prev.filter(c => c.id !== commentId));

        try {
            await deleteComment(commentId, postId);
            if (onCommentsLoaded && comments.length > 0) onCommentsLoaded(comments.length - 1);
        } catch (error) {
            console.error("Failed to delete comment:", error);
            alert("Failed to delete comment.");
            // Revert
            if (commentToDelete) {
                setComments(prev => [...prev, commentToDelete]);
            }
        }
    };

    const handleUpdateComment = async (commentId: string, newContent: string) => {
        try {
            // Optimistic update
            setComments(prev => prev.map(c =>
                c.id === commentId
                    ? { ...c, content: newContent, updatedAt: new Date().toISOString() }
                    : c
            ));

            await updateComment(commentId, newContent);
        } catch (error) {
            console.error("Failed to update comment:", error);
            alert("Failed to update comment.");
            await loadComments(); // Revert
        }
    };

    const CommentItem = ({ comment, isReply = false }: { comment: Comment, isReply?: boolean }) => {
        const isLiked = user && comment.likes?.includes(user.uid);
        const likeCount = comment.likes?.length || 0;
        const [isEditing, setIsEditing] = useState(false);
        const [editContent, setEditContent] = useState(comment.content);
        const [isMenuOpen, setIsMenuOpen] = useState(false);
        const [isSaving, setIsSaving] = useState(false);
        const menuRef = useRef<HTMLDivElement>(null);

        // Close menu on outside click
        useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                    setIsMenuOpen(false);
                }
            };
            if (isMenuOpen) {
                document.addEventListener('mousedown', handleClickOutside);
            }
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }, [isMenuOpen]);

        const saveEdit = async () => {
            if (!editContent.trim()) return;
            setIsSaving(true);
            await handleUpdateComment(comment.id!, editContent);
            setIsSaving(false);
            setIsEditing(false);
        };

        return (
            <div className={cn("flex gap-3 animate-in fade-in slide-in-from-top-2 relative group", isReply && "ml-12 mt-3")}>
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center overflow-hidden shrink-0">
                    {comment.userAvatar ? (
                        <img src={comment.userAvatar} alt={comment.userName} className="w-full h-full object-cover" />
                    ) : (
                        <UserCircle className="w-5 h-5 text-muted-foreground" />
                    )}
                </div>
                <div className="flex-1 min-w-0"> {/* min-w-0 prevents text overflow issues */}
                    <div className="flex items-center justify-between mb-0.5">
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-sm text-white truncate">{comment.userName}</span>
                            <span className="text-xs text-muted-foreground shrink-0">
                                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                            </span>
                            {comment.updatedAt && (
                                <span className="text-[10px] text-muted-foreground/60 italic shrink-0">
                                    (edited)
                                </span>
                            )}
                        </div>

                        {/* More Options Menu */}
                        {user?.uid === comment.userId && !isEditing && (
                            <div className="relative" ref={menuRef}>
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="p-1 text-muted-foreground hover:text-white rounded-full hover:bg-white/5 transition-colors md:opacity-0 md:group-hover:opacity-100 opacity-100 focus:opacity-100"
                                >
                                    <MoreHorizontal className="w-4 h-4" />
                                </button>

                                {isMenuOpen && (
                                    <div className="absolute right-0 top-full mt-1 w-28 bg-[#1A1A1A] border border-white/10 rounded-lg shadow-xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                        <button
                                            onClick={() => {
                                                setIsEditing(true);
                                                setIsMenuOpen(false);
                                            }}
                                            className="w-full flex items-center gap-3 px-3 py-2 text-xs text-white hover:bg-white/5 transition-colors text-left"
                                        >
                                            <Pencil className="w-3.5 h-3.5" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteComment(comment.id!)}
                                            className="w-full flex items-center gap-3 px-3 py-2 text-xs text-red-500 hover:bg-red-500/10 transition-colors text-left"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {isEditing ? (
                        <div className="space-y-2 mt-1">
                            <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-primary/50 min-h-[60px] resize-none"
                                autoFocus
                            />
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-2 py-1 text-xs text-muted-foreground hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={saveEdit}
                                    disabled={isSaving || !editContent.trim()}
                                    className="px-3 py-1 bg-primary text-white text-xs rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50"
                                >
                                    {isSaving ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-white/80 leading-relaxed mb-2 break-words">{comment.content}</p>
                    )}

                    {/* Actions */}
                    {!isEditing && (
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => handleLike(comment.id!)}
                                className={cn(
                                    "flex items-center gap-1.5 text-xs font-medium transition-colors",
                                    isLiked ? "text-red-500" : "text-muted-foreground hover:text-white"
                                )}
                            >
                                <Heart className={cn("w-3.5 h-3.5", isLiked && "fill-current")} />
                                {likeCount > 0 && likeCount}
                            </button>

                            {!isReply && (
                                <button
                                    onClick={() => {
                                        if (!user) {
                                            router.push('/login');
                                            return;
                                        }
                                        setReplyingTo(replyingTo === comment.id ? null : comment.id!);
                                    }}
                                    className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-white transition-colors"
                                >
                                    <MessageCircle className="w-3.5 h-3.5" />
                                    Reply
                                </button>
                            )}
                        </div>
                    )}

                    {/* Reply Input */}
                    {replyingTo === comment.id && !isEditing && (
                        <form onSubmit={(e) => handleSubmit(e, comment.id!)} className="flex gap-3 mt-3 animate-in fade-in zoom-in-95 duration-200">
                            <div className="flex items-center justify-center w-8 shrink-0">
                                <CornerDownRight className="w-4 h-4 text-muted-foreground/50" />
                            </div>
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    autoFocus
                                    placeholder={`Reply to ${comment.userName}...`}
                                    className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2 text-base md:text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:bg-white/10 pr-11 transition-all"
                                />
                                <button
                                    type="submit"
                                    disabled={!replyContent.trim() || submitting}
                                    className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-primary text-white hover:bg-primary/90 rounded-full transition-colors disabled:opacity-50 z-10"
                                    onClick={(e) => e.stopPropagation()} // Prevent bubbling if needed
                                >
                                    <Send className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        );
    };

    const rootComments = comments.filter(c => !c.parentId);
    const getReplies = (parentId: string) => comments.filter(c => c.parentId === parentId);

    return (
        <div className="bg-[#0a0a0a] border-t border-white/5 p-4 md:p-6">
            {/* Main Input */}
            <form onSubmit={(e) => handleSubmit(e)} className="flex gap-4 mb-8">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center overflow-hidden shrink-0">
                    {user?.photoURL ? (
                        <img src={user.photoURL} alt="Me" className="w-full h-full object-cover" />
                    ) : (
                        <UserCircle className="w-5 h-5 text-muted-foreground" />
                    )}
                </div>
                <div className="flex-1 relative">
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onFocus={() => {
                            if (!user) router.push('/login');
                        }}
                        placeholder={user ? "Write a comment..." : "Log in to comment..."}
                        className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-base md:text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:bg-white/10 pr-12 transition-all cursor-text"
                    />
                    <button
                        type="submit"
                        disabled={!user || !newComment.trim() || submitting}
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-primary text-white hover:bg-primary/90 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed z-10"
                    >
                        <Send className="w-3.5 h-3.5" />
                    </button>
                </div>
            </form>

            {/* List */}
            <div className="space-y-6">
                {rootComments.map((comment) => (
                    <div key={comment.id} className="space-y-3">
                        <CommentItem comment={comment} />
                        {/* Render Replies */}
                        {getReplies(comment.id!).map(reply => (
                            <CommentItem key={reply.id} comment={reply} isReply={true} />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
