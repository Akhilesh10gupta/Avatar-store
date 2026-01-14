import Hero from "@/components/Hero";
import GameCard from "@/components/GameCard";
import { getGames } from "@/lib/firestore";
import { Game } from "@/lib/firestore";
import { Gamepad2 } from "lucide-react";

// Dummy data for initial render if DB is empty
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
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Gamepad2 className="text-primary" />
            Featured Games
          </h2>
          <a href="#" className="text-primary text-sm font-medium hover:underline">View All</a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>
    </div>
  );
}
