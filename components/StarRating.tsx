'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { rateGame } from '@/lib/firestore'; // We need to export this next

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

    const handleRate = async (value: number) => {
        if (hasRated || isSubmitting) return;

        setIsSubmitting(true);
        try {
            // Optimistic update
            const newCount = count + 1;
            // Weighted average formula: ((oldRating * oldCount) + newValue) / newCount
            const newAverage = ((rating * count) + value) / newCount;

            setRating(newAverage);
            setCount(newCount);
            setHasRated(true);

            await rateGame(gameId, value);

            if (onRate) onRate(newAverage);
        } catch (error) {
            console.error("Failed to rate game:", error);
            // Revert on error (simplified)
            setHasRated(false);
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
                <span className="text-xs text-green-500 animate-in fade-in">Thanks for rating!</span>
            )}
        </div>
    );
}
