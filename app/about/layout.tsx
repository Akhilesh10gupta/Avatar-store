import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'About Us',
    description: 'Learn about Avatar Play, our mission, active players, and game distribution platform.',
}

export default function AboutLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>;
}
