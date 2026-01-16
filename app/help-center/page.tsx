'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Download, Users, Gamepad2, ArrowRight, ShieldCheck, Mail, ChevronRight, HelpCircle, Code, Globe } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export default function HelpCenter() {
    const [activeTab, setActiveTab] = useState<'gamers' | 'developers' | 'community'>('gamers');

    const tabs = [
        { id: 'gamers', label: 'For Gamers', icon: Gamepad2, color: 'text-emerald-400' },
        { id: 'developers', label: 'For Developers', icon: Code, color: 'text-violet-400' },
        { id: 'community', label: 'Community', icon: Users, color: 'text-blue-400' },
    ] as const;

    const content = {
        gamers: {
            title: "Start Playing in Seconds",
            description: "Everything you need to know about finding and playing your next favorite game.",
            guides: [
                {
                    title: "How to Download",
                    icon: Download,
                    steps: [
                        "Browse the store or search for a specific title.",
                        "Click on a game card to view details & system requirements.",
                        "Hit 'Download' for your platform (PC or Android).",
                        "Launch the installer once finished."
                    ]
                },
                {
                    title: "System Requirements",
                    icon: HelpCircle,
                    steps: [
                        "Check the 'System Requirements' section on any game page.",
                        "Ensure your OS (Windows/Android) is up to date.",
                        "Verify you have enough storage space before downloading."
                    ]
                }
            ]
        },
        developers: {
            title: "Publish Your Masterpiece",
            description: "Join our creator economy. Upload, manage, and track your games easily.",
            guides: [
                {
                    title: "How to Upload",
                    icon: Upload,
                    steps: [
                        "Sign in and click your profile avatar -> Admin Dashboard.",
                        "Click 'Add New Game' in the top right.",
                        "Fill in metadata: Title, Genre, Description, and Cover Art.",
                        "Add your download links (Google Drive, Itch.io, etc.).",
                        "Publish! Your game is live instantly."
                    ]
                },
                {
                    title: "Managing Games",
                    icon: ShieldCheck,
                    steps: [
                        "Go to your Dashboard to see all your listed games.",
                        "Use the 'Edit' button to update descriptions or fix bugs.",
                        "Track download counts to see how your game is performing."
                    ]
                }
            ]
        },
        community: {
            title: "Join the Conversation",
            description: "Connect with fellow gamers, share moments, and make friends.",
            guides: [
                {
                    title: "Social Features",
                    icon: Globe,
                    steps: [
                        "Visit the 'Community' tab to see the global feed.",
                        "Post screenshots, reviews, or ask for tips.",
                        "Like and comment on other players' posts."
                    ]
                },
                {
                    title: "Profile Customization",
                    icon: Users,
                    steps: [
                        "Your profile shows your contributions.",
                        "Update your avatar to stand out in the comments.",
                        "Earn badges (coming soon) for active participation."
                    ]
                }
            ]
        }
    };

    return (
        <main className="min-h-screen bg-[#050505] pt-24 pb-20 px-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 pointer-events-none" />

            <div className="container mx-auto max-w-5xl relative z-10">
                {/* Header */}
                <div className="text-center mb-16 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/80 text-sm font-medium backdrop-blur-md"
                    >
                        <ShieldCheck className="w-4 h-4 text-primary" />
                        <span>Help Center</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold text-white tracking-tighter"
                    >
                        How can we <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">help?</span>
                    </motion.h1>
                </div>

                {/* Navigation Tabs */}
                <div className="flex flex-wrap justify-center gap-4 mb-16">
                    {tabs.map((tab, idx) => {
                        const isActive = activeTab === tab.id;
                        const Icon = tab.icon;

                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={cn(
                                    "relative px-8 py-4 rounded-2xl flex items-center gap-3 transition-all duration-300 outline-none group",
                                    isActive ? "bg-white/10 text-white ring-1 ring-white/20" : "bg-transparent text-muted-foreground hover:bg-white/5 hover:text-white"
                                )}
                            >
                                <Icon className={cn("w-5 h-5 transition-colors", isActive ? tab.color : "text-white/40 group-hover:text-white")} />
                                <span className="font-semibold text-lg">{tab.label}</span>
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 rounded-2xl bg-white/5"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Content Area */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="grid md:grid-cols-[1fr_300px] gap-12"
                    >
                        {/* Main Guides */}
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-2">{content[activeTab].title}</h2>
                                <p className="text-lg text-muted-foreground">{content[activeTab].description}</p>
                            </div>

                            <div className="grid gap-6">
                                {content[activeTab].guides.map((guide, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="bg-card/40 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-8 hover:bg-card/60 transition-colors group"
                                    >
                                        <div className="flex items-start gap-6">
                                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500">
                                                <guide.icon className="w-6 h-6 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-white mb-6">{guide.title}</h3>
                                                <div className="space-y-4">
                                                    {guide.steps.map((step, sIdx) => (
                                                        <div key={sIdx} className="flex gap-4">
                                                            <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-mono text-primary shrink-0 mt-0.5">
                                                                {sIdx + 1}
                                                            </div>
                                                            <p className="text-white/80">{step}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            <div className="bg-gradient-to-b from-primary/20 to-blue-500/20 rounded-3xl p-1">
                                <div className="bg-[#0a0a0a] rounded-[22px] p-6 h-full backdrop-blur-xl">
                                    <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                                        <Mail className="w-5 h-5 text-primary" />
                                        Need more help?
                                    </h3>
                                    <p className="text-sm text-muted-foreground mb-6">
                                        Can't find what you're looking for? Our support team is here to assist you 24/7.
                                    </p>
                                    <a href="mailto:support@avatarplay.in" className="block">
                                        <Button className="w-full bg-white text-black hover:bg-gray-200">
                                            Contact Support
                                        </Button>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </main>
    );
}
