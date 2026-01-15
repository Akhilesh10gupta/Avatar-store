'use client';

import { Gamepad2, Users, Rocket, Globe, Trophy, Heart, Sparkles, Target, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function AboutPage() {
    return (
        <div className="min-h-screen pt-24 pb-12 bg-[#0a0a0a] overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen opacity-30 animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px] mix-blend-screen opacity-30 animate-pulse delay-1000"></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] mask-image-gradient-to-b"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Back Button */}
                <div className="mb-8">
                    <Link href="/">
                        <Button variant="outline" className="gap-2 bg-card hover:bg-secondary text-foreground border-border/50">
                            <ArrowLeft className="w-4 h-4" /> Back to Store
                        </Button>
                    </Link>
                </div>

                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center max-w-4xl mx-auto mb-20"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
                        <Sparkles className="w-4 h-4" />
                        <span>The Next Gen of Gaming</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-foreground">
                        We Are <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-indigo-400">Avatar Play</span>
                    </h1>

                    <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10">
                        Crafting the ultimate digital playground where gamers discover, connect, and play.
                        We're not just a store; we're a universe of endless possibilities.
                    </p>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-card/50 backdrop-blur-xl rounded-2xl border border-border/50 shadow-xl">
                        {[
                            { label: "Active Players", value: "10K+", icon: Users },
                            { label: "Epic Games", value: "500+", icon: Gamepad2 },
                            { label: "Community", value: "Global", icon: Globe },
                            { label: "Satisfaction", value: "100%", icon: Heart },
                        ].map((stat, index) => (
                            <div key={index} className="flex flex-col items-center justify-center p-4">
                                <stat.icon className="w-6 h-6 text-primary mb-2 opacity-80" />
                                <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                                <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Mission Section */}
                <div className="grid md:grid-cols-2 gap-12 mb-32 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary to-indigo-600 rounded-2xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                        <div className="relative bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl p-8 h-full overflow-hidden">
                            {/* Abstract Background Pattern */}
                            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>

                            <div className="relative z-10">
                                <Target className="w-12 h-12 text-primary mb-6" />
                                <h2 className="text-3xl font-bold mb-4 text-foreground">Our Mission</h2>
                                <p className="text-muted-foreground leading-relaxed text-lg">
                                    To revolutionize digital distribution by putting power back into the hands of gamers.
                                    We believe in transparent pricing, supporting indie developers alongside AAA giants, and creating a space where community comes first.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8"
                    >
                        {[
                            {
                                icon: Rocket,
                                title: "Lightning Fast",
                                description: "Our optimized platform ensures you spend less time waiting and more time playing. Instant access to your favorite titles."
                            },
                            {
                                icon: Trophy,
                                title: "Curated Excellence",
                                description: "Every game on our platform is hand-picked. We prize quality over quantity, ensuring you only get the best gaming experiences."
                            },
                            {
                                icon: Users,
                                title: "Community First",
                                description: "Join a vibrant community. Share reviews, join discussions, and shape the future of the platform with your feedback."
                            }
                        ].map((item, index) => (
                            <div key={index} className="flex gap-4 group">
                                <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                    <item.icon className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors text-foreground">{item.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Team/Join CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative rounded-3xl overflow-hidden border border-border/50 shadow-2xl"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/80 to-primary/80"></div>
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=2071')] bg-cover bg-center mix-blend-overlay opacity-30"></div>

                    <div className="relative z-10 px-8 py-24 text-center max-w-3xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Ready to Level Up?</h2>
                        <p className="text-xl text-white/80 mb-8">
                            Join thousands of gamers who have already found their new home.
                            The next great adventure is just a click away.
                        </p>
                        <Link href="/browse">
                            <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-bold px-10 py-6 text-lg rounded-full shadow-xl">
                                Browse Games
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
