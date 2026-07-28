import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Top Rated Games',
    description: 'Check out the highest-rated games as voted by the Avatar Play community.',
}

export default function TopRatedLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>;
}
