
// Safe image optimization without expensive AI generative fills
export const getOptimizedImage = (url: string, width: number, height: number) => {
    if (!url || !url.includes('cloudinary.com')) return url;

    try {
        const parts = url.split('/upload/');
        if (parts.length !== 2) return url;

        const [baseUrl, rest] = parts;
        // Standard c_fill with automatic format and quality (0 extra AI credits consumed)
        const transformation = `c_fill,g_auto,w_${width},h_${height},q_auto,f_auto`;

        return `${baseUrl}/upload/${transformation}/${rest}`;
    } catch (e) {
        return url;
    }
};

// Standard Card/Cover Image Generation (Safe & Free - No AI b_gen_fill)
export const getAICardImage = (url: string, width: number, height: number, _title?: string) => {
    // If local image or non-cloudinary, return as-is
    if (!url || !url.includes('cloudinary.com')) return url;

    // Use fast standard optimization instead of expensive b_gen_fill AI transformation
    return getOptimizedImage(url, width, height);
};
