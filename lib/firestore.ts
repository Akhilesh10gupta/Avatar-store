import { db } from "./firebase";
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
    getDoc,
    limit,
    where,
    increment,
    runTransaction
} from "firebase/firestore";

// ... (Interfaces omitted, assuming they match file) ...

// ... (Other functions omitted) ...

const RATINGS_COLLECTION = "ratings";

export const getUserRating = async (gameId: string, userId: string) => {
    try {
        console.log(`Checking rating for game: ${gameId}, user: ${userId}`);
        const ratingDocRef = doc(db, RATINGS_COLLECTION, `${gameId}_${userId}`);
        const ratingSnap = await getDoc(ratingDocRef);
        if (ratingSnap.exists()) {
            const val = ratingSnap.data().rating as number;
            console.log(`Found existing rating: ${val}`);
            return val;
        }
        console.log("No existing rating found.");
        return null;
    } catch (e) {
        console.error("Error fetching user rating:", e);
        return null;
    }
};

export const submitRating = async (gameId: string, userId: string, rating: number) => {
    try {
        console.log(`Submitting rating for game: ${gameId}, user: ${userId}, value: ${rating}`);
        const ratingDocId = `${gameId}_${userId}`;
        const ratingDocRef = doc(db, RATINGS_COLLECTION, ratingDocId);

        // Check if already rated (Double check)
        const ratingSnap = await getDoc(ratingDocRef);
        if (ratingSnap.exists()) {
            console.warn("User already rated (checked in submitRating)");
            throw new Error("User has already rated this game.");
        }

        const gameRef = doc(db, GAMES_COLLECTION, gameId);

        await runTransaction(db, async (transaction) => {
            const gameDoc = await transaction.get(gameRef);
            if (!gameDoc.exists()) {
                throw new Error("Game does not exist!");
            }

            const data = gameDoc.data();
            const currentRating = data.rating || 0;
            const currentCount = data.ratingCount || 0;

            const newCount = currentCount + 1;
            const newAverage = ((currentRating * currentCount) + rating) / newCount;

            // Create rating doc
            transaction.set(ratingDocRef, {
                gameId,
                userId,
                rating,
                createdAt: new Date().toISOString()
            });

            // Update game doc
            transaction.update(gameRef, {
                rating: newAverage,
                ratingCount: newCount
            });
        });
        console.log("Rating transaction completed successfully.");

    } catch (e) {
        console.error("Error rating game:", e);
        throw e;
    }
};

// Define the interface for a Game
export interface Game {
    id?: string;
    title: string;
    description: string;
    coverImage: string; // URL from Storage or external
    screenshots: string[];
    genre: string;
    releaseDate: string;
    developer: string;

    // Platform Support
    platform: 'PC' | 'Android' | 'Both';
    downloadLinkPC?: string;      // For PC/Both
    downloadLinkAndroid?: string; // For Android/Both

    downloadLink?: string; // @deprecated - keeping for backward compatibility

    icon: string; // URL for the game icon
    systemRequirements: {
        os: string;
        processor: string;
        memory: string;
        graphics: string;
        storage: string;
    };
    systemRequirementsAndroid?: {
        os: string;
        processor: string;
        memory: string;
        storage: string;
    };
    gameplayVideo?: string; // URL for gameplay video
    featured?: boolean;
    createdAt?: string;
    userId?: string; // Owner of the game

    // Stats
    downloadCount?: number;
    rating?: number; // Average rating (0-5)
    ratingCount?: number; // Number of ratings
}

export interface Review {
    id?: string;
    gameId: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    content: string;
    createdAt: string;
}

const GAMES_COLLECTION = "games";
const REVIEWS_COLLECTION = "reviews";

const docToGame = (doc: any): Game => {
    const data = doc.data();
    return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
    } as Game;
};

// Fetch all games (public view)
export const getGames = async () => {
    const q = query(collection(db, GAMES_COLLECTION), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(docToGame);
};

// Fetch only games belonging to a specific user (admin view)
export const getUserGames = async (userId: string) => {
    const q = query(
        collection(db, GAMES_COLLECTION),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(docToGame);
};

export const getFeaturedGames = async () => {
    // Simplified for now, real implementation would filter by featured
    const q = query(collection(db, GAMES_COLLECTION), orderBy("createdAt", "desc"), limit(5));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(docToGame);
};


export const getGameById = async (id: string) => {
    const docRef = doc(db, GAMES_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docToGame(docSnap);
    } else {
        return null;
    }
};

export const addGame = async (game: Omit<Game, "id">) => {
    try {
        const docRef = await addDoc(collection(db, GAMES_COLLECTION), {
            ...game,
            createdAt: new Date(),
        });
        return docRef.id;
    } catch (e) {
        console.error("Error adding document: ", e);
        throw e;
    }
};

export const updateGame = async (id: string, game: Partial<Game>) => {
    const gameRef = doc(db, GAMES_COLLECTION, id);
    await updateDoc(gameRef, game);
};

export const deleteGame = async (id: string) => {
    await deleteDoc(doc(db, GAMES_COLLECTION, id));
};

// Batch update to assign all games without a userId to the current user
export const claimOrphanedGames = async (userId: string) => {
    // Fetch all games (we can't easily filter by "missing field" in basic queries without composite indexes perfectly, 
    // but we can fetch all and filter client side for this one-time migration, or use a specific query if possible)
    // Firestore doesn't support 'where("userId", "==", undefined)' directly in all SDK versions efficiently without setup.
    // Simplest approach for migration: Get all games, check if userId is missing, update.

    const q = query(collection(db, GAMES_COLLECTION));
    const querySnapshot = await getDocs(q);

    const batchPromises = querySnapshot.docs.map(async (docSnap) => {
        const data = docSnap.data();
        if (!data.userId) {
            await updateDoc(doc(db, GAMES_COLLECTION, docSnap.id), {
                userId: userId
            });
            return 1; // Count updated
        }
        return 0;
    });

    const results = await Promise.all(batchPromises);
    return results.reduce((a: number, b: number) => a + b, 0); // Return count of updated games
};

export const incrementDownload = async (gameId: string) => {
    const gameRef = doc(db, GAMES_COLLECTION, gameId);
    await updateDoc(gameRef, {
        downloadCount: increment(1)
    });
};



export const addReview = async (review: Omit<Review, "id">) => {
    try {
        const docRef = await addDoc(collection(db, REVIEWS_COLLECTION), {
            ...review,
            createdAt: new Date().toISOString()
        });
        return docRef.id;
    } catch (e) {
        console.error("Error adding review: ", e);
        throw e;
    }
};

export const getGameReviews = async (gameId: string) => {
    try {
        // Query without orderBy to avoid needing a composite index
        const q = query(
            collection(db, REVIEWS_COLLECTION),
            where("gameId", "==", gameId)
        );
        const querySnapshot = await getDocs(q);
        const reviews = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));

        // Sort client-side
        return reviews.sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    } catch (e) {
        console.error("Error fetching reviews:", e);
        return [];
    }
};
