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
        // Debugging: Log partial credentials to verify presence in Vercel
        console.log("Admin SDK Init Check:");
        console.log("- Project ID:", serviceAccount.projectId);
        console.log("- Client Email:", serviceAccount.clientEmail ? "Present" : "Missing");
        console.log("- Private Key:", serviceAccount.privateKey ? "Present (Length: " + serviceAccount.privateKey.length + ")" : "Missing");

        if (!serviceAccount.clientEmail || !serviceAccount.privateKey) {
            console.warn("Firebase Admin: Missing service account credentials. Server-side operations may fail.");
            // Fallback: If no credentials, we might return null or throw, 
            // but let's try to initialize with minimal config if possible or just log error.
            if (process.env.NODE_ENV === 'development') {
                console.log("Using default/mock admin for dev if keys missing (or just warning)");
            }
            // For now, let's just create the app. It will fail on usage if auth fails.
            // Actually, initializeApp without args attempts to use Google Application Default Credentials
            // which might work if deployed on GCP/Vercel with proper env, or locally with gcloud auth.
            initializeApp({
                credential: cert(serviceAccount)
            });
        } else {
            initializeApp({
                credential: cert(serviceAccount)
            });
        }
    }
    return getApp();
};

export const adminDb = getFirestore(initAdmin());
