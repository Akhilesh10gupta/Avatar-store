import Hero from "@/components/Hero";
import { getGames, getTopRatedGames, getMostDownloadedGames, Game } from "@/lib/firestore";
import FeaturedGames from "@/components/FeaturedGames";
import TopRatedGames from "@/components/TopRatedGames";

// Dummy data for initial render if DB is empty
export const dynamic = 'force-dynamic';

const dummyGames: Game[] = [
  // ... (keep dummy data if needed, or just let it handle empty arrays)
  {
    id: '1',
    title: 'Cyber Odyssey 2077',
    description: 'A futuristic RPG set in a neon-lit metropolis.',
    coverImage: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=2070&auto=format&fit=crop',
    screenshots: [],
    genre: 'RPG',
    releaseDate: '2025',
    developer: 'CD Project Red',
    downloadLink: '#',
    platform: 'PC',
    icon: '',
    systemRequirements: { os: '', processor: '', memory: '', graphics: '', storage: '' },
    createdAt: new Date().toISOString(),
    downloadCount: 1250,
    rating: 4.8
  },
  // ...
];

export default async function Home() {
  // Try to fetch games from DB
  let games: Game[] = [];
  let popularGames: Game[] = [];

  try {
    const [latest, popular] = await Promise.all([
      getGames(),
      getMostDownloadedGames()
    ]);
    games = latest;
    popularGames = popular;
  } catch (e) {
    console.log("Using dummy data as DB might be empty or not configured yet for server side");
    // Fallback dummies
    games = dummyGames; // Treat dummies as "latest"
    popularGames = dummyGames; // And as "popular"
  }

  const displayGames = games.length > 0 ? games : dummyGames;
  const displayPopular = popularGames.length > 0 ? popularGames : dummyGames;

  return (
    <div className="flex flex-col gap-12 pb-16">
      <Hero latestGames={displayGames} popularGames={displayPopular} />

      {/* Featured Games Section */}
      <FeaturedGames games={displayGames} />

      {/* Top Rated Games Section */}
      <TopRatedGames games={displayPopular} />
    </div>
  );
}
