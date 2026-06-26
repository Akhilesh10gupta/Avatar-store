import { getBlogPostsPaginatedAdmin, getBlogPostsCountAdmin, seedInitialBlogPosts } from "@/lib/firestore-blog";
import Link from "next/link";
import Image from "next/image";
import { Calendar, User, Clock, ChevronRight, ArrowLeft, ArrowRight } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Gaming Blog & News | Avatar Play",
    description: "Deep dives, expert insights, and late-breaking news from the gaming frontier. Read articles about game tech, retro revivals, cyber avatars, and industry trends.",
};

// Next.js ISR: Revalidate the page once every hour in production
export const revalidate = 3600;

interface PageProps {
    searchParams: Promise<{ page?: string }>;
}

export default async function BlogHome({ searchParams }: PageProps) {
    const { page } = await searchParams;
    const currentPage = parseInt(page || "1", 10);
    const postsPerPage = 7; // 1 featured post + 6 grid posts

    // 1. Fetch total count of posts using ultra-fast count aggregation
    let totalPosts = await getBlogPostsCountAdmin();

    // 2. Self-Healing Seeder fallback if database is completely empty
    if (totalPosts === 0) {
        console.log("No blog posts found in Firestore. Seeding database...");
        await seedInitialBlogPosts();
        totalPosts = await getBlogPostsCountAdmin();
    }

    // Calculate pagination math
    const totalPages = Math.ceil(totalPosts / postsPerPage);
    const offset = (currentPage - 1) * postsPerPage;

    // 3. Fetch ONLY the posts required for this page
    const posts = await getBlogPostsPaginatedAdmin(postsPerPage, offset);

    // 4. Determine layouts based on current page
    // On page 1: first post is featured (wide card), next 6 are in the grid.
    // On page 2+: all N posts are rendered directly in the grid (no redundant massive featured card).
    const featuredPost = currentPage === 1 ? posts[0] : null;
    const gridPosts = currentPage === 1 ? posts.slice(1) : posts;

    // Helper to get HSL tailored category styles
    const getCategoryStyles = (category: string) => {
        switch (category.toLowerCase()) {
            case 'technology':
                return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
            case 'culture':
                return 'bg-pink-500/10 text-pink-400 border-pink-500/20';
            case 'design':
                return 'bg-violet-500/10 text-violet-400 border-violet-500/20';
            case 'industry':
                return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
            case 'security':
                return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            default:
                return 'bg-primary/10 text-primary border-primary/20';
        }
    };

    return (
        <div className="space-y-12 pb-12">
            {/* Header Section */}
            <div className="text-center md:text-left space-y-4 max-w-3xl">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    Gaming News &amp; <span className="text-violet-400">Insights</span>
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                    Explore high-fidelity analysis, gaming culture reviews, developer stories, and cybersecurity guidelines on our curated blog feed.
                </p>
            </div>

            {/* Featured Post (Only rendered on Page 1) */}
            {featuredPost && (
                <div className="group relative overflow-hidden rounded-2xl border border-white/5 bg-[#0a0a0a]/80 p-1 backdrop-blur-xl transition-all duration-500 hover:border-violet-500/30 hover:shadow-[0_0_30px_rgba(139,92,246,0.1)]">
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                    <Link href={`/blog/${featuredPost.slug}`} className="grid md:grid-cols-[1.2fr_1fr] gap-8 p-6 md:p-8 relative z-10">
                        {/* Image */}
                        <div className="relative aspect-[16/10] md:aspect-auto md:h-[350px] overflow-hidden rounded-xl border border-white/5">
                            <Image
                                src={featuredPost.coverImage}
                                alt={featuredPost.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                priority
                            />
                        </div>
                        {/* Meta & Info */}
                        <div className="flex flex-col justify-between py-2 space-y-4">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryStyles(featuredPost.category)}`}>
                                        {featuredPost.category}
                                    </span>
                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {featuredPost.readTime}
                                    </span>
                                </div>
                                <h2 className="text-2xl md:text-3xl font-bold text-white group-hover:text-violet-400 transition-colors duration-300">
                                    {featuredPost.title}
                                </h2>
                                <p className="text-muted-foreground text-base leading-relaxed">
                                    {featuredPost.description}
                                </p>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-xs font-bold text-violet-400">
                                        {featuredPost.author.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-white">{featuredPost.author}</div>
                                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {featuredPost.date}
                                        </div>
                                    </div>
                                </div>
                                <span className="inline-flex items-center text-sm font-bold text-violet-400 group-hover:translate-x-1 transition-transform duration-300">
                                    Read Article <ChevronRight className="w-4 h-4 ml-1" />
                                </span>
                            </div>
                        </div>
                    </Link>
                </div>
            )}

            {/* Grid of Other Posts */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {gridPosts.map((post) => (
                    <div
                        key={post.slug}
                        className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/5 bg-[#0a0a0a]/50 backdrop-blur-xl transition-all duration-300 hover:border-violet-500/20 hover:bg-[#0a0a0a]/80"
                    >
                        <Link href={`/blog/${post.slug}`} className="flex flex-col h-full">
                            {/* Image */}
                            <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl border-b border-white/5">
                                <Image
                                    src={post.coverImage}
                                    alt={post.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-md ${getCategoryStyles(post.category)}`}>
                                    {post.category}
                                </span>
                            </div>

                            {/* Info Content */}
                            <div className="flex flex-col justify-between flex-grow p-6 space-y-4">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {post.date}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5" />
                                            {post.readTime}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white group-hover:text-violet-400 transition-colors duration-300 line-clamp-2">
                                        {post.title}
                                    </h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                                        {post.description}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white/70">
                                            {post.author.charAt(0)}
                                        </div>
                                        <span className="text-xs font-medium text-white/80">{post.author}</span>
                                    </div>
                                    <span className="inline-flex items-center text-xs font-bold text-violet-400 group-hover:translate-x-1 transition-transform duration-300">
                                        Read <ChevronRight className="w-3 h-3 ml-1" />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>

            {/* Empty State Fallback */}
            {posts.length === 0 && (
                <div className="text-center py-12 border border-white/5 bg-[#0a0a0a]/30 rounded-2xl">
                    <p className="text-muted-foreground">No more articles found on this page.</p>
                    {currentPage > 1 && (
                        <Link href="/blog" className="mt-4 inline-flex text-sm text-primary hover:underline">
                            Back to Page 1
                        </Link>
                    )}
                </div>
            )}

            {/* Cyber-Themed Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-6 pt-8 mt-12 border-t border-white/5">
                    {/* Previous Button */}
                    {currentPage > 1 ? (
                        <Link
                            href={`/blog?page=${currentPage - 1}`}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm font-semibold text-white hover:border-violet-500/50 hover:bg-violet-500/10 hover:shadow-[0_0_15px_rgba(139,92,246,0.2)] transition-all duration-300 group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Previous
                        </Link>
                    ) : (
                        <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/5 bg-white/1 text-sm font-semibold text-white/20 cursor-not-allowed">
                            <ArrowLeft className="w-4 h-4" />
                            Previous
                        </span>
                    )}

                    {/* Page Indicator */}
                    <span className="text-sm font-semibold text-white/60 bg-[#0a0a0a] border border-white/10 px-4 py-2.5 rounded-xl backdrop-blur-md">
                        Page <span className="text-violet-400">{currentPage}</span> of <span className="text-white">{totalPages}</span>
                    </span>

                    {/* Next Button */}
                    {currentPage < totalPages ? (
                        <Link
                            href={`/blog?page=${currentPage + 1}`}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm font-semibold text-white hover:border-violet-500/50 hover:bg-violet-500/10 hover:shadow-[0_0_15px_rgba(139,92,246,0.2)] transition-all duration-300 group"
                        >
                            Next
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    ) : (
                        <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/5 bg-white/1 text-sm font-semibold text-white/20 cursor-not-allowed">
                            Next
                            <ArrowRight className="w-4 h-4" />
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
