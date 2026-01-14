
export const getYouTubeEmbedUrl = (url: string): string | null => {
    if (!url) return null;

    // Check if it's strictly a YouTube URL
    if (!url.includes('youtube.com') && !url.includes('youtu.be')) return null;

    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
        return `https://www.youtube.com/embed/${match[2]}`;
    }

    return null;
};
