'use client';

import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ShieldCheck, AlertCircle, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function Login() {
    const [email, setEmail] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // ... existing code ...

    // (Update imports first)

    // ... inside component ...

    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectPath = searchParams.get('redirect') || '/admin';

    const [isResetting, setIsResetting] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [resetMessage, setResetMessage] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push(redirectPath);
        } catch (err: any) {
            console.error(err);
            setError('Invalid email or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Handle redirect result
        import('firebase/auth').then(({ getRedirectResult }) => {
            getRedirectResult(auth).then((result) => {
                if (result) {
                    router.push(redirectPath);
                }
            }).catch((err) => {
                console.error(err);
                setError('Failed to sign in with Google.');
            });
        });
    }, [router]);

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            const { signInWithRedirect, signInWithPopup } = await import('firebase/auth');

            // Try popup first
            try {
                await signInWithPopup(auth, googleProvider);
                router.push(redirectPath);
            } catch (popupError: any) {
                console.error("Popup failed, trying redirect:", popupError);

                if (popupError.code === 'auth/popup-closed-by-user') {
                    setLoading(false);
                    return;
                }

                // Fallback to redirect for mobile or blocked popups
                try {
                    await signInWithRedirect(auth, googleProvider);
                    return; // Redirecting...
                } catch (redirectError: any) {
                    console.error("Redirect failed:", redirectError);
                    setError(`Sign in failed: ${redirectError.message}`);
                }
            }
        } catch (err: any) {
            console.error(err);
            setError(`System error: ${err.message}`);
        } finally {
            // Only stop loading if we didn't initiate a fallback redirect (if we returned early, we returned)
            // But if we are here and redirecting, we want to keep loading state? 
            // Actually, if signInWithRedirect succeeded, we "return" inside the try block above.
            // If we are here, either everything finished (popup success) -> router push -> component unmount likely.
            // Or both failed. Or popup closed. 
            // So setting false here is safe for the "failure" or "popup closed" cases.
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
                            placeholder="admin@avatarplay.com"
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
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
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

                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border"></span>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        className="w-full flex items-center gap-2"
                        onClick={handleGoogleLogin}
                        disabled={loading}
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        Sign in with Google
                    </Button>

                    <div className="text-center text-sm text-muted-foreground pt-4">
                        Need an admin account?{' '}
                        <Link
                            href={redirectPath !== '/admin' ? `/signup?redirect=${encodeURIComponent(redirectPath)}` : "/signup"}
                            className="text-violet-400 hover:text-violet-300 hover:underline"
                        >
                            Create one
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
