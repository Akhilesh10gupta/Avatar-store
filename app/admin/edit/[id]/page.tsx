'use client';

import GameForm from '@/components/GameForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, use } from 'react';
import { getGameByIdAction } from '@/app/actions/gameActions';
import { Game } from '@/lib/firestore';
import { Loader2 } from 'lucide-react';

export default function EditGamePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [game, setGame] = useState<Game | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGame = async () => {
            const data = await getGameByIdAction(id);
            setGame(data);
            setLoading(false);
        };
        fetchGame();
    }, [id]);

    if (loading) return <Loader2 className="animate-spin w-8 h-8 mx-auto my-20" />;
    if (!game) return <div>Game not found</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <Link href="/admin" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 mb-2">
                    <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </Link>
                <h1 className="text-3xl font-bold">Edit Game: {game.title}</h1>
            </div>
            <GameForm initialData={game} />
        </div>
    );
}
