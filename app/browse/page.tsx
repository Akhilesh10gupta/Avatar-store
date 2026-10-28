import { getGamesAdmin } from "@/lib/firestore-admin";
import BrowseClient from "@/components/BrowseClient";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Browse Games',
    description: 'Explore the full collection of indie and premium games on Avatar Play.',
};

// ISR Cache: Revalidate every 5 minutes
export const revalidate = 300;

export default async function BrowsePage() {
    const games = await getGamesAdmin();
    return <BrowseClient initialGames={games} />;
}
