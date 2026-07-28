import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'New Arrivals',
    description: 'Discover the newest games recently published on Avatar Play.',
}

export default function NewArrivalsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>;
}
