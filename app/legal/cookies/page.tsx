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
                <p className="text-muted-foreground text-sm">Last updated: <span className="text-primary font-medium">{new Date().toLocaleDateString()}</span></p>
            </div>

            <section className="space-y-8 text-muted-foreground leading-relaxed">
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold flex items-center gap-3 text-foreground">
                        <span className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-sm font-bold shadow-md shadow-primary/20">1</span>
                        What Are Cookies?
                    </h2>
                    <p>
                        Cookies are small text files that are downloaded and stored on your computer, smartphone, or other internet-enabled device when you visit a website. They enable websites to recognize your device, remember your preferences, and secure your transactions. Cookies act as a memory for the website, allowing it to provide a more efficient and personalized user experience.
                    </p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold flex items-center gap-3 text-foreground">
                        <span className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-sm font-bold shadow-md shadow-primary/20">2</span>
                        How We Use Cookies
                    </h2>
                    <p>
                        Avatar Play uses cookies and similar tracking technologies (such as web beacons and local storage) to ensure our platform operates smoothly, analyze user engagement, and support the platform financially through advertising partnerships. The cookies we deploy are categorized as follows:
                    </p>
                    
                    <div className="grid gap-4 mt-4">
                        <div className="bg-secondary/30 p-5 rounded-xl border border-border/50 flex gap-4">
                            <div className="w-1.5 h-auto bg-primary rounded-full shrink-0" />
                            <div>
                                <strong className="text-white block mb-1 font-semibold text-base">Essential and Functional Cookies</strong>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    These cookies are absolutely necessary for the core functionality of Avatar Play. They manage session authentication (keeping you logged in), enforce security parameters, track your XP levels and achievements, and store user-specific preferences such as your consent choices for cookies. Without these cookies, the website cannot perform properly.
                                </p>
                            </div>
                        </div>

                        <div className="bg-secondary/30 p-5 rounded-xl border border-border/50 flex gap-4">
                            <div className="w-1.5 h-auto bg-indigo-500 rounded-full shrink-0" />
                            <div>
                                <strong className="text-white block mb-1 font-semibold text-base">Third-Party Advertising Cookies (Google AdSense)</strong>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    We integrate Google AdSense to serve programmatic ads across our pages. Third-party vendors, including Google, use cookies to serve personalized advertisements based on your browsing patterns and previous visits to Avatar Play or other sites on the web. These cookies help advertisers show ads that are relevant to you and prevent you from seeing the same ad repeatedly.
                                </p>
                            </div>
                        </div>

                        <div className="bg-secondary/30 p-5 rounded-xl border border-border/50 flex gap-4">
                            <div className="w-1.5 h-auto bg-blue-500 rounded-full shrink-0" />
                            <div>
                                <strong className="text-white block mb-1 font-semibold text-base">Analytics and Performance Cookies</strong>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    We use analytics tools to gather aggregate, non-personal data regarding user traffic patterns and platform performance. This helps us understand which pages are visited most frequently, identify software bugs, and continuously optimize user experience.
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
                    <p>
                        In strict compliance with Google AdSense Publisher Policies, we provide the following disclosures regarding our advertising cookies:
                    </p>
                    <ul className="list-disc pl-5 space-y-3 marker:text-primary">
                        <li>
                            Third-party vendors, including Google, use cookies to serve advertisements based on your prior visits to our platform or other websites.
                        </li>
                        <li>
                            Google's use of advertising cookies enables it and its partners to serve targeted ads to you based on your visits to our site and other locations on the Internet.
                        </li>
                        <li>
                            You can opt out of personalized Google advertising at any time by visiting the official 
                            <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold ml-1.5">
                                Google Ads Settings
                            </a>.
                        </li>
                        <li>
                            Alternatively, you may choose to opt out of a third-party vendor's use of cookies for personalized advertising by visiting the 
                            <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold ml-1.5">
                                About Ads Info portal
                            </a>.
                        </li>
                    </ul>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold flex items-center gap-3 text-foreground">
                        <span className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-sm font-bold shadow-md shadow-primary/20">4</span>
                        Managing and Disabling Cookies
                    </h2>
                    <p>
                        You have the right to choose whether to accept or refuse cookies. Most web browsers are configured to accept cookies by default, but you can usually adjust your browser settings to reject cookies or prompt you before accepting them. 
                    </p>
                    <p>
                        Please note that if you decide to disable or block cookies, certain sections of Avatar Play—including account creation, user logins, game reviews, community feeds, and game rating modules—may experience reduced functionality or fail to work entirely.
                    </p>
                </div>
            </section>
        </>
    )
}

