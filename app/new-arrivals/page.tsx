import { getGamesAdmin } from "@/lib/firestore-admin";
import NewArrivalsClient from "@/components/NewArrivalsClient";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'New Arrivals',
    description: 'Discover the newest games recently published on Avatar Play.',
};

// ISR Cache: Cache new arrivals page for 1 hour (3600s) to keep Vercel within free limits
export const revalidate = 3600;

export default async function NewArrivalsPage() {
    const games = await getGamesAdmin();
    // Exclude standalone 3D action games (accessible via /3d-action)
    const catalogGames = games.filter(
        g => !g.hiddenFromHome && g.id !== 'crt-city-80s-open-world' && g.id !== 'midnight-neon-underground-3d' && g.id !== 'tactical-infiltrator-3d' && g.id !== 'apex-outlaw-3d'
    );
    return <NewArrivalsClient initialGames={catalogGames} />;
}
