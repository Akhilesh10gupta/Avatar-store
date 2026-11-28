import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Load environment variables
const envPath = path.resolve(rootDir, '.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    for (let line of envConfig.split(/\r?\n/)) {
        line = line.trim();
        if (!line || line.startsWith('#')) continue;
        const idx = line.indexOf('=');
        if (idx !== -1) {
            const key = line.slice(0, idx).trim();
            let val = line.slice(idx + 1).trim();
            if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
            process.env[key] = val;
        }
    }
}

// Initialize Firebase
const serviceAccount = {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'gameweb-4fe8b',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY
        ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
        : undefined,
};

if (!getApps().length) {
    initializeApp({ credential: cert(serviceAccount) });
}
const db = getFirestore();

// Helper to determine local filename and path from Cloudinary URL
function parseCloudinaryUrl(url) {
    if (!url || typeof url !== 'string' || !url.includes('cloudinary.com')) {
        return null;
    }
    // E.g. https://res.cloudinary.com/dzzawmvmc/image/upload/v1769098955/icons/gvwdkmex2yfmpss0ncyt.png
    // Or with transformations: https://res.cloudinary.com/dzzawmvmc/image/upload/c_fill,w_600/v1769098955/icons/gvwdkmex2yfmpss0ncyt.png
    const cleanUrl = url.split('?')[0];
    const match = cleanUrl.match(/\/upload\/(?:[^\/]+\/)*(?:v\d+\/)?(.+)$/);
    if (!match) {
        const basename = path.basename(cleanUrl);
        return {
            subPath: `misc/${basename}`,
            localRelUrl: `/media/misc/${basename}`,
        };
    }

    const subPath = match[1]; // e.g. "icons/gvwdkmex2yfmpss0ncyt.png"
    return {
        subPath,
        localRelUrl: `/media/${subPath}`,
    };
}

async function downloadFile(url, destFilePath) {
    const destDir = path.dirname(destFilePath);
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }

    if (fs.existsSync(destFilePath) && fs.statSync(destFilePath).size > 0) {
        return true; // Already downloaded
    }

    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Failed to download ${url}: status ${res.status}`);
    }

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(destFilePath, buffer);
    return true;
}

async function run() {
    console.log("=== STEP 1: Reading games-backup.json ===");
    const backupFilePath = path.resolve(rootDir, 'data/games-backup.json');
    const games = JSON.parse(fs.readFileSync(backupFilePath, 'utf8'));

    const urlMap = new Map(); // cloudUrl -> localRelUrl

    // Collect all Cloudinary URLs from games
    for (const game of games) {
        ['icon', 'cardImage', 'coverImage'].forEach(field => {
            if (game[field] && game[field].includes('cloudinary.com')) {
                const parsed = parseCloudinaryUrl(game[field]);
                if (parsed) {
                    urlMap.set(game[field], parsed);
                }
            }
        });

        if (Array.isArray(game.screenshots)) {
            game.screenshots.forEach(sc => {
                if (sc && sc.includes('cloudinary.com')) {
                    const parsed = parseCloudinaryUrl(sc);
                    if (parsed) {
                        urlMap.set(sc, parsed);
                    }
                }
            });
        }
    }

    console.log(`Found ${urlMap.size} unique Cloudinary image URLs in games-backup.json`);

    console.log("=== STEP 2: Downloading all images to public/media/ ===");
    const mediaRootDir = path.resolve(rootDir, 'public/media');

    let downloadedCount = 0;
    let failedCount = 0;

    for (const [cloudUrl, info] of urlMap.entries()) {
        const localDestPath = path.resolve(mediaRootDir, info.subPath);
        try {
            await downloadFile(cloudUrl, localDestPath);
            const size = fs.statSync(localDestPath).size;
            downloadedCount++;
            console.log(`[${downloadedCount}/${urlMap.size}] OK: ${info.subPath} (${(size / 1024).toFixed(1)} KB)`);
        } catch (err) {
            failedCount++;
            console.error(`ERROR downloading ${cloudUrl}:`, err.message);
        }
    }

    console.log(`Download complete: ${downloadedCount} succeeded, ${failedCount} failed.`);

    console.log("=== STEP 3: Updating games-backup.json with local paths ===");
    const updatedGames = games.map(game => {
        const updated = { ...game };
        ['icon', 'cardImage', 'coverImage'].forEach(field => {
            if (updated[field] && urlMap.has(updated[field])) {
                updated[field] = urlMap.get(updated[field]).localRelUrl;
            }
        });
        if (Array.isArray(updated.screenshots)) {
            updated.screenshots = updated.screenshots.map(sc => {
                if (sc && urlMap.has(sc)) {
                    return urlMap.get(sc).localRelUrl;
                }
                return sc;
            });
        }
        return updated;
    });

    fs.writeFileSync(backupFilePath, JSON.stringify(updatedGames, null, 2), 'utf8');
    console.log("Updated data/games-backup.json saved.");

    console.log("=== STEP 4: Updating Firestore 'games' collection ===");
    let dbUpdated = 0;
    for (const game of updatedGames) {
        if (!game.id) continue;
        const docRef = db.collection('games').doc(game.id);
        const updateData = {};
        if (game.icon) updateData.icon = game.icon;
        if (game.cardImage) updateData.cardImage = game.cardImage;
        if (game.coverImage) updateData.coverImage = game.coverImage;
        if (game.screenshots) updateData.screenshots = game.screenshots;

        await docRef.set(updateData, { merge: true });
        dbUpdated++;
    }
    console.log(`Updated ${dbUpdated} game documents in Firestore.`);

    console.log("=== Migration successfully finished! ===");
}

run().catch(err => {
    console.error("Migration failed:", err);
    process.exit(1);
});
