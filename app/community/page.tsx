import CommunityFeed from '@/components/CommunityFeed';
import { getPostsAction } from '@/app/actions/communityActions';
import { Users } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Community Feed',
    description: 'Share your gaming moments, discuss strategies, and connect with fellow gamers on Avatar Play.',
}

export const dynamic = 'force-dynamic';

export default async function CommunityPage() {
    const initialPosts = await getPostsAction(1, 10);
    return (
        <main className="min-h-screen bg-[#050505] pt-4 pb-8 px-4">
            <div className="container mx-auto max-w-2xl">
                <div className="mb-1">
                    <h1 className="text-xl md:text-2xl font-bold text-white mb-0.5 flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary" />
                        Community
                    </h1>
                    <p className="text-muted-foreground text-[10px] md:text-xs">
                        Share your gaming moments, discuss strategies, and connect with fellow gamers.
                    </p>
                </div>

                <CommunityFeed initialPosts={initialPosts} />
            </div>
        </main>
    );
}
