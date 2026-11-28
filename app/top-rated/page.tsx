import { getTopRatedGamesAdmin } from "@/lib/firestore-admin";
import TopRatedClient from "@/components/TopRatedClient";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Top Rated Games',
    description: 'Check out the highest-rated games as voted by the Avatar Play community.',
};

// ISR Cache: Cache top-rated page for 1 hour (3600s) to keep Vercel within free limits
export const revalidate = 3600;

export default async function TopRatedPage() {
    const ratedGames = await getTopRatedGamesAdmin();
    // Exclude standalone 3D action games (accessible via /3d-action)
    const filteredGames = ratedGames.filter(
        g => !g.hiddenFromHome && g.id !== 'crt-city-80s-open-world' && g.id !== 'midnight-neon-underground-3d' && g.id !== 'tactical-infiltrator-3d'
    );
    // Sort logic from original: (Downloads -> Rating)
    const sortedGames = [...filteredGames].sort((a, b) => {
        const downloadsA = a.downloadCount || 0;
        const downloadsB = b.downloadCount || 0;
        if (downloadsA !== downloadsB) {
            return downloadsB - downloadsA;
        }
        return (b.rating || 0) - (a.rating || 0);
    });

    return <TopRatedClient initialGames={sortedGames} />;
}
