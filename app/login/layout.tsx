import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Login',
    description: 'Log in to your Avatar Play account to rate games, write reviews, and post in the community.',
}

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>;
}
