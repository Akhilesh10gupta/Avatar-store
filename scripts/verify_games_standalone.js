
// scripts/verify_games_standalone.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, orderBy, limit } from "firebase/firestore";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Load Environment Variables from .env.local
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach((line) => {
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
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                console.log(`- [${doc.id}] ${data.title} (Rating: ${data.rating})`);
            });
        } else {
            console.log("No games found in the 'games' collection.");
        }
    } catch (error) {
        console.error("Error fetching games:", error);
        if (error.code) console.error("Error Code:", error.code);
        if (error.message) console.error("Error Message:", error.message);
    } finally {
        process.exit(0);
    }
}

await verifyGames();
