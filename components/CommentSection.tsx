'use client';

import { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { addComment, getPostComments, Comment } from '@/lib/firestore';
import { Button } from '@/components/ui/Button';
import { Send, UserCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

export default function CommentSection({ postId, onCommentAdded, onCommentsLoaded }: {
    postId: string,
    onCommentAdded?: () => void,
    onCommentsLoaded?: (count: number) => void
}) {
    const [user, setUser] = useState<User | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        loadComments();

        return () => unsubscribe();
    }, [postId]);

    const loadComments = async () => {
        const fetchedComments = await getPostComments(postId);
        setComments(fetchedComments);
        if (onCommentsLoaded) onCommentsLoaded(fetchedComments.length);
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !newComment.trim()) return;

        setSubmitting(true);
        try {
            const commentData: any = {
                postId,
                userId: user.uid,
                userName: user.displayName || 'Anonymous',
                content: newComment.trim(),
                createdAt: new Date().toISOString()
            };

            if (user.photoURL) {
                commentData.userAvatar = user.photoURL;
            }

            await addComment(commentData);
            setNewComment('');
            if (onCommentAdded) onCommentAdded();
            await loadComments();
        } catch (error) {
            console.error("Failed to post comment:", error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-[#0a0a0a] border-t border-white/5 p-4 md:p-6">
            {/* Input */}
            {user ? (
                <form onSubmit={handleSubmit} className="flex gap-4 mb-6">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center overflow-hidden shrink-0">
                        {user.photoURL ? (
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
                            placeholder="Write a comment..."
                            className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:bg-white/10 pr-12 transition-all"
                        />
                        <button
                            type="submit"
                            disabled={!newComment.trim() || submitting}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-primary hover:bg-primary/10 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </form>
            ) : (
                <div className="text-center py-4 bg-white/5 rounded-xl mb-6">
                    <p className="text-sm text-muted-foreground mb-2">Log in to join the conversation</p>
                    <Link href="/login">
                        <Button size="sm" variant="outline">Login</Button>
                    </Link>
                </div>
            )}

            {/* List */}
            <div className="space-y-4">
                {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3 animate-in fade-in slide-in-from-top-2">
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
                            <p className="text-sm text-white/80 leading-relaxed">{comment.content}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
