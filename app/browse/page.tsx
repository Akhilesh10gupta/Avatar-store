import { getGamesAdmin } from "@/lib/firestore-admin";
import BrowseClient from "@/components/BrowseClient";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Browse Games',
    description: 'Explore the full collection of indie and premium games on Avatar Play.',
};

export const dynamic = 'force-dynamic';

export default async function BrowsePage() {
    const games = await getGamesAdmin();
    return <BrowseClient initialGames={games} />;
}
