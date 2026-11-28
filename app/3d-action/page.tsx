import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Sparkles, Gamepad2, Zap, ShieldCheck, ArrowRight, Star } from 'lucide-react';
import AdsterraBanner from '@/components/AdsterraBanner';

export const metadata: Metadata = {
    title: '3D Action & Open World Games – Play Online Free in Browser | Avatar Play',
    description: 'Play high-octane 3D open world action and street drift racing games online in your browser. Zero installation, instant play on Avatar Play.',
    keywords: [
        '3D action games',
        '3D browser games',
        'open world online',
        '3D car racing game',
        'street drift 3D',
        'free 3D games',
        'Avatar Play'
    ],
    alternates: {
        canonical: 'https://avatarplay.in/3d-action',
    },
    openGraph: {
        title: '3D Action & Open World Games – Play Online Free | Avatar Play',
        description: 'Play high-octane 3D open world action and street racing games online in your browser on Avatar Play.',
        url: 'https://avatarplay.in/3d-action',
        siteName: 'Avatar Play',
        locale: 'en_IN',
        type: 'website',
        images: [
            {
                url: 'https://avatarplay.in/games/crt-city-cover.jpg',
                width: 1200,
                height: 675,
                alt: '3D Action Games on Avatar Play',
            }
        ],
    },
};

export const revalidate = 3600;

const ACTION_GAMES = [
    {
        id: 'crt-city-80s-open-world',
        title: 'CRT City: 80s Neon Open World 3D',
        tagline: 'Retro Miami 80s Open World Crime & Action',
        genre: 'Open World 3D',
        rating: 4.9,
        plays: '650+ Plays',
        badge: 'Open World',
        badgeColor: 'from-pink-500 to-purple-600',
        cardImage: '/games/crt-city-card.jpg',
        description: 'Step into a neon-soaked 1980s retro city. Drive vintage muscle cars, free-roam across oceanfront boulevards, complete street missions, and dominate the criminal underworld in full 3D.',
        features: ['Full 3D Open World', 'Vintage Cars & Radio', 'Drive & Roam Freely']
    },
    {
        id: 'midnight-neon-underground-3d',
        title: 'Midnight Neon Underground 3D: Street Racing',
        tagline: 'High-Octane Midnight Street Drift & Tuning',
        genre: '3D Racing',
        rating: 4.8,
        plays: '580+ Plays',
        badge: 'Street Racing',
        badgeColor: 'from-cyan-500 to-blue-600',
        cardImage: '/games/midnight-underground-card.jpg',
        description: 'Experience high-octane 3D midnight street racing, drifting, and city cruising in your browser. Tune your ride with custom underglow, drift rain-slicked highways, and conquer the underground scene.',
        features: ['Realistic Drift Physics', 'Neon Night City', 'Controller & Keyboard Support']
    },
    {
        id: 'tactical-infiltrator-3d',
        title: 'Tactical Infiltrator 3D: Covert Ops',
        tagline: 'High-Stakes Stealth Military Base Infiltration',
        genre: 'Tactical FPS 3D',
        rating: 4.9,
        plays: '490+ Plays',
        badge: 'Covert Ops',
        badgeColor: 'from-emerald-500 to-teal-600',
        cardImage: '/games/tactical-infiltrator-card.jpg',
        description: 'Infiltrate high-security enemy military compounds undetected. Use silenced tactical weaponry, binoculars, surveillance cameras, and stealth combat tactics to complete covert ops in full 3D.',
        features: ['Stealth & Silenced Combat', 'Enemy Base Infiltration', 'Tactical Surveillance & Sniper']
    },
    {
        id: 'apex-outlaw-3d',
        title: 'Apex Outlaw 3D: High-Speed Police Pursuit',
        tagline: 'High-Speed Open World Police Chases & Outlaw Racing',
        genre: '3D Pursuit Racing',
        rating: 4.9,
        plays: '740+ Plays',
        badge: 'Police Pursuit',
        badgeColor: 'from-amber-500 to-orange-600',
        cardImage: '/games/apex-outlaw-card.jpg',
        description: 'Tear through open highways and industrial docklands in full 3D. Outrun aggressive police cruisers, smash through roadblocks, climb the blacklist hierarchy, and become the most elusive street racer in town.',
        features: ['Intense Police Pursuit System', 'Heat Levels & Roadblocks', 'Daylight Autumn Open World']
    }
];

export default function ThreeDActionPage() {
    return (
        <div className="space-y-12 pb-20 max-w-7xl mx-auto px-4 sm:px-6">
            {/* Hero Header */}
            <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-b from-purple-950/40 via-background to-background p-8 md:p-12 text-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent pointer-events-none" />

                <div className="relative z-10 max-w-3xl mx-auto space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold tracking-wide text-purple-300">
                        <span className="text-base">🕹️</span>
                        <span>AVATAR PLAY ARCADE</span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
                        3D Action & <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">Open World</span> Games
                    </h1>

                    <p className="text-sm sm:text-base text-white/70 max-w-2xl mx-auto leading-relaxed">
                        Console-grade 3D open world action and midnight street drift racing directly in your browser. Zero installation, 100% free, and optimized for PC & mobile.
                    </p>

                    {/* Features Strip */}
                    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-4 text-xs font-medium text-white/60">
                        <div className="flex items-center gap-1.5">
                            <Zap className="w-4 h-4 text-cyan-400" />
                            <span>Instant In-Browser Play</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Gamepad2 className="w-4 h-4 text-purple-400" />
                            <span>Gamepad & Keyboard Ready</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                            <span>100% Free & Safe</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Ad */}
            <div className="max-w-5xl mx-auto">
                <AdsterraBanner />
            </div>

            {/* 3D Games Grid */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
                            <span>Featured 3D Games</span>
                            <Sparkles className="w-5 h-5 text-purple-400" />
                        </h2>
                        <p className="text-xs sm:text-sm text-white/60">Choose your game and jump straight into action</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {ACTION_GAMES.map((game) => (
                        <div
                            key={game.id}
                            className="group relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent hover:border-purple-500/50 transition-all duration-300 flex flex-col justify-between"
                        >
                            {/* Card Media Container */}
                            <div className="relative aspect-[16/10] w-full overflow-hidden bg-black">
                                <Image
                                    src={game.cardImage}
                                    alt={game.title}
                                    fill
                                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                                {/* Top Badges */}
                                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${game.badgeColor} shadow-lg`}>
                                        {game.badge}
                                    </span>
                                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-bold text-amber-300">
                                        <Star className="w-3.5 h-3.5 fill-current" />
                                        {game.rating}
                                    </span>
                                </div>

                                {/* Bottom Overlay Title */}
                                <div className="absolute bottom-4 left-4 right-4">
                                    <span className="text-xs font-semibold text-cyan-300 uppercase tracking-wider">{game.genre}</span>
                                    <h3 className="text-xl sm:text-2xl font-bold text-white drop-shadow-md leading-tight">
                                        {game.title}
                                    </h3>
                                </div>
                            </div>

                            {/* Card Content & Features */}
                            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                                <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                                    {game.description}
                                </p>

                                <div className="space-y-4">
                                    {/* Features Pill List */}
                                    <div className="flex flex-wrap gap-2">
                                        {game.features.map((feat, idx) => (
                                            <span
                                                key={idx}
                                                className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[11px] font-medium text-white/80"
                                            >
                                                ✓ {feat}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-3 pt-2">
                                        <Link
                                            href={`/play/${game.id}`}
                                            prefetch={false}
                                            className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 hover:opacity-95 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 active:scale-[0.98] transition-all"
                                        >
                                            <Play className="w-4 h-4 fill-current" />
                                            Play Online Free
                                        </Link>

                                        <Link
                                            href={`/game/${game.id}`}
                                            prefetch={false}
                                            className="py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1 transition-all"
                                            title="View Game Details"
                                        >
                                            <span>Details</span>
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Ad */}
            <div className="max-w-5xl mx-auto pt-6">
                <AdsterraBanner />
            </div>
        </div>
    );
}
