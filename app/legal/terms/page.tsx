import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Terms of Service | Avatar Play',
    description: 'Terms and conditions for using Avatar Play.',
}

export default function TermsOfService() {
    return (
        <>
            <div className="mb-8 pb-8 border-b border-border/50">
                <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Terms of Service</h1>
                <p className="text-muted-foreground">Last updated: <span className="text-primary font-medium">{new Date().toLocaleDateString()}</span></p>
            </div>

            <section className="space-y-8">
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold flex items-center gap-3 text-foreground">
                        <span className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-sm font-bold shadow-md shadow-primary/20">1</span>
                        The “Be Nice” Rule
                    </h2>
                    <p>
                        Welcome to Avatar Play! By using our site, you agree to simply be a decent human being. Treat others with respect in the comments, don't spam, and don't post hateful content.
                    </p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold flex items-center gap-3 text-foreground">
                        <span className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-sm font-bold shadow-md shadow-primary/20">2</span>
                        Don't Pirate Stuff
                    </h2>
                    <p>
                        We respect game developers. The games listed here are either free-to-play, official demos, or linked to official stores. **Do not upload pirated games or crack files.** If you do, we'll have to ban you.
                    </p>
                    <ul className="list-disc pl-5 space-y-2 marker:text-primary">
                        <li>Don't pretend to be a game developer if you aren't one.</li>
                        <li>Don't upload viruses or malware.</li>
                    </ul>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold flex items-center gap-3 text-foreground">
                        <span className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-sm font-bold shadow-md shadow-primary/20">3</span>
                        Your Account
                    </h2>
                    <div className="bg-blue-500/5 border border-blue-500/20 p-6 rounded-xl">
                        <p className="mb-0 text-blue-200/80">
                            You are responsible for your account. Pick a strong password and don't share it. If someone hacks your account because your password was "password123", that's on you (but we'll try to help if we can).
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold flex items-center gap-3 text-foreground">
                        <span className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-sm font-bold shadow-md shadow-primary/20">4</span>
                        That's It!
                    </h2>
                    <p>
                        We reserve the right to ban users who ruin the fun for everyone else. Let's keep this a cool place for gamers.
                    </p>
                </div>
            </section>
        </>
    )
}
