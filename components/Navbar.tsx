'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Gamepad2, Search, User, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { UserAvatar } from '@/components/UserAvatar';

const Navbar = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const router = useRouter();
    const { user, loading } = useAuth();

    // Determine profile link based on auth state
    const profileLink = user ? '/admin' : '/login';

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            router.push(`/browse?query=${encodeURIComponent(searchQuery.trim())}`);
            setIsMobileMenuOpen(false);
        }
    };

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0a0a0a]/90 backdrop-blur-xl supports-[backdrop-filter]:bg-[#0a0a0a]/80">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight hover:opacity-80 transition-opacity">
                    <div className="bg-primary p-1.5 rounded-lg">
                        <Gamepad2 className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white">Avatar<span className="text-primary"> Store</span></span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
                    <Link href="/" className="hover:text-white transition-colors">Store</Link>
                    <Link href="/browse" className="hover:text-white transition-colors">Browse</Link>
                    <Link href="/about" className="hover:text-white transition-colors">About</Link>

                </div>

                {/* Right Actions (Desktop) */}
                <div className="hidden md:flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-white/50 group-focus-within:text-white transition-colors" />
                        <input
                            type="text"
                            placeholder="Search games..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleSearch}
                            className="h-10 w-64 rounded-full border border-white/10 bg-white/5 px-10 text-sm text-white placeholder:text-white/40 outline-none focus:border-violet-500/50 focus:bg-white/10 focus:ring-1 focus:ring-violet-500/50 transition-all"
                        />
                    </div>
                    <Link href={profileLink}>
                        <button className="rounded-full bg-white/5 hover:bg-white/10 transition-all relative overflow-hidden w-10 h-10 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary/50" title={user ? "Go to Profile" : "Login"}>
                            <UserAvatar user={user} className="w-full h-full" />
                            {user && !user.photoURL && (
                                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#0a0a0a] rounded-full mr-0.5 mt-0.5 z-10"></span>
                            )}
                        </button>
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden p-2 text-muted-foreground hover:text-foreground"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-16 left-0 w-full bg-background border-b border-border p-4 space-y-4 shadow-xl">
                    <div className="space-y-2">
                        <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 hover:bg-secondary rounded-md text-sm font-medium">
                            Store
                        </Link>
                        <Link href="/browse" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 hover:bg-secondary rounded-md text-sm font-medium">
                            Browse
                        </Link>
                        <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 hover:bg-secondary rounded-md text-sm font-medium">
                            About
                        </Link>

                    </div>

                    <div className="pt-4 border-t border-border space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search games..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleSearch}
                                className="h-10 w-full rounded-md border border-border bg-secondary/50 px-9 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                        </div>
                        <Link href={profileLink} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 hover:bg-secondary rounded-md text-sm font-medium text-primary">
                            <UserAvatar user={user} className="w-6 h-6 text-xs" />
                            <span>{user ? 'My Profile' : 'Admin Login'}</span>
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
