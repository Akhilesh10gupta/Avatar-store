import CommunityFeed from '@/components/CommunityFeed';
import { Users } from 'lucide-react';

export default function CommunityPage() {
    return (
        <main className="min-h-screen bg-[#050505] pt-20 pb-8 px-4">
            <div className="container mx-auto max-w-2xl">
                <div className="mb-2">
                    <h1 className="text-xl md:text-2xl font-bold text-white mb-1 flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary" />
                        Community
                    </h1>
                    <p className="text-muted-foreground text-xs md:text-sm">
                        Share your gaming moments, discuss strategies, and connect with fellow gamers.
                    </p>
                </div>

                <CommunityFeed />
            </div>
        </main>
    );
}
