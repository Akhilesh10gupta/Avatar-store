import Hero from "@/components/Hero";
import { getGames, getTopRatedGames, getMostDownloadedGames, Game } from "@/lib/firestore";
import { getGamesAdmin, getMostDownloadedGamesAdmin } from "@/lib/firestore-admin";
import FeaturedGames from "@/components/FeaturedGames";
import TopRatedGames from "@/components/TopRatedGames";
import AdBanner from "@/components/AdBanner";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Avatar Play - Premium Game Distribution Platform",
  description: "Your ultimate destination for curated games, avatars, and gaming community. Discover, download, and play the future of gaming today.",
};

// ISR Cache: Cache homepage for 1 hour (3600s) to keep Vercel within free limits
export const revalidate = 3600;

export default async function Home() {
  // Try to fetch games from DB
  let games: Game[] = [];
  let popularGames: Game[] = [];

  try {
    const [latest, popular] = await Promise.all([
      getGamesAdmin(),
      getMostDownloadedGamesAdmin()
    ]);
    games = latest;
    popularGames = popular;
  } catch (e) {
    console.error("Error loading games from DB on homepage:", e);
  }

  const displayGames = games;
  const displayPopular = popularGames.length > 0 ? popularGames : games;

  return (
    <div className="flex flex-col gap-12 pb-16">
      <Hero latestGames={displayGames} popularGames={displayPopular} />

      {/* Top Banner Ad */}
      <div className="container mx-auto px-4 max-w-5xl">
        <AdBanner />
      </div>

      {/* Featured Games Section */}
      <FeaturedGames games={displayGames} />

      {/* Top Rated Games Section */}
      <TopRatedGames games={displayPopular} />
    </div>
  );
}
