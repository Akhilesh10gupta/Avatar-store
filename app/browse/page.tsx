import { getGamesAdmin } from "@/lib/firestore-admin";
import BrowseClient from "@/components/BrowseClient";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Browse Best Indian Meme Games, Funny Desi APKs & Viral Games | Avatar Play',
    description: 'Explore our complete collection of trending Indian meme games, Bollywood parody games, and viral Android & PC titles. Free direct downloads on Avatar Play.',
    keywords: ['Indian meme games', 'desi apk download', 'viral games', 'Avatar Play browse games'],
};

// ISR Cache: Cache browse page for 1 hour (3600s) to keep Vercel within free limits
export const revalidate = 3600;

export default async function BrowsePage() {
    const games = await getGamesAdmin();
    // Exclude standalone 3D action games (accessible via /3d-action)
    const catalogGames = games.filter(
        g => !g.hiddenFromHome && g.id !== 'crt-city-80s-open-world' && g.id !== 'midnight-neon-underground-3d' && g.id !== 'tactical-infiltrator-3d'
    );
    return <BrowseClient initialGames={catalogGames} />;
}
