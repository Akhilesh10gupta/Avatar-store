import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Browse Games',
    description: 'Explore the full collection of indie and premium games on Avatar Play.',
}

export default function BrowseLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>;
}
