
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;

export const uploadFile = async (file: File, folder: string = 'general', resourceType: 'image' | 'video' | 'auto' = 'image') => {
    // 1. Prepare parameters for signature
    const timestamp = Math.round((new Date).getTime() / 1000);
    const paramsToSign = {
        folder: folder,
        timestamp: timestamp,
    };

    // 2. Get Signature and Cloudinary credentials securely from backend
    const signResponse = await fetch('/api/cloudinary-sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paramsToSign }),
    });

    if (!signResponse.ok) {
        throw new Error("Failed to sign upload request");
    }

    const { signature, cloudName, apiKey } = await signResponse.json();
    const activeCloudName = cloudName || CLOUD_NAME;
    const activeApiKey = apiKey || API_KEY;

    if (!activeCloudName || !activeApiKey) {
        throw new Error("Cloudinary configuration is missing.");
    }

    // 3. Upload to Cloudinary using the signature
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', activeApiKey);
    formData.append('timestamp', timestamp.toString());
    formData.append('signature', signature);
    formData.append('folder', folder);

    try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${activeCloudName}/${resourceType}/upload`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Upload failed');
        }

        const data = await response.json();
        return data.secure_url;
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        throw error;
    }
};

export const uploadMultipleFiles = async (files: File[], folder: string = 'general') => {
    const promises = files.map(file => uploadFile(file, folder));
    return Promise.all(promises);
};
