import { cache } from "react";
import { adminDb } from "./firebase-admin";
import { Game } from "./firestore";
import fallbackGamesRaw from "@/data/games-backup.json";

const GAMES_COLLECTION = "games";

// Fallback games loaded from offline JSON backup
const fallbackGames: Game[] = (fallbackGamesRaw as unknown as Game[]);

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

// In-Memory Cache store
let cachedGames: Game[] | null = null;
let lastCacheTime = 0;
// Cache TTL: 2 hours (in ms). Keeps Firestore reads below 500/day even with 50K visits
const CACHE_TTL_MS = 2 * 60 * 60 * 1000;

/**
 * Core smart-cached games fetcher with automatic offline fallback:
 * 1. Checks server in-memory cache (instant response, 0 DB reads)
 * 2. Fetches from Firestore only when cache expires
 * 3. Automatically falls back to offline games-backup.json if quota is exhausted or DB is down
 */
export const getAllGamesCached = async (forceRefresh = false): Promise<Game[]> => {
    const now = Date.now();
    if (!forceRefresh && cachedGames && cachedGames.length > 0 && (now - lastCacheTime < CACHE_TTL_MS)) {
        return cachedGames;
    }

    try {
        const snapshot = await adminDb.collection(GAMES_COLLECTION)
            .orderBy("createdAt", "desc")
            .get();

        if (snapshot && !snapshot.empty) {
            const games = snapshot.docs.map(doc => ({
                id: doc.id,
                ...convertTimestamps(doc.data())
            } as Game));

            cachedGames = games;
            lastCacheTime = now;
            return games;
        }
    } catch (error) {
        console.warn("Firestore fetch failed, activating fallback / existing cache:", error);
    }

    // If fetch failed, return existing memory cache if available
    if (cachedGames && cachedGames.length > 0) {
        return cachedGames;
    }

    // Safety Net: Serve from offline backup JSON to guarantee 0 downtime
    cachedGames = fallbackGames;
    lastCacheTime = now;
    return fallbackGames;
};

// Fetch all games (served from smart cache / fallback)
export const getGamesAdmin = async (): Promise<Game[]> => {
    return await getAllGamesCached();
};

// Fetch top rated games (sorted in-memory, saves separate Firestore query)
export const getTopRatedGamesAdmin = async (): Promise<Game[]> => {
    const games = await getAllGamesCached();
    return [...games].sort((a, b) => {
        const ratingA = a.rating || 0;
        const ratingB = b.rating || 0;
        if (ratingB !== ratingA) return ratingB - ratingA;
        return (b.ratingCount || 0) - (a.ratingCount || 0);
    });
};

// Fetch most downloaded games (sorted in-memory, saves separate Firestore query)
export const getMostDownloadedGamesAdmin = async (): Promise<Game[]> => {
    const games = await getAllGamesCached();
    return [...games]
        .sort((a, b) => (b.downloadCount || 0) - (a.downloadCount || 0))
        .slice(0, 10);
};

// Fetch single game by ID (finds in memory first; falls back to single doc or JSON backup)
export const getGameByIdAdmin = cache(async (id: string): Promise<Game | null> => {
    if (!id) return null;

    // 1. Check in-memory cached list (Instant, 0 Firestore reads)
    const games = await getAllGamesCached();
    const found = games.find(g => g.id === id);
    if (found) return found;

    // 2. If not in cache (e.g. brand new game), query single doc
    try {
        const doc = await adminDb.collection(GAMES_COLLECTION).doc(id).get();
        if (doc.exists) {
            const game = {
                id: doc.id,
                ...convertTimestamps(doc.data())
            } as Game;
            if (cachedGames) {
                cachedGames.push(game);
            }
            return game;
        }
    } catch (error) {
        console.warn(`Firestore getGameByIdAdmin(${id}) failed, checking fallback:`, error);
    }

    // 3. Fallback: Search in local JSON backup
    const backupGame = fallbackGames.find(g => g.id === id);
    return backupGame || null;
});

// Cache management helpers
export const clearGamesCache = () => {
    cachedGames = null;
    lastCacheTime = 0;
};

export const updateCachedGameDownload = (gameId: string) => {
    if (cachedGames) {
        const game = cachedGames.find(g => g.id === gameId);
        if (game) {
            game.downloadCount = (game.downloadCount || 0) + 1;
        }
    }
};
