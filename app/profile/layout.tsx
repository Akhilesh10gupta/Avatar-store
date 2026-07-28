import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'User Profile',
    description: 'View your profile, dashboard, game ratings, and contributions on Avatar Play.',
}

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>;
}
