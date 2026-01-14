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
    limit
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
    downloadLink: string; // Google Drive link
    icon: string; // URL for the game icon
    systemRequirements: {
        os: string;
        processor: string;
        memory: string;
        graphics: string;
        storage: string;
    };
    featured?: boolean;
    createdAt?: any;
}

const GAMES_COLLECTION = "games";

export const getGames = async () => {
    const q = query(collection(db, GAMES_COLLECTION), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Game));
};

export const getFeaturedGames = async () => {
    // Simplified for now, real implementation would filter by featured
    const q = query(collection(db, GAMES_COLLECTION), orderBy("createdAt", "desc"), limit(5));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Game));
};


export const getGameById = async (id: string) => {
    const docRef = doc(db, GAMES_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Game;
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
