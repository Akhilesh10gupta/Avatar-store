'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ShieldCheck, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const [isResetting, setIsResetting] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [resetMessage, setResetMessage] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/admin');
        } catch (err: any) {
            console.error(err);
            setError('Invalid email or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResetMessage('');

        try {
            await import('firebase/auth').then(({ sendPasswordResetEmail }) =>
                sendPasswordResetEmail(auth, resetEmail)
            );
            setResetMessage('Password reset link sent! Check your email.');
            setResetEmail('');
        } catch (err: any) {
            console.error(err);
            setError('Failed to send reset email. Please verify the email address.');
        } finally {
            setLoading(false);
        }
    };

    if (isResetting) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <div className="w-full max-w-md p-8 bg-card rounded-2xl border border-border shadow-2xl animate-in fade-in zoom-in-95 duration-300">
                    <div className="flex flex-col items-center mb-8 space-y-2">
                        <div className="bg-primary/20 p-3 rounded-full">
                            <ShieldCheck className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-2xl font-bold">Reset Password</h1>
                        <p className="text-muted-foreground text-sm text-center">
                            Enter your email to receive a password reset link.
                        </p>
                    </div>

                    <form onSubmit={handlePasswordReset} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <Input
                                type="email"
                                placeholder="name@example.com"
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                                required
                            />
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}

                        {resetMessage && (
                            <div className="flex items-center gap-2 text-green-500 text-sm bg-green-500/10 p-3 rounded-lg">
                                <ShieldCheck className="w-4 h-4" />
                                {resetMessage}
                            </div>
                        )}

                        <Button type="submit" className="w-full" isLoading={loading}>
                            Send Reset Link
                        </Button>

                        <div className="text-center">
                            <button
                                type="button"
                                onClick={() => { setIsResetting(false); setError(''); setResetMessage(''); }}
                                className="text-sm text-primary hover:underline"
                            >
                                Back to Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center">
            <div className="w-full max-w-md p-8 bg-card rounded-2xl border border-border shadow-2xl">
                <div className="flex flex-col items-center mb-8 space-y-2">
                    <div className="bg-primary/20 p-3 rounded-full">
                        <ShieldCheck className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold">Admin Access</h1>
                    <p className="text-muted-foreground text-sm text-center">
                        Please authenticated to access the game management dashboard.
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <Input
                            type="email"
                            placeholder="admin@avatarstore.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">Password</label>
                            <button
                                type="button"
                                onClick={() => setIsResetting(true)}
                                className="text-xs text-violet-400 hover:text-violet-300 hover:underline"
                            >
                                Forgot password?
                            </button>
                        </div>
                        <Input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    <Button type="submit" className="w-full" isLoading={loading}>
                        Sign In
                    </Button>

                    <div className="text-center text-sm text-muted-foreground pt-4">
                        Need an admin account?{' '}
                        <Link href="/signup" className="text-violet-400 hover:text-violet-300 hover:underline">
                            Create one
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
