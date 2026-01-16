'use client';

import { useEffect, useState } from 'react';
import { getGames, deleteGame, Game } from '@/lib/firestore';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { Plus, Pencil, Trash2, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import ProfileManager from '@/components/ProfileManager';

export default function AdminDashboard() {
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUserGames = async () => {
            const { auth } = await import('@/lib/firebase');
            // Wait for auth to initialize if needed, or check currentUser
            // A listener is safer for initial load
            const unsubscribe = auth.onAuthStateChanged(async (user) => {
                if (user) {
                    const data = await import('@/lib/firestore').then(mod => mod.getUserGames(user.uid));
                    setGames(data);
                } else {
                    // Handle unauthenticated state if necessary (middleware should handle this though)
                    setGames([]);
                }
                setLoading(false);
            });
            return unsubscribe;
        };

        const cleanup = loadUserGames();
        return () => { cleanup.then(unsub => unsub && unsub()); };
    }, []);

    const handleDelete = async (id: string, title: string) => {
        if (confirm(`Are you sure you want to delete "${title}"?`)) {
            await deleteGame(id);
            await deleteGame(id);
            // Re-fetch or filter locally
            setGames(prev => prev.filter(g => g.id !== id));
        }
    };

    if (loading) {
        return <div className="text-center py-20">Loading games...</div>;
    }

    return (
        <div>
            <ProfileManager />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pt-8 border-t border-border">
                <p className="text-muted-foreground text-sm md:text-base">Manage your game library, edit details, and add new titles.</p>
                <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                    <Button variant="outline" className="w-full md:w-auto" onClick={async () => {
                        if (confirm("This will assign ALL games without an owner to your account. Continue?")) {
                            setLoading(true);
                            try {
                                const { auth } = await import('@/lib/firebase');
                                const user = auth.currentUser;
                                if (user) {
                                    const { claimOrphanedGames } = await import('@/lib/firestore');
                                    const count = await claimOrphanedGames(user.uid);
                                    alert(`Successfully claimed ${count} legacy games!`);
                                    window.location.reload();
                                }
                            } catch (e) {
                                console.error(e);
                                alert("Error claiming games.");
                            } finally {
                                setLoading(false);
                            }
                        }
                    }}>
                        Claim Legacy Games
                    </Button>
                    <Link href="/admin/add" className="w-full md:w-auto">
                        <Button className="w-full md:w-auto">
                            <Plus className="w-4 h-4 mr-2" />
                            Add New Game
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-card rounded-xl border border-border shadow-sm overflow-hidden">
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
                                                <ExternalLink className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                        <Link href={`/admin/edit/${game.id}`}>
                                            <Button size="sm" variant="secondary">
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                        <Button size="sm" variant="danger" onClick={() => handleDelete(game.id!, game.title)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden grid gap-4">
                {games.map((game) => (
                    <div key={game.id} className="bg-card p-4 rounded-xl border border-border shadow-sm space-y-4">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="relative w-12 h-12 rounded overflow-hidden bg-secondary shrink-0">
                                    {game.icon ? (
                                        <Image src={game.icon} alt={game.title} fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xs">No Icon</div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold text-foreground line-clamp-1">{game.title}</h3>
                                    <div className="text-xs text-muted-foreground flex gap-2">
                                        <span className="bg-secondary px-2 py-0.5 rounded">{game.genre}</span>
                                        <span>{game.releaseDate}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/50">
                            <Link href={`/game/${game.id}`} target="_blank" className="flex-1">
                                <Button size="sm" variant="outline" className="w-full text-xs h-8">
                                    <ExternalLink className="w-3 h-3 mr-2" /> View
                                </Button>
                            </Link>
                            <Link href={`/admin/edit/${game.id}`} className="flex-1">
                                <Button size="sm" variant="secondary" className="w-full text-xs h-8">
                                    <Pencil className="w-3 h-3 mr-2" /> Edit
                                </Button>
                            </Link>
                            <Button size="sm" variant="danger" className="h-8 px-3" onClick={() => handleDelete(game.id!, game.title)}>
                                <Trash2 className="w-3 h-3" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {games.length === 0 && (
                <div className="p-8 text-center text-muted-foreground bg-card rounded-xl border border-border mt-4">
                    No games found. Click "Add New Game" to start.
                </div>
            )}
        </div>
    );
}
