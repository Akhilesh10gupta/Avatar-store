'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { auth } from '@/lib/firebase';
import { addComment, getPostComments, toggleLikeComment, Comment } from '@/lib/firestore';
import { Button } from '@/components/ui/Button';
import { Send, UserCircle, Heart, MessageCircle, CornerDownRight } from 'lucide-react';
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

        if (!user || !content.trim()) return;

        setSubmitting(true);
        try {
            const commentData: any = {
                postId,
                userId: user.uid,
                userName: user.displayName || 'Anonymous',
                content: content.trim(),
                parentId,
                createdAt: new Date().toISOString()
            };

            if (user.photoURL) {
                commentData.userAvatar = user.photoURL;
            }

            await addComment(commentData);

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
        } finally {
            setSubmitting(false);
        }
    };

    const CommentItem = ({ comment, isReply = false }: { comment: Comment, isReply?: boolean }) => {
        const isLiked = user && comment.likes?.includes(user.uid);
        const likeCount = comment.likes?.length || 0;

        return (
            <div className={cn("flex gap-3 animate-in fade-in slide-in-from-top-2", isReply && "ml-12 mt-3")}>
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center overflow-hidden shrink-0">
                    {comment.userAvatar ? (
                        <img src={comment.userAvatar} alt={comment.userName} className="w-full h-full object-cover" />
                    ) : (
                        <UserCircle className="w-5 h-5 text-muted-foreground" />
                    )}
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-medium text-sm text-white">{comment.userName}</span>
                        <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        </span>
                    </div>
                    <p className="text-sm text-white/80 leading-relaxed mb-2">{comment.content}</p>

                    {/* Actions */}
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

                    {/* Reply Input */}
                    {replyingTo === comment.id && (
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
                                    className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:bg-white/10 pr-10 transition-all"
                                />
                                <button
                                    type="submit"
                                    disabled={!replyContent.trim() || submitting}
                                    className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-primary text-white hover:bg-primary/90 rounded-full transition-colors disabled:opacity-50"
                                >
                                    <Send className="w-3 h-3" />
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
                        className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:bg-white/10 pr-12 transition-all cursor-text"
                    />
                    <button
                        type="submit"
                        disabled={!user || !newComment.trim() || submitting}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-white hover:bg-primary/90 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
