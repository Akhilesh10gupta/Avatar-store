'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Gamepad2, Joystick, UserCircle, Newspaper } from 'lucide-react';
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
            href: '/browse',
            icon: Gamepad2
        },
        {
            label: 'Blog',
            href: '/blog',
            icon: Newspaper
        },
        {
            label: '3D Action',
            href: '/3d-action',
            icon: Joystick,
            emoji: '🕹️'
        },
        {
            label: 'Profile',
            href: profileLink,
            icon: UserCircle,
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
                            prefetch={false}
                            aria-label={item.label}
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
                            ) : item.emoji ? (
                                <div className={cn(
                                    "w-6 h-6 flex items-center justify-center transition-all",
                                    isActive ? "scale-110 drop-shadow-[0_0_8px_rgba(168,85,247,0.7)] opacity-100" : "opacity-75 hover:opacity-100"
                                )}>
                                    <span className="text-xl leading-none select-none">{item.emoji}</span>
                                </div>
                            ) : (
                                <item.icon className={cn(
                                    "w-6 h-6 transition-all",
                                    isActive && "fill-current"
                                )} />
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
