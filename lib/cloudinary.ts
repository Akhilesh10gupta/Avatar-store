
export const getOptimizedImage = (url: string, width: number, height: number) => {
    if (!url || !url.includes('cloudinary.com')) return url;

    // Split the URL to insert transformations
    // Cloudinary URL format: https://res.cloudinary.com/<cloud_name>/image/upload/<version>/<public_id>
    // We want: https://res.cloudinary.com/<cloud_name>/image/upload/c_fill,g_auto,w_<w>,h_<h>/<version>/<public_id>

    try {
        const parts = url.split('/upload/');
        if (parts.length !== 2) return url;

        const [baseUrl, rest] = parts;
        const transformation = `c_fill,g_auto,w_${width},h_${height},q_auto,f_auto`;

        return `${baseUrl}/upload/${transformation}/${rest}`;
    } catch (e) {
        return url;
    }
};
