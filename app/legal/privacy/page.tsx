import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Privacy Policy | Avatar Play',
    description: 'How we collect, use, and protect your data at Avatar Play.',
}

export default function PrivacyPolicy() {
    return (
        <>
            <div className="mb-8 pb-8 border-b border-border/50">
                <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Privacy Policy</h1>
                <p className="text-muted-foreground">Last updated: <span className="text-primary font-medium">{new Date().toLocaleDateString()}</span></p>
            </div>

            <section className="space-y-6">
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold flex items-center gap-3 text-foreground">
                        <span className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-sm font-bold shadow-md shadow-primary/20">1</span>
                        We Respect Your Privacy
                    </h2>
                    <p>
                        At Avatar Play, we believe in keeping things simple. We only collect the data necessary to make our features work. **We do not sell your data to third parties.**
                    </p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold flex items-center gap-2 text-foreground">
                        <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">2</span>
                        What We Actually Collect
                    </h2>
                    <p>We only store information that you provide to us directly:</p>
                    <ul className="grid sm:grid-cols-2 gap-4 list-none pl-0">
                        <li className="bg-secondary/50 p-4 rounded-lg border border-border/50">
                            <strong className="text-foreground block mb-1">Account Info:</strong>
                            Your username and email address (so you can log in).
                        </li>
                        <li className="bg-secondary/50 p-4 rounded-lg border border-border/50">
                            <strong className="text-foreground block mb-1">Your Content:</strong>
                            The posts, comments, and reviews you define.
                        </li>
                        <li className="bg-secondary/50 p-4 rounded-lg border border-border/50">
                            <strong className="text-foreground block mb-1">Game Ratings:</strong>
                            Your star ratings (so we can calculate the average).
                        </li>
                        <li className="bg-secondary/50 p-4 rounded-lg border border-border/50">
                            <strong className="text-foreground block mb-1">Profile Picture:</strong>
                            If you upload one, we host it for you.
                        </li>
                    </ul>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold flex items-center gap-2 text-foreground">
                        <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">3</span>
                        Using Your Data
                    </h2>
                    <p>
                        We use this information strictly to provide our services to you:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 marker:text-primary">
                        <li>To create and manage your account.</li>
                        <li>To display your posts and comments to the community.</li>
                        <li>To remember which games you have rated.</li>
                    </ul>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold flex items-center gap-2 text-foreground">
                        <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">4</span>
                        Data Security
                    </h2>
                    <div className="bg-green-500/5 border border-green-500/20 p-6 rounded-xl">
                        <p className="mb-0 text-green-200/80">
                            Your data is securely stored using Google Firebase, an industry-standard secure cloud platform. We protect it as if it were our own.
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold flex items-center gap-2 text-foreground">
                        <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">5</span>
                        Advertising & Cookies (Google AdSense)
                    </h2>
                    <p>
                        We partner with third-party advertising networks, including **Google AdSense**, to serve relevant advertisements when you visit our website. To facilitate this, third-party vendors, including Google, use cookies to serve ads based on your prior visits to Avatar Play or other websites on the internet.
                    </p>
                    <p>
                        Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visits to our site and/or other sites on the Internet.
                    </p>
                    <p>
                        You can manage your preferences or opt out of personalized advertising by visiting the following resources:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 marker:text-primary">
                        <li>
                            To opt out of personalized Google advertising, visit the official 
                            <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium ml-1">
                                Google Ads Settings
                            </a>.
                        </li>
                        <li>
                            To opt out of a third-party vendor's use of cookies for personalized advertising, visit 
                            <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium ml-1">
                                About Ads Info
                            </a>.
                        </li>
                    </ul>
                </div>
            </section>
        </>
    )
}
