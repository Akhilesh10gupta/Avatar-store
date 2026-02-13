'use client';

import { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Game } from '@/lib/firestore';
import { fetchGamesAction } from '@/app/actions/gameActions';
import GameCard from '@/components/GameCard';
import GameLoader from '@/components/GameLoader';
import { Search, X, Filter, SearchX } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function BrowsePage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const urlQuery = searchParams.get('query')?.toLowerCase() || '';

    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(urlQuery);
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Fetch games once
    useEffect(() => {
        const fetchGames = async () => {
            setLoading(true);
            try {
                const allGames = await fetchGamesAction();
                setGames(allGames);
            } catch (error) {
                console.error("Error fetching games:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchGames();
    }, []);

    // Update local search state if URL changes (e.g. back button)
    useEffect(() => {
        setSearchQuery(urlQuery);
    }, [urlQuery]);

    // Derived state: Extract unique categories
    const categories = useMemo(() => {
        const cats = new Set(games.map(g => g.genre).filter(Boolean));
        return ['All', ...Array.from(cats).sort()];
    }, [games]);

    // Derived state: Filtered games
    const filteredGames = useMemo(() => {
        return games.filter(game => {
            const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                game.genre.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || game.genre === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [games, searchQuery, selectedCategory]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setSearchQuery(newValue);
        // Optional: Update URL without navigation to keep state in sync
        // router.replace(`/browse?query=${encodeURIComponent(newValue)}`, { scroll: false });
    };

    const clearSearch = () => {
        setSearchQuery('');
        router.replace('/browse', { scroll: false });
    };

    return (
        <div className="space-y-8 min-h-screen">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold md:text-4xl">Browse Games</h1>
                    <p className="text-muted-foreground">Explore our collection of the latest and greatest games.</p>
                </div>

                {/* Controls Section */}
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between sticky top-16 z-40 bg-background/95 backdrop-blur py-4 -mx-4 px-4 md:mx-0 md:px-0 border-b md:border-none border-border/40">

                    {/* Search Bar */}
                    <div className="relative w-full md:max-w-xs">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search titles, genres..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="pl-9 pr-9"
                        />
                        {searchQuery && (
                            <button onClick={clearSearch} className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground">
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Category Filter - Mobile Horizontal Scroll / Desktop Flex */}
                    <div className="w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                        <div className="flex items-center gap-2">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`
                                        px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all border
                                        ${selectedCategory === cat
                                            ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25'
                                            : 'bg-secondary/50 text-muted-foreground border-transparent hover:bg-secondary hover:text-foreground'
                                        }
                                    `}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="py-20">
                    <GameLoader text="Loading Games..." />
                </div>
            ) : filteredGames.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-in fade-in duration-500">
                    {filteredGames.map((game) => (
                        <GameCard key={game.id} game={game} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground text-center animate-in zoom-in-95 duration-300">
                    <div className="bg-secondary/50 p-4 rounded-full mb-4">
                        <SearchX className="w-8 h-8 opacity-50" />
                    </div>
                    <h3 className="text-lg font-semibold mb-1">No games found</h3>
                    <p className="text-sm max-w-xs">
                        We couldn't find any matches for "{searchQuery}"
                        {selectedCategory !== 'All' && ` in ${selectedCategory}`}.
                    </p>
                    <Button
                        variant="ghost"
                        onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                        className="mt-4 text-primary"
                    >
                        Clear all filters
                    </Button>
                </div>
            )}
        </div>
    );
}
