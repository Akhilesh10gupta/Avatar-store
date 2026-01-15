'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { addReview, getGameReviews, updateReview, Review } from '@/lib/firestore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useRouter, usePathname } from 'next/navigation';
import { MessageSquare, UserCircle, Pencil, X, Check } from 'lucide-react';
import Link from 'next/link';
import GameLoader from './GameLoader';

export default function ReviewSection({ gameId }: { gameId: string }) {
    const [user, setUser] = useState<User | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [newReview, setNewReview] = useState('');
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        // Fetch reviews
        getGameReviews(gameId).then(fetchedReviews => {
            setReviews(fetchedReviews);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [gameId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !newReview.trim()) return;

        setSubmitting(true);
        try {
            const reviewData = {
                gameId,
                userId: user.uid,
                userName: user.displayName || 'Anonymous User',
                userAvatar: user.photoURL || undefined,
                content: newReview.trim(),
                createdAt: new Date().toISOString()
            };

            await addReview(reviewData);
            setNewReview('');

            // Refresh reviews
            const updatedReviews = await getGameReviews(gameId);
            setReviews(updatedReviews);
        } catch (error) {
            console.error("Failed to post review:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleLoginRedirect = () => {
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    };

    if (loading) {

        // ...

        if (loading) {
            return <div className="py-8"><GameLoader text="Loading Reviews..." /></div>;
        }
    }

    return (
        <div className="space-y-8 max-w-2xl">
            <h3 className="text-2xl font-bold flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-primary" />
                Comments & Reviews ({reviews.length})
            </h3>

            {/* Comment Form */}
            <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm">
                {user ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center overflow-hidden shrink-0">
                                {user.photoURL ? (
                                    <img src={user.photoURL} alt={user.displayName || "User"} className="w-full h-full object-cover" />
                                ) : (
                                    <UserCircle className="w-6 h-6 text-muted-foreground" />
                                )}
                            </div>
                            <div className="flex-1 space-y-2">
                                <h4 className="font-medium text-sm">{user.displayName || 'User'}</h4>
                                <textarea
                                    value={newReview}
                                    onChange={(e) => setNewReview(e.target.value)}
                                    placeholder="Write your review here..."
                                    className="w-full min-h-[100px] p-3 rounded-md border border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit" disabled={submitting || !newReview.trim()}>
                                {submitting ? 'Posting...' : 'Post Comment'}
                            </Button>
                        </div>
                    </form>
                ) : (
                    <div className="text-center py-6 space-y-4">
                        <p className="text-muted-foreground">Please log in to leave a review.</p>
                        <Button onClick={handleLoginRedirect} variant="outline">
                            Log in to Comment
                        </Button>
                    </div>
                )}
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
                {reviews.length === 0 ? (
                    <p className="text-muted-foreground text-center italic">No reviews yet. Be the first to share your thoughts!</p>
                ) : (
                    reviews.map((review) => (
                        <ReviewItem
                            key={review.id}
                            review={review}
                            currentUser={user}
                            onUpdate={async () => {
                                const updatedReviews = await getGameReviews(gameId);
                                setReviews(updatedReviews);
                            }}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

// Split into sub-component for better state management
function ReviewItem({ review, currentUser, onUpdate }: { review: Review, currentUser: User | null, onUpdate: () => void }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(review.content);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!review.id || !editContent.trim()) return;
        setIsSaving(true);
        try {
            await updateReview(review.id, editContent.trim());
            setIsEditing(false);
            onUpdate();
        } catch (error) {
            console.error("Failed to update review:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const isOwner = currentUser && currentUser.uid === review.userId;

    return (
        <div className="flex gap-4 p-4 rounded-lg hover:bg-card/50 transition-colors group">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center overflow-hidden shrink-0 mt-1">
                {review.userAvatar ? (
                    <img src={review.userAvatar} alt={review.userName} className="w-full h-full object-cover" />
                ) : (
                    <UserCircle className="w-6 h-6 text-muted-foreground" />
                )}
            </div>
            <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm">{review.userName}</h4>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString()}
                            {review.updatedAt && " (edited)"}
                        </span>
                        {isOwner && !isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded"
                                title="Edit comment"
                            >
                                <Pencil className="w-3 h-3 text-muted-foreground hover:text-white" />
                            </button>
                        )}
                    </div>
                </div>

                {isEditing ? (
                    <div className="space-y-2">
                        <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full min-h-[80px] p-2 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        />
                        <div className="flex gap-2 justify-end">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => { setIsEditing(false); setEditContent(review.content); }}
                                disabled={isSaving}
                                className="h-7 text-xs"
                            >
                                <X className="w-3 h-3 mr-1" /> Cancel
                            </Button>
                            <Button
                                size="sm"
                                onClick={handleSave}
                                disabled={isSaving}
                                className="h-7 text-xs"
                            >
                                <Check className="w-3 h-3 mr-1" /> {isSaving ? 'Saving...' : 'Save'}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                        {review.content}
                    </p>
                )}
            </div>
        </div>
    );
}
