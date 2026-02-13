import { initializeApp, getApps, cert, getApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'gameweb-4fe8b',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY
        ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') // Correctly format private key
        : undefined,
};

export const initAdmin = () => {
    if (!getApps().length) {
        if (!serviceAccount.clientEmail || !serviceAccount.privateKey) {
            console.error("Firebase Admin: Missing service account credentials.");
            console.error("If you just added .env.local, please RESTART YOUR SERVER.");
            throw new Error("Missing Firebase Admin Credentials. Please add FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY to .env.local and restart the server.");
        }

        initializeApp({
            credential: cert(serviceAccount)
        });
    }
    return getApp();
};

export const adminDb = getFirestore(initAdmin());
