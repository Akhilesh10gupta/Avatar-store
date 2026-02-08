import { db } from "./firebase";
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
    getDoc,
    limit,
    where,
    increment,
    runTransaction,
    writeBatch,
    startAfter,
    arrayUnion,
    arrayRemove,
    setDoc,
    onSnapshot,
    getCountFromServer
} from "firebase/firestore";

// ... (Interfaces omitted, assuming they match file) ...

// ... (Other functions omitted) ...

const RATINGS_COLLECTION = "ratings";

export const getUserRating = async (gameId: string, userId: string) => {
    try {
        console.log(`Checking rating for game: ${gameId}, user: ${userId}`);
        const ratingDocRef = doc(db, RATINGS_COLLECTION, `${gameId}_${userId}`);
        const ratingSnap = await getDoc(ratingDocRef);
        if (ratingSnap.exists()) {
            const val = ratingSnap.data().rating as number;
            console.log(`Found existing rating: ${val}`);
            return val;
        }
        console.log("No existing rating found.");
        return null;
    } catch (e) {
        console.error("Error fetching user rating:", e);
        return null;
    }
};

export const submitRating = async (gameId: string, userId: string, rating: number) => {
    try {
        console.log(`Submitting rating for game: ${gameId}, user: ${userId}, value: ${rating}`);
        const ratingDocId = `${gameId}_${userId}`;
        const ratingDocRef = doc(db, RATINGS_COLLECTION, ratingDocId);

        // Check if already rated (Double check)
        const ratingSnap = await getDoc(ratingDocRef);
        if (ratingSnap.exists()) {
            console.warn("User already rated (checked in submitRating)");
            throw new Error("User has already rated this game.");
        }

        const gameRef = doc(db, GAMES_COLLECTION, gameId);

        await runTransaction(db, async (transaction) => {
            const gameDoc = await transaction.get(gameRef);
            if (!gameDoc.exists()) {
                throw new Error("Game does not exist!");
            }

            const data = gameDoc.data();
            const currentRating = data.rating || 0;
            const currentCount = data.ratingCount || 0;

            const newCount = currentCount + 1;
            const newAverage = ((currentRating * currentCount) + rating) / newCount;

            // Create rating doc
            transaction.set(ratingDocRef, {
                gameId,
                userId,
                rating,
                createdAt: new Date().toISOString()
            });

            // Update game doc
            transaction.update(gameRef, {
                rating: newAverage,
                ratingCount: newCount
            });
        });
        console.log("Rating transaction completed successfully.");

    } catch (e) {
        console.error("Error rating game:", e);
        throw e;
    }
};

// Define the interface for a Game
export interface Game {
    id?: string;
    title: string;
    description: string;
    coverImage: string; // URL from Storage or external
    cardImage?: string; // Optional dedicated card image (3:4 aspect ratio)
    screenshots: string[];
    genre: string;
    releaseDate: string;
    developer: string;
    price?: string;

    // Platform Support
    platform: 'PC' | 'Android' | 'Both';
    downloadLinkPC?: string;      // For PC/Both
    downloadLinkAndroid?: string; // For Android/Both

    downloadLink?: string; // @deprecated - keeping for backward compatibility

    icon: string; // URL for the game icon
    systemRequirements: {
        os: string;
        processor: string;
        memory: string;
        graphics: string;
        storage: string;
    };
    systemRequirementsAndroid?: {
        os: string;
        processor: string;
        memory: string;
        storage: string;
    };
    gameplayVideo?: string; // URL for gameplay video
    featured?: boolean;
    createdAt?: string;
    userId?: string; // Owner of the game
    updatedAt?: string;

    // Stats
    downloadCount?: number;
    rating?: number; // Average rating (0-5)
    ratingCount?: number; // Number of ratings
}

export interface Review {
    id?: string;
    gameId: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    content: string;
    createdAt: string;
    updatedAt?: string;
}

const GAMES_COLLECTION = "games";
const REVIEWS_COLLECTION = "reviews";

const docToGame = (doc: any): Game => {
    const data = doc.data();
    return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
    } as Game;
};

// Fetch all games (public view)
export const getGames = async () => {
    const q = query(collection(db, GAMES_COLLECTION), orderBy("createdAt", "desc"), limit(20));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(docToGame);
};

// Fetch only games belonging to a specific user (admin view)
export const getUserGames = async (userId: string) => {
    const q = query(
        collection(db, GAMES_COLLECTION),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(docToGame);
};

export const getTopRatedGames = async () => {
    const q = query(collection(db, GAMES_COLLECTION), orderBy("rating", "desc"), limit(20));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(docToGame);
};

export const getMostDownloadedGames = async () => {
    const q = query(collection(db, GAMES_COLLECTION), orderBy("downloadCount", "desc"), limit(10));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(docToGame);
};

export const getFeaturedGames = async () => {
    // Simplified for now, real implementation would filter by featured
    const q = query(collection(db, GAMES_COLLECTION), orderBy("createdAt", "desc"), limit(5));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(docToGame);
};


export const getGameById = async (id: string) => {
    const docRef = doc(db, GAMES_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docToGame(docSnap);
    } else {
        return null;
    }
};

export const addGame = async (game: Omit<Game, "id">) => {
    try {
        const docRef = await addDoc(collection(db, GAMES_COLLECTION), {
            ...game,
            createdAt: new Date(),
        });
        return docRef.id;
    } catch (e) {
        console.error("Error adding document: ", e);
        throw e;
    }
};

export const updateGame = async (id: string, game: Partial<Game>) => {
    const gameRef = doc(db, GAMES_COLLECTION, id);
    await updateDoc(gameRef, {
        ...game,
        updatedAt: new Date().toISOString()
    });
};

export const deleteGame = async (id: string) => {
    await deleteDoc(doc(db, GAMES_COLLECTION, id));
};

// Batch update to assign all games without a userId to the current user
export const claimOrphanedGames = async (userId: string) => {
    // Fetch all games (we can't easily filter by "missing field" in basic queries without composite indexes perfectly, 
    // but we can fetch all and filter client side for this one-time migration, or use a specific query if possible)
    // Firestore doesn't support 'where("userId", "==", undefined)' directly in all SDK versions efficiently without setup.
    // Simplest approach for migration: Get all games, check if userId is missing, update.

    const q = query(collection(db, GAMES_COLLECTION));
    const querySnapshot = await getDocs(q);

    const batchPromises = querySnapshot.docs.map(async (docSnap) => {
        const data = docSnap.data();
        if (!data.userId) {
            await updateDoc(doc(db, GAMES_COLLECTION, docSnap.id), {
                userId: userId
            });
            return 1; // Count updated
        }
        return 0;
    });

    const results = await Promise.all(batchPromises);
    return results.reduce((a: number, b: number) => a + b, 0); // Return count of updated games
};

export const incrementDownload = async (gameId: string) => {
    const gameRef = doc(db, GAMES_COLLECTION, gameId);
    await updateDoc(gameRef, {
        downloadCount: increment(1)
    });
};



export const addReview = async (review: Omit<Review, "id">) => {
    try {
        const docRef = await addDoc(collection(db, REVIEWS_COLLECTION), {
            ...review,
            createdAt: new Date().toISOString()
        });
        return docRef.id;
    } catch (e) {
        console.error("Error adding review: ", e);
        throw e;
    }
};

export const updateReview = async (reviewId: string, content: string) => {
    try {
        const reviewRef = doc(db, REVIEWS_COLLECTION, reviewId);
        await updateDoc(reviewRef, {
            content,
            updatedAt: new Date().toISOString()
        });
    } catch (e) {
        console.error("Error updating review:", e);
        throw e;
    }
};

export const getGameReviews = async (gameId: string) => {
    try {
        // Query without orderBy to avoid needing a composite index
        const q = query(
            collection(db, REVIEWS_COLLECTION),
            where("gameId", "==", gameId)
        );
        const querySnapshot = await getDocs(q);
        const reviews = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));

        // Sort client-side
        return reviews.sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    } catch (e) {
        console.error("Error fetching reviews:", e);
        return [];
    }
};

// --- Community Features ---

export interface Post {
    id?: string;
    userId: string;
    userName: string;
    userAvatar?: string | null;
    content: string;
    imageUrl?: string;
    imageUrls?: string[]; // Multiple images support
    likes: string[]; // User IDs who liked
    commentCount?: number;
    createdAt: string;
    updatedAt?: string;
}

export interface Comment {
    id?: string;
    postId: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    content: string;
    createdAt: string;
    likes: string[]; // User IDs who liked
    parentId?: string; // ID of parent comment if this is a reply
    updatedAt?: string;
}

const POSTS_COLLECTION = "posts";
const COMMENTS_COLLECTION = "comments";

export const addPost = async (post: Omit<Post, "id" | "likes" | "commentCount">) => {
    try {
        const docRef = await addDoc(collection(db, POSTS_COLLECTION), {
            ...post,
            likes: [],
            commentCount: 0,
            createdAt: new Date().toISOString()
        });
        return docRef.id;
    } catch (e) {
        console.error("Error adding post:", e);
        throw e;
    }
};

export const getPosts = async () => {
    try {
        const q = query(collection(db, POSTS_COLLECTION), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
    } catch (e) {
        console.error("Error fetching posts:", e);
        return [];
    }
};



export const addComment = async (comment: Omit<Comment, "id">) => {
    try {
        await runTransaction(db, async (transaction) => {
            // Create reference for new comment
            const commentRef = doc(collection(db, COMMENTS_COLLECTION));

            // Get post reference
            const postRef = doc(db, POSTS_COLLECTION, comment.postId);
            const postDoc = await transaction.get(postRef);

            if (!postDoc.exists()) {
                throw new Error("Post does not exist!");
            }

            // Set comment data
            transaction.set(commentRef, {
                ...comment,
                likes: [],
                createdAt: new Date().toISOString()
            });

            // Update post comment count
            transaction.update(postRef, {
                commentCount: increment(1)
            });
        });
    } catch (e) {
        console.error("Error adding comment:", e);
        throw e;
    }
};

export const getPostComments = async (postId: string, lastDoc: any = null) => {
    try {
        let q = query(
            collection(db, COMMENTS_COLLECTION),
            where("postId", "==", postId),
            orderBy("createdAt", "desc"),
            limit(20)
        );

        if (lastDoc) {
            q = query(q, startAfter(lastDoc));
        }

        const querySnapshot = await getDocs(q);
        const comments: Comment[] = [];
        querySnapshot.forEach((doc) => {
            comments.push({ id: doc.id, ...doc.data() } as Comment);
        });

        // Return object with comments and lastDoc
        return {
            comments,
            lastDoc: querySnapshot.docs.length > 0 ? querySnapshot.docs[querySnapshot.docs.length - 1] : null
        };
    } catch (error) {
        console.error("Error getting comments: ", error);
        return { comments: [], lastDoc: null };
    }
};

export const getRecentCommentsOnUserPosts = async (userId: string, limitCount: number = 10) => {
    try {
        // 1. Get user's recent posts
        const posts = await getUserPosts(userId, 10);
        if (posts.length === 0) return [];

        // 2. Fetch recent comments for these posts
        // We have to query individually or use 'in' if posts < 10 (firebase limit is 10 for 'in' usually 30)
        // Best approach for now: Promise.all of getPostComments, but optimized.

        const commentsPromises = posts.map(async (post) => {
            if (!post.id) return [];
            // We only want comments NOT by the author (notifications)
            const q = query(
                collection(db, COMMENTS_COLLECTION),
                where("postId", "==", post.id),
                where("userId", "!=", userId), // Check index support for this
                orderBy("userId"), // Firestore requires orderBy on inequity filter field
                orderBy("createdAt", "desc"),
                limit(5)
            );

            // If the complex query fails due to index, fallback to creating it or simple query
            try {
                const snapshot = await getDocs(q);
                return snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    postTitle: post.content.substring(0, 30) // Pass context
                }));
            } catch (e) {
                // Fallback: fetch all and filter
                const simpleQ = query(
                    collection(db, COMMENTS_COLLECTION),
                    where("postId", "==", post.id),
                    orderBy("createdAt", "desc"),
                    limit(10)
                );
                const snap = await getDocs(simpleQ);
                return snap.docs
                    .map(doc => ({ id: doc.id, ...doc.data(), postTitle: post.content.substring(0, 30) }))
                    .filter((c: any) => c.userId !== userId);
            }
        });

        const commentsArrays = await Promise.all(commentsPromises);
        const allComments = commentsArrays.flat();

        // 3. Sort by createdAt desc
        return allComments.sort((a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ).slice(0, limitCount);

    } catch (e) {
        console.error("Error fetching comments on user posts:", e);
        return [];
    }
};

export const toggleLikeComment = async (commentId: string, userId: string) => {
    const commentRef = doc(db, COMMENTS_COLLECTION, commentId);
    await runTransaction(db, async (transaction) => {
        const commentDoc = await transaction.get(commentRef);
        if (!commentDoc.exists()) throw new Error("Comment does not exist");

        const likes = commentDoc.data().likes || [];
        const newLikes = likes.includes(userId)
            ? likes.filter((id: string) => id !== userId) // Unlike
            : [...likes, userId]; // Like

        transaction.update(commentRef, { likes: newLikes });
    });
};

export const deleteComment = async (commentId: string, postId: string) => {
    try {
        await runTransaction(db, async (transaction) => {
            const commentRef = doc(db, COMMENTS_COLLECTION, commentId);
            const postRef = doc(db, POSTS_COLLECTION, postId);

            // Read post logic first
            const postDoc = await transaction.get(postRef);

            // Delete comment
            transaction.delete(commentRef);

            // Update post count if post exists
            if (postDoc.exists()) {
                transaction.update(postRef, {
                    commentCount: increment(-1)
                });
            }
        });
    } catch (e) {
        console.error("Error deleting comment:", e);
        throw e;
    }
};

export const updateComment = async (commentId: string, content: string) => {
    try {
        const commentRef = doc(db, COMMENTS_COLLECTION, commentId);
        await updateDoc(commentRef, {
            content,
            updatedAt: new Date().toISOString()
        });
    } catch (e) {
        console.error("Error updating comment:", e);
        throw e;
    }
};

export const toggleLikePost = async (postId: string, userId: string) => {
    const postRef = doc(db, POSTS_COLLECTION, postId);
    await runTransaction(db, async (transaction) => {
        const postDoc = await transaction.get(postRef);
        if (!postDoc.exists()) throw new Error("Post does not exist");

        const likes = postDoc.data().likes || [];
        const newLikes = likes.includes(userId)
            ? likes.filter((id: string) => id !== userId) // Unlike
            : [...likes, userId]; // Like

        transaction.update(postRef, { likes: newLikes });
    });
};

export const deletePost = async (postId: string) => {
    try {
        await deleteDoc(doc(db, POSTS_COLLECTION, postId));
    } catch (e) {
        console.error("Error deleting post:", e);
        throw e;
    }
};

export const updatePost = async (postId: string, content: string) => {
    try {
        const postRef = doc(db, POSTS_COLLECTION, postId);
        await updateDoc(postRef, {
            content,
            updatedAt: new Date().toISOString()
        });
    } catch (e) {
        console.error("Error updating post:", e);
        throw e;
    }
};

export const syncUserProfile = async (userId: string, updates: { userName?: string, userAvatar?: string }) => {
    try {
        const batch = writeBatch(db);
        let operationCount = 0;

        // 1. Update Reviews
        const reviewsQ = query(collection(db, REVIEWS_COLLECTION), where("userId", "==", userId));
        const reviewsSnapshot = await getDocs(reviewsQ);
        reviewsSnapshot.docs.forEach(doc => {
            batch.update(doc.ref, updates);
            operationCount++;
        });

        // 2. Update Posts
        const postsQ = query(collection(db, POSTS_COLLECTION), where("userId", "==", userId));
        const postsSnapshot = await getDocs(postsQ);
        postsSnapshot.docs.forEach(doc => {
            batch.update(doc.ref, updates);
            operationCount++;
        });

        // 3. Update Comments
        const commentsQ = query(collection(db, COMMENTS_COLLECTION), where("userId", "==", userId));
        const commentsSnapshot = await getDocs(commentsQ);
        commentsSnapshot.docs.forEach(doc => {
            batch.update(doc.ref, updates);
            operationCount++;
        });

        // Commit if there are updates
        if (operationCount > 0) {
            await batch.commit();
        }

    } catch (e) {
        console.error("Error syncing profile updates:", e);
        throw e;
    }
};

export const recalculateCommentCounts = async () => {
    try {
        const posts = await getPosts();
        const batch = writeBatch(db);
        let operationCount = 0;

        for (const post of posts) {
            if (!post.id) continue;

            // Get actual count
            const q = query(collection(db, COMMENTS_COLLECTION), where("postId", "==", post.id));
            const snapshot = await getDocs(q);
            const count = snapshot.size;

            if (post.commentCount !== count) {
                const postRef = doc(db, POSTS_COLLECTION, post.id);
                batch.update(postRef, { commentCount: count });
                operationCount++;
            }
        }

        if (operationCount > 0) {
            await batch.commit();
            console.log(`Updated counts for ${operationCount} posts`);
        } else {
            console.log("No count updates needed");
        }
    } catch (e) {
        console.error("Error calculating counts:", e);
    }
};

const SUBSCRIBERS_COLLECTION = "subscribers";

export const addSubscriber = async (email: string) => {
    try {
        // Check if already subscribed to avoid duplicates (optional but good)
        const q = query(collection(db, SUBSCRIBERS_COLLECTION), where("email", "==", email));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
            return; // Already subscribed, just return success silently
        }

        await addDoc(collection(db, SUBSCRIBERS_COLLECTION), {
            email,
            createdAt: new Date().toISOString()
        });
    } catch (e) {
        console.error("Error adding subscriber:", e);
        throw e;
    }
};

export const getSubscribers = async () => {
    try {
        const q = query(collection(db, SUBSCRIBERS_COLLECTION), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            email: doc.data().email,
            createdAt: doc.data().createdAt
        }));
    } catch (e) {
        console.error("Error fetching subscribers:", e);
        return [];
    }
};

export const getAllGamesAdmin = async () => {
    try {
        const q = query(collection(db, GAMES_COLLECTION), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(docToGame);
    } catch (e) {
        console.error("Error fetching all games for admin:", e);
        return [];
    }
};

// --- Contact & Support ---

const CONTACT_COLLECTION = "contact_messages";

export interface ContactMessage {
    id?: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: 'new' | 'read' | 'replied';
    createdAt: string;
}

export const addContactMessage = async (msg: Omit<ContactMessage, "id" | "status" | "createdAt">) => {
    try {
        await addDoc(collection(db, CONTACT_COLLECTION), {
            ...msg,
            status: 'new',
            createdAt: new Date().toISOString()
        });
    } catch (e) {
        console.error("Error sending message:", e);
        throw e;
    }
};

export const getContactMessages = async () => {
    try {
        const q = query(collection(db, CONTACT_COLLECTION), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContactMessage));
    } catch (e) {
        console.error("Error fetching messages:", e);
        return [];
    }
};

// --- User Management ---

const USERS_COLLECTION = "users";

import { getLevel } from "./gamification";

export interface UserProfile {
    id: string;
    email: string;
    displayName?: string;
    photoURL?: string;
    createdAt?: string;
    lastLogin?: string;
    xp?: number;
    level?: number;
}

export const syncUser = async (user: any) => {
    if (!user) return;
    try {
        const userRef = doc(db, USERS_COLLECTION, user.uid);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            // Create new user doc
            await setDoc(userRef, {
                email: user.email,
                displayName: user.displayName || '',
                photoURL: user.photoURL || '',
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString(),
                xp: 0,
                level: 1
            });
        } else {
            // Update last login & ensure XP/Level exist
            const data = userDoc.data();
            await updateDoc(userRef, {
                lastLogin: new Date().toISOString(),
                email: user.email,
                displayName: user.displayName || data.displayName,
                photoURL: user.photoURL || data.photoURL,
                xp: data.xp || 0,
                level: data.level || 1
            });
        }
    } catch (e) {
        console.error("Error syncing user:", e);
    }
};

export const addUserXP = async (userId: string, amount: number, source: string = 'Activity') => {
    try {
        const userRef = doc(db, USERS_COLLECTION, userId);

        await runTransaction(db, async (transaction) => {
            const userDoc = await transaction.get(userRef);
            if (!userDoc.exists()) throw new Error("User does not exist");

            const currentXP = userDoc.data().xp || 0;
            const currentLevel = userDoc.data().level || 1;

            const newXP = currentXP + amount;
            const newLevelInfo = getLevel(newXP);

            transaction.update(userRef, {
                xp: newXP,
                level: newLevelInfo.level
            });

            // Dispatch event for UI feedback
            if (typeof window !== 'undefined') {
                const eventDetail: any = {
                    amount: amount,
                    source: source,
                    newLevel: newLevelInfo.level > currentLevel ? newLevelInfo.level : undefined,
                    newTitle: newLevelInfo.level > currentLevel ? newLevelInfo.title : undefined
                };
                window.dispatchEvent(new CustomEvent('xp-gained', { detail: eventDetail }));
            }

            if (newLevelInfo.level > currentLevel) {
                console.log(`User ${userId} leveled up to ${newLevelInfo.level}!`);
            }
        });
    } catch (e) {
        console.error("Error adding XP:", e);
    }
};

export const getAllUsers = async () => {
    try {
        const q = query(collection(db, USERS_COLLECTION), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserProfile));
    } catch (e) {
        console.error("Error fetching users:", e);
        return [];
    }
};

// --- Site Stats (Visitor Counter) ---

const STATS_COLLECTION = "site_stats";
const GLOBAL_STATS_DOC = "global";

export const incrementVisitorCount = async () => {
    const statsRef = doc(db, STATS_COLLECTION, GLOBAL_STATS_DOC);
    try {
        await updateDoc(statsRef, {
            visitorCount: increment(1)
        });
    } catch (e: any) {
        // If doc doesn't exist, create it
        if (e.code === 'not-found') {
            await setDoc(statsRef, {
                visitorCount: 1,
                updatedAt: new Date().toISOString()
            });
        } else {
            console.error("Error incrementing visitor count:", e);
        }
    }
};



export const getVisitorCount = async () => {
    try {
        const statsRef = doc(db, STATS_COLLECTION, GLOBAL_STATS_DOC);
        const docSnap = await getDoc(statsRef);
        if (docSnap.exists()) {
            return docSnap.data().visitorCount as number;
        }
        return 0;
    } catch (e) {
        console.error("Error getting visitor count:", e);
        return 0;
    }
};

export const subscribeToVisitorCount = (callback: (count: number) => void) => {
    const statsRef = doc(db, STATS_COLLECTION, GLOBAL_STATS_DOC);
    return onSnapshot(statsRef, (doc) => {
        if (doc.exists()) {
            callback(doc.data().visitorCount as number);
        } else {
            callback(0);
        }
    }, (error) => {
        console.error("Error subscribing to visitor count:", error);
    });
};

export const incrementUserDownload = async (userId: string) => {
    try {
        const userRef = doc(db, USERS_COLLECTION, userId);
        await updateDoc(userRef, {
            downloadsCount: increment(1)
        });
    } catch (e) {
        console.error("Error incrementing user downloads:", e);
    }
};

export const getUserReviewCount = async (userId: string) => {
    try {
        const q = query(collection(db, REVIEWS_COLLECTION), where("userId", "==", userId));
        // Use count() for efficiency
        const snapshot = await getCountFromServer(q);
        return snapshot.data().count;
    } catch (e) {
        console.error("Error fetching user review count:", e);
        return 0;
    }
};

export const getUserTotalLikes = async (userId: string) => {
    try {
        // Sum likes from posts
        const postsQ = query(collection(db, POSTS_COLLECTION), where("userId", "==", userId));
        const postsSnap = await getDocs(postsQ);
        let totalLikes = 0;
        postsSnap.forEach(doc => {
            const data = doc.data();
            if (data.likes && Array.isArray(data.likes)) {
                totalLikes += data.likes.length;
            }
        });
        return totalLikes;
    } catch (e) {
        console.error("Error fetching user total likes:", e);
        return 0;
    }
};

export const getUserPosts = async (userId: string, limitCount: number = 20) => {
    try {
        const q = query(
            collection(db, POSTS_COLLECTION),
            where("userId", "==", userId),
            orderBy("createdAt", "desc"),
            limit(limitCount)
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
    } catch (e) {
        console.error("Error fetching user posts:", e);
        try {
            // Fallback
            const q = query(collection(db, POSTS_COLLECTION), where("userId", "==", userId), limit(limitCount));
            const snapshot = await getDocs(q);
            // Client side sort
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post))
                .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        } catch (e2) {
            return [];
        }
    }
}

export const getUserReviews = async (userId: string, limitCount: number = 20) => {
    try {
        const q = query(
            collection(db, REVIEWS_COLLECTION),
            where("userId", "==", userId),
            orderBy("createdAt", "desc"),
            limit(limitCount)
        );
        const snapshot = await getDocs(q);
        const reviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));

        return reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (e) {
        console.error("Error fetching user reviews:", e);
        try {
            // Fallback attempt without orderBy
            const q = query(collection(db, REVIEWS_COLLECTION), where("userId", "==", userId), limit(limitCount));
            const snapshot = await getDocs(q);
            const reviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
            return reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        } catch (e2) {
            return [];
        }
    }
};
