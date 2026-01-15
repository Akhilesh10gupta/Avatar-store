'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, FileText, Cookie, Scale, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export default function LegalLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname();

    const links = [
        { href: '/legal/terms', label: 'Terms of Service', icon: Scale },
        { href: '/legal/privacy', label: 'Privacy Policy', icon: Shield },
        { href: '/legal/cookies', label: 'Cookie Policy', icon: Cookie },
    ];

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl min-h-screen">
            <div className="mb-8">
                <Link href="/">
                    <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-primary pl-0">
                        <ArrowLeft className="w-4 h-4" /> Back to Store
                    </Button>
                </Link>
            </div>

            <div className="grid md:grid-cols-[280px_1fr] gap-8 items-start">
                {/* Mobile Navigation (Tabs) */}
                <div className="md:hidden mb-6 sticky top-20 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-2 -mx-4 px-4 overflow-x-auto scrollbar-hide border-b border-border/50">
                    <nav className="flex items-center gap-2 min-w-max">
                        {links.map((link) => {
                            const Icon = link.icon;
                            const isActive = pathname === link.href;
                            return (
                                <Link key={link.href} href={link.href}>
                                    <div className={cn(
                                        "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border",
                                        isActive
                                            ? "bg-primary text-white border-primary shadow-lg shadow-primary/25"
                                            : "bg-card border-border/50 text-muted-foreground hover:bg-secondary hover:text-foreground hover:border-border"
                                    )}>
                                        <Icon className="w-3.5 h-3.5" />
                                        {link.label}
                                    </div>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Desktop Sidebar Navigation */}
                <div className="hidden md:block space-y-6 sticky top-24">
                    <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-primary" />
                            Legal Center
                        </h3>
                        <nav className="space-y-2">
                            {links.map((link) => {
                                const Icon = link.icon;
                                const isActive = pathname === link.href;
                                return (
                                    <Link key={link.href} href={link.href}>
                                        <div className={cn(
                                            "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                                            isActive
                                                ? "bg-primary text-white shadow-lg shadow-primary/25"
                                                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                        )}>
                                            <Icon className="w-4 h-4" />
                                            {link.label}
                                        </div>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    <div className="bg-gradient-to-br from-primary/20 to-secondary/50 rounded-xl p-6 border border-primary/10">
                        <h4 className="font-bold text-sm mb-2">Need Help?</h4>
                        <p className="text-xs text-muted-foreground mb-4">
                            If you have questions about our policies, please contact our support team.
                        </p>
                        <Button size="sm" className="w-full">Contact Support</Button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="bg-card border border-border/50 rounded-2xl p-8 md:p-12 shadow-lg relative overflow-hidden">
                    {/* Decorative Background */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2" />

                    <div className="relative z-10 prose prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground prose-a:text-primary hover:prose-a:underline">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}
