
// scripts/verify_admin_sdk.js
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
        // Simple parser that handles key="value" or key=value
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            let value = match[2].trim();
            // Remove surrounding quotes if present
            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1);
            }
            if (key.includes('PROJECT_ID')) console.log(`Loaded ${key}: ${value}`);
            process.env[key] = value;
        }
    });
} else {
    console.error(".env.local not found!");
    process.exit(1);
}

// 2. Initialize Admin SDK
const serviceAccount = {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    // Handle the newlines in private key
    privateKey: process.env.FIREBASE_PRIVATE_KEY
        ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
        : undefined,
};

console.log("Initializing Admin SDK with:", serviceAccount.clientEmail);
console.log("Project ID:", serviceAccount.projectId);
console.log("Private Key length:", serviceAccount.privateKey ? serviceAccount.privateKey.length : 0);


if (!getApps().length) {
    initializeApp({
        credential: cert(serviceAccount)
    });
}

const db = getFirestore();
const GAMES_COLLECTION = "games";

async function verifyAdminFetch() {
    try {
        console.log("Fetching games via Admin SDK...");
        const snapshot = await db.collection(GAMES_COLLECTION)
            .orderBy("createdAt", "desc")
            .limit(5)
            .get();

        console.log(`Found ${snapshot.size} games.`);

        if (!snapshot.empty) {
            snapshot.forEach((doc) => {
                const data = doc.data();
                console.log(`- [${doc.id}] ${data.title} (Rating: ${data.rating})`);
            });
            console.log("SUCCESS: Admin SDK is working!");
        } else {
            console.log("No games found, but connection was successful.");
        }
    } catch (error) {
        console.error("Error fetching games:", error);
    } finally {
        process.exit(0);
    }
}

await verifyAdminFetch();
