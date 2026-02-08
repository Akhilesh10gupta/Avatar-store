'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Gamepad2, Users, UserCircle } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { cn } from '@/lib/utils';
import { UserAvatar } from '@/components/UserAvatar';

export default function BottomNav() {
    const pathname = usePathname();
    const { user } = useAuth();

    // Determine profile link based on auth state
    const profileLink = user ? '/profile' : '/login';

    const navItems = [
        {
            label: 'Home',
            href: '/',
            icon: Home
        },
        {
            label: 'Games',
            href: '/browse', // Or '/' if games are on home, but let's use browse for clarity? Or maybe '/' is store.
            // Let's stick to what Navbar had: Store -> '/', Browse -> '/browse'
            // User requested: "Home, Games, Community, Profile"
            // Let's map Home -> /, Games -> /browse
            icon: Gamepad2
        },
        {
            label: 'Community',
            href: '/community',
            icon: Users
        },
        {
            label: 'Profile',
            href: profileLink,
            icon: UserCircle, // We'll conditionally replace this
            isProfile: true
        }
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-white/10 safe-area-bottom">
            <div className="flex items-center justify-around h-16">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));

                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-full gap-1 active:scale-95 transition-all text-[10px] font-medium",
                                isActive ? "text-white" : "text-muted-foreground hover:text-white/80"
                            )}
                        >
                            {item.isProfile && user ? (
                                <div className={cn(
                                    "rounded-full p-0.5 border-2 transition-all",
                                    isActive ? "border-white" : "border-transparent"
                                )}>
                                    <UserAvatar user={user} className="w-6 h-6" />
                                </div>
                            ) : (
                                <item.icon className={cn(
                                    "w-6 h-6 transition-all",
                                    isActive && "fill-current"
                                )} />
                            )}
                            {/* Optional: We can hide labels if we want a pure icon look like Instagram */}
                            {/* Instagram usually hides labels or shows them only for inactive? No, usually just icons. */}
                            {/* User said "use icon instead of name in mobile view". So let's hide the name? 
                                Or keep it very small? Instagram actually HAS no labels.
                                Let's hide labels to match the request "use icon instead of name".
                             */}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
