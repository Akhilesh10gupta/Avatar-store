import { getGamesAdmin } from "@/lib/firestore-admin";
import NewArrivalsClient from "@/components/NewArrivalsClient";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'New Arrivals',
    description: 'Discover the newest games recently published on Avatar Play.',
};

// ISR Cache: Revalidate every 5 minutes
export const revalidate = 300;

export default async function NewArrivalsPage() {
    const games = await getGamesAdmin();
    return <NewArrivalsClient initialGames={games} />;
}
