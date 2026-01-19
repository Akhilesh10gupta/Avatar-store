
export const getYouTubeEmbedUrl = (url: string): string | null => {
    if (!url) return null;

    // Check if it's strictly a YouTube URL
    if (!url.includes('youtube.com') && !url.includes('youtu.be')) return null;

    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
        return `https://www.youtube.com/embed/${match[2]}`;
    }

    return null;
};

export const getInstagramEmbedUrl = (url: string): string | null => {
    if (!url) return null;

    if (!url.includes('instagram.com')) return null;

    // Support both /reel/ and /p/ (posts can be videos too) and /tv/
    const regExp = /instagram\.com\/(?:reel|p|tv)\/([a-zA-Z0-9_-]+)/;
    const match = url.match(regExp);

    if (match && match[1]) {
        return `https://www.instagram.com/reel/${match[1]}/embed/`;
    }

    return null;
};

export const getVideoEmbedUrl = (url: string): { type: 'youtube' | 'instagram' | null, url: string | null } => {
    const youtubeUrl = getYouTubeEmbedUrl(url);
    if (youtubeUrl) return { type: 'youtube', url: youtubeUrl };

    const instagramUrl = getInstagramEmbedUrl(url);
    if (instagramUrl) return { type: 'instagram', url: instagramUrl };

    return { type: null, url: null };
}
