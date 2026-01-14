'use client';

import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { submitRating, getUserRating } from '@/lib/firestore';
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
    const [rating, setRating] = useState(initialRating);
    const [hoverRating, setHoverRating] = useState(0);
    const [count, setCount] = useState(initialRatingCount);
    const [hasRated, setHasRated] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [userRatingVal, setUserRatingVal] = useState<number | null>(null);

    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                console.log(`Checking existing rating for game: ${gameId}, user: ${currentUser.uid}`);
                try {
                    const existingRating = await getUserRating(gameId, currentUser.uid);
                    console.log(`Existing rating result: ${existingRating}`);
                    if (existingRating !== null) {
                        setUserRatingVal(existingRating);
                        setHasRated(true);
                    }
                } catch (err) {
                    console.error("Error in StarRating auth check:", err);
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
            // Optimistic update (show the new average temporarily, but locked)
            // Actually, usually we'd show the user's rating as "Your rating"
            // For now, we update the average logic as before for visual feedback
            const newCount = count + 1;
            const newAverage = ((rating * count) + value) / newCount;

            setRating(newAverage);
            setCount(newCount);
            setHasRated(true);
            setUserRatingVal(value);

            await submitRating(gameId, user.uid, value);

            if (onRate) onRate(newAverage);
        } catch (error) {
            console.error("Failed to rate game:", error);
            // Revert on error
            setHasRated(false);
            setUserRatingVal(null);
            setRating(initialRating);
            setCount(initialRatingCount);
        } finally {
            setIsSubmitting(false);
        }
    };

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
                                (hoverRating ? star <= hoverRating : star <= Math.round(rating))
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "fill-transparent text-muted-foreground"
                            )}
                        />
                    </button>
                ))}
            </div>
            <div className="text-sm text-muted-foreground">
                {rating.toFixed(1)} ({count} {count === 1 ? 'review' : 'reviews'})
            </div>
            {hasRated && (
                <span className="text-xs text-green-500 animate-in fade-in">
                    {userRatingVal ? `You rated: ${userRatingVal} ★` : "Thanks for rating!"}
                </span>
            )}
        </div>
    );
}
