'use client';

import { useState } from 'react';
import { updateProfile } from 'firebase/auth';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Loader2, Camera, Save, User as UserIcon } from 'lucide-react';
import { uploadFile } from '@/lib/storage';
import { UserAvatar } from '@/components/UserAvatar';

export default function ProfileManager() {
    const { user } = useAuth();
    const [displayName, setDisplayName] = useState(user?.displayName || '');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    if (!user) return null;

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            await updateProfile(user, { displayName });
            setMessage('Profile updated successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error(error);
            setMessage('Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const photoURL = await uploadFile(file, 'avatars');
            await updateProfile(user, { photoURL });
            window.location.reload(); // Reload to reflect new avatar across app
        } catch (error) {
            console.error('Error uploading avatar:', error);
            setMessage('Failed to upload image.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="bg-card border border-border rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-primary" />
                Profile Settings
            </h2>

            <div className="flex flex-col md:flex-row gap-8 items-start">

                {/* Avatar Section */}
                <div className="flex flex-col items-center gap-4">
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
                                <Loader2 className="w-8 h-8 text-white animate-spin" />
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

                {/* Info Section */}
                <form onSubmit={handleUpdateProfile} className="flex-1 w-full space-y-4 max-w-md">
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
        </div>
    );
}
