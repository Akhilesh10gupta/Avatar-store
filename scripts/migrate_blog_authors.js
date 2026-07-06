import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Manually Load Environment Variables
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach((line) => {
        // Clean line of carriage returns
        const cleanLine = line.replace('\r', '').trim();
        const match = cleanLine.match(/^([^=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            let value = match[2].trim();
            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1);
            }
            process.env[key] = value;
        }
    });
} else {
    console.error(".env.local not found!");
    process.exit(1);
}

// 2. Initialize Admin SDK
const serviceAccount = {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'gameweb-4fe8b',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY
        ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
        : undefined,
};

console.log("Loaded credentials:");
console.log("- projectId:", serviceAccount.projectId);
console.log("- clientEmail:", serviceAccount.clientEmail);
console.log("- privateKey length:", serviceAccount.privateKey ? serviceAccount.privateKey.length : 0);

if (!getApps().length) {
    initializeApp({
        credential: cert(serviceAccount)
    });
}

const db = getFirestore();
const BLOG_COLLECTION = "blog_posts";

async function migrateAuthors() {
    try {
        console.log("Fetching blog posts from Firestore...");
        const snapshot = await db.collection(BLOG_COLLECTION).get();
        console.log(`Found ${snapshot.size} total posts.`);

        let updatedCount = 0;
        
        for (const doc of snapshot.docs) {
            const data = doc.data();
            if (data.author === "Avatar Play AI") {
                console.log(`Updating author for post: "${data.title}"...`);
                await doc.ref.update({
                    author: "Avatar Play Editorial Team"
                });
                updatedCount++;
            }
        }

        console.log(`SUCCESS: Migration complete. Updated ${updatedCount} blog posts.`);
    } catch (error) {
        console.error("Migration failed:", error);
    } finally {
        process.exit(0);
    }
}

await migrateAuthors();
