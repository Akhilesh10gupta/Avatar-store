
// scripts/verify_games_standalone.ts
const fs = require('fs');
const path = require('path');
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs, query, orderBy, limit } = require("firebase/firestore");

// 1. Load Environment Variables from .env.local
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach((line: string) => {
        const [key, value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.trim();
        }
    });
} else {
    console.error(".env.local not found!");
    process.exit(1);
}

// 2. Initialize Firebase
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

console.log("Initializing Firebase with project:", firebaseConfig.projectId);

// Polyfill for Request/Response/fetch if needed (Node 18+ has fetch)
// Firebase 9+ works in Node.

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const GAMES_COLLECTION = "games";

async function verifyGames() {
    try {
        console.log("Fetching games...");
        const q = query(collection(db, GAMES_COLLECTION), orderBy("createdAt", "desc"), limit(5));
        const querySnapshot = await getDocs(q);

        console.log(`Found ${querySnapshot.size} games.`);

        if (!querySnapshot.empty) {
            querySnapshot.forEach((doc: any) => {
                const data = doc.data();
                console.log(`- [${doc.id}] ${data.title} (Rating: ${data.rating})`);
            });
        } else {
            console.log("No games found in the 'games' collection.");
        }
    } catch (error) {
        console.error("Error fetching games:", error);
    }
}

verifyGames();
