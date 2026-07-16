// scripts/check_games_data.js
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

async function run() {
    const gamesSnapshot = await db.collection('games').get();
    console.log(`Total Games: ${gamesSnapshot.size}`);
    
    gamesSnapshot.forEach(doc => {
        const data = doc.data();
        console.log(`Game: ${data.title}`);
        console.log(`- Platform: ${data.platform}`);
        console.log(`- Download Link (PC): ${data.downloadLinkPC || data.downloadLink}`);
        console.log(`- Download Link (Android): ${data.downloadLinkAndroid || data.downloadLink}`);
        console.log(`- Screenshots: ${data.screenshots ? data.screenshots.length : 0}`);
        console.log(`- Description Length: ${data.description ? data.description.length : 0}`);
        console.log(`-----------------------------------`);
    });
}

run().catch(console.error);
