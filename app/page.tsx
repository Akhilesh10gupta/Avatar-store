import Hero from "@/components/Hero";
import { getGames } from "@/lib/firestore";
import { Game } from "@/lib/firestore";
import FeaturedGames from "@/components/FeaturedGames";
import TopRatedGames from "@/components/TopRatedGames";

// Dummy data for initial render if DB is empty
export const dynamic = 'force-dynamic';

const dummyGames: Game[] = [
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
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Space Voyager',
    description: 'Explore the galaxy in this epic space simulation.',
    coverImage: 'https://images.unsplash.com/photo-1614728853975-69c770c1652e?q=80&w=1974&auto=format&fit=crop',
    screenshots: [],
    genre: 'Simulation',
    releaseDate: '2024',
    developer: 'Star Systems',
    downloadLink: '#',
    platform: 'PC',
    icon: '',
    systemRequirements: { os: '', processor: '', memory: '', graphics: '', storage: '' },
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Ancient Legends',
    description: 'Battle mythical creatures in ancient Greece.',
    coverImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop',
    screenshots: [],
    genre: 'Action',
    releaseDate: '2023',
    developer: 'Mythos Games',
    downloadLink: '#',
    platform: 'PC',
    icon: '',
    systemRequirements: { os: '', processor: '', memory: '', graphics: '', storage: '' },
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    title: 'Speed Racer Pro',
    description: 'High octane racing on the streets.',
    coverImage: 'https://images.unsplash.com/photo-1511882150382-421056ac8d89?q=80&w=2074&auto=format&fit=crop',
    screenshots: [],
    genre: 'Racing',
    releaseDate: '2024',
    developer: 'Turbo Arts',
    downloadLink: '#',
    platform: 'PC',
    icon: '',
    systemRequirements: { os: '', processor: '', memory: '', graphics: '', storage: '' },
    createdAt: new Date().toISOString()
  }
];

export default async function Home() {
  // Try to fetch games from DB, fall back to dummy data
  let games: Game[] = [];
  try {
    games = await getGames();
  } catch (e) {
    console.log("Using dummy data as DB might be empty or not configured yet for server side");
  }

  const displayGames = games.length > 0 ? games : dummyGames;

  return (
    <div className="flex flex-col gap-12 pb-16">
      <Hero games={displayGames} />

      {/* Featured Games Section */}
      <FeaturedGames games={displayGames} />

      {/* Top Rated Games Section */}
      <TopRatedGames games={displayGames} />
    </div>
  );
}
