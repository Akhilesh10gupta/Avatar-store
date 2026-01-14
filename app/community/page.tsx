import CommunityFeed from '@/components/CommunityFeed';
import { Users } from 'lucide-react';

export default function CommunityPage() {
    return (
        <main className="min-h-screen bg-[#050505] pt-24 pb-12 px-4">
            <div className="container mx-auto">
                <div className="max-w-2xl mx-auto mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
                        <Users className="w-8 h-8 text-primary" />
                        Community
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Share your gaming moments, discuss strategies, and connect with fellow gamers.
                    </p>
                </div>

                <CommunityFeed />
            </div>
        </main>
    );
}
