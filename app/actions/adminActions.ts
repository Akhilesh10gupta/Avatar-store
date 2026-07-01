"use server";

import { adminDb } from "@/lib/firebase-admin";

// Helper to sanitize data
const sanitize = (doc: any) => {
    const data = doc.data();
    return {
        id: doc.id,
        ...data,
        createdAt: (data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt) || new Date().toISOString(),
        updatedAt: (data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt),
        lastLogin: (data.lastLogin?.toDate ? data.lastLogin.toDate().toISOString() : data.lastLogin)
    };
};

export async function getAllGamesAdminAction() {
    try {
        const snapshot = await adminDb.collection("games").orderBy("createdAt", "desc").get();
        return snapshot.docs.map(doc => sanitize(doc));
    } catch (error) {
        console.error("Error fetching all games:", error);
        return [];
    }
}

export async function getSubscribersAction() {
    try {
        const snapshot = await adminDb.collection("subscribers").orderBy("createdAt", "desc").get();
        return snapshot.docs.map(doc => sanitize(doc));
    } catch (error) {
        console.error("Error fetching subscribers:", error);
        return [];
    }
}

export async function getContactMessagesAction() {
    try {
        const snapshot = await adminDb.collection("contact_messages").get(); // Remove orderBy to avoid index errors
        const messages = snapshot.docs.map(doc => sanitize(doc));

        // Sort in-memory: Newest first
        return messages.sort((a: any, b: any) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return dateB - dateA;
        });
    } catch (error) {
        console.error("Error fetching messages:", error);
        return [];
    }
}

export async function getAllUsersAction() {
    try {
        const snapshot = await adminDb.collection("users").get();
        const users = snapshot.docs.map(doc => sanitize(doc));

        // Sort in-memory: Recent login first
        return users.sort((a: any, b: any) => {
            const dateA = a.lastLogin ? new Date(a.lastLogin).getTime() : 0;
            const dateB = b.lastLogin ? new Date(b.lastLogin).getTime() : 0;
            return dateB - dateA;
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
}

// Blog Administration Server Actions
export async function getAllBlogPostsAdminAction() {
    try {
        const { getBlogPostsAdmin } = await import("@/lib/firestore-blog");
        const posts = await getBlogPostsAdmin();
        return posts.map(p => ({
            ...p,
            createdAt: p.createdAt || new Date().toISOString()
        }));
    } catch (error) {
        console.error("Error in getAllBlogPostsAdminAction:", error);
        return [];
    }
}

export async function updateBlogPostAdminAction(id: string, postData: any) {
    try {
        const { updateBlogPostAdmin } = await import("@/lib/firestore-blog");
        return await updateBlogPostAdmin(id, postData);
    } catch (error) {
        console.error(`Error in updateBlogPostAdminAction for ${id}:`, error);
        return { success: false, error: String(error) };
    }
}

export async function deleteBlogPostAdminAction(id: string) {
    try {
        const { deleteBlogPostAdmin } = await import("@/lib/firestore-blog");
        return await deleteBlogPostAdmin(id);
    } catch (error) {
        console.error(`Error in deleteBlogPostAdminAction for ${id}:`, error);
        return { success: false, error: String(error) };
    }
}
