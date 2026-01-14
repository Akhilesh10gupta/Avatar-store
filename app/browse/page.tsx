'use client';

import { useEffect, useState, use } from 'react';
import { useSearchParams } from 'next/navigation';
import { getGames, Game } from '@/lib/firestore';
import GameCard from '@/components/GameCard';
import { Loader2, SearchX } from 'lucide-react';

export default function BrowsePage() {
    const searchParams = useSearchParams();
    const query = searchParams.get('query')?.toLowerCase() || '';

    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGames = async () => {
            setLoading(true);
            try {
                // Fetch all games and filter client-side for simplicity
                const allGames = await getGames();

                if (query) {
                    const filtered = allGames.filter(game =>
                        game.title.toLowerCase().includes(query) ||
                        game.genre.toLowerCase().includes(query)
                    );
                    setGames(filtered);
                } else {
                    setGames(allGames);
                }
            } catch (error) {
                console.error("Error fetching games:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGames();
    }, [query]);

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">
                {query ? `Search Results for "${query}"` : 'Browse All Games'}
            </h1>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : games.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {games.map((game) => (
                        <GameCard key={game.id} game={game} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                    <SearchX className="w-12 h-12 mb-4 opacity-50" />
                    <p className="text-lg">No games found fetching "{query}".</p>
                    <p className="text-sm">Try searching for a different title or genre.</p>
                </div>
            )}
        </div>
    );
}
