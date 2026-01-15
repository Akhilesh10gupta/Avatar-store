import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Cookie Policy | Avatar Play',
    description: 'Learn how Avatar Play uses cookies to improve your experience.',
}

export default function CookiePolicy() {
    return (
        <>
            <div className="mb-8 pb-8 border-b border-border/50">
                <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Cookie Policy</h1>
                <p className="text-muted-foreground">Last updated: <span className="text-primary font-medium">{new Date().toLocaleDateString()}</span></p>
            </div>

            <section className="space-y-8">
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold flex items-center gap-2 text-foreground">
                        <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">1</span>
                        What Are Cookies
                    </h2>
                    <p>
                        Cookies are small text files that are placed on your computer or mobile device by websites that you visit. They are widely used in order to make websites work, or work more efficiently, as well as to provide information to the owners of the site.
                    </p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold flex items-center gap-2 text-foreground">
                        <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">2</span>
                        How We Use Cookies
                    </h2>
                    <p>We use cookies for the following purposes:</p>
                    <div className="grid gap-4">
                        <div className="bg-secondary/50 p-4 rounded-lg border border-border/50 flex gap-4">
                            <div className="w-2 h-full bg-primary rounded-full shrink-0" />
                            <div>
                                <strong className="text-foreground block mb-1">Essential Cookies</strong>
                                These represent the basic functionality of our website, such as keeping you logged in.
                            </div>
                        </div>
                        <div className="bg-secondary/50 p-4 rounded-lg border border-border/50 flex gap-4">
                            <div className="w-2 h-full bg-blue-500 rounded-full shrink-0" />
                            <div>
                                <strong className="text-foreground block mb-1">Analytics Cookies</strong>
                                We use these to understand how visitors interact with our website.
                            </div>
                        </div>
                        <div className="bg-secondary/50 p-4 rounded-lg border border-border/50 flex gap-4">
                            <div className="w-2 h-full bg-green-500 rounded-full shrink-0" />
                            <div>
                                <strong className="text-foreground block mb-1">Preferences</strong>
                                These help us remember your settings and preferences to provide a personalized experience.
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold flex items-center gap-2 text-foreground">
                        <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">3</span>
                        Managing Cookies
                    </h2>
                    <p>
                        Most web browsers allow some control of most cookies through the browser settings. To find out more about cookies, including how to see what cookies have been set, visit www.aboutcookies.org or www.allaboutcookies.org.
                    </p>
                </div>
            </section>
        </>
    )
}
