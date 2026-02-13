'use server';

import { adminDb } from "@/lib/firebase-admin";

const STATS_COLLECTION = "site_stats";
const GLOBAL_STATS_DOC = "global";

export async function getVisitorCountAction() {
    try {
        const docRef = adminDb.collection(STATS_COLLECTION).doc(GLOBAL_STATS_DOC);
        const docSnap = await docRef.get();
        if (docSnap.exists) {
            return docSnap.data()?.visitorCount as number || 0;
        }
        return 0;
    } catch (error) {
        console.error("Error getting visitor count:", error);
        return 0;
    }
}

export async function incrementVisitorCountAction() {
    try {
        const { FieldValue } = await import('firebase-admin/firestore');
        const docRef = adminDb.collection(STATS_COLLECTION).doc(GLOBAL_STATS_DOC);

        await docRef.set({
            visitorCount: FieldValue.increment(1),
            updatedAt: new Date().toISOString()
        }, { merge: true });

    } catch (error) {
        console.error("Error incrementing visitor count:", error);
    }
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
