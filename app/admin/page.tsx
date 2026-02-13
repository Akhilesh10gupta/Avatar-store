'use client';

import { useEffect, useState } from 'react';
import { Game, Post } from '@/lib/firestore';
import { deleteGameAction, getUserGamesAction } from '@/app/actions/gameActions';
import { getUserPostsAction, deletePostAction } from '@/app/actions/communityActions';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import PostCard from '@/components/PostCard';
import { Plus, Pencil, Trash2, ExternalLink, Heart, MessageCircle, Gamepad2, Grid, LayoutGrid, LogOut, X, User as UserIcon } from 'lucide-react';
import Image from 'next/image';
import ProfileManager from '@/components/ProfileManager';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/components/AuthProvider';

import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';

export default function AdminDashboard() {
    const { user, loading: authLoading } = useAuth();
    const [games, setGames] = useState<Game[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'games' | 'posts'>('games');
    const [showSettings, setShowSettings] = useState(false);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);

    // Secure Deletion State
    const [gameToDelete, setGameToDelete] = useState<{ id: string, title: string } | null>(null);
    const [password, setPassword] = useState('');
    const [confirmName, setConfirmName] = useState('');
    const [isReauthenticating, setIsReauthenticating] = useState(false);

    useEffect(() => {
        const loadUserData = async () => {
            if (user) {
                try {
                    const [userGames, userPosts] = await Promise.all([
                        getUserGamesAction(user.uid),
                        getUserPostsAction(user.uid)
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
        setGameToDelete({ id, title });
        setPassword('');
        setConfirmName('');
    };

    const handleConfirmDelete = async () => {
        if (!user || !gameToDelete) return;

        if (confirmName !== gameToDelete.title) {
            alert("Game name does not match!");
            return;
        }

        setIsReauthenticating(true);
        try {
            const credential = EmailAuthProvider.credential(user.email!, password);
            await reauthenticateWithCredential(user, credential);

            // If auth successful, delete game
            await deleteGameAction(gameToDelete.id);
            setGames(prev => prev.filter(g => g.id !== gameToDelete.id));
            setGameToDelete(null); // Close modal
            alert("Game deleted successfully.");
        } catch (error: any) {
            console.error("Re-authentication failed", error);
            if (error.code === 'auth/wrong-password') {
                alert("Incorrect password.");
            } else {
                alert("Authentication failed. Please check your password and try again.");
            }
        } finally {
            setIsReauthenticating(false);
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
                        ← Back to Dashboard
                    </Button>
                </div>
                <div className="bg-card border border-border rounded-xl p-6">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <UserIcon className="w-5 h-5 text-primary" />
                        Profile Settings
                    </h2>
                    <ProfileManager />
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* CYBER/GAMING PROFILE HEADER */}
            <div className="relative overflow-hidden rounded-3xl bg-black/40 border border-white/10 p-4 md:p-10 mb-8 md:mb-12 backdrop-blur-md animate-in fade-in slide-in-from-top-4 group">
                {/* Grid Background Effect */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

                {/* Ambient Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-32 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />

                <div className="relative flex flex-col md:flex-row items-center gap-6 md:gap-12">

                    {/* CYBER CIRCLE AVATAR */}
                    <div className="relative shrink-0 group/avatar">
                        {/* Rotating Outer Tech Rings */}
                        <div className="absolute -inset-2 border border-primary/40 border-t-primary border-r-primary rounded-full animate-spin-slow pointer-events-none" style={{ animationDuration: '6s' }} />
                        <div className="absolute -inset-1 border border-white/20 rounded-full pointer-events-none" />

                        <div className="relative w-24 h-24 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-primary/50 box-content shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)] bg-zinc-900 z-10">
                            {user.photoURL ? (
                                <Image
                                    src={user.photoURL}
                                    alt={user.displayName || 'User'}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover/avatar:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-white">
                                    <span className="text-3xl md:text-5xl font-bold">{(user.displayName || '?').charAt(0).toUpperCase()}</span>
                                </div>
                            )}
                        </div>

                        {/* Status Badge */}
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 py-1 px-3 md:px-4 bg-primary text-white border border-primary/50 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(var(--primary-rgb),0.6)] z-20">
                            Creator
                        </div>
                    </div>

                    {/* INFO & STATS */}
                    <div className="flex-1 w-full flex flex-col items-center md:items-start text-center md:text-left">
                        <div className="mb-6 space-y-2">
                            <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/50 filter drop-shadow-lg">
                                {user.displayName || 'Anonymous User'}
                            </h1>
                            <p className="text-muted-foreground text-sm font-medium max-w-md mx-auto md:mx-0">
                                Welcome to your command center. Manage your games and community posts.
                            </p>
                        </div>

                        {/* HUD Stats Row */}
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-4 mb-8 w-full">
                            <div className="flex flex-col items-center justify-center min-w-[80px] md:min-w-[100px] p-2 md:p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-white/10 transition-all group/stat">
                                <span className="text-xl md:text-2xl font-bold text-white group-hover/stat:text-primary transition-colors">{games.length}</span>
                                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Games</span>
                            </div>
                            <div className="w-px h-10 bg-white/10 hidden md:block" />
                            <div className="flex flex-col items-center justify-center min-w-[80px] md:min-w-[100px] p-2 md:p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-pink-500/50 hover:bg-white/10 transition-all group/stat">
                                <span className="text-xl md:text-2xl font-bold text-white group-hover/stat:text-pink-500 transition-colors">{posts.length}</span>
                                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Posts</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full md:w-auto mt-2">
                            <Link href="/profile" className="w-full md:w-auto">
                                <Button variant="outline" className="w-full md:w-auto h-11 px-6 font-bold bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/30 rounded-xl whitespace-nowrap">
                                    <UserIcon className="w-4 h-4 mr-2" />
                                    View Profile
                                </Button>
                            </Link>
                            <div className="flex gap-3 w-full md:w-auto">
                                <Button className="flex-1 md:flex-none h-11 px-6 font-bold bg-primary text-white hover:bg-primary/90 rounded-xl shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)] hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.6)] transition-all whitespace-nowrap" onClick={() => setShowSettings(true)}>
                                    <Pencil className="w-4 h-4 mr-2" />
                                    Edit
                                </Button>
                                <Button variant="secondary" className="flex-1 md:flex-none h-11 px-6 font-bold bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/30 rounded-xl whitespace-nowrap" onClick={async () => {
                                    const { auth } = await import('@/lib/firebase');
                                    auth.signOut();
                                    window.location.href = '/login';
                                }}>
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Logout
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CYBER TABS */}
            <div className="sticky top-6 z-40 mb-8 flex justify-center md:justify-start pointer-events-none">
                <div className="flex items-center gap-1 p-1.5 bg-black/60 border border-white/10 rounded-2xl backdrop-blur-xl shadow-2xl shadow-black/50 pointer-events-auto">
                    <button
                        onClick={() => setActiveTab('games')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'games'
                            ? 'bg-primary text-white shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)] scale-105'
                            : 'text-muted-foreground hover:text-white hover:bg-white/10'
                            }`}
                    >
                        <Gamepad2 className="w-4 h-4" />
                        <span>Games</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('posts')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'posts'
                            ? 'bg-primary text-white shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)] scale-105'
                            : 'text-muted-foreground hover:text-white hover:bg-white/10'
                            }`}
                    >
                        <Grid className="w-4 h-4" />
                        <span>Posts</span>
                    </button>
                </div>
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

            {/* Secure Deletion Modal */}
            <AnimatePresence>
                {gameToDelete && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={() => setGameToDelete(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-[#0A0A0A] border border-red-500/30 w-full max-w-md p-6 rounded-xl shadow-2xl shadow-red-900/20"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center gap-3 text-red-500 mb-4">
                                <div className="p-2 bg-red-500/10 rounded-lg">
                                    <Trash2 className="w-6 h-6" />
                                </div>
                                <h2 className="text-xl font-bold">Delete Game?</h2>
                            </div>

                            <p className="text-muted-foreground text-sm mb-6">
                                This action cannot be undone. This will permanently delete
                                <span className="font-bold text-white"> "{gameToDelete.title}" </span>
                                and remove all associated data.
                            </p>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-muted-foreground uppercase mb-1">
                                        Type <span className="text-white select-all">{gameToDelete.title}</span> to confirm
                                    </label>
                                    <input
                                        type="text"
                                        value={confirmName}
                                        onChange={(e) => setConfirmName(e.target.value)}
                                        className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors"
                                        placeholder={gameToDelete.title}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-muted-foreground uppercase mb-1">
                                        Enter your password
                                    </label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500/50 transition-colors"
                                        placeholder="Current Password"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-8">
                                <Button
                                    variant="ghost"
                                    className="flex-1 hover:bg-zinc-800"
                                    onClick={() => setGameToDelete(null)}
                                    disabled={isReauthenticating}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="danger"
                                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={handleConfirmDelete}
                                    disabled={confirmName !== gameToDelete.title || !password || isReauthenticating}
                                >
                                    {isReauthenticating ? 'Verifying...' : 'Delete Permanently'}
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
