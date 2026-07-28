import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Help Center',
    description: 'Guides, tutorials, and help documentation for gamers and developers on Avatar Play.',
}

export default function HelpCenterLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>;
}
