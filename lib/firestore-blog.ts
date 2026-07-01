import { adminDb } from "./firebase-admin";
import { BlogPost, blogPosts } from "./blogData";

const BLOG_COLLECTION = "blog_posts";

// Helper to convert Firestore timestamp to ISO string
const convertTimestamps = (data: any) => {
    if (!data) return data;
    const result = { ...data };
    if (result.createdAt && result.createdAt.toDate) {
        result.createdAt = result.createdAt.toDate().toISOString();
    }
    return result;
};

// Fetch all blog posts (server-side, bypass rules)
export const getBlogPostsAdmin = async (): Promise<BlogPost[]> => {
    try {
        const snapshot = await adminDb.collection(BLOG_COLLECTION)
            .orderBy("createdAt", "desc")
            .get();

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...convertTimestamps(doc.data())
        } as unknown as BlogPost));
    } catch (error) {
        console.error("Error fetching blog posts (admin):", error);
        return [];
    }
};

// Fetch paginated blog posts (high performance offset-based)
export const getBlogPostsPaginatedAdmin = async (limit: number, offset: number): Promise<BlogPost[]> => {
    try {
        const snapshot = await adminDb.collection(BLOG_COLLECTION)
            .orderBy("createdAt", "desc")
            .offset(offset)
            .limit(limit)
            .get();

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...convertTimestamps(doc.data())
        } as unknown as BlogPost));
    } catch (error) {
        console.error(`Error fetching paginated blog posts (limit: ${limit}, offset: ${offset}):`, error);
        return [];
    }
};

// Get the total count of blog posts using ultra-cheap count aggregation
export const getBlogPostsCountAdmin = async (): Promise<number> => {
    try {
        const snapshot = await adminDb.collection(BLOG_COLLECTION).count().get();
        return snapshot.data().count;
    } catch (error) {
        console.error("Error getting blog posts count:", error);
        return 0;
    }
};

// Fetch a single blog post by its slug (server-side)
export const getBlogPostBySlugAdmin = async (slug: string): Promise<BlogPost | null> => {
    try {
        const snapshot = await adminDb.collection(BLOG_COLLECTION)
            .where("slug", "==", slug)
            .limit(1)
            .get();

        if (snapshot.empty) {
            return null;
        }

        const doc = snapshot.docs[0];
        return {
            id: doc.id,
            ...convertTimestamps(doc.data())
        } as unknown as BlogPost;
    } catch (error) {
        console.error(`Error fetching blog post by slug ${slug} (admin):`, error);
        return null;
    }
};

// Create a new blog post (server-side)
export const createBlogPostAdmin = async (postData: Omit<BlogPost, 'id'>) => {
    try {
        const createdAt = new Date();
        const docRef = await adminDb.collection(BLOG_COLLECTION).add({
            ...postData,
            createdAt: createdAt
        });
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error("Error creating blog post (admin):", error);
        return { success: false, error };
    }
};

// Seeder to populate initial blog posts if Firestore collection is empty
export const seedInitialBlogPosts = async () => {
    try {
        const snapshot = await adminDb.collection(BLOG_COLLECTION).limit(1).get();
        
        // If collection already has posts, do not seed
        if (!snapshot.empty) {
            return { success: true, seeded: false };
        }

        console.log("Blog collection is empty. Seeding initial posts...");
        
        // Seed in reverse chronological order to maintain sort order
        const reversedPosts = [...blogPosts].reverse();
        
        for (let i = 0; i < reversedPosts.length; i++) {
            const post = reversedPosts[i];
            
            // Generate distinct mock creation dates (e.g. 1 day apart)
            const mockDate = new Date();
            mockDate.setDate(mockDate.getDate() - (reversedPosts.length - 1 - i));
            
            await adminDb.collection(BLOG_COLLECTION).add({
                title: post.title,
                slug: post.slug,
                description: post.description,
                category: post.category,
                date: post.date,
                author: post.author,
                readTime: post.readTime,
                coverImage: post.coverImage,
                content: post.content,
                createdAt: mockDate
            });
        }

        console.log("Successfully seeded 5 initial blog posts.");
        return { success: true, seeded: true };
    } catch (error) {
        console.error("Error seeding initial blog posts:", error);
        return { success: false, error };
    }
};

// Update an existing blog post (server-side)
export const updateBlogPostAdmin = async (id: string, postData: Partial<BlogPost>) => {
    try {
        const updateData: any = { ...postData };
        if (updateData.id) delete updateData.id; // Prevent writing ID inside doc data
        
        await adminDb.collection(BLOG_COLLECTION).doc(id).update({
            ...updateData,
            updatedAt: new Date()
        });
        return { success: true };
    } catch (error) {
        console.error(`Error updating blog post ${id} (admin):`, error);
        return { success: false, error };
    }
};

// Delete a blog post (server-side)
export const deleteBlogPostAdmin = async (id: string) => {
    try {
        await adminDb.collection(BLOG_COLLECTION).doc(id).delete();
        return { success: true };
    } catch (error) {
        console.error(`Error deleting blog post ${id} (admin):`, error);
        return { success: false, error };
    }
};
