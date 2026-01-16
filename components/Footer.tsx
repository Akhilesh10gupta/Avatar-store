'use client';

import Link from 'next/link';
import { Gamepad2, Twitter, Facebook, Instagram, Youtube, Mail, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function Footer() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');
        try {
            const { addSubscriber } = await import('@/lib/firestore');
            await addSubscriber(email);
            setStatus('success');
            setEmail('');
            setTimeout(() => setStatus('idle'), 3000); // Reset after 3s
        } catch (error) {
            console.error(error);
            setStatus('error');
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    return (
        <footer className="bg-[#050505] border-t border-white/5 pt-16 pb-8 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
                            <img src="/logo.png" alt="Avatar Play Logo" className="w-8 h-8 rounded-lg object-contain" />
                            <span className="text-white">Avatar<span className="text-primary"> Play</span></span>
                        </Link>
                        <p className="text-muted-foreground leading-relaxed text-sm">
                            Your ultimate destination for curated gaming experiences.
                            Discover, download, and play the future of gaming today.
                        </p>
                        <div className="flex items-center gap-4">
                            {[Twitter, Facebook, Instagram, Youtube].map((Icon, idx) => (
                                <a
                                    key={idx}
                                    href="#"
                                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-primary hover:bg-primary/10 hover:border-primary/20 transition-all duration-300"
                                >
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Explore</h4>
                        <ul className="space-y-4 text-sm text-muted-foreground">
                            {[
                                { label: 'Store', href: '/' },
                                { label: 'Browse Games', href: '/browse' },
                                { label: 'Top Rated', href: '/browse?sort=rating' },
                                { label: 'New Arrivals', href: '/browse?sort=newest' },
                            ].map((link, idx) => (
                                <li key={idx}>
                                    <Link href={link.href} className="hover:text-white transition-all duration-300 flex items-center gap-2 group hover:translate-x-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-white/10 group-hover:bg-primary group-hover:shadow-[0_0_10px_currentColor] transition-all"></span>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Support</h4>
                        <ul className="space-y-4 text-sm text-muted-foreground">
                            {[
                                { label: 'Help Center', href: '/help-center' },
                                { label: 'Terms of Service', href: '/legal/terms' },
                                { label: 'Privacy Policy', href: '/legal/privacy' },
                                { label: 'Cookie Policy', href: '/legal/cookies' },
                            ].map((link, idx) => (
                                <li key={idx}>
                                    <Link href={link.href} className="hover:text-white transition-all duration-300 flex items-center gap-2 group hover:translate-x-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-white/10 group-hover:bg-primary group-hover:shadow-[0_0_10px_currentColor] transition-all"></span>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Stay Updated</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                            Subscribe to our newsletter for the latest drops and exclusive offers.
                        </p>
                        <form onSubmit={handleSubscribe} className="space-y-2">
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 w-4 h-4 text-white/40" />
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={status === 'loading' || status === 'success'}
                                className={`w-full font-bold py-2.5 rounded-lg text-sm transition-all flex items-center justify-center gap-2 ${status === 'success'
                                    ? 'bg-green-500 text-white'
                                    : status === 'error'
                                        ? 'bg-red-500 text-white'
                                        : 'bg-white text-black hover:bg-gray-200'
                                    }`}
                            >
                                {status === 'loading' ? (
                                    <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                ) : status === 'success' ? (
                                    "Subscribed!"
                                ) : status === 'error' ? (
                                    "Failed"
                                ) : (
                                    <>
                                        Subscribe
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} Avatar Play. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <Link href="/legal/privacy" className="hover:text-white transition-colors">Privacy</Link>
                        <Link href="/legal/terms" className="hover:text-white transition-colors">Terms</Link>
                        <Link href="/legal/cookies" className="hover:text-white transition-colors">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
