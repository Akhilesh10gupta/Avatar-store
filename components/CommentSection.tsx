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

export default function CommentSection({ postId, postOwnerId, postOwnerAvatar, onCommentAdded, onCommentsLoaded }: {
    postId: string,
    postOwnerId: string,
    postOwnerAvatar?: string,
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
            <div className={cn("flex gap-3 animate-in fade-in slide-in-from-top-2 relative group", isReply && "ml-6 md:ml-12 mt-3")}>
                {/* Left: Avatar */}
                {/* Left: Avatar */}
                <div className={cn("rounded-full bg-secondary flex items-center justify-center overflow-hidden shrink-0", isReply ? "w-6 h-6 md:w-8 md:h-8" : "w-8 h-8")}>
                    {comment.userAvatar ? (
                        <img src={comment.userAvatar} alt={comment.userName} className="w-full h-full object-cover" />
                    ) : (
                        <UserCircle className={cn("text-muted-foreground", isReply ? "w-4 h-4 md:w-5 md:h-5" : "w-5 h-5")} />
                    )}
                </div>

                {/* Middle: Content & Actions */}
                <div className="flex-1 min-w-0">
                    {/* Header: Name, Time, Badge */}
                    <div className="flex items-center gap-1.5 md:gap-2 mb-0.5">
                        <span className="font-semibold text-sm text-white truncate">{comment.userName}</span>
                        <span className="text-[10px] md:text-xs text-muted-foreground shrink-0">
                            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        </span>
                        {comment.updatedAt && (
                            <span className="text-[10px] text-muted-foreground/60 italic shrink-0">(edited)</span>
                        )}
                        {comment.userId === postOwnerId && (
                            <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded text-xs font-medium">Author</span>
                        )}

                        {/* Author Like Badge (Instagram Style) - Next to timestamp */}
                        {comment.likes?.includes(postOwnerId) && (
                            <div className="relative flex items-center justify-center w-3.5 h-3.5 ml-0.5" title="Liked by author">
                                <div className="w-3.5 h-3.5 rounded-full overflow-hidden border border-background">
                                    {postOwnerAvatar ? (
                                        <img src={postOwnerAvatar} alt="Author" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                                            <UserCircle className="w-3 h-3 text-primary" />
                                        </div>
                                    )}
                                </div>
                                <Heart className="w-2 h-2 text-red-500 fill-red-500 absolute -bottom-0.5 -right-0.5 drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]" />
                            </div>
                        )}
                    </div>

                    {/* Comment Text / Edit Mode */}
                    {isEditing ? (
                        <div className="space-y-2 mt-1">
                            <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-primary/50 min-h-[60px] resize-none"
                                autoFocus
                            />
                            <div className="flex justify-end gap-2">
                                <button onClick={() => setIsEditing(false)} className="px-2 py-1 text-xs text-muted-foreground hover:text-white transition-colors">Cancel</button>
                                <button onClick={saveEdit} disabled={isSaving || !editContent.trim()} className="px-3 py-1 bg-primary text-white text-xs rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50">{isSaving ? 'Saving...' : 'Save'}</button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-white/90 leading-relaxed break-words">{comment.content}</p>
                    )}

                    {/* Actions: Reply, Menu */}
                    {!isEditing && (
                        <div className="flex items-center gap-4 mt-1.5">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => {
                                        if (!user) { router.push('/login'); return; }
                                        setReplyingTo(replyingTo === comment.id ? null : comment.id!);
                                    }}
                                    className="text-xs font-semibold text-muted-foreground hover:text-white transition-colors"
                                >
                                    Reply
                                </button>
                            </div>
                            {user && (user.uid === comment.userId || user.uid === postOwnerId) && (
                                <div className="relative" ref={menuRef}>
                                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-1 text-muted-foreground/50 hover:text-white rounded-full transition-colors">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                    {isMenuOpen && (
                                        <div className="absolute left-0 top-full mt-1 w-28 bg-[#1A1A1A] border border-white/10 rounded-lg shadow-xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                            {user.uid === comment.userId && (
                                                <button onClick={() => { setIsEditing(true); setIsMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-xs text-white hover:bg-white/5 transition-colors text-left">
                                                    <Pencil className="w-3.5 h-3.5" /> Edit
                                                </button>
                                            )}
                                            <button onClick={() => handleDeleteComment(comment.id!)} className="w-full flex items-center gap-3 px-3 py-2 text-xs text-red-500 hover:bg-red-500/10 transition-colors text-left">
                                                <Trash2 className="w-3.5 h-3.5" /> Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
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
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Send className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Right: Like Button (Vertical) */}
                {!isEditing && (
                    <div className="shrink-0 flex flex-col items-center gap-0.5 pt-1">
                        <button
                            onClick={() => handleLike(comment.id!)}
                            className="text-muted-foreground hover:text-red-500 transition-colors"
                        >
                            <Heart className={cn("w-4 h-4", isLiked ? "fill-red-500 text-red-500" : "")} />
                        </button>
                        {likeCount > 0 && (
                            <span className="text-[10px] text-muted-foreground">{likeCount}</span>
                        )}
                    </div>
                )}
            </div>
        );
    };

    const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());

    const toggleReplies = (commentId: string) => {
        const newExpanded = new Set(expandedComments);
        if (newExpanded.has(commentId)) {
            newExpanded.delete(commentId);
        } else {
            newExpanded.add(commentId);
        }
        setExpandedComments(newExpanded);
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
                {rootComments.map((comment) => {
                    const replies = getReplies(comment.id!);
                    const isExpanded = expandedComments.has(comment.id!);

                    return (
                        <div key={comment.id} className="space-y-2">
                            <CommentItem comment={comment} />

                            {/* Replies Toggle */}
                            {replies.length > 0 && (
                                <div className="ml-12">
                                    {!isExpanded && (
                                        <button
                                            onClick={() => toggleReplies(comment.id!)}
                                            className="flex items-center gap-3 group/line my-2"
                                        >
                                            <div className="w-8 h-[1px] bg-white/20 group-hover/line:bg-white/40 transition-colors"></div>
                                            <span className="text-xs font-semibold text-muted-foreground group-hover/line:text-white transition-colors">
                                                View {replies.length} more {replies.length === 1 ? 'reply' : 'replies'}
                                            </span>
                                        </button>
                                    )}

                                    {/* Render Replies */}
                                    {isExpanded && (
                                        <div className="space-y-3 mt-3 animate-in fade-in slide-in-from-top-1">
                                            {replies.map(reply => (
                                                <CommentItem key={reply.id} comment={reply} isReply={true} />
                                            ))}
                                            <button
                                                onClick={() => toggleReplies(comment.id!)}
                                                className="flex items-center gap-3 group/line mt-4 mb-2"
                                            >
                                                <div className="w-8 h-[1px] bg-white/20 group-hover/line:bg-white/40 transition-colors"></div>
                                                <span className="text-xs font-semibold text-muted-foreground group-hover/line:text-white transition-colors">
                                                    Hide replies
                                                </span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
