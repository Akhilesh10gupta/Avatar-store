import GameForm from '@/components/GameForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AddGamePage() {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <Link href="/admin" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 mb-2">
                    <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </Link>
                <h1 className="text-3xl font-bold">Add New Game</h1>
            </div>
            <GameForm />
        </div>
    );
}
