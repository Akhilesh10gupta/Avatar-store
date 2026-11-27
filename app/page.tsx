import Hero from "@/components/Hero";
import { getGames, getTopRatedGames, getMostDownloadedGames, Game } from "@/lib/firestore";
import { getGamesAdmin, getMostDownloadedGamesAdmin } from "@/lib/firestore-admin";
import FeaturedGames from "@/components/FeaturedGames";
import TopRatedGames from "@/components/TopRatedGames";
import AdsterraBanner from "@/components/AdsterraBanner";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Avatar Play - Play & Download Viral Indian Meme Games & Desi APKs",
  description: "Play and download the funniest viral Indian meme games for Android & PC! Featuring Sheru Bhai, Flying Thala, Big B's Bouncing Journey, Chappal Run 3D, and more free desi games on Avatar Play.",
  keywords: [
    "Indian meme games",
    "viral games",
    "desi games",
    "Sheru Bhai game",
    "Flying Thala",
    "free android games",
    "free browser games",
    "Avatar Play"
  ],
  openGraph: {
    title: "Avatar Play - Play & Download Viral Indian Meme Games & Desi APKs",
    description: "Play and download the funniest viral Indian meme games for Android & PC! Featuring Sheru Bhai, Flying Thala, and more free desi games.",
    url: "https://avatarplay.in",
    siteName: "Avatar Play",
    locale: "en_IN",
    type: "website",
  },
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

  // Exclude standalone / dedicated 3D games (like CRT City and Midnight Underground) from the public homepage
  const isHomeVisible = (g: Game) => !g.hiddenFromHome && g.id !== 'crt-city-80s-open-world' && g.id !== 'midnight-neon-underground-3d';
  const displayGames = games.filter(isHomeVisible);
  const displayPopular = (popularGames.length > 0 ? popularGames : games).filter(isHomeVisible);

  return (
    <div className="flex flex-col gap-12 pb-16">
      {/* Semantic SEO Heading for search engines */}
      <h1 className="sr-only">Avatar Play - India's #1 Hub for Viral Meme Games & Desi APKs</h1>
      <Hero latestGames={displayGames} popularGames={displayPopular} />

      {/* Top Banner Ad */}
      <div className="container mx-auto px-4 max-w-5xl">
        <AdsterraBanner />
      </div>

      {/* Featured Games Section */}
      <FeaturedGames games={displayGames} />

      {/* Top Rated Games Section */}
      <TopRatedGames games={displayPopular} />
    </div>
  );
}
