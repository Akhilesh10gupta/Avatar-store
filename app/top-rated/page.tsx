'use client';

import { useEffect, useState, useMemo } from 'react';
import { getTopRatedGames, Game } from '@/lib/firestore';
import GameCard from '@/components/GameCard';
import GameLoader from '@/components/GameLoader';
import { Trophy, Star, Search, X, SearchX } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function TopRatedPage() {
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        const fetchGames = async () => {
            setLoading(true);
            try {
                const ratedGames = await getTopRatedGames();
                setGames(ratedGames);
            } catch (error) {
                console.error("Error fetching games:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchGames();
    }, []);

    const categories = useMemo(() => {
        const cats = new Set(games.map(g => g.genre).filter(Boolean));
        return ['All', ...Array.from(cats).sort()];
    }, [games]);

    const filteredGames = useMemo(() => {
        return games.filter(game => {
            const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                game.genre.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || game.genre === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [games, searchQuery, selectedCategory]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const clearSearch = () => {
        setSearchQuery('');
    };

    return (
        <div className="min-h-screen pt-24 pb-16 container mx-auto px-4">
            <div className="flex flex-col gap-8">
                {/* Header */}
                <div className="flex flex-col gap-4">
                    <Link href="/" className="text-muted-foreground hover:text-white transition-colors w-fit">
                        ← Back to Home
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold md:text-4xl flex items-center gap-3">
                            <Trophy className="text-yellow-500 w-6 h-6 md:w-8 md:h-8 fill-yellow-500" />
                            Top Rated Games
                        </h1>
                        <p className="text-muted-foreground mt-2 max-w-2xl">
                            The community has spoken. These are the highest-rated masterpieces
                            available on Avatar Play.
                        </p>
                    </div>
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

                    {/* Category Filter */}
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

                {/* Content */}
                {loading ? (
                    <div className="py-20">
                        <GameLoader text="Loading Top Rated..." />
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
        </div>
    );
}
