import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Contact Support',
    description: 'Get in touch with Avatar Play support. We are here to help with your accounts, bug reports, and publisher requests.',
}

export default function ContactLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>;
}
