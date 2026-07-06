import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Cookie Policy | Avatar Play',
    description: 'Learn how Avatar Play uses cookies to improve your experience and support our services.',
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
                    <p className="text-muted-foreground leading-relaxed">
                        Cookies are small text files that are stored on your computer or mobile device when you visit a website. They are widely used to make websites work, or work more efficiently, as well as to provide information to the owners of the site.
                    </p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold flex items-center gap-3 text-foreground">
                        <span className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-sm font-bold shadow-md shadow-primary/20">2</span>
                        How We Use Cookies
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                        We use cookies to improve your browsing experience, analyze site traffic, and serve relevant advertisements. The cookies we use fall into the following categories:
                    </p>
                    
                    <div className="grid gap-4 mt-4">
                        <div className="bg-secondary/30 p-5 rounded-xl border border-border/50 flex gap-4">
                            <div className="w-1.5 h-auto bg-primary rounded-full shrink-0" />
                            <div>
                                <strong className="text-white block mb-1">Essential Cookies</strong>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    These cookies are necessary for the website to function properly. They handle basic site security, account authentication (keeping you logged in), and remember your preferences, such as whether you have accepted our cookie consent banner.
                                </p>
                            </div>
                        </div>

                        <div className="bg-secondary/30 p-5 rounded-xl border border-border/50 flex gap-4">
                            <div className="w-1.5 h-auto bg-indigo-500 rounded-full shrink-0" />
                            <div>
                                <strong className="text-white block mb-1">Advertising & Third-Party Cookies (Google AdSense)</strong>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    We partner with Google AdSense to serve advertisements on our site. Google and other third-party vendors use cookies to serve personalized ads based on your prior visits to Avatar Play or other websites on the internet. These cookies do not store personal details like your name or email.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold flex items-center gap-3 text-foreground">
                        <span className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-sm font-bold shadow-md shadow-primary/20">3</span>
                        AdSense & Personalization Disclosures
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                        In compliance with Google AdSense policies, please note the following information regarding advertising cookies:
                    </p>
                    <ul className="list-disc pl-5 space-y-3 marker:text-primary text-muted-foreground">
                        <li>
                            Third-party vendors, including Google, use cookies to serve ads based on your prior visits to our website or other websites.
                        </li>
                        <li>
                            Google's use of advertising cookies enables it and its partners to serve ads to you based on your visits to our site and/or other sites on the Internet.
                        </li>
                        <li>
                            You may opt out of personalized advertising by visiting the official 
                            <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold ml-1.5">
                                Google Ads Settings page
                            </a>.
                        </li>
                        <li>
                            Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting the 
                            <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold ml-1.5">
                                About Ads Info page
                            </a>.
                        </li>
                    </ul>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold flex items-center gap-3 text-foreground">
                        <span className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-sm font-bold shadow-md shadow-primary/20">4</span>
                        Managing and Disabling Cookies
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Most web browsers allow you to control cookies through their settings preferences. You can configure your browser to block or delete cookies entirely. However, please be aware that if you disable essential cookies, key features of Avatar Play (such as user log-in, profile synchronization, rating, and posting comments) will no longer function.
                    </p>
                </div>
            </section>
        </>
    )
}
