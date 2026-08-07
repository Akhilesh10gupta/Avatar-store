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
                <p className="text-muted-foreground text-sm">Last updated: <span className="text-primary font-medium">{new Date().toLocaleDateString()}</span></p>
            </div>

            <section className="space-y-8 text-muted-foreground leading-relaxed">
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold flex items-center gap-3 text-foreground">
                        <span className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-sm font-bold shadow-md shadow-primary/20">1</span>
                        Acceptance of Terms
                    </h2>
                    <p>
                        By accessing, browsing, or using the Avatar Play website (located at https://avatarplay.in) and any services or products provided therein, you agree to be bound by these Terms of Service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                    </p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold flex items-center gap-3 text-foreground">
                        <span className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-sm font-bold shadow-md shadow-primary/20">2</span>
                        Platform Usage & Code of Conduct
                    </h2>
                    <p>
                        Avatar Play is a premium gaming community and software distribution platform. To maintain a safe, welcoming, and professional environment for all gamers and developers, you agree to use the platform in accordance with the following rules:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 marker:text-primary">
                        <li><strong>Respectful Interaction:</strong> Harassment, hate speech, spamming, and offensive behavior in the comments, reviews, or community posts are strictly prohibited.</li>
                        <li><strong>No Malicious Behavior:</strong> You must not upload, post, or transmit any software, link, or content that contains computer viruses, malware, trojan horses, or any other destructive computer code.</li>
                        <li><strong>No Unauthorized Scraping:</strong> You agree not to use automated scripts, bots, spiders, or scrapers to copy content or mass-download games from our database.</li>
                    </ul>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold flex items-center gap-3 text-foreground">
                        <span className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-sm font-bold shadow-md shadow-primary/20">3</span>
                        Intellectual Property & Piracy Policy
                    </h2>
                    <p>
                        We respect the intellectual property rights of game developers and publishers. The games hosted or cataloged on our site are distributed under official developer authorizations, freeware/shareware licenses, or are linked directly to official download stores.
                    </p>
                    <div className="bg-blue-500/5 border border-blue-500/20 p-6 rounded-xl">
                        <p className="mb-0 text-blue-200/80 text-sm">
                            <strong>Zero Tolerance Piracy Policy:</strong> The upload, share, or distribution of cracked games, serial keys, key generators, or bypassed copyrighted software is strictly forbidden on Avatar Play. Users who violate this policy will face immediate and permanent account suspension.
                        </p>
                    </div>
                    <p>
                        If you are a copyright owner and believe that any content hosted on our site infringes your copyright, please consult our official <strong>Legal Disclaimer & DMCA Policy</strong> to submit an infringement notice.
                    </p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold flex items-center gap-3 text-foreground">
                        <span className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-sm font-bold shadow-md shadow-primary/20">4</span>
                        User Accounts & Security
                    </h2>
                    <p>
                        To access certain features of the platform, you may be required to register an account. You are solely responsible for maintaining the confidentiality of your account password and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account or security breach.
                    </p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold flex items-center gap-3 text-foreground">
                        <span className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-sm font-bold shadow-md shadow-primary/20">5</span>
                        Disclaimers & Limitations of Liability
                    </h2>
                    <p>
                        The services and software on Avatar Play are provided on an "as is" and "as available" basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties of merchantability, fitness for a particular purpose, or non-infringement of intellectual property.
                    </p>
                    <p>
                        In no event shall Avatar Play or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our platform.
                    </p>
                </div>
            </section>
        </>
    )
}

