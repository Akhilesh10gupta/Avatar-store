import { getTopRatedGamesAdmin } from "@/lib/firestore-admin";
import TopRatedClient from "@/components/TopRatedClient";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Top Rated Games',
    description: 'Check out the highest-rated games as voted by the Avatar Play community.',
};

export const dynamic = 'force-dynamic';

export default async function TopRatedPage() {
    const ratedGames = await getTopRatedGamesAdmin();
    // Sort logic from original: (Downloads -> Rating)
    const sortedGames = [...ratedGames].sort((a, b) => {
        const downloadsA = a.downloadCount || 0;
        const downloadsB = b.downloadCount || 0;
        if (downloadsA !== downloadsB) {
            return downloadsB - downloadsA;
        }
        return (b.rating || 0) - (a.rating || 0);
    });

    return <TopRatedClient initialGames={sortedGames} />;
}
