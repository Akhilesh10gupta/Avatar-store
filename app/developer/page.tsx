'use client';

import { Github, Linkedin, Mail, Globe, Code, Database, Layout, Server, ExternalLink, Cpu, Terminal, Zap, Shield, Gamepad2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';

export default function DeveloperPage() {
    const skills = [
        { name: "React / Next.js", icon: <Layout className="w-4 h-4" />, level: 95, color: "text-blue-400", border: "border-blue-500/50" },
        { name: "TypeScript", icon: <Code className="w-4 h-4" />, level: 90, color: "text-cyan-400", border: "border-cyan-500/50" },
        { name: "Node.js", icon: <Server className="w-4 h-4" />, level: 85, color: "text-green-400", border: "border-green-500/50" },
        { name: "Tailwind CSS", icon: <Layout className="w-4 h-4" />, level: 95, color: "text-purple-400", border: "border-purple-500/50" },
        { name: "Java / Spring Boot", icon: <Cpu className="w-4 h-4" />, level: 75, color: "text-orange-400", border: "border-orange-500/50" },
        { name: "C++", icon: <Code className="w-4 h-4" />, level: 80, color: "text-pink-400", border: "border-pink-500/50" },
        { name: "PostgreSQL", icon: <Database className="w-4 h-4" />, level: 85, color: "text-indigo-400", border: "border-indigo-500/50" },
        { name: "Three.js", icon: <Gamepad2 className="w-4 h-4" />, level: 70, color: "text-yellow-400", border: "border-yellow-500/50" },
    ];

    const projects = [
        {
            title: "ExtraBite",
            subtitle: "Food Donation Platform",
            description: "Real-time tracking system connecting donors to NGOs. Reduces food waste by 40%.",
            tech: ["React", "Spring Boot", "PostgreSQL"],
            link: "https://github.com/akhilesh10gupta",
            type: "Full Stack",
            stats: { users: "10K+", uptime: "99.9%" }
        },
        {
            title: "Musiz",
            subtitle: "Music Discovery",
            description: "Music streaming platform and freelance marketplace for artists.",
            tech: ["React", "Node.js", "MongoDB"],
            link: "https://github.com/akhilesh10gupta",
            type: "Creative",
            stats: { artists: "500+", tracks: "2K+" }
        },
        {
            title: "TipsyTown",
            subtitle: "Restaurant Experience",
            description: "High-performance responsive site with smooth parallax scrolling and booking engine.",
            tech: ["Next.js", "Framer Motion", "Tailwind"],
            link: "https://github.com/akhilesh10gupta",
            type: "Frontend",
            stats: { speed: "100ms", score: "A+" }
        }
    ];

    return (
        <main className="min-h-screen bg-[#030303] text-white pt-24 pb-16 overflow-x-hidden relative">
            {/* Ambient Background Effects */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/10 rounded-full blur-[150px] animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] animate-pulse delay-700"></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] mask-image-gradient-to-b"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">

                {/* Hero Section */}
                <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-32 relative">
                    {/* Floating Tech Orbs */}
                    <motion.div
                        animate={{ y: [0, -20, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -left-20 top-20 hidden lg:block text-primary/20"
                    >
                        <Code className="w-24 h-24" />
                    </motion.div>
                    <motion.div
                        animate={{ y: [0, 20, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute -right-20 top-40 hidden lg:block text-purple-500/20"
                    >
                        <Database className="w-24 h-24" />
                    </motion.div>

                    {/* Avatar Frame */}
                    {/* Avatar Frame */}
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                        className="relative w-48 h-48 md:w-56 md:h-56 mb-12 group mx-auto"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-cyan-500 rounded-full animate-spin-slow blur-md opacity-70 group-hover:opacity-100 transition-opacity"></div>
                        <div className="absolute inset-1 bg-black rounded-full flex items-center justify-center overflow-hidden border-2 border-white/10 relative">
                            <img
                                src="/akhilesh_final.jpg"
                                alt="Akhilesh Gupta"
                                className="w-full h-full object-cover object-[center_20%] hover:scale-110 transition-transform duration-500"
                            />
                        </div>
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md border border-primary/50 text-primary px-4 py-1 rounded-full text-xs font-mono uppercase tracking-widest shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                            Lvl. 99 dev
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-6"
                    >
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4 relative inline-block">
                            <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-white via-primary to-white animate-text-shimmer bg-[length:200%_auto]">
                                AKHILESH GUPTA
                            </span>
                            <span className="absolute -top-[2px] -left-[2px] text-primary/30 z-0 blur-sm">AKHILESH GUPTA</span>
                        </h1>

                        <div className="flex items-center justify-center gap-4 text-xl md:text-2xl font-medium text-muted-foreground">
                            <Terminal className="w-6 h-6 text-primary animate-pulse" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">
                                Full Stack Architect
                            </span>
                        </div>

                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed border-l-2 border-primary/50 pl-6 text-left italic bg-white/5 p-4 rounded-r-xl">
                            &quot;Forging digital realities using the arcane arts of React and Next.js. I don&apos;t just write code; I craft high-performance engines for the web.&quot;
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="flex gap-4 mt-10"
                    >
                        <Link href="https://github.com/akhilesh10gupta" target="_blank">
                            <Button size="lg" className="h-12 px-8 bg-zinc-900 border border-white/20 hover:bg-white hover:text-black hover:border-white transition-all duration-300 font-bold tracking-wide group">
                                <Github className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                                GITHUB
                            </Button>
                        </Link>
                        <Link href="https://www.linkedin.com/in/akhilesh-gupta-826067228/" target="_blank">
                            <Button size="lg" className="h-12 px-8 bg-primary/90 hover:bg-primary border border-primary text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_40px_rgba(37,99,235,0.6)] transition-all duration-300 font-bold tracking-wide">
                                <Linkedin className="w-5 h-5 mr-2" />
                                CONNECT
                            </Button>
                        </Link>
                    </motion.div>
                </div>

                {/* Skills Section - "Skill Tree" */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-32"
                >
                    <div className="flex items-center gap-4 mb-12">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/20"></div>
                        <h2 className="text-3xl font-black uppercase tracking-wider flex items-center gap-3 text-white">
                            <Zap className="text-yellow-400 w-8 h-8 fill-yellow-400" />
                            Skill Tree
                        </h2>
                        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/20"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {skills.map((skill, idx) => (
                            <div key={idx} className={`p-6 bg-zinc-900/50 backdrop-blur-sm border ${skill.border} rounded-2xl relative group overflow-hidden`}>
                                <div className={`absolute inset-0 bg-${skill.color.split('-')[1]}-500/5 opacity-0 group-hover:opacity-100 transition-opacity`}></div>

                                <div className="flex items-center justify-between mb-4 relative z-10">
                                    <div className={`p-3 rounded-lg bg-zinc-900 border border-white/10 ${skill.color}`}>
                                        {skill.icon}
                                    </div>
                                    <div className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                                        Lvl. {skill.level}
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold mb-3 relative z-10">{skill.name}</h3>

                                {/* XP Bar */}
                                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden relative z-10">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${skill.level}%` }}
                                        transition={{ duration: 1.5, delay: idx * 0.1 }}
                                        className={`h-full ${skill.color.replace('text', 'bg')} shadow-[0_0_10px_currentColor]`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Projects Section - "Quest Log" */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="flex items-center gap-4 mb-12">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/20"></div>
                        <h2 className="text-3xl font-black uppercase tracking-wider flex items-center gap-3 text-white">
                            <Shield className="text-primary w-8 h-8 fill-primary" />
                            Completed Quests
                        </h2>
                        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/20"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {projects.map((project, idx) => (
                            <div key={idx} className="group relative bg-[#0A0A0A] border border-white/10 rounded-3xl overflow-hidden hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-20px_rgba(37,99,235,0.3)]">
                                {/* Holographic Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                                <div className="p-8 h-full flex flex-col relative z-10">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary uppercase tracking-wide">
                                            {project.type}
                                        </div>
                                        <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-white transition-colors" />
                                    </div>

                                    <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-primary transition-colors">{project.title}</h3>
                                    <p className="text-sm text-primary/60 font-mono mb-4">{project.subtitle}</p>

                                    <p className="text-muted-foreground mb-6 flex-1 leading-relaxed">
                                        {project.description}
                                    </p>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-2 gap-2 mb-6 p-4 bg-zinc-900/50 rounded-xl border border-white/5">
                                        {Object.entries(project.stats).map(([key, value], i) => (
                                            <div key={i}>
                                                <div className="text-[10px] uppercase text-muted-foreground font-bold">{key}</div>
                                                <div className="text-sm font-mono text-white">{value}</div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex flex-wrap gap-2 mt-auto">
                                        {project.tech.map((t, i) => (
                                            <span key={i} className="text-xs font-medium px-2 py-1 rounded-md bg-white/5 text-white/50 border border-white/5 group-hover:border-primary/30 group-hover:text-white/80 transition-colors">
                                                {t}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Clickable Area */}
                                    <Link href={project.link} className='absolute inset-0 z-20' target='_blank'>
                                        <span className='sr-only'>View Project</span>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

            </div>
        </main>
    );
}
