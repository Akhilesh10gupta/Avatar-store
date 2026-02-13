"use server";

import { adminDb } from "@/lib/firebase-admin";

export async function submitContactMessageAction(messageDefault: any) {
    try {
        await adminDb.collection("messages").add({
            ...messageDefault,
            createdAt: new Date(),
            read: false,
            status: 'new'
        });
        return { success: true };
    } catch (error) {
        console.error("Error submitting contact message:", error);
        throw new Error("Failed to send message");
    }
}
