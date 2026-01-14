import { User } from 'firebase/auth';
import { User as UserIcon } from 'lucide-react';

interface UserAvatarProps {
    user: User | null;
    className?: string; // For container sizing/styling
}

export const UserAvatar = ({ user, className = "w-10 h-10" }: UserAvatarProps) => {
    if (!user) {
        return (
            <div className={`${className} rounded-full bg-secondary flex items-center justify-center border border-white/10`}>
                <UserIcon className="w-1/2 h-1/2 text-muted-foreground" />
            </div>
        );
    }

    if (user.photoURL) {
        return (
            <img
                src={user.photoURL}
                alt={user.displayName || "User"}
                className={`${className} rounded-full object-cover border border-white/10`}
            />
        );
    }

    // Generate Initials
    const getInitials = () => {
        if (user.displayName) {
            const names = user.displayName.split(' ');
            if (names.length >= 2) {
                return (names[0][0] + names[1][0]).toUpperCase();
            }
            return names[0].substring(0, 2).toUpperCase();
        }
        if (user.email) {
            return user.email.substring(0, 2).toUpperCase();
        }
        return "U";
    };

    return (
        <div className={`${className} rounded-full bg-violet-600 flex items-center justify-center text-white font-bold border border-white/10 tracking-wider shadow-inner`}>
            {getInitials()}
        </div>
    );
};
