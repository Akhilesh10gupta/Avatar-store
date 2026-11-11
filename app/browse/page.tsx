import { getGamesAdmin } from "@/lib/firestore-admin";
import BrowseClient from "@/components/BrowseClient";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Browse Games',
    description: 'Explore the full collection of indie and premium games on Avatar Play.',
};

// ISR Cache: Cache browse page for 1 hour (3600s) to keep Vercel within free limits
export const revalidate = 3600;

export default async function BrowsePage() {
    const games = await getGamesAdmin();
    return <BrowseClient initialGames={games} />;
}
