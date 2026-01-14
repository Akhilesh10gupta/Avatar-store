const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export const uploadFile = async (file: File, folder: string = 'general') => {
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
        throw new Error("Cloudinary configuration is missing. Check .env.local");
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', folder); // Cloudinary supports folders via preset or direct param if allowed

    try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Upload failed');
        }

        const data = await response.json();
        return data.secure_url; // Returns the HTTPS URL of the uploaded image
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        throw error;
    }
};

export const uploadMultipleFiles = async (files: File[], folder: string = 'general') => {
    const promises = files.map(file => uploadFile(file, folder));
    return Promise.all(promises);
};
