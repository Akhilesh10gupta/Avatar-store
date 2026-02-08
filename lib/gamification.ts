
export const LEVELS = [
    { level: 1, xp: 0, title: "Novice", color: "text-zinc-400" },
    { level: 2, xp: 100, title: "Explorer", color: "text-emerald-400" },
    { level: 3, xp: 300, title: "Gamer", color: "text-cyan-400" },
    { level: 4, xp: 600, title: "Pro", color: "text-blue-400" },
    { level: 5, xp: 1000, title: "Elite", color: "text-violet-400" },
    { level: 6, xp: 1500, title: "Master", color: "text-fuchsia-400" },
    { level: 7, xp: 2100, title: "Grandmaster", color: "text-rose-400" },
    { level: 8, xp: 2800, title: "Legend", color: "text-amber-400" },
    { level: 9, xp: 3600, title: "Mythic", color: "text-orange-500" },
    { level: 10, xp: 4500, title: "Godlike", color: "text-yellow-300" },
    // Infinite scaling: Level N = 100 * N * (N-1) / 2 approx, or just strict linear/exponential
];

export const XP_REWARDS = {
    LOGIN_DAILY: 50,
    DOWNLOAD_GAME: 100,
    WRITE_REVIEW: 150,
    RECEIVE_LIKE: 10,
    CREATE_POST: 50,
};

export const BADGES = [
    { id: 'pioneer', name: 'Pioneer', iconName: 'Rocket', imagePath: '/badges/rocket.png', description: 'Joined in the first month', color: 'from-orange-400 to-pink-600' },
    { id: 'reviewer', name: 'Critic', iconName: 'PenTool', imagePath: '/badges/pen.png', description: 'Wrote 5 reviews', color: 'from-blue-400 to-cyan-400' },
    { id: 'influencer', name: 'Influencer', iconName: 'Zap', imagePath: '/badges/zap.png', description: 'Received 100 likes', color: 'from-purple-400 to-fuchsia-400' },
    { id: 'collector', name: 'Collector', iconName: 'Gamepad2', imagePath: '/badges/gamepad.png', description: 'Downloaded 10 games', color: 'from-emerald-400 to-green-600' },
];

export function getLevel(xp: number) {
    // Find the highest level where user XP >= level requirement
    for (let i = LEVELS.length - 1; i >= 0; i--) {
        if (xp >= LEVELS[i].xp) {
            return LEVELS[i];
        }
    }
    return LEVELS[0];
}

export function getNextLevel(currentLevel: number) {
    return LEVELS.find(l => l.level === currentLevel + 1) || null;
}

export function getProgressToNextLevel(xp: number, currentLevelIdx: number) {
    const current = LEVELS.find(l => l.level === currentLevelIdx) || LEVELS[0];
    const next = getNextLevel(currentLevelIdx);

    if (!next) return 100; // Max level

    const xpInLevel = xp - current.xp;
    const xpNeeded = next.xp - current.xp;

    return Math.min(100, Math.max(0, (xpInLevel / xpNeeded) * 100));
}
