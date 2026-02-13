"use server";

import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { Post, Comment } from "@/lib/firestore"; // Import types

// Helper to sanitize data for client (convert timestamps)
const sanitizeDoc = (doc: any) => {
    const data = doc.data();
    return {
        id: doc.id,
        ...data,
        createdAt: (data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt) || new Date().toISOString(),
        updatedAt: (data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt)
    };
};

// --- Posts ---

export async function getPostsAction(page: number = 1, limit: number = 10) {
    try {
        const snapshot = await adminDb.collection("posts").get();
        const posts = snapshot.docs.map(doc => sanitizeDoc(doc) as Post);

        // Sort in-memory: Newest first
        posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        // Pagination (slice)
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        return posts.slice(startIndex, endIndex);
    } catch (error) {
        console.error("Error fetching posts:", error);
        return [];
    }
}

export async function addPostAction(post: any) {
    try {
        const docRef = await adminDb.collection("posts").add({
            ...post,
            likes: [],
            commentCount: 0,
            createdAt: new Date()
        });
        return docRef.id;
    } catch (error) {
        console.error("Error adding post:", error);
        throw new Error("Failed to add post");
    }
}

export async function deletePostAction(postId: string) {
    try {
        await adminDb.collection("posts").doc(postId).delete();
    } catch (error) {
        console.error("Error deleting post:", error);
        throw new Error("Failed to delete post");
    }
}

export async function updatePostAction(postId: string, content: string) {
    try {
        await adminDb.collection("posts").doc(postId).update({
            content,
            updatedAt: new Date()
        });
    } catch (error) {
        console.error("Error updating post:", error);
        throw new Error("Failed to update post");
    }
}

export async function toggleLikePostAction(postId: string, userId: string) {
    const postRef = adminDb.collection("posts").doc(postId);
    await adminDb.runTransaction(async (t) => {
        const doc = await t.get(postRef);
        if (!doc.exists) throw new Error("Post does not exist");

        const likes = doc.data()?.likes || [];
        const newLikes = likes.includes(userId)
            ? likes.filter((id: string) => id !== userId)
            : [...likes, userId];

        t.update(postRef, { likes: newLikes });
    });
}

// --- Comments ---

export async function getPostCommentsAction(postId: string, lastDocId?: string) {
    try {
        // Fetch ALL comments for this post (avoid compound index issues)
        const snapshot = await adminDb.collection("comments")
            .where("postId", "==", postId)
            .get();

        const allComments = snapshot.docs.map(doc => sanitizeDoc(doc) as Comment);

        // Sort in-memory: Newest first
        allComments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        // Simple Pagination Simulation (in-memory)
        // If we really need pagination, we'd slice the array based on lastDocId
        // For now, let's just return the top 50 recent comments to be safe and fast
        const comments = allComments.slice(0, 50);

        return {
            comments,
            lastDocId: comments.length > 0 ? comments[comments.length - 1].id : null
        };
    } catch (error) {
        console.error("Error fetching comments:", error);
        return { comments: [], lastDocId: null };
    }
}

export async function addCommentAction(comment: any) {
    try {
        const newCommentId = await adminDb.runTransaction(async (t) => {
            const commentRef = adminDb.collection("comments").doc();
            const postRef = adminDb.collection("posts").doc(comment.postId);

            const postDoc = await t.get(postRef);
            if (!postDoc.exists) throw new Error("Post not found");

            t.set(commentRef, {
                ...comment,
                likes: [],
                createdAt: new Date()
            });

            t.update(postRef, {
                commentCount: FieldValue.increment(1)
            });

            return commentRef.id;
        });

        return newCommentId;
    } catch (error) {
        console.error("Error adding comment:", error);
        throw new Error("Failed to add comment");
    }
}

export async function deleteCommentAction(commentId: string, postId: string) {
    try {
        await adminDb.runTransaction(async (t) => {
            const commentRef = adminDb.collection("comments").doc(commentId);
            const postRef = adminDb.collection("posts").doc(postId);

            t.delete(commentRef);
            t.update(postRef, {
                commentCount: FieldValue.increment(-1)
            });
        });
    } catch (error) {
        console.error("Error deleting comment:", error);
        throw new Error("Failed to delete comment");
    }
}

export async function updateCommentAction(commentId: string, content: string) {
    try {
        await adminDb.collection("comments").doc(commentId).update({
            content,
            updatedAt: new Date()
        });
    } catch (error) {
        console.error("Error updating comment:", error);
        throw new Error("Failed to update comment");
    }
}

export async function toggleLikeCommentAction(commentId: string, userId: string) {
    const commentRef = adminDb.collection("comments").doc(commentId);
    await adminDb.runTransaction(async (t) => {
        const doc = await t.get(commentRef);
        if (!doc.exists) throw new Error("Comment does not exist");

        const likes = doc.data()?.likes || [];
        const newLikes = likes.includes(userId)
            ? likes.filter((id: string) => id !== userId)
            : [...likes, userId];

        t.update(commentRef, { likes: newLikes });
    });
}

export async function getUserPostsAction(userId: string) {
    try {
        const snapshot = await adminDb.collection("posts")
            .where("userId", "==", userId)
            .get();

        const posts = snapshot.docs.map(doc => sanitizeDoc(doc) as Post);
        return posts.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
        console.error("Error fetching user posts:", error);
        return [];
    }
}


