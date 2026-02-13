"use server";

// ... imports ...
import { getGamesAdmin, getTopRatedGamesAdmin, getMostDownloadedGamesAdmin } from "@/lib/firestore-admin";
import { Review } from "@/lib/firestore";

// ... existing actions ...

export async function incrementDownloadAction(gameId: string) {
    if (!gameId) return;
    try {
        const { adminDb } = await import('@/lib/firebase-admin');
        const { FieldValue } = await import('firebase-admin/firestore');
        await adminDb.collection('games').doc(gameId).update({
            downloadCount: FieldValue.increment(1)
        });
    } catch (error) {
        console.error("Error incrementing download:", error);
    }
}

export async function getGameReviewsAction(gameId: string) {
    try {
        const { adminDb } = await import('@/lib/firebase-admin');
        const snapshot = await adminDb.collection('reviews')
            .where("gameId", "==", gameId)
            .get();

        const reviews = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            // Convert timestamps to string to pass to client
            createdAt: (doc.data().createdAt?.toDate ? doc.data().createdAt.toDate().toISOString() : doc.data().createdAt) || new Date().toISOString(),
            updatedAt: (doc.data().updatedAt?.toDate ? doc.data().updatedAt.toDate().toISOString() : doc.data().updatedAt)
        } as Review));

        return reviews.sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return [];
    }
}

export async function addReviewAction(review: any) {
    try {
        const { adminDb } = await import('@/lib/firebase-admin');
        const docRef = await adminDb.collection('reviews').add({
            ...review,
            createdAt: new Date() // Admin SDK uses native timestamp or Date
        });
        return docRef.id;
    } catch (error) {
        console.error("Error adding review:", error);
        throw new Error("Failed to add review");
    }
}

export async function updateReviewAction(reviewId: string, content: string) {
    try {
        const { adminDb } = await import('@/lib/firebase-admin');
        await adminDb.collection('reviews').doc(reviewId).update({
            content,
            updatedAt: new Date()
        });
    } catch (error) {
        console.error("Error updating review:", error);
        throw new Error("Failed to update review");
    }
}

export async function getUserRatingAction(gameId: string, userId: string) {
    try {
        const { adminDb } = await import('@/lib/firebase-admin');
        const docSnap = await adminDb.collection('ratings').doc(`${gameId}_${userId}`).get();
        if (docSnap.exists) {
            return docSnap.data()?.rating as number;
        }
        return null;
    } catch (error) {
        console.error("Error getting user rating:", error);
        return null;
    }
}

export async function submitRatingAction(gameId: string, userId: string, rating: number) {
    try {
        const { adminDb } = await import('@/lib/firebase-admin');
        const { FieldValue } = await import('firebase-admin/firestore');

        const ratingDocRef = adminDb.collection('ratings').doc(`${gameId}_${userId}`);
        const gameRef = adminDb.collection('games').doc(gameId);

        await adminDb.runTransaction(async (t) => {
            const ratingDoc = await t.get(ratingDocRef);
            if (ratingDoc.exists) {
                throw new Error("User has already rated this game.");
            }

            const gameDoc = await t.get(gameRef);
            if (!gameDoc.exists) {
                throw new Error("Game does not exist!");
            }

            const data = gameDoc.data();
            const currentRating = data?.rating || 0;
            const currentCount = data?.ratingCount || 0;

            const newCount = currentCount + 1;
            const newAverage = ((currentRating * currentCount) + rating) / newCount;

            t.set(ratingDocRef, {
                gameId,
                userId,
                rating,
                createdAt: new Date()
            });

            t.update(gameRef, {
                rating: newAverage,
                ratingCount: newCount
            });
        });
    } catch (error) {
        console.error("Error submitting rating:", error);
        throw new Error("Failed to submit rating");
    }
}

export async function addGameAction(gameData: any) {
    try {
        const { adminDb } = await import('@/lib/firebase-admin');
        const docRef = await adminDb.collection('games').add({
            ...gameData,
            createdAt: new Date(),
            rating: 0,
            ratingCount: 0,
            downloadCount: 0
        });
        return docRef.id;
    } catch (error) {
        console.error("Error adding game:", error);
        throw new Error("Failed to add game");
    }
}

export async function updateGameAction(gameId: string, gameData: any) {
    try {
        const { adminDb } = await import('@/lib/firebase-admin');
        await adminDb.collection('games').doc(gameId).update({
            ...gameData,
            updatedAt: new Date()
        });
    } catch (error) {
        console.error("Error updating game:", error);
        throw new Error("Failed to update game");
    }
}

export async function deleteGameAction(gameId: string) {
    try {
        const { adminDb } = await import('@/lib/firebase-admin');
        await adminDb.collection('games').doc(gameId).delete();
    } catch (error) {
        console.error("Error deleting game:", error);
        throw new Error("Failed to delete game");
    }
}

export async function getUserGamesAction(userId: string) {
    try {
        const { adminDb } = await import('@/lib/firebase-admin');
        const snapshot = await adminDb.collection('games')
            .where("userId", "==", userId)
            .get();

        const games = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: (doc.data().createdAt?.toDate ? doc.data().createdAt.toDate().toISOString() : doc.data().createdAt) || new Date().toISOString(),
        } as any));

        return games.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
        console.error("Error fetching user games:", error);
        return [];
    }
}


export async function fetchGamesAction() {
    return await getGamesAdmin();
}

export async function fetchTopRatedGamesAction() {
    return await getTopRatedGamesAdmin();
}

export async function fetchMostDownloadedGamesAction() {
    return await getMostDownloadedGamesAdmin();
}

export async function getGameByIdAction(gameId: string) {
    try {
        const { adminDb } = await import('@/lib/firebase-admin');
        const doc = await adminDb.collection('games').doc(gameId).get();
        if (!doc.exists) return null;

        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            createdAt: (data?.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data?.createdAt) || new Date().toISOString(),
            updatedAt: (data?.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data?.updatedAt)
        } as any;
    } catch (error) {
        console.error("Error fetching game by ID:", error);
        return null;
    }
}
