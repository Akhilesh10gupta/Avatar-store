'use client';

import { useEffect, useState } from 'react';
import { getGames, deleteGame, getUserGames, getUserPosts, Game, Post } from '@/lib/firestore';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import PostCard from '@/components/PostCard';
import { Plus, Pencil, Trash2, ExternalLink, Heart, MessageCircle, Gamepad2, Grid, LayoutGrid, LogOut, X } from 'lucide-react';
import Image from 'next/image';
import ProfileManager from '@/components/ProfileManager';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/components/AuthProvider';

export default function AdminDashboard() {
    const { user, loading: authLoading } = useAuth();
    const [games, setGames] = useState<Game[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'games' | 'posts'>('games');
    const [showSettings, setShowSettings] = useState(false);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);

    useEffect(() => {
        const loadUserData = async () => {
            if (user) {
                try {
                    const [userGames, userPosts] = await Promise.all([
                        getUserGames(user.uid),
                        getUserPosts(user.uid)
                    ]);
                    setGames(userGames);
                    setPosts(userPosts);
                } catch (e) {
                    console.error("Error loading user data:", e);
                } finally {
                    setLoading(false);
                }
            } else if (!authLoading) {
                // Not logged in
                setLoading(false);
            }
        };

        if (!authLoading) {
            loadUserData();
        }
    }, [user, authLoading]);

    const handleDelete = async (id: string, title: string) => {
        if (confirm(`Are you sure you want to delete "${title}"?`)) {
            await deleteGame(id);
            setGames(prev => prev.filter(g => g.id !== id));
        }
    };

    if (authLoading || (loading && user)) {
        return <div className="text-center py-20 text-muted-foreground">Loading dashboard...</div>;
    }

    if (!user) {
        return <div className="text-center py-20">Please log in to view your dashboard.</div>;
    }

    if (showSettings) {
        return (
            <div>
                <div className="mb-6">
                    <Button variant="ghost" onClick={() => setShowSettings(false)} className="pl-0 hover:bg-transparent">
                        ← Back to Profile
                    </Button>
                </div>
                <ProfileManager />
            </div>
        );
    }

    return (
        <div>
            {/* INSTAGRAM-STYLE PROFILE HEADER */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 mb-8 md:mb-12 animate-in fade-in slide-in-from-top-4">

                {/* Mobile Layout: Row with Avatar + Stats */}
                <div className="flex items-center gap-6 w-full md:hidden px-2">
                    {/* Avatar */}
                    <div className="relative w-24 h-24 rounded-full p-[2px] bg-gradient-to-tr from-primary to-purple-500 shrink-0">
                        <div className="w-full h-full rounded-full overflow-hidden border-4 border-black bg-zinc-800 relative">
                            {user.photoURL ? (
                                <Image src={user.photoURL} alt={user.displayName || 'User'} fill className="object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-white">
                                    <span className="text-3xl font-bold">{(user.displayName || '?').charAt(0).toUpperCase()}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Stats (Right side on mobile) */}
                    <div className="flex-1 flex justify-around text-center">
                        <div className="flex flex-col items-center">
                            <span className="font-bold text-xl text-white">{games.length}</span>
                            <span className="text-xs text-muted-foreground uppercase tracking-wide">games</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="font-bold text-xl text-white">{posts.length}</span>
                            <span className="text-xs text-muted-foreground uppercase tracking-wide">posts</span>
                        </div>
                    </div>
                </div>

                {/* Desktop Avatar (Hidden on mobile) */}
                <div className="hidden md:block relative w-32 h-32 rounded-full p-[3px] bg-gradient-to-tr from-primary to-purple-500 shrink-0">
                    <div className="w-full h-full rounded-full overflow-hidden border-4 border-black bg-zinc-800 relative">
                        {user.photoURL ? (
                            <Image src={user.photoURL} alt={user.displayName || 'User'} fill className="object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-muted-foreground">
                                <span className="text-4xl font-bold">{(user.displayName || '?').charAt(0).toUpperCase()}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Info Section */}
                <div className="flex-1 flex flex-col gap-4 w-full">

                    {/* Name & Buttons Row */}
                    <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 px-2 md:px-0">
                        <h1 className="text-xl md:text-2xl font-bold">{user.displayName || 'Anonymous User'}</h1>

                        <div className="flex gap-3 w-full md:w-auto mt-1 md:mt-0">
                            <Button variant="secondary" size="sm" className="flex-1 md:flex-none h-9 text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 border border-white/10" onClick={() => setShowSettings(true)}>
                                <Pencil className="w-3 h-3 mr-1" />
                                Edit Profile
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1 md:flex-none h-9 text-xs font-semibold border-white/10 hover:bg-white/5" onClick={async () => {
                                const { auth } = await import('@/lib/firebase');
                                auth.signOut();
                                window.location.href = '/login';
                            }}>
                                <LogOut className="w-3 h-3 mr-1" />
                                Logout
                            </Button>
                        </div>
                    </div>

                    {/* Desktop Stats (Hidden on mobile) */}
                    <div className="hidden md:flex items-center gap-8 text-sm">
                        <div>
                            <span className="font-bold text-white mr-1">{games.length}</span>
                            <span className="text-muted-foreground">games</span>
                        </div>
                        <div>
                            <span className="font-bold text-white mr-1">{posts.length}</span>
                            <span className="text-muted-foreground">posts</span>
                        </div>
                    </div>

                    {/* Bio */}
                    <p className="text-muted-foreground text-sm max-w-md px-2 md:px-0 leading-relaxed">
                        Welcome to your creator hub.
                    </p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center justify-around md:justify-start md:gap-12 border-t border-border sticky top-0 bg-[#050505]/95 backdrop-blur-xl z-20 shadow-2xl shadow-black/50">
                <button
                    onClick={() => setActiveTab('games')}
                    className={`flex-1 md:flex-none py-3 md:py-4 text-xs md:text-sm font-medium transition-all flex items-center justify-center gap-2 uppercase tracking-wider ${activeTab === 'games'
                        ? 'text-white border-b-2 border-white'
                        : 'text-muted-foreground hover:text-white border-b-2 border-transparent'
                        }`}
                >
                    <Gamepad2 className="w-4 h-4" />
                    <span className="hidden md:inline">Games</span>
                </button>
                <button
                    onClick={() => setActiveTab('posts')}
                    className={`flex-1 md:flex-none py-3 md:py-4 text-xs md:text-sm font-medium transition-all flex items-center justify-center gap-2 uppercase tracking-wider ${activeTab === 'posts'
                        ? 'text-white border-b-2 border-white'
                        : 'text-muted-foreground hover:text-white border-b-2 border-transparent'
                        }`}
                >
                    <Grid className="w-4 h-4" />
                    <span className="hidden md:inline">Posts</span>
                </button>
            </div>

            {/* TAB: GAMES */}
            {activeTab === 'games' && (
                <div className="mt-8 animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div className="text-sm text-muted-foreground text-center md:text-left hidden md:block">Manage your published games.</div>
                        <div className="flex flex-col md:flex-row items-center gap-2 w-full md:w-auto">
                            <Button variant="outline" size="sm" className="w-full md:w-auto" onClick={async () => {
                                if (confirm("This will link ALL previous games (without an owner) to your account. Continue?")) {
                                    setLoading(true);
                                    try {
                                        const { claimOrphanedGames } = await import('@/lib/firestore');
                                        const count = await claimOrphanedGames(user.uid);
                                        alert(`Successfully claimed ${count} legacy games!`);
                                        window.location.reload();
                                    } catch (e) {
                                        console.error(e);
                                    } finally {
                                        setLoading(false);
                                    }
                                }
                            }}>
                                Claim Legacy Games
                            </Button>
                            <Link href="/admin/add" className="w-full md:w-auto">
                                <Button size="sm" className="w-full">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add New Game
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Games Table (Desktop) */}
                    <div className="hidden md:block bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-secondary/50 border-b border-border">
                                <tr>
                                    <th className="p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">Game</th>
                                    <th className="p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">Genre</th>
                                    <th className="p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">Downloads</th>
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
                                        <td className="p-4 text-emerald-400 font-mono">{game.downloadCount || 0}</td>
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

                    {/* Games Cards (Mobile) */}
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
                                            <div className="text-xs text-muted-foreground">{game.genre}</div>
                                        </div>
                                    </div>
                                    <span className="text-emerald-400 font-mono text-sm">{game.downloadCount || 0} DLs</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Link href={`/admin/edit/${game.id}`} className="flex-1">
                                        <Button size="sm" variant="secondary" className="w-full">Edit</Button>
                                    </Link>
                                    <Button size="sm" variant="danger" onClick={() => handleDelete(game.id!, game.title)}>Delete</Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {games.length === 0 && (
                        <div className="p-12 text-center border-2 border-dashed border-border rounded-xl mt-4">
                            <Gamepad2 className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
                            <p className="text-muted-foreground">You haven't uploaded any games yet.</p>
                            <Link href="/admin/add" className="inline-block mt-4">
                                <Button>Upload Your First Game</Button>
                            </Link>
                        </div>
                    )}
                </div>
            )}


            {/* TAB: POSTS */}
            {activeTab === 'posts' && (
                <div className="mt-8 animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div className="text-sm text-muted-foreground text-center md:text-left hidden md:block">Your shared moments with the community.</div>
                        <Link href="/community" className="w-full md:w-auto">
                            <Button size="sm" className="w-full">
                                <Plus className="w-4 h-4 mr-2" />
                                New Post
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-1 md:gap-4">
                        {posts.map((post) => (
                            <div
                                key={post.id}
                                onClick={() => setSelectedPost(post)}
                                className="group relative bg-card border border-border rounded-lg md:rounded-xl overflow-hidden aspect-square hover:border-primary/50 transition-all cursor-pointer"
                            >
                                {/* Image / Content Preview */}
                                {post.imageUrl ? (
                                    <Image src={post.imageUrl} alt="post" fill className="object-cover transition-transform group-hover:scale-105" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-secondary/30 p-4 text-center text-sm text-muted-foreground">
                                        {post.content.slice(0, 100)}...
                                    </div>
                                )}

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-4">
                                    <div className="flex items-center gap-6 font-bold text-lg">
                                        <div className="flex items-center gap-2">
                                            <Heart className="w-6 h-6 fill-white" />
                                            {(post.likes || []).length}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MessageCircle className="w-6 h-6 fill-white" />
                                            {post.commentCount || 0}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {posts.length === 0 && (
                        <div className="p-12 text-center border-2 border-dashed border-border rounded-xl mt-4">
                            <Grid className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
                            <p className="text-muted-foreground">No posts yet. Share something with the community!</p>
                            <Link href="/community" className="inline-block mt-4">
                                <Button variant="outline">Go to Community</Button>
                            </Link>
                        </div>
                    )}
                </div>
            )}

            {/* Post Detail Modal */}
            <AnimatePresence>
                {selectedPost && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={() => setSelectedPost(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-background border border-white/10 shadow-2xl no-scrollbar"
                            onClick={e => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedPost(null)}
                                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white z-50 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="p-0">
                                <PostCard post={selectedPost} />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
