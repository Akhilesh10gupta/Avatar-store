'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import {
    getAllGamesAdminAction,
    getContactMessagesAction,
    getSubscribersAction,
    getAllUsersAction
} from '@/app/actions/adminActions';
import { deleteGameAction } from '@/app/actions/gameActions';
import { deletePostAction, getPostsAction } from '@/app/actions/communityActions';
import { Game, ContactMessage, UserProfile, Post } from '@/lib/firestore';
import { useRouter } from 'next/navigation';
import { Monitor, Smartphone, Download, Star, Users, ArrowUpRight, ShieldAlert, Mail, User, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

// ALLOWED ADMIN EMAILS
const ADMIN_EMAILS = ['gakhilesh946@gmail.com'];

export default function SuperAdminPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [games, setGames] = useState<any[]>([]);
    const [subscribers, setSubscribers] = useState<any[]>([]);
    const [messages, setMessages] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Pagination State
    const [activeTab, setActiveTab] = useState<'games' | 'subscribers' | 'inbox' | 'users' | 'posts'>('games');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Stats
    const [stats, setStats] = useState({
        totalGames: 0,
        totalDownloads: 0,
        totalSubscribers: 0,
        avgRating: 0,
        totalUsers: 0
    });

    useEffect(() => {
        if (!authLoading) {
            if (!user || (user.email && !ADMIN_EMAILS.includes(user.email))) {
                // Redirect unauthorized users
                router.push('/');
            }
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        const load = async () => {
            try {
                // Parallel fetch
                const [gamesData, subscribersData, messagesData, usersData, postsData] = await Promise.all([
                    getAllGamesAdminAction(),
                    getSubscribersAction(),
                    getContactMessagesAction(),
                    getAllUsersAction(),
                    getPostsAction()
                ]);

                setGames(gamesData);
                setSubscribers(subscribersData);
                setMessages(messagesData);
                setUsers(usersData);
                setPosts(postsData);

                // Calculate Stats
                const totalDl = gamesData.reduce((acc: number, g: any) => acc + (g.downloadCount || 0), 0);
                const avgR = gamesData.length > 0
                    ? gamesData.reduce((acc: number, g: any) => acc + (g.rating || 0), 0) / gamesData.length
                    : 0;

                setStats({
                    totalGames: gamesData.length,
                    totalDownloads: totalDl,
                    totalSubscribers: subscribersData.length,
                    avgRating: avgR,
                    totalUsers: usersData.length
                });

            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    // Reset page on tab change
    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab]);

    const handleDeleteGame = async (id: string, title: string) => {
        if (confirm(`SUPER ADMIN ACTION:\nAre you sure you want to PERMANENTLY DELETE the game "${title}"? This cannot be undone.`)) {
            try {
                await deleteGameAction(id);
                setGames(prev => prev.filter(g => g.id !== id));
                alert("Game deleted successfully.");
            } catch (e) {
                console.error(e);
                alert("Failed to delete game.");
            }
        }
    };

    const handleDeletePost = async (id: string) => {
        if (confirm("SUPER ADMIN ACTION:\nAre you sure you want to delete this post?")) {
            try {
                await deletePostAction(id);
                setPosts(prev => prev.filter(p => p.id !== id));
                alert("Post deleted successfully.");
            } catch (e) {
                console.error(e);
                alert("Failed to delete post.");
            }
        }
    };

    if (authLoading || loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading Dashboard...</div>;

    if (!user) return <div className="min-h-screen flex items-center justify-center text-white">Please log in.</div>;

    // Helper for pagination
    const getPaginatedData = (data: any[]) => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return data.slice(start, end);
    };

    return (
        <main className="min-h-screen bg-[#050505] pt-24 pb-12 px-4 text-white">
            <div className="container mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-sm font-medium border border-red-500/20 mb-2">
                            <ShieldAlert className="w-4 h-4" />
                            Super Admin Mode
                        </div>
                        <h1 className="text-3xl font-bold">Platform Overview</h1>
                        <p className="text-muted-foreground">Welcome back, {user.displayName || 'Admin'}. Here is what's happening today.</p>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
                    <StatCard label="Total Games" value={stats.totalGames} icon={Monitor} color="text-blue-400" bg="bg-blue-400/10" />
                    <StatCard label="Total Downloads" value={stats.totalDownloads.toLocaleString()} icon={Download} color="text-emerald-400" bg="bg-emerald-400/10" />
                    <StatCard label="Subscribers" value={stats.totalSubscribers.toLocaleString()} icon={Mail} color="text-violet-400" bg="bg-violet-400/10" />
                    <StatCard label="Reg. Users" value={stats.totalUsers.toLocaleString()} icon={Users} color="text-pink-400" bg="bg-pink-400/10" />
                    <StatCard label="Avg Rating" value={stats.avgRating.toFixed(1)} icon={Star} color="text-yellow-400" bg="bg-yellow-400/10" />
                </div>

                {/* Tab Navigation */}
                <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-1 overflow-x-auto">
                    {['games', 'users', 'posts', 'subscribers', 'inbox'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors capitalize ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-white'
                                }`}
                        >
                            {tab}
                            <span className="ml-2 text-xs bg-white/10 px-2 py-0.5 rounded-full">
                                {tab === 'games' ? games.length :
                                    tab === 'users' ? users.length :
                                        tab === 'posts' ? posts.length :
                                            tab === 'subscribers' ? subscribers.length :
                                                messages.length}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="bg-card border border-white/10 rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4">

                    {/* Header */}
                    <div className="p-6 border-b border-white/10 flex justify-between items-center">
                        <h2 className="text-xl font-bold capitalize">{activeTab} List</h2>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground">
                                Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage,
                                    activeTab === 'games' ? games.length :
                                        activeTab === 'users' ? users.length :
                                            activeTab === 'subscribers' ? subscribers.length :
                                                activeTab === 'posts' ? posts.length : messages.length
                                )} of {
                                    activeTab === 'games' ? games.length :
                                        activeTab === 'users' ? users.length :
                                            activeTab === 'subscribers' ? subscribers.length :
                                                activeTab === 'posts' ? posts.length : messages.length
                                }
                            </span>
                        </div>
                    </div>

                    {/* Table Container */}
                    <div className="overflow-x-auto min-h-[300px]">

                        {/* GAMES TABLE */}
                        {activeTab === 'games' && (
                            <table className="w-full text-left text-sm">
                                <thead className="bg-white/5 text-muted-foreground">
                                    <tr>
                                        <th className="p-4 uppercase">Game</th>
                                        <th className="p-4 uppercase">Platform</th>
                                        <th className="p-4 uppercase">Dev</th>
                                        <th className="p-4 uppercase">Downloads</th>
                                        <th className="p-4 uppercase">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {getPaginatedData(games).map((game) => (
                                        <tr key={game.id} className="hover:bg-white/5">
                                            <td className="p-4 font-semibold">{game.title}</td>
                                            <td className="p-4">{game.platform}</td>
                                            <td className="p-4 text-white/70">{game.developer}</td>
                                            <td className="p-4 text-emerald-400 font-mono">{game.downloadCount}</td>
                                            <td className="p-4 flex gap-2">
                                                <Link href={`/game/${game.id}`} target="_blank">
                                                    <Button size="sm" variant="ghost">
                                                        <ArrowUpRight className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                                <Button size="sm" variant="danger" onClick={() => handleDeleteGame(game.id!, game.title)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                    {games.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                                No games found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}

                        {/* USERS TABLE */}
                        {activeTab === 'users' && (
                            <table className="w-full text-left text-sm">
                                <thead className="bg-white/5 text-muted-foreground">
                                    <tr>
                                        <th className="p-4 uppercase">User</th>
                                        <th className="p-4 uppercase">Email</th>
                                        <th className="p-4 uppercase">Joined</th>
                                        <th className="p-4 uppercase">Last Login</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {getPaginatedData(users).map((u) => (
                                        <tr key={u.id} className="hover:bg-white/5">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    {u.photoURL ? (
                                                        <Image src={u.photoURL} width={32} height={32} alt="" className="rounded-full" />
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><User className="w-4 h-4" /></div>
                                                    )}
                                                    <span className="font-medium">{u.displayName || 'No Name'}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 font-mono text-white/70">{u.email}</td>
                                            <td className="p-4 text-muted-foreground">{new Date(u.createdAt || Date.now()).toLocaleDateString()}</td>
                                            <td className="p-4 text-muted-foreground">{u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : '-'}</td>
                                        </tr>
                                    ))}
                                    {users.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="p-8 text-center text-muted-foreground">
                                                No registered users found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}

                        {/* POSTS TABLE */}
                        {activeTab === 'posts' && (
                            <table className="w-full text-left text-sm">
                                <thead className="bg-white/5 text-muted-foreground">
                                    <tr>
                                        <th className="p-4 uppercase">Post / Caption</th>
                                        <th className="p-4 uppercase">Author</th>
                                        <th className="p-4 uppercase">Stats</th>
                                        <th className="p-4 uppercase">Posted</th>
                                        <th className="p-4 uppercase">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {getPaginatedData(posts).map((post) => (
                                        <tr key={post.id} className="hover:bg-white/5">
                                            <td className="p-4 max-w-xs">
                                                <div className="flex gap-3">
                                                    {post.imageUrl && (
                                                        <div className="relative w-12 h-12 rounded overflow-hidden bg-white/5 shrink-0">
                                                            <Image src={post.imageUrl} alt="" fill className="object-cover" />
                                                        </div>
                                                    )}
                                                    <div className="line-clamp-2 text-white/80">{post.content}</div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">{post.userName}</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex gap-4 text-xs text-muted-foreground">
                                                    <span>❤️ {(post.likes || []).length}</span>
                                                    <span>💬 {post.commentCount || 0}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-muted-foreground">{new Date(post.createdAt).toLocaleDateString()}</td>
                                            <td className="p-4">
                                                <Button size="sm" variant="danger" onClick={() => handleDeletePost(post.id!)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                    {posts.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                                No posts found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}

                        {/* SUBSCRIBERS TABLE */}
                        {activeTab === 'subscribers' && (
                            <table className="w-full text-left text-sm">
                                <thead className="bg-white/5 text-muted-foreground">
                                    <tr>
                                        <th className="p-4 uppercase">Email</th>
                                        <th className="p-4 uppercase text-right">Joined</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {getPaginatedData(subscribers).map((s) => (
                                        <tr key={s.id} className="hover:bg-white/5">
                                            <td className="p-4 font-mono">{s.email}</td>
                                            <td className="p-4 text-right text-muted-foreground">{new Date(s.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                    {subscribers.length === 0 && (
                                        <tr>
                                            <td colSpan={2} className="p-8 text-center text-muted-foreground">
                                                No subscribers found yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}

                        {/* INBOX TABLE */}
                        {activeTab === 'inbox' && (
                            <table className="w-full text-left text-sm">
                                <thead className="bg-white/5 text-muted-foreground">
                                    <tr>
                                        <th className="p-4 uppercase">From</th>
                                        <th className="p-4 uppercase">Subject</th>
                                        <th className="p-4 uppercase">Message</th>
                                        <th className="p-4 uppercase">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {getPaginatedData(messages).map((m) => (
                                        <tr key={m.id} className="hover:bg-white/5">
                                            <td className="p-4">
                                                <div className="font-medium">{m.name}</div>
                                                <div className="text-xs text-muted-foreground">{m.email}</div>
                                            </td>
                                            <td className="p-4">{m.subject}</td>
                                            <td className="p-4 text-white/70 truncate max-w-xs">{m.message}</td>
                                            <td className="p-4 text-muted-foreground text-xs">{new Date(m.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                    {messages.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="p-8 text-center text-muted-foreground">
                                                No support messages yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* Pagination Controls */}
                    <div className="p-4 border-t border-white/10 flex items-center justify-between">
                        <Button
                            variant="outline"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        >
                            Previous
                        </Button>
                        <span className="text-sm text-muted-foreground">
                            Page {currentPage} of {Math.ceil(
                                (activeTab === 'games' ? games.length :
                                    activeTab === 'users' ? users.length :
                                        activeTab === 'subscribers' ? subscribers.length :
                                            messages.length) / itemsPerPage
                            ) || 1}
                        </span>
                        <Button
                            variant="outline"
                            disabled={currentPage * itemsPerPage >= (
                                activeTab === 'games' ? games.length :
                                    activeTab === 'users' ? users.length :
                                        activeTab === 'subscribers' ? subscribers.length :
                                            messages.length
                            )}
                            onClick={() => setCurrentPage(p => p + 1)}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </main>
    );
}

function StatCard({ label, value, subValue, icon: Icon, color, bg }: any) {
    return (
        <div className="bg-card border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-white/20 transition-colors">
            <div className={`absolute top-4 right-4 p-3 rounded-xl ${bg} ${color}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div className="space-y-1 relative z-10">
                <p className="text-muted-foreground text-sm font-medium">{label}</p>
                <div className="text-3xl font-bold text-white tracking-tight">{value}</div>
                {subValue && <p className="text-xs text-white/40">{subValue}</p>}
            </div>
        </div>
    );
}
