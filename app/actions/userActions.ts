'use server';

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
        const result = await adminDb.runTransaction(async (t) => {
            const doc = await t.get(userRef);
            if (!doc.exists) return null;

            const currentXP = doc.data()?.xp || 0;
            const currentLevel = doc.data()?.level || 1;
            const newXP = currentXP + amount;

            // Simple level up logic: Level = 1 + floor(XP / 1000)
            const newLevel = 1 + Math.floor(newXP / 1000);

            t.update(userRef, {
                xp: newXP,
                level: newLevel
            });

            return {
                amount,
                newLevel: newLevel > currentLevel ? newLevel : undefined,
                newTitle: newLevel > currentLevel ? "Level Up" : undefined // We could fetch title from gamification shared lib if needed, but this is simple
            };
        });
        return result;
    } catch (error) {
        console.error("Error adding user XP:", error);
        return null;
    }
}

export async function getUserExtendedProfileAction(uid: string) {
    try {
        const userRef = adminDb.collection("users").doc(uid);
        const userDoc = await userRef.get();
        if (!userDoc.exists) return null;

        const userData = userDoc.data();

        // 1. Fetch ALL raw docs for user (no orderBy) to bypass index requirements
        // We assume a user doesn't have thousands of posts/reviews yet.
        const [reviewsSnap, postsSnap, commentsSnap] = await Promise.all([
            adminDb.collection("reviews").where("userId", "==", uid).get(),
            adminDb.collection("posts").where("userId", "==", uid).get(),
            adminDb.collection("comments").where("userId", "==", uid).get()
        ]);

        const getDate = (d: any) => d?.toDate ? d.toDate() : (d ? new Date(d) : new Date(0));

        // 2. Map & Sort In-Memory
        const reviews = reviewsSnap.docs
            .map(doc => ({ id: doc.id, ...doc.data(), createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate().toISOString() : doc.data().createdAt }))
            .sort((a, b) => getDate(b.createdAt).getTime() - getDate(a.createdAt).getTime());

        const posts = postsSnap.docs
            .map(doc => ({ id: doc.id, ...doc.data(), createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate().toISOString() : doc.data().createdAt }))
            .sort((a, b) => getDate(b.createdAt).getTime() - getDate(a.createdAt).getTime());

        // 3. Calculate Stats
        const reviewsCount = reviewsSnap.size;

        let totalLikes = 0;
        postsSnap.forEach(doc => {
            const likes = doc.data().likes;
            if (Array.isArray(likes)) totalLikes += likes.length;
        });

        // 4. Recent Data for Feed (Top 10)
        const recentReviews = reviews.slice(0, 10);
        const recentPosts = posts.slice(0, 10);

        // 5. Recent Comments on User's Posts (Complex Logic)
        // We need comments where postId is in user's posts.
        let recentCommentsOnPosts: any[] = [];

        // Only check comments for the user's latest 20 posts to avoid limits
        const targetPostIds = posts.slice(0, 20).map(p => p.id);

        if (targetPostIds.length > 0) {
            try {
                // If we exceed 10 items in 'in' clause, we must batch or just take top 10.
                // Firestore 'in' limit is 10.
                const limitedPostIds = targetPostIds.slice(0, 10);

                const commentsOnPostsSnap = await adminDb.collection("comments")
                    .where("postId", "in", limitedPostIds)
                    .get(); // No orderBy to avoid index

                recentCommentsOnPosts = commentsOnPostsSnap.docs
                    .map(doc => ({ id: doc.id, ...doc.data(), createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate().toISOString() : doc.data().createdAt }))
                    .filter((c: any) => c.userId !== uid) // Filter out self-comments
                    .sort((a, b) => getDate(b.createdAt).getTime() - getDate(a.createdAt).getTime())
                    .slice(0, 5);
            } catch (err) {
                console.warn("Failed to fetch recent comments on posts (likely index or limit issue):", err);
            }
        }

        return {
            ...userData,
            createdAt: userData?.createdAt?.toDate ? userData.createdAt.toDate().toISOString() : userData?.createdAt,
            lastLogin: userData?.lastLogin?.toDate ? userData.lastLogin.toDate().toISOString() : userData?.lastLogin,
            reviewsCount,
            totalLikes,
            recentPosts,
            recentReviews,
            recentCommentsOnPosts
        };

    } catch (error) {
        console.error("Error fetching extended profile:", error);
        return null;
    }
}
