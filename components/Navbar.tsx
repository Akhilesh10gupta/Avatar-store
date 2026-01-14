'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Gamepad2, Search, User } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            router.push(`/browse?query=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight hover:opacity-80 transition-opacity">
                    <div className="bg-primary p-1.5 rounded-lg">
                        <Gamepad2 className="w-5 h-5 text-white" />
                    </div>
                    <span>Avatar<span className="text-primary">Game Store</span></span>
                </Link>

                {/* Navigation Links (Desktop) */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
                    <Link href="/" className="hover:text-primary transition-colors">Store</Link>
                    <Link href="/browse" className="hover:text-primary transition-colors">Browse</Link>
                    <Link href="/admin" className="hover:text-primary transition-colors text-xs bg-secondary/50 px-2 py-1 rounded border border-border">Admin Panel</Link>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    <div className="relative hidden sm:block">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search games..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleSearch}
                            className="h-9 w-64 rounded-full border border-border bg-secondary/50 px-9 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                        />
                    </div>
                    <Link href="/login">
                        <button className="p-2 rounded-full hover:bg-secondary transition-colors" title="Admin Login">
                            <User className="w-5 h-5" />
                        </button>
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
