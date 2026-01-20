
// Basic optimization with smart crop
export const getOptimizedImage = (url: string, width: number, height: number) => {
    if (!url || !url.includes('cloudinary.com')) return url;

    try {
        const parts = url.split('/upload/');
        if (parts.length !== 2) return url;

        const [baseUrl, rest] = parts;
        // c_fill: Crop to fill dimensions, g_auto: AI focus on interesting part
        const transformation = `c_fill,g_auto,w_${width},h_${height},q_auto,f_auto`;

        return `${baseUrl}/upload/${transformation}/${rest}`;
    } catch (e) {
        return url;
    }
};

// Advanced AI Card Generation with Generative Fill
// This preserves the full original image content (including text/titles) 
// and uses AI to extend/paint the background to fill the requested aspect ratio.
export const getAICardImage = (url: string, width: number, height: number, title?: string) => {
    if (!url || !url.includes('cloudinary.com')) return url;

    try {
        const parts = url.split('/upload/');
        if (parts.length !== 2) return url;

        const [baseUrl, rest] = parts;

        // Advanced AI Configuration for "Perfect Original" Look
        // 1. c_pad: Ensures NONE of the original image (title/content) is cropped.
        // 2. b_gen_fill: AI paints the missing background area. 
        //    Removing 'ignore-foreground' allows for smoother blending with the edges.
        // 3. q_auto:best: Forces maximum image quality.
        // 4. e_vibes: Checks if we can add a subtle vibrancy, but 'e_improve' is safer.
        // 5. e_sharpen: Adds crispness to match high-res assets.

        let transformation = `c_pad,b_gen_fill,w_${width},h_${height},ar_${width}:${height},q_auto:best,f_auto`;

        // Add enhancements for that "premium" feel
        transformation += `,e_improve,e_sharpen:50`;

        return `${baseUrl}/upload/${transformation}/${rest}`;
    } catch (e) {
        // Fallback to basic optimization if parsing fails
        return getOptimizedImage(url, width, height);
    }
};
