'use client';

import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { submitRatingAction, getUserRatingAction } from '@/app/actions/gameActions';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter, usePathname } from 'next/navigation';

interface StarRatingProps {
    gameId: string;
    initialRating?: number;
    initialRatingCount?: number;
    onRate?: (newRating: number) => void;
}

export default function StarRating({ gameId, initialRating = 0, initialRatingCount = 0, onRate }: StarRatingProps) {
    const [averageRating, setAverageRating] = useState(initialRating);
    const [ratingCount, setRatingCount] = useState(initialRatingCount);

    // User's personal rating state
    const [userRating, setUserRating] = useState<number>(0);
    const [hasRated, setHasRated] = useState(false);

    const [hoverRating, setHoverRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                try {
                    const existingRating = await getUserRatingAction(gameId, currentUser.uid);
                    if (existingRating !== null) {
                        setUserRating(existingRating);
                        setHasRated(true);
                    }
                } catch (err) {
                    console.error("Error checking rating:", err);
                }
            }
        });
        return () => unsubscribe();
    }, [gameId]);

    const handleRate = async (value: number) => {
        if (hasRated || isSubmitting) return;

        if (!user) {
            router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
            return;
        }

        setIsSubmitting(true);
        try {
            // Calculate new average optimistically
            const totalScore = averageRating * ratingCount;
            const newCount = ratingCount + 1;
            const newAverage = (totalScore + value) / newCount;

            setAverageRating(newAverage);
            setRatingCount(newCount);

            setUserRating(value);
            setHasRated(true);

            await submitRatingAction(gameId, user.uid, value);

            if (onRate) onRate(newAverage);
        } catch (error) {
            console.error("Failed to rate game:", error);
            // Revert
            setHasRated(false);
            setUserRating(0);
            setAverageRating(initialRating);
            setRatingCount(initialRatingCount);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Determine what to show on stars: Hover -> User Rating (if rated) -> 0 (Empty)
    const displayRating = hoverRating || (hasRated ? userRating : 0);

    return (
        <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onClick={() => handleRate(star)}
                        onMouseEnter={() => !hasRated && setHoverRating(star)}
                        onMouseLeave={() => !hasRated && setHoverRating(0)}
                        disabled={hasRated || isSubmitting}
                        className={cn(
                            "transition-all duration-200",
                            hasRated ? "cursor-default" : "cursor-pointer hover:scale-110"
                        )}
                        aria-label={`Rate ${star} stars`}
                    >
                        <Star
                            className={cn(
                                "w-6 h-6",
                                star <= displayRating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "fill-transparent text-muted-foreground"
                            )}
                        />
                    </button>
                ))}
            </div>
            {/* Always show actual global stats in text */}
            <div className="text-sm text-muted-foreground">
                {averageRating.toFixed(1)} ({ratingCount} {ratingCount === 1 ? 'review' : 'reviews'})
            </div>
            {hasRated && (
                <span className="text-xs text-green-500 animate-in fade-in">
                    {userRating ? `You rated: ${userRating} ★` : "Thanks for rating!"}
                </span>
            )}
        </div>
    );
}
