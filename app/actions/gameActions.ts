"use server";

import { getGamesAdmin, getTopRatedGamesAdmin, getMostDownloadedGamesAdmin } from "@/lib/firestore-admin";

export async function fetchGamesAction() {
    return await getGamesAdmin();
}

export async function fetchTopRatedGamesAction() {
    return await getTopRatedGamesAdmin();
}

export async function fetchMostDownloadedGamesAction() {
    return await getMostDownloadedGamesAdmin();
}
