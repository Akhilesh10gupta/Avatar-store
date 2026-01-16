'use client';

import { useState } from 'react';
import { updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider, AuthError } from 'firebase/auth';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Camera, Save, User as UserIcon, Lock, KeyRound, Gamepad2 } from 'lucide-react';
import { uploadFile } from '@/lib/storage';
import { syncUserProfile } from '@/lib/firestore';
import { UserAvatar } from '@/components/UserAvatar';

export default function ProfileManager() {
    const { user } = useAuth();
    const [displayName, setDisplayName] = useState(user?.displayName || '');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    // Password Update State
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);

    if (!user) return null;

    // Check if user is authenticated with email/password
    const isEmailProvider = user.providerData.some(p => p.providerId === 'password');

    if (!user) return null;

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            await updateProfile(user, { displayName });
            await syncUserProfile(user.uid, { userName: displayName });
            setMessage('Profile updated successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error(error);
            setMessage('Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    const isSuperAdmin = user.email === 'gakhilesh946@gmail.com';

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const photoURL = await uploadFile(file, 'avatars');
            await updateProfile(user, { photoURL });
            await syncUserProfile(user.uid, { userAvatar: photoURL });
            window.location.reload(); // Reload to reflect new avatar across app
        } catch (error) {
            console.error('Error uploading avatar:', error);
            setMessage('Failed to upload image.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordLoading(true);
        setPasswordError('');
        setPasswordSuccess('');

        if (newPassword !== confirmPassword) {
            setPasswordError("New passwords do not match.");
            setPasswordLoading(false);
            return;
        }

        if (newPassword.length < 6) {
            setPasswordError("Password must be at least 6 characters.");
            setPasswordLoading(false);
            return;
        }

        try {
            // Re-authenticate user
            if (user.email) {
                const credential = EmailAuthProvider.credential(user.email, currentPassword);
                await reauthenticateWithCredential(user, credential);

                // Update Password
                await updatePassword(user, newPassword);

                setPasswordSuccess("Password updated successfully!");
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');

                setTimeout(() => setPasswordSuccess(''), 3000);
            }
        } catch (error: any) {
            console.error("Password update error:", error);
            if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
                setPasswordError("Incorrect current password.");
            } else if (error.code === 'auth/requires-recent-login') {
                setPasswordError("Please log in again before changing your password.");
            } else {
                setPasswordError("Failed to update password. Please try again.");
            }
        } finally {
            setPasswordLoading(false);
        }
    };

    return (
        <div className="bg-card border border-border rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-primary" />
                Profile Settings
            </h2>

            {isSuperAdmin && (
                <div className="mb-8 p-4 bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-xl flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-red-400 flex items-center gap-2">
                            <Lock className="w-4 h-4" /> Super Admin Access
                        </h3>
                        <p className="text-xs text-muted-foreground">You have special developer privileges.</p>
                    </div>
                    <Button variant="outline" className="border-red-500/30 hover:bg-red-500/20 text-red-400" onClick={() => window.location.href = '/admin/super'}>
                        Open Dashboard
                    </Button>
                </div>
            )}

            <div className="flex flex-col xl:flex-row gap-12 items-start">

                {/* Left Side: Avatar & Profile Info */}
                <div className="flex flex-col md:flex-row gap-8 items-start flex-1 w-full">

                    {/* Avatar Section */}
                    <div className="flex flex-col items-center gap-4 shrink-0">
                        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-secondary bg-secondary/50 group">
                            {user.photoURL ? (
                                <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <UserIcon className="w-12 h-12 text-muted-foreground" />
                                </div>
                            )}

                            {/* Overlay for upload */}
                            <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                {isUploading ? (
                                    <Gamepad2 className="w-8 h-8 text-white animate-spin" />
                                ) : (
                                    <>
                                        <Camera className="w-8 h-8 text-white mb-1" />
                                        <span className="text-xs text-white font-medium">Change</span>
                                    </>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageUpload}
                                    disabled={isUploading}
                                />
                            </label>
                        </div>
                        <p className="text-xs text-muted-foreground">Click image to upload</p>
                    </div>

                    {/* Profile Form */}
                    <form onSubmit={handleUpdateProfile} className="flex-1 w-full max-w-md space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Display Name</label>
                            <Input
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                placeholder="Enter your name"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <Input
                                value={user.email || ''}
                                disabled
                                className="bg-secondary/50 text-muted-foreground cursor-not-allowed"
                            />
                            <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
                        </div>

                        <div className="flex items-center gap-4 pt-2">
                            <Button type="submit" isLoading={loading} disabled={isUploading}>
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                            </Button>
                            {message && (
                                <p className={`text-sm ${message.includes('success') ? 'text-green-500' : 'text-red-500'}`}>
                                    {message}
                                </p>
                            )}
                        </div>
                    </form>
                </div>

                {/* Right Side: Password Change (Only for Email/Pass users) */}
                {isEmailProvider && (
                    <div className="w-full xl:w-96 xl:border-l xl:border-white/10 xl:pl-12 pt-8 xl:pt-0 border-t xl:border-t-0 border-white/10">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <Lock className="w-5 h-5 text-primary" />
                            Change Password
                        </h3>

                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <div className="space-y-4 p-4 bg-secondary/20 rounded-xl border border-white/5">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Current Password</label>
                                    <div className="relative">
                                        <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type="password"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            placeholder="Enter current"
                                            className="pl-10 bg-secondary/50 border-white/10"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">New Password</label>
                                    <Input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Min 6 chars"
                                        className="bg-secondary/50 border-white/10"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Confirm New</label>
                                    <Input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Retype new"
                                        className="bg-secondary/50 border-white/10"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <Button
                                    type="submit"
                                    isLoading={passwordLoading}
                                    className="w-full h-11"
                                    variant="outline"
                                >
                                    Update Password
                                </Button>

                                {passwordError && (
                                    <p className="text-sm text-red-500 bg-red-500/10 p-2 rounded text-center">{passwordError}</p>
                                )}
                                {passwordSuccess && (
                                    <p className="text-sm text-green-500 bg-green-500/10 p-2 rounded text-center">{passwordSuccess}</p>
                                )}
                            </div>
                        </form>
                    </div>
                )}

                {!isEmailProvider && (
                    <div className="w-full xl:w-96 xl:border-l xl:border-white/10 xl:pl-12 pt-8 xl:pt-0 border-t xl:border-t-0 border-white/10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 text-sm border border-blue-500/20">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12.48 10.92v3.28h-1.28v-3.28h1.28zm-4.517 7.608c0 1.956 1.708 3.472 3.879 3.472 2.169 0 3.879-1.516 3.879-3.472v-1.127H7.965v1.127zm6.38-2.616H7.962v-1.115h6.383v1.115zm.609-2.193H7.35v-1.077h7.604v1.077zm-.38-2.003H7.728V10.64h6.848v1.074z" /></svg>
                            <span>Password managed via Google Account</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
