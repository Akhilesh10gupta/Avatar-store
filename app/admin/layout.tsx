'use client';

import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/Button';
import { LogOut } from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    if (loading) {
        return (
            <div className="h-full w-full flex items-center justify-center p-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!user) {
        return null; // Will redirect
    }

    return (
        <div className="admin-layout space-y-6">
            <div className="flex items-center justify-between border-b border-border/50 pb-4">
                <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
                <div className="flex items-center gap-4">
                    <div className="text-sm text-muted-foreground hidden md:block">
                        Logged in as <span className="text-foreground">{user.email}</span>
                    </div>
                    <Button size="sm" variant="outline" onClick={handleLogout} className="text-xs">
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                    </Button>
                </div>
            </div>
            {children}
        </div>
    );
}
