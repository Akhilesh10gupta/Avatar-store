'use client';

import { motion } from 'framer-motion';
import { Upload, Download, Users, Gamepad2, ArrowRight, ShieldCheck, Mail } from 'lucide-react';
import Link from 'next/link';

export default function HelpCenter() {
    const sections = [
        {
            title: "For Developers: How to Upload",
            icon: Upload,
            color: "text-violet-400",
            bg: "bg-violet-400/10",
            steps: [
                "Sign in to your Avatar Play account.",
                "Click on your profile avatar in the navigation bar to access the Admin Dashboard.",
                "Click the 'Add New Game' button in the top right corner.",
                "Fill in the game details including title, description, cover image, and download links.",
                "Submit your game. It will be instantly listed on the store!"
            ]
        },
        {
            title: "For Gamers: How to Download",
            icon: Download,
            color: "text-emerald-400",
            bg: "bg-emerald-400/10",
            steps: [
                "Browse through our store or use the search bar to find a game.",
                "Click on a game card to view the detailed game page.",
                "Check the system requirements to ensure compatibility.",
                "Click the 'Download' button for your platform (PC or Android).",
                "The file will begin downloading automatically. Enjoy playing!"
            ]
        },
        {
            title: "Community Features",
            icon: Users,
            color: "text-blue-400",
            bg: "bg-blue-400/10",
            steps: [
                "Visit the 'Community' tab to see what others are sharing.",
                "Share your own gaming moments, screenshots, or reviews.",
                "Interact with other players by liking and commenting on their posts.",
                "Join discussions about your favorite games and discover new strategies."
            ]
        }
    ];

    return (
        <main className="min-h-screen bg-[#050505] pt-12 pb-20 px-4">
            <div className="container mx-auto max-w-4xl">
                {/* Header */}
                <div className="text-center mb-16 space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2 border border-primary/20"
                    >
                        <ShieldCheck className="w-4 h-4" />
                        Avatar Play Support
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold text-white tracking-tight"
                    >
                        How can we help you?
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-muted-foreground text-lg max-w-2xl mx-auto"
                    >
                        Learn how to publish your games, discover new titles, and connect with the community.
                    </motion.p>
                </div>

                {/* Guides Grid */}
                <div className="grid gap-8">
                    {sections.map((section, idx) => (
                        <motion.section
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-card/50 backdrop-blur-sm border border-white/5 rounded-2xl p-6 md:p-8 hover:border-white/10 transition-colors"
                        >
                            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                                <div className={`w-16 h-16 rounded-2xl ${section.bg} ${section.color} flex items-center justify-center shrink-0`}>
                                    <section.icon className="w-8 h-8" />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                        {section.title}
                                    </h2>
                                    <div className="grid gap-4">
                                        {section.steps.map((step, stepIdx) => (
                                            <div key={stepIdx} className="flex gap-4">
                                                <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-mono text-white/50 shrink-0 mt-0.5">
                                                    {stepIdx + 1}
                                                </div>
                                                <p className="text-white/80 leading-relaxed">
                                                    {step}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.section>
                    ))}
                </div>

                {/* Contact CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-16 bg-gradient-to-r from-primary/10 via-purple-500/10 to-blue-500/10 border border-white/5 rounded-2xl p-8 text-center relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-white/5 opacity-0 hover:opacity-100 transition-opacity" />
                    <h3 className="text-2xl font-bold text-white mb-4 relative z-10">Still need help?</h3>
                    <p className="text-muted-foreground mb-8 max-w-lg mx-auto relative z-10">
                        Our support team is always ready to assist you. Reach out to us for any technical issues or inquiries.
                    </p>
                    <a href="mailto:support@avatarplay.in">
                        <button className="relative z-10 bg-white text-black font-bold py-3 px-8 rounded-xl hover:bg-gray-200 transition-colors inline-flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            Contact Support
                        </button>
                    </a>
                </motion.div>
            </div>
        </main>
    );
}
