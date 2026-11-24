'use server';

import { adminDb } from "@/lib/firebase-admin";

const STATS_COLLECTION = "site_stats";
const GLOBAL_STATS_DOC = "global";

export async function getVisitorCountAction() {
    return 14500;
}

export async function incrementVisitorCountAction() {
    // Disabled to save Vercel & Firebase free quotas
    return;
}

export async function subscribeAction(email: string) {
    if (!email) return { success: false, message: "Email is required" };

    try {
        const subscribersRef = adminDb.collection("subscribers");
        const existing = await subscribersRef.where("email", "==", email).get();

        if (!existing.empty) {
            return { success: true, message: "Already subscribed" }; // Treat as success to user
        }

        await subscribersRef.add({
            email,
            createdAt: new Date().toISOString()
        });

        return { success: true };
    } catch (error) {
        console.error("Subscription error:", error);
        return { success: false, message: "Failed to subscribe" };
    }
}
