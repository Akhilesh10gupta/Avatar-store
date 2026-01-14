'use client';

import { motion } from 'framer-motion';
import { Button } from './ui/Button';
import { ArrowRight, Sparkles } from 'lucide-react';
import Image from 'next/image';

const Hero = () => {
    return (
        <section className="relative h-[500px] md:h-[600px] w-full overflow-hidden rounded-3xl my-8">
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src="https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop"
                    alt="Hero Background"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="relative h-full flex items-center px-8 md:px-16">
                <div className="max-w-2xl space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4 border border-primary/20">
                            <Sparkles className="w-4 h-4" />
                            New Arrivals
                        </span>
                        <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight">
                            Discover Your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">
                                Next Adventure
                            </span>
                        </h1>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-lg text-muted-foreground md:pr-12"
                    >
                        Explore a vast library of premium games. From indie gems to AAA masterpieces, find it all here.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex flex-wrap gap-4"
                    >
                        <Button size="lg" className="rounded-full">
                            Browse Games <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                        <Button size="lg" variant="outline" className="rounded-full bg-background/50 backdrop-blur-sm border-white/10 hover:bg-white/10">
                            View Collections
                        </Button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
