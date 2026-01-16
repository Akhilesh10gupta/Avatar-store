
import * as tf from '@tensorflow/tfjs';
import * as nsfwjs from 'nsfwjs';

// Cache the model instance
let model: nsfwjs.NSFWJS | null = null;

/**
 * Loads the NSFWJS model.
 */
async function getModel() {
    if (model) return model;
    try {
        // Load model from default public URL
        model = await nsfwjs.load();
        return model;
    } catch (error) {
        console.error("Failed to load content safety model:", error);
        return null;
    }
}

export interface SafetyCheckResult {
    safe: boolean;
    reason?: string;
}

/**
 * Checks if an image file contains explicit content.
 * Blocks 'Porn' and 'Hentai' with high confidence.
 * Allows 'Sexy' (lingerie/bikini), 'Neutral', and 'Drawing'.
 */
export async function checkImageSafety(file: File): Promise<SafetyCheckResult> {
    try {
        const model = await getModel();

        // If model fails to load (offline or blocking), we default to safe to not break app functionality.
        // In a strict environment, you might want to default to unsafe.
        if (!model) {
            console.warn("Content safety model not available, skipping check.");
            return { safe: true };
        }

        // Create an HTML Image element from the file
        const img = document.createElement('img');
        const objectUrl = URL.createObjectURL(file);
        img.src = objectUrl;

        // Wait for image to load dimensions
        await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
        });

        // Run classification
        const predictions = await model.classify(img);

        // Cleanup memory
        URL.revokeObjectURL(objectUrl);
        // img.remove() is not strictly necessary as it's not attached to DOM, but good practice if it were.

        // Analyze predictions
        // Predictions are sorted by probability (highest first).
        console.log("Content Safety Predictions:", predictions);

        const porn = predictions.find(p => p.className === 'Porn');
        const hentai = predictions.find(p => p.className === 'Hentai');
        const sexy = predictions.find(p => p.className === 'Sexy');

        // Logic: 
        // User wants to block "complete nude" (Porn) but allow "panty or bra" (Sexy).
        // NSFWJS 'Sexy' class covers partial nudity/lingerie. 'Porn' covers explicit acts/genitalia.

        const STRICT_THRESHOLD = 0.25; // Lowered to 25% to catch more nude images

        // Log for debugging on client
        console.log(`Safety Check: Porn=${porn?.probability.toFixed(2)}, Hentai=${hentai?.probability.toFixed(2)}, Sexy=${sexy?.probability.toFixed(2)}`);

        if (porn && porn.probability > STRICT_THRESHOLD) {
            return {
                safe: false,
                reason: "Explicit content detected (Nudity). Please upload appropriate content."
            };
        }

        if (hentai && hentai.probability > STRICT_THRESHOLD) {
            return {
                safe: false,
                reason: "Explicit content detected (Hentai). Please upload appropriate content."
            };
        }

        return { safe: true };

    } catch (error) {
        console.error("Error during content safety check:", error);
        // Fail open to avoid blocking users on technical errors, but log it
        return { safe: true };
    }
}
