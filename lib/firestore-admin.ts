import { adminDb } from "./firebase-admin";
import { Game } from "./firestore";

const GAMES_COLLECTION = "games";

// Helper to convert Firestore timestamp to ISO string
const convertTimestamps = (data: any) => {
    if (!data) return data;
    const result = { ...data };
    if (result.createdAt && result.createdAt.toDate) {
        result.createdAt = result.createdAt.toDate().toISOString();
    }
    if (result.updatedAt && result.updatedAt.toDate) {
        result.updatedAt = result.updatedAt.toDate().toISOString();
    }
    return result;
};

// Fetch all games (admin/server-side view bypassing rules)
export const getGamesAdmin = async () => {
    try {
        const snapshot = await adminDb.collection(GAMES_COLLECTION)
            .orderBy("createdAt", "desc")
            .limit(20)
            .get();

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...convertTimestamps(doc.data())
        } as Game));
    } catch (error) {
        console.error("Error fetching games (admin):", error);
        return [];
    }
};

export const getTopRatedGamesAdmin = async () => {
    try {
        const snapshot = await adminDb.collection(GAMES_COLLECTION)
            .orderBy("rating", "desc")
            .limit(20)
            .get();

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...convertTimestamps(doc.data())
        } as Game));
    } catch (error) {
        console.error("Error fetching top rated games (admin):", error);
        return [];
    }
};

export const getMostDownloadedGamesAdmin = async () => {
    try {
        const snapshot = await adminDb.collection(GAMES_COLLECTION)
            .orderBy("downloadCount", "desc")
            .limit(10)
            .get();

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...convertTimestamps(doc.data())
        } as Game));
    } catch (error) {
        console.error("Error fetching most downloaded games (admin):", error);
        return [];
    }
};
