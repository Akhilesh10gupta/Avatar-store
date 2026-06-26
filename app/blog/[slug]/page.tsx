import { blogPosts } from "@/lib/blogData";
import Link from "next/link";
import Image from "next/image";
import { Calendar, User, Clock, ArrowLeft, ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface RouteParams {
    params: Promise<{ slug: string }>;
}

// Generate static routes for all articles at build time
export async function generateStaticParams() {
    return blogPosts.map((post) => ({
        slug: post.slug,
    }));
}

// Dynamic SEO metadata for each article
export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
    const { slug } = await params;
    const post = blogPosts.find((p) => p.slug === slug);
    if (!post) {
        return {};
    }
    return {
        title: `${post.title} | Avatar Play Blog`,
        description: post.description,
        openGraph: {
            title: post.title,
            description: post.description,
            type: "article",
            publishedTime: new Date(post.date).toISOString(),
            authors: [post.author],
            images: [{ url: post.coverImage }],
        },
    };
}

export default async function BlogDetails({ params }: RouteParams) {
    const { slug } = await params;
    const post = blogPosts.find((p) => p.slug === slug);

    if (!post) {
        return notFound();
    }

    const schemaData = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.description,
        "image": post.coverImage,
        "datePublished": new Date(post.date).toISOString(),
        "author": {
            "@type": "Person",
            "name": post.author
        },
        "publisher": {
            "@type": "Organization",
            "name": "Avatar Play",
            "logo": {
                "@type": "ImageObject",
                "url": "https://avatarplay.in/logo.png"
            }
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://avatarplay.in/blog/${post.slug}`
        }
    };

    // Get 2 related articles (excluding the current one)
    const relatedPosts = blogPosts
        .filter((p) => p.slug !== slug)
        .slice(0, 2);

    // Helper to get category colors
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
        <div className="space-y-10 pb-16 max-w-4xl mx-auto">
            {/* Back Button */}
            <Link
                href="/blog"
                className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-white transition-colors group"
            >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Blog
            </Link>

            {/* Article Header */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 flex-wrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryStyles(post.category)}`}>
                        {post.category}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {post.readTime}
                    </span>
                </div>

                <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">
                    {post.title}
                </h1>

                {/* Author Info & Date */}
                <div className="flex items-center gap-4 py-4 border-y border-white/5">
                    <div className="w-10 h-10 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center font-bold text-violet-400">
                        {post.author.charAt(0)}
                    </div>
                    <div>
                        <div className="text-sm font-semibold text-white">{post.author}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-3 mt-0.5">
                            <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {post.date}
                            </span>
                            <span>•</span>
                            <span>Author &amp; Gaming Contributor</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cover Image */}
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/5 shadow-2xl">
                <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                />
            </div>

            {/* Article Body Content */}
            <article className="prose prose-invert max-w-none space-y-6">
                {post.content.map((section, idx) => {
                    switch (section.type) {
                        case 'heading':
                            return (
                                <h2
                                    key={idx}
                                    className="text-2xl md:text-3xl font-bold text-white mt-10 mb-4 tracking-tight border-b border-white/5 pb-2 first:mt-4"
                                >
                                    {section.text}
                                </h2>
                            );
                        case 'paragraph':
                            return (
                                <p
                                    key={idx}
                                    className="text-muted-foreground text-base md:text-lg leading-relaxed mb-6"
                                >
                                    {section.text}
                                </p>
                            );
                        case 'quote':
                            return (
                                <blockquote
                                    key={idx}
                                    className="border-l-4 border-violet-500 bg-white/5 p-6 rounded-r-xl my-8 italic text-lg text-white/90 shadow-inner"
                                >
                                    "{section.text}"
                                </blockquote>
                            );
                        case 'list':
                            return (
                                <ul key={idx} className="space-y-4 my-6 pl-0 list-none">
                                    {section.items?.map((item, itemIdx) => {
                                        // Split bold prefix if present (e.g. "Bold Title: description")
                                        const parts = item.split(': ');
                                        if (parts.length > 1) {
                                            return (
                                                <li key={itemIdx} className="flex items-start text-muted-foreground text-base md:text-lg leading-relaxed">
                                                    <span className="flex-shrink-0 w-2 h-2 rounded-full bg-violet-400 mt-2.5 mr-3.5 shadow-[0_0_8px_rgba(139,92,246,0.6)]"></span>
                                                    <span>
                                                        <strong className="text-white font-semibold">{parts[0]}:</strong>
                                                        {parts.slice(1).join(': ')}
                                                    </span>
                                                </li>
                                            );
                                        }
                                        return (
                                            <li key={itemIdx} className="flex items-start text-muted-foreground text-base md:text-lg leading-relaxed">
                                                <span className="flex-shrink-0 w-2 h-2 rounded-full bg-violet-400 mt-2.5 mr-3.5 shadow-[0_0_8px_rgba(139,92,246,0.6)]"></span>
                                                <span>{item}</span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            );
                        default:
                            return null;
                    }
                })}
            </article>

            {/* Related Articles Divider */}
            <div className="border-t border-white/5 pt-12 mt-16 space-y-8">
                <h3 className="text-2xl font-bold text-white tracking-tight">
                    Related <span className="text-violet-400">Articles</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {relatedPosts.map((rPost) => (
                        <div
                            key={rPost.slug}
                            className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-white/5 bg-[#0a0a0a]/40 p-4 transition-all duration-300 hover:border-violet-500/20 hover:bg-[#0a0a0a]/60"
                        >
                            <Link href={`/blog/${rPost.slug}`} className="space-y-3 flex flex-col h-full justify-between">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium">
                                        <span className={`px-2 py-0.5 rounded-full border ${getCategoryStyles(rPost.category)}`}>
                                            {rPost.category}
                                        </span>
                                        <span>•</span>
                                        <span>{rPost.readTime}</span>
                                    </div>
                                    <h4 className="text-base font-bold text-white group-hover:text-violet-400 transition-colors duration-300 line-clamp-1">
                                        {rPost.title}
                                    </h4>
                                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                        {rPost.description}
                                    </p>
                                </div>
                                <span className="inline-flex items-center text-xs font-bold text-violet-400 mt-3 group-hover:translate-x-1 transition-transform duration-300">
                                    Read Article <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                                </span>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            {/* JSON-LD Schema Markup for Google AI Search */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
            />
        </div>
    );
}
