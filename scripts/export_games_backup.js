// scripts/export_games_backup.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, '../.env.local');
const envConfig = fs.readFileSync(envPath, 'utf8');

const lines = envConfig.split(/\r?\n/);
for (let line of lines) {
    line = line.trim();
    if (!line || line.startsWith('#')) continue;
    const index = line.indexOf('=');
    if (index !== -1) {
        const key = line.slice(0, index).trim();
        let value = line.slice(index + 1).trim();
        if (value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1);
        }
        process.env[key] = value;
    }
}

const serviceAccount = {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'gameweb-4fe8b',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY
        ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
        : undefined,
};

if (!getApps().length) {
    initializeApp({
        credential: cert(serviceAccount)
    });
}

const db = getFirestore();

const convertTimestamps = (data) => {
    if (!data) return data;
    const result = { ...data };
    if (result.createdAt && result.createdAt.toDate) {
        result.createdAt = result.createdAt.toDate().toISOString();
    }
    if (result.updatedAt && result.updatedAt.toDate) {
        result.updatedAt = result.updatedAt.toDate().toISOString();
    }
    return result;
};

async function run() {
    console.log("Fetching games from Firestore...");
    const gamesSnap = await db.collection('games').get();
    const games = gamesSnap.docs.map(doc => ({
        id: doc.id,
        ...convertTimestamps(doc.data())
    }));

    const dataDir = path.resolve(__dirname, '../data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    const backupPath = path.resolve(dataDir, 'games-backup.json');
    fs.writeFileSync(backupPath, JSON.stringify(games, null, 2), 'utf8');
    console.log(`Successfully exported ${games.length} games to ${backupPath}`);
}

run().catch(console.error);
