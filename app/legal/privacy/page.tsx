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
                <p className="text-muted-foreground text-sm">Last updated: <span className="text-primary font-medium">{new Date().toLocaleDateString()}</span></p>
            </div>

            <section className="space-y-8 text-muted-foreground leading-relaxed">
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold flex items-center gap-3 text-foreground">
                        <span className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-sm font-bold shadow-md shadow-primary/20">1</span>
                        Introduction
                    </h2>
                    <p>
                        Avatar Play ("we," "our," or "us") operates the website located at https://avatarplay.in. We are committed to protecting the privacy and security of your personal data. This Privacy Policy details our practices concerning the collection, use, and disclosure of information we receive from users of our website. By accessing or using our services, you consent to the practices described in this Privacy Policy.
                    </p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold flex items-center gap-3 text-foreground">
                        <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">2</span>
                        Information We Collect
                    </h2>
                    <p>We collect information you provide directly to us, as well as data automatically collected when you navigate through our platform:</p>
                    
                    <h3 className="text-lg font-medium text-foreground mt-2">A. Personal Information Provided by You</h3>
                    <ul className="list-disc pl-5 space-y-2 marker:text-primary">
                        <li><strong>Account Details:</strong> When you register an account, we collect your email address and username to manage your credentials, authenticate your sessions, and secure your profile.</li>
                        <li><strong>User Content:</strong> We store posts, comments, game reviews, ratings, and avatars that you explicitly upload to the community platform.</li>
                        <li><strong>Communications:</strong> If you contact us directly via our support forms or email, we receive the contents of your message, email address, and any attachments.</li>
                    </ul>

                    <h3 className="text-lg font-medium text-foreground mt-4">B. Information Automatically Collected</h3>
                    <ul className="list-disc pl-5 space-y-2 marker:text-primary">
                        <li><strong>Device and Usage Information:</strong> When you visit our website, our servers automatically log details such as your Internet Protocol (IP) address, browser type, operating system, referring/exit pages, and clickstream data.</li>
                        <li><strong>Cookies and Tracking Technologies:</strong> We use cookies to enhance navigation, analyze trends, manage user sessions, and deliver targeted advertising. Please see Section 5 below and our Cookie Policy for more details.</li>
                    </ul>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold flex items-center gap-3 text-foreground">
                        <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">3</span>
                        How We Use Your Information
                    </h2>
                    <p>We process your personal information based on legitimate business interests, performance of a contract, compliance with legal obligations, or with your consent:</p>
                    <ul className="list-disc pl-5 space-y-2 marker:text-primary">
                        <li>To provide, maintain, and optimize our game distribution platform.</li>
                        <li>To personalize your user experience and display your community activities (reviews, forum posts, ratings).</li>
                        <li>To communicate with you, including sending welcome notifications and newsletters (which you can opt out of at any time).</li>
                        <li>To monitor, detect, and prevent fraudulent activity, security breaches, or unauthorized software redistribution (piracy).</li>
                        <li>To serve personalized or non-personalized advertisements via Google AdSense and manage associated ad slots.</li>
                    </ul>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold flex items-center gap-3 text-foreground">
                        <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">4</span>
                        Data Retention and Security
                    </h2>
                    <p>
                        We retain your personal data only for as long as is necessary to fulfill the purposes set out in this Privacy Policy.
                    </p>
                    <div className="bg-green-500/5 border border-green-500/20 p-6 rounded-xl">
                        <p className="mb-0 text-green-200/80 text-sm">
                            We utilize industry-standard cloud architecture (Google Firebase/Firestore) to safeguard your information. This includes end-to-end data transmission security, encrypted storage layers, and secure access policies. While we take every measure to protect your data, no method of electronic transmission or cloud storage is 100% secure, and we cannot guarantee absolute security.
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold flex items-center gap-3 text-foreground">
                        <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">5</span>
                        Advertising & Cookies (Google AdSense Disclosure)
                    </h2>
                    <p>
                        We use Google AdSense to serve advertisements when you visit our website. To do so, Google and other third-party vendors use cookies to serve ads based on your prior visits to our website or other websites on the Internet.
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
                            <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold ml-1">
                                Google Ads Settings
                            </a>.
                        </li>
                        <li>
                            To opt out of a third-party vendor's use of cookies for personalized advertising, visit the 
                            <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold ml-1">
                                About Ads Info portal
                            </a>.
                        </li>
                    </ul>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold flex items-center gap-3 text-foreground">
                        <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">6</span>
                        Your Privacy Rights (GDPR & CCPA)
                    </h2>
                    <p>
                        Depending on your location, you may possess specific legal rights regarding your personal information. Under the General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA), these rights include:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 marker:text-primary">
                        <li><strong>Right of Access:</strong> The right to request copies of the personal data we hold about you.</li>
                        <li><strong>Right to Rectification:</strong> The right to request corrections of inaccurate or incomplete data.</li>
                        <li><strong>Right to Erasure:</strong> The right to request that we erase your personal data under certain conditions (accessible via your Profile settings).</li>
                        <li><strong>Right to Data Portability:</strong> The right to request the transfer of your data to another organization.</li>
                    </ul>
                    <p>
                        To exercise any of these rights, please submit a formal request via our support form on the contact page.
                    </p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold flex items-center gap-3 text-foreground">
                        <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">7</span>
                        Children's Privacy
                    </h2>
                    <p>
                        Our platform is not directed to children under the age of 13. We do not knowingly collect or solicit personal information from children under 13. If we discover that we have inadvertently collected personal data from a child under 13, we will immediately delete that information from our records.
                    </p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold flex items-center gap-3 text-foreground">
                        <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">8</span>
                        Changes to This Privacy Policy
                    </h2>
                    <p>
                        We reserve the right to update or modify this Privacy Policy at any time. Any changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically to stay informed about how we protect your information.
                    </p>
                </div>
            </section>
        </>
    )
}

