'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { getAllGamesAdmin, getSubscribers, Game } from '@/lib/firestore';
import { useRouter } from 'next/navigation';
import { Monitor, Smartphone, Download, Star, Users, ArrowUpRight, ShieldAlert, Mail } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// ALLOWED ADMIN EMAILS
const ADMIN_EMAILS = ['gakhilesh946@gmail.com'];

export default function SuperAdminPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);

    // Stats
    const [stats, setStats] = useState({
        totalGames: 0,
        totalDownloads: 0,
        totalSubscribers: 0,
        avgRating: 0
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
                const [gamesData, subscribersData] = await Promise.all([
                    getAllGamesAdmin(),
                    getSubscribers()
                ]);

                setGames(gamesData);

                // Calculate Stats
                const totalDl = gamesData.reduce((acc, g) => acc + (g.downloadCount || 0), 0);
                const avgR = gamesData.length > 0
                    ? gamesData.reduce((acc, g) => acc + (g.rating || 0), 0) / gamesData.length
                    : 0;

                setStats({
                    totalGames: gamesData.length,
                    totalDownloads: totalDl,
                    totalSubscribers: subscribersData.length,
                    avgRating: avgR
                });

            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (authLoading || loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading Dashboard...</div>;

    if (!user) return <div className="min-h-screen flex items-center justify-center text-white">Please log in.</div>;

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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <StatCard
                        label="Total Games"
                        value={stats.totalGames}
                        icon={Monitor}
                        color="text-blue-400"
                        bg="bg-blue-400/10"
                    />
                    <StatCard
                        label="Total Downloads"
                        value={stats.totalDownloads.toLocaleString()}
                        icon={Download}
                        color="text-emerald-400"
                        bg="bg-emerald-400/10"
                    />
                    <StatCard
                        label="Newsletter Subscribers"
                        value={stats.totalSubscribers.toLocaleString()}
                        subValue="Active Emails"
                        icon={Mail}
                        color="text-violet-400"
                        bg="bg-violet-400/10"
                    />
                    <StatCard
                        label="Average Rating"
                        value={stats.avgRating.toFixed(1)}
                        icon={Star}
                        color="text-yellow-400"
                        bg="bg-yellow-400/10"
                    />
                </div>

                {/* Games Table */}
                <div className="bg-card border border-white/10 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-white/10 flex justify-between items-center">
                        <h2 className="text-xl font-bold">All Published Games</h2>
                        <span className="text-sm text-muted-foreground">{games.length} titles found</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-white/5 text-muted-foreground">
                                <tr>
                                    <th className="p-4 font-medium uppercase tracking-wider">Game</th>
                                    <th className="p-4 font-medium uppercase tracking-wider">Platform</th>
                                    <th className="p-4 font-medium uppercase tracking-wider">Developer</th>
                                    <th className="p-4 font-medium uppercase tracking-wider">Downloads</th>
                                    <th className="p-4 font-medium uppercase tracking-wider">Rating</th>
                                    <th className="p-4 font-medium uppercase tracking-wider text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {games.map((game) => (
                                    <tr key={game.id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-white/10 relative overflow-hidden shrink-0">
                                                    {game.icon && <Image src={game.icon} alt="" fill className="object-cover" />}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-white">{game.title}</div>
                                                    <div className="text-xs text-muted-foreground">{new Date(game.createdAt || '').toLocaleDateString()}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 text-xs font-medium">
                                                {game.platform === 'Android' ? <Smartphone className="w-3 h-3" /> : <Monitor className="w-3 h-3" />}
                                                {game.platform}
                                            </span>
                                        </td>
                                        <td className="p-4 text-white/80">
                                            {game.developer}
                                            {/* Note: In a real app, you'd fetch the user email via game.userId if needed */}
                                        </td>
                                        <td className="p-4 font-mono text-emerald-400">
                                            {game.downloadCount || 0}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-1 text-yellow-400">
                                                <Star className="w-3 h-3 fill-current" />
                                                {game.rating?.toFixed(1) || '0.0'}
                                                <span className="text-muted-foreground text-xs ml-1">({game.ratingCount || 0})</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <Link href={`/game/${game.id}`} target="_blank" className="inline-flex items-center justify-center p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors">
                                                <ArrowUpRight className="w-4 h-4" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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
