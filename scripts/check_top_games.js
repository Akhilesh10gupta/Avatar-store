import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, '../.env.local');
const envConfig = fs.readFileSync(envPath, 'utf8');

for (let line of envConfig.split(/\r?\n/)) {
    line = line.trim();
    if (!line || line.startsWith('#')) continue;
    const index = line.indexOf('=');
    if (index !== -1) {
        let value = line.slice(index + 1).trim();
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
        process.env[line.slice(0, index).trim()] = value;
    }
}

const serviceAccount = {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'gameweb-4fe8b',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

if (!getApps().length) {
    initializeApp({ credential: cert(serviceAccount) });
}

const db = getFirestore();

async function run() {
    const gamesSnap = await db.collection('games').get();
    gamesSnap.forEach(g => {
        const d = g.data();
        if (d.downloadCount > 1000) {
            console.log(`--- ${d.title} (${d.downloadCount} plays) ---`);
            console.log('webPlayUrl:', d.webPlayUrl);
            console.log('downloadLink:', d.downloadLink);
            console.log('platform:', d.platform);
        }
    });
}

run().catch(console.error);
