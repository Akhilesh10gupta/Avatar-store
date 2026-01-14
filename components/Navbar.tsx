'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Gamepad2, Search, User, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { UserAvatar } from '@/components/UserAvatar';
import { motion, AnimatePresence, Variants } from 'framer-motion';

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

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [router]);

    // Prevent scrolling when menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isMobileMenuOpen]);

    const menuVariants: Variants = {
        closed: {
            opacity: 0,
            y: "-100%",
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 40,
                staggerChildren: 0.05,
                staggerDirection: -1
            }
        },
        open: {
            opacity: 1,
            y: "0%",
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30,
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants: Variants = {
        closed: { opacity: 0, y: -20 },
        open: { opacity: 1, y: 0 }
    };

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0a0a0a]/90 backdrop-blur-xl supports-[backdrop-filter]:bg-[#0a0a0a]/80">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between relative z-50 bg-[#0a0a0a]/90">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight hover:opacity-80 transition-opacity">
                    <div className="bg-primary p-1.5 rounded-lg">
                        <Gamepad2 className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white">Avatar<span className="text-violet-400"> Store</span></span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
                    <Link href="/" className="hover:text-white transition-colors">Store</Link>
                    <Link href="/browse" className="hover:text-white transition-colors">Browse</Link>
                    <Link href="/community" className="hover:text-white transition-colors">Community</Link>
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
                    className="md:hidden p-2 text-white hover:bg-white/10 rounded-full transition-colors relative z-50"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <AnimatePresence mode="wait">
                        {isMobileMenuOpen ? (
                            <motion.div
                                key="close"
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 90, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <X className="w-6 h-6" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="menu"
                                initial={{ rotate: 90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: -90, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Menu className="w-6 h-6" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={menuVariants}
                        className="fixed inset-0 top-0 left-0 w-full h-screen bg-[#050505] z-40 flex flex-col pt-24 px-6 md:hidden overflow-hidden"
                    >
                        {/* Background Gradients */}
                        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

                        <div className="space-y-6 relative z-10">
                            {/* Search Bar Mobile */}
                            <motion.div variants={itemVariants} className="relative mb-8">
                                <Search className="absolute left-4 top-3.5 h-5 w-5 text-white/50" />
                                <input
                                    type="text"
                                    placeholder="Search games..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleSearch}
                                    className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-12 text-base text-white outline-none focus:border-primary/50 focus:bg-white/10 focus:ring-1 focus:ring-primary/50 transition-all shadow-inner"
                                />
                            </motion.div>

                            {/* Links */}
                            <div className="flex flex-col gap-2">
                                {[
                                    { label: 'Store', href: '/' },
                                    { label: 'Browse Games', href: '/browse' },
                                    { label: 'Community', href: '/community' },
                                    { label: 'About Us', href: '/about' },
                                ].map((link, idx) => (
                                    <motion.div key={idx} variants={itemVariants}>
                                        <Link
                                            href={link.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all group"
                                        >
                                            <span className="text-lg font-medium text-white/80 group-hover:text-white transition-colors">{link.label}</span>
                                            <Gamepad2 className="w-5 h-5 text-white/20 group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transform duration-300" />
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Profile Link */}
                            <motion.div variants={itemVariants} className="pt-6 border-t border-white/10 mt-6">
                                <Link
                                    href={profileLink}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/30 transition-all group"
                                >
                                    <UserAvatar user={user} className="w-10 h-10 ring-2 ring-white/10 group-hover:ring-primary/50 transition-all" />
                                    <div>
                                        <div className="font-medium text-white">{user ? (user.displayName || 'Gamer') : 'Guest'}</div>
                                        <div className="text-sm text-white/50">{user ? 'View Profile' : 'Login / Sign Up'}</div>
                                    </div>
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
