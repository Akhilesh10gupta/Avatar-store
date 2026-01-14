import { Gamepad2, Users, Rocket, Globe } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen pt-24 pb-12 bg-background">
            <div className="container mx-auto px-4">
                {/* Hero Section */}
                <div className="text-center max-w-3xl mx-auto mb-20 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -z-10"></div>
                    <div className="flex justify-center mb-6">
                        <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
                            <Gamepad2 className="w-10 h-10 text-primary" />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                        We Are Avatar Store
                    </h1>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        Your ultimate destination for discovering, downloading, and managing high-quality games.
                        We believe in creating a seamless bridge between developers and gamers, offering a
                        curated experience that prioritizes performance, security, and community.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                    <div className="bg-secondary/20 border border-white/5 p-8 rounded-2xl relative overflow-hidden group hover:border-primary/20 transition-all duration-300">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-all"></div>
                        <Users className="w-10 h-10 text-blue-400 mb-6" />
                        <h3 className="text-xl font-bold mb-3">Community First</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Built by gamers, for gamers. We create an ecosystem where every player feels at home and every voice matters.
                        </p>
                    </div>

                    <div className="bg-secondary/20 border border-white/5 p-8 rounded-2xl relative overflow-hidden group hover:border-primary/20 transition-all duration-300">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2 group-hover:bg-purple-500/20 transition-all"></div>
                        <Rocket className="w-10 h-10 text-purple-400 mb-6" />
                        <h3 className="text-xl font-bold mb-3">Lightning Fast</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Experience optimized downloads and a snappy interface designed to get you into the game faster than ever.
                        </p>
                    </div>

                    <div className="bg-secondary/20 border border-white/5 p-8 rounded-2xl relative overflow-hidden group hover:border-primary/20 transition-all duration-300">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2 group-hover:bg-green-500/20 transition-all"></div>
                        <Globe className="w-10 h-10 text-green-400 mb-6" />
                        <h3 className="text-xl font-bold mb-3">Global Access</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Available across multiple platforms including PC and Android, ensuring you can play your favorite titles anywhere.
                        </p>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y border-white/5">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-white mb-1">10k+</div>
                        <div className="text-sm text-muted-foreground">Active Users</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-white mb-1">500+</div>
                        <div className="text-sm text-muted-foreground">Games</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-white mb-1">99%</div>
                        <div className="text-sm text-muted-foreground">Uptime</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-white mb-1">24/7</div>
                        <div className="text-sm text-muted-foreground">Support</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
