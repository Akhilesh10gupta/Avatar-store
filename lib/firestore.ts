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
    where
} from "firebase/firestore";

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
}

const GAMES_COLLECTION = "games";

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
