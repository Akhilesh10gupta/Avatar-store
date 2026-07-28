import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Meet the Developer',
    description: 'Learn about the developer of Avatar Play, Akhilesh Gupta, and their software projects.',
}

export default function DeveloperLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>;
}
