"use server";

import { adminDb } from "@/lib/firebase-admin";

export async function syncUserAction(user: { uid: string, email: string | null, displayName: string | null, photoURL: string | null }) {
    if (!user.uid) return;

    try {
        const userRef = adminDb.collection("users").doc(user.uid);
        const doc = await userRef.get();

        if (!doc.exists) {
            await userRef.set({
                uid: user.uid,
                email: user.email,
                userName: user.displayName || 'Anonymous',
                userAvatar: user.photoURL || '',
                createdAt: new Date(),
                role: 'user', // Default role
                xp: 0,
                level: 1,
                downloads: 0
            });
        }
    } catch (error) {
        console.error("Error syncing user:", error);
    }
}

export async function syncUserProfileAction(uid: string, data: { userName?: string, userAvatar?: string }) {
    try {
        await adminDb.collection("users").doc(uid).update({
            ...data,
            updatedAt: new Date()
        });

        // Optional: Update user details in recent posts/comments if needed? 
        // This is expensive in NoSQL (denormalized data). 
        // For now, let's just update the user profile. The client might see old names in old posts unless we do a massive update.
        // Given constraints, we'll leave deep updating for now unless requested.
    } catch (error) {
        console.error("Error syncing user profile:", error);
        throw new Error("Failed to update profile");
    }
}

export async function incrementUserDownloadAction(uid: string) {
    try {
        const { FieldValue } = await import('firebase-admin/firestore');
        await adminDb.collection("users").doc(uid).update({
            downloads: FieldValue.increment(1)
        });
    } catch (error) {
        console.error("Error incrementing user download:", error);
    }
}

export async function addUserXPAction(uid: string, amount: number) {
    try {
        const userRef = adminDb.collection("users").doc(uid);
        await adminDb.runTransaction(async (t) => {
            const doc = await t.get(userRef);
            if (!doc.exists) return;

            const currentXP = doc.data()?.xp || 0;
            const newXP = currentXP + amount;

            // Simple level up logic: Level = 1 + floor(XP / 1000)
            const newLevel = 1 + Math.floor(newXP / 1000);

            t.update(userRef, {
                xp: newXP,
                level: newLevel
            });
        });
    } catch (error) {
        console.error("Error adding user XP:", error);
    }
}


