import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Sign Up',
    description: 'Create an Avatar Play account today to start sharing posts and rating games.',
}

export default function SignUpLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>;
}
