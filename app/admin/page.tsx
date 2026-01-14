'use client';

import { useEffect, useState } from 'react';
import { getGames, deleteGame, Game } from '@/lib/firestore';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { Plus, Pencil, Trash2, ExternalLink } from 'lucide-react';
import Image from 'next/image';

export default function AdminDashboard() {
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchGames = async () => {
        setLoading(true);
        const data = await getGames();
        setGames(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchGames();
    }, []);

    const handleDelete = async (id: string, title: string) => {
        if (confirm(`Are you sure you want to delete "${title}"?`)) {
            await deleteGame(id);
            fetchGames();
        }
    };

    if (loading) {
        return <div className="text-center py-20">Loading games...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <p className="text-muted-foreground">Manage your game library, edit details, and add new titles.</p>
                <Link href="/admin/add">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Game
                    </Button>
                </Link>
            </div>

            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-secondary/50 border-b border-border">
                        <tr>
                            <th className="p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">Game</th>
                            <th className="p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">Genre</th>
                            <th className="p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">Release</th>
                            <th className="p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {games.map((game) => (
                            <tr key={game.id} className="hover:bg-secondary/20 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="relative w-10 h-10 rounded overflow-hidden bg-secondary">
                                            {game.icon ? (
                                                <Image src={game.icon} alt={game.title} fill className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xs">No Icon</div>
                                            )}
                                        </div>
                                        <div className="font-medium text-foreground">{game.title}</div>
                                    </div>
                                </td>
                                <td className="p-4 text-muted-foreground">{game.genre}</td>
                                <td className="p-4 text-muted-foreground">{game.releaseDate}</td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link href={`/game/${game.id}`} target="_blank">
                                            <Button size="sm" variant="ghost" title="View Page">
                                                <ExternalLink className="w-3 h-3" />
                                            </Button>
                                        </Link>
                                        <Link href={`/admin/edit/${game.id}`}>
                                            <Button size="sm" variant="secondary">
                                                <Pencil className="w-3 h-3" />
                                            </Button>
                                        </Link>
                                        <Button size="sm" variant="danger" onClick={() => handleDelete(game.id!, game.title)}>
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {games.length === 0 && (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-muted-foreground">
                                    No games found. Click "Add New Game" to start.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
