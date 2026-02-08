'use client';

import { ProfileLoading } from '@/components/profile/ProfileLoading';

import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { getLevel, getNextLevel, getProgressToNextLevel, BADGES } from '@/lib/gamification';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import Image from 'next/image';
import { Monitor, Trophy, Shield, LayoutDashboard, Settings, Gamepad2, User as UserIcon, MessageSquare, Rocket, PenTool, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { HolographicAvatar } from '@/components/profile/HolographicAvatar';
import { ParticleBackground } from '@/components/profile/ParticleBackground';

// ... imports remain same

export default function ProfilePage() {
    const { user, loading } = useAuth();
    const [userProfile, setUserProfile] = useState<any>(null);
    const [dataLoading, setDataLoading] = useState(true);
    const [visibleActivitiesCount, setVisibleActivitiesCount] = useState(3);

    // Memoize activities to prevent re-sorting on every render
    const activities = useMemo(() => {
        return [
            ...(userProfile?.recentPosts || []).map((p: any) => ({ ...p, type: 'post' })),
            ...(userProfile?.recentReviews || []).map((r: any) => ({ ...r, type: 'review' })),
            ...(userProfile?.recentCommentsOnPosts || []).map((c: any) => ({ ...c, type: 'comment_received' }))
        ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [userProfile]);

    useEffect(() => {
        const fetchUserData = async () => {
            if (user) {
                try {
                    const { db } = await import('@/lib/firebase');
                    const { doc: firestoreDoc, getDoc: firestoreGetDoc } = await import('firebase/firestore');
                    const { db: firestoreDb } = await import('@/lib/firebase');

                    const userRef = firestoreDoc(firestoreDb, 'users', user.uid);
                    const userSnap = await firestoreGetDoc(userRef);

                    // Import new stats functions dynamically
                    const { getUserReviewCount, getUserTotalLikes, getUserPosts, getUserReviews, getRecentCommentsOnUserPosts } = await import('@/lib/firestore');

                    // Fetch all data in parallel with limits
                    const [reviewsCount, totalLikes, recentPosts, recentReviews, recentCommentsOnPosts] = await Promise.all([
                        getUserReviewCount(user.uid),
                        getUserTotalLikes(user.uid),
                        getUserPosts(user.uid, 10), // Limit to 10
                        getUserReviews(user.uid, 10), // Limit to 10
                        getRecentCommentsOnUserPosts(user.uid, 5) // Recent 5 comments on your posts
                    ]);

                    if (userSnap.exists()) {
                        setUserProfile({
                            ...userSnap.data(),
                            reviewsCount,
                            totalLikes,
                            recentPosts,
                            recentReviews,
                            recentCommentsOnPosts
                        });
                    }
                } catch (e) {
                    console.error("Error fetching profile:", e);
                } finally {
                    setDataLoading(false);
                }
            }
        };

        if (!loading && user) {
            fetchUserData();
        } else if (!loading && !user) {
            window.location.href = '/login';
        }
    }, [user, loading]);

    if (loading || dataLoading) {
        return <ProfileLoading />;
    }

    if (!user) return null;

    // Derived Stats
    const xp = userProfile?.xp || 0;
    const levelInfo = getLevel(xp);
    const nextLevel = getNextLevel(levelInfo.level);
    const progress = getProgressToNextLevel(xp, levelInfo.level);



    // XP Calculation for bar details
    const nextLevelXP = nextLevel ? nextLevel.xp : xp;

    const visibleActivities = activities.slice(0, visibleActivitiesCount);

    return (
        <div className="min-h-screen pb-20 bg-background text-white overflow-hidden font-sans">

            {/* FULL SCREEN BACKGROUNDS */}
            <ParticleBackground />
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-violet-600/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[150px]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
            </div>

            <div className="relative z-10 container max-w-6xl mx-auto px-4 pt-8 md:pt-12">

                {/* HERO SECTION - REIMAGINED */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative mb-12 flex flex-col items-center justify-center text-center"
                >
                    {/* HOLOGRAPHIC AVATAR */}
                    <div className="mb-6 relative z-20">
                        <HolographicAvatar />
                        {/* Level Badge Floating Below */}
                        <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md border border-violet-500/30 px-4 py-1 rounded-full shadow-[0_0_10px_rgba(139,92,246,0.2)]"
                        >
                            <span className={`text-xs font-bold ${levelInfo.color || 'text-violet-300'} tracking-widest uppercase`}>Lvl {levelInfo.level} • {levelInfo.title}</span>
                        </motion.div>
                    </div>

                    {/* USERNAME & DETAILS */}
                    <div className="space-y-2 relative z-20">
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                            {user.displayName || 'Anonymous Player'}
                        </h1>
                        <p className="text-violet-400/60 font-mono text-sm tracking-widest uppercase">
                            Member since {new Date(user.metadata.creationTime || Date.now()).getFullYear()} • ID: {user.uid.slice(0, 8)}
                        </p>
                    </div>

                    {/* Quick Action Floating Right */}
                    <div className="absolute top-0 right-0 hidden md:block">
                        <Link href="/admin">
                            <Button className="rounded-none clip-path-polygon h-10 px-8 font-bold bg-violet-950/30 hover:bg-violet-900/50 border border-violet-500/30 text-violet-400 hover:text-violet-200 transition-all group backdrop-blur-sm">
                                <LayoutDashboard className="w-4 h-4 mr-2" />
                                DASHBOARD
                            </Button>
                        </Link>
                    </div>
                </motion.div>


                {/* CONTENTS GRID - NEO GLASS */}
                <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-6">

                    {/* LEFT COLUMN: NAVIGATION & STATUS */}
                    <div className="space-y-6">
                        {/* XP MODULE */}
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="p-5 rounded-2xl bg-zinc-900/60 border border-t-white/10 border-l-white/10 border-b-black/50 border-r-black/50 backdrop-blur-xl relative overflow-hidden group"
                        >
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

                            <div className="flex justify-between items-end mb-2">
                                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">XP Progress</span>
                                <span className="text-2xl font-black text-white">{Math.round(progress)}%</span>
                            </div>

                            {/* HUD Progress Bar */}
                            <div className="h-4 w-full bg-black/80 rounded-sm relative overflow-hidden border border-white/5">
                                {/* Grid Lines Background */}
                                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:10px_100%]" />

                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    className="h-full bg-gradient-to-r from-violet-600 via-violet-400 to-white shadow-[0_0_15px_rgba(139,92,246,0.5)] relative"
                                >
                                    <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-white shadow-[0_0_10px_white]" />
                                </motion.div>
                            </div>

                            <div className="mt-3 flex justify-between text-[10px] font-mono text-violet-500/60">
                                <span>{xp.toLocaleString()} XP</span>
                                <span>NEXT: {nextLevel ? nextLevel.xp.toLocaleString() : 'MAX'}</span>
                            </div>
                        </motion.div>

                        {/* MENU */}
                        <div className="bg-white/5 border border-white/5 rounded-2xl p-2 backdrop-blur-md">
                            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 text-white font-bold text-sm border-l-2 border-violet-500 transition-all">
                                <LayoutDashboard className="w-4 h-4 ml-1" />
                                OVERVIEW
                            </button>
                            <Link href="/admin">
                                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 font-bold text-sm transition-all">
                                    <Settings className="w-4 h-4 ml-1" />
                                    SETTINGS
                                </button>
                            </Link>
                        </div>
                    </div>


                    {/* RIGHT COLUMN: CONTENT */}
                    <div className="space-y-8">

                        {/* BADGES SECTION */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="flex items-center gap-3 mb-4 px-2">
                                <Shield className="w-5 h-5 text-violet-400" />
                                <h2 className="text-lg font-bold tracking-wide uppercase text-white/90">Achievements</h2>
                            </div>

                            <div className="flex flex-wrap gap-4">
                                {BADGES.filter(badge => {
                                    if (badge.id === 'pioneer') {
                                        const joinDate = user.metadata.creationTime ? new Date(user.metadata.creationTime) : new Date();
                                        const launchDate = new Date('2026-03-01'); // Extended for testing
                                        return joinDate < launchDate;
                                    }
                                    if (badge.id === 'reviewer') return (userProfile?.reviewsCount || 0) >= 5;
                                    if (badge.id === 'influencer') return (userProfile?.totalLikes || 0) >= 100;
                                    if (badge.id === 'collector') return (userProfile?.downloadsCount || 0) >= 10;
                                    return false;
                                }).map((badge: any, index) => {
                                    const Icon = badge.iconName === 'Rocket' ? Rocket :
                                        badge.iconName === 'PenTool' ? PenTool :
                                            badge.iconName === 'Zap' ? Zap :
                                                badge.iconName === 'Gamepad2' ? Gamepad2 : Trophy;

                                    // Clean Image Design (No Box, No Glow)
                                    if (badge.imagePath) {
                                        return (
                                            <motion.div
                                                key={badge.id}
                                                initial={{ scale: 0.9, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ delay: 0.3 + (index * 0.1) }}
                                                className="flex flex-col items-center gap-2 group cursor-pointer"
                                            >
                                                <div className="relative w-24 h-24 drop-shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-transform duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_25px_rgba(255,255,255,0.3)]">
                                                    <Image
                                                        src={badge.imagePath}
                                                        alt={badge.name}
                                                        fill
                                                        className="object-contain p-2 mix-blend-screen"
                                                    />
                                                </div>
                                                <span className="text-xs font-bold text-white/60 uppercase tracking-widest group-hover:text-violet-400 transition-colors">{badge.name}</span>
                                            </motion.div>
                                        );
                                    }

                                    return (
                                        <div key={badge.id} className="p-4 rounded-xl bg-white/5 border border-dashed border-white/10 flex flex-col items-center justify-center gap-2 text-white/50">
                                            <Icon className="w-8 h-8" />
                                            <span className="text-xs font-bold">{badge.name}</span>
                                        </div>
                                    );
                                })}
                                {/* Fallback if no badges */}
                                {BADGES.filter(b => {
                                    if (b.id === 'pioneer') return user.metadata.creationTime && new Date(user.metadata.creationTime) < new Date('2026-02-01');
                                    if (b.id === 'reviewer') return (userProfile?.reviewsCount || 0) >= 5;
                                    if (b.id === 'influencer') return (userProfile?.totalLikes || 0) >= 100;
                                    if (b.id === 'collector') return (userProfile?.downloadsCount || 0) >= 10;
                                    return false;
                                }).length === 0 && (
                                        <div className="col-span-full py-12 border border-dashed border-white/5 rounded-2xl flex flex-col items-center text-white/30">
                                            <Trophy className="w-8 h-8 mb-2 opacity-50" />
                                            <p className="text-sm font-mono uppercase tracking-widest">No Data Found</p>
                                        </div>
                                    )}
                            </div>
                        </motion.div>


                        {/* RECENT ACTIVITY - RESTORED CARDS */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <div className="flex items-center gap-3 mb-4 px-2">
                                <LayoutDashboard className="w-5 h-5 text-violet-400" />
                                <h2 className="text-lg font-bold tracking-wide uppercase text-white/90">Recent Activity</h2>
                            </div>

                            <div className="space-y-4">
                                {activities.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center text-center py-8 text-muted-foreground bg-white/5 rounded-2xl border border-white/5">
                                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                                            <Gamepad2 className="w-6 h-6 opacity-50" />
                                        </div>
                                        <p className="text-sm">No recent activity.</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className={`space-y-4 ${visibleActivitiesCount > 3 ? 'max-h-[400px] overflow-y-auto pr-2 custom-scrollbar' : ''} transition-all duration-500`}>
                                            {visibleActivities.map((activity: any) => {
                                                if (activity.type === 'comment_received') {
                                                    return (
                                                        <Link href={`/community#${activity.postId}`} key={activity.id + activity.type} className="flex gap-4 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 transition-colors block group">
                                                            <div className="shrink-0 mt-1">
                                                                <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                                    <MessageSquare className="w-4 h-4" />
                                                                </div>
                                                            </div>
                                                            <div className="min-w-0">
                                                                <div className="flex items-baseline gap-2 mb-1">
                                                                    <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                                                                        New Comment
                                                                    </span>
                                                                    <span className="text-[10px] text-muted-foreground/60">
                                                                        {new Date(activity.createdAt).toLocaleDateString()}
                                                                    </span>
                                                                </div>
                                                                <div className="text-sm text-white/90">
                                                                    <span className="font-semibold text-purple-200">{activity.userName}</span> commented on: <span className="italic text-white/60">"{activity.postTitle}..."</span>
                                                                </div>
                                                                <p className="text-sm text-white/70 mt-1 line-clamp-1 border-l-2 border-white/10 pl-2">
                                                                    "{activity.content}"
                                                                </p>
                                                            </div>
                                                        </Link>
                                                    );
                                                }

                                                // Post or Review
                                                return (
                                                    <Link href={activity.type === 'post' ? `/community#${activity.id}` : `/game/${activity.gameId}#reviews`} key={activity.id + activity.type} className="flex gap-4 p-4 rounded-xl bg-black/40 border border-white/10 hover:bg-white/5 transition-colors block group backdrop-blur-sm">
                                                        <div className="shrink-0 mt-1">
                                                            {activity.type === 'post' ? (
                                                                <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                                    <LayoutDashboard className="w-4 h-4" />
                                                                </div>
                                                            ) : (
                                                                <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                                    <Monitor className="w-4 h-4" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="flex items-baseline gap-2 mb-1">
                                                                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                                                    {activity.type === 'post' ? 'Community Post' : 'Game Review'}
                                                                </span>
                                                                <span className="text-[10px] text-muted-foreground/60">
                                                                    {new Date(activity.createdAt).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-white line-clamp-2">
                                                                {activity.content}
                                                            </p>
                                                        </div>
                                                    </Link>
                                                );
                                            })}
                                        </div>

                                        {/* View More / Less Button */}
                                        {activities.length > 3 && (
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => setVisibleActivitiesCount(prev => prev > 3 ? 3 : 10)}
                                                className="w-full py-3 mt-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-sm font-medium text-muted-foreground hover:text-white transition-all flex items-center justify-center gap-2"
                                            >
                                                {visibleActivitiesCount > 3 ? (
                                                    <>Show Less</>
                                                ) : (
                                                    <>View All Activity ({Math.min(activities.length, 10) - 3})</>
                                                )}
                                            </motion.button>
                                        )}
                                    </>
                                )}
                            </div>
                        </motion.div>

                    </div>
                </div>
            </div>
        </div>
    );
}
