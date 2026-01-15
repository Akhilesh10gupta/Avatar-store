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
                    <h2 className="text-2xl font-semibold flex items-center gap-3 text-foreground">
                        <span className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-sm font-bold shadow-md shadow-primary/20">1</span>
                        What Are Cookies?
                    </h2>
                    <p>
                        Not the tasty kind 🍪. Cookies are tiny files we save on your browser to remember who you are. Without them, you'd have to log in every single time you clicked a new page.
                    </p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold flex items-center gap-3 text-foreground">
                        <span className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-sm font-bold shadow-md shadow-primary/20">2</span>
                        How We Use Them
                    </h2>
                    <p>We keep it minimal. We use cookies for exactly one main thing:</p>
                    <div className="grid gap-4">
                        <div className="bg-secondary/50 p-4 rounded-lg border border-border/50 flex gap-4">
                            <div className="w-2 h-full bg-primary rounded-full shrink-0" />
                            <div>
                                <strong className="text-foreground block mb-1">Keeping You Logged In</strong>
                                This is the "Essential" cookie. It just tells our Code "Hey, this is [Username], let them post a comment."
                            </div>
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                        *We don't use creepy tracking cookies to follow you around the internet.*
                    </p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold flex items-center gap-3 text-foreground">
                        <span className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-sm font-bold shadow-md shadow-primary/20">3</span>
                        Managing Cookies
                    </h2>
                    <p>
                        If you really hate cookies, you can turn them off in your browser settings (Chrome, Firefox, Safari). But be warned: **You won't be able to log in** to Avatar Play if you do.
                    </p>
                </div>
            </section>
        </>
    )
}
