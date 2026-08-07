import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Legal Disclaimer & DMCA Policy | Avatar Play',
    description: 'Legal disclaimer, liability limitation, and DMCA copyright infringement policy for Avatar Play.',
}

export default function LegalDisclaimer() {
    return (
        <>
            <div className="mb-8 pb-8 border-b border-border/50">
                <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Legal Disclaimer & DMCA</h1>
                <p className="text-muted-foreground text-sm">Last updated: <span className="text-primary font-medium">{new Date().toLocaleDateString()}</span></p>
            </div>

            <section className="space-y-8 text-muted-foreground leading-relaxed">
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold flex items-center gap-3 text-foreground">
                        <span className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-sm font-bold shadow-md shadow-primary/20">1</span>
                        Website Disclaimer
                    </h2>
                    <p>
                        The information and software files provided on the Avatar Play website (https://avatarplay.in) are for general informational, educational, and cataloging purposes only. While we endeavor to keep the website up to date, secure, and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability with respect to the website or the information, products, services, or related graphics contained on the website for any purpose. Any reliance you place on such information is therefore strictly at your own risk.
                    </p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold flex items-center gap-3 text-foreground">
                        <span className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-sm font-bold shadow-md shadow-primary/20">2</span>
                        Software & Links Disclaimer
                    </h2>
                    <p>
                        Avatar Play catalogs games and software applications. All download links provided on this site lead to official developer sites, verified storefronts (like Google Play, Steam, Itch.io), or officially authorized public files hosted securely. 
                    </p>
                    <p>
                        We perform automated security and integrity scans on any file hosted by us. However, we cannot and do not guarantee that files downloaded from our site or third-party links will be completely free of viruses, malware, or other malicious components. Users are strongly advised to run active antivirus protection on their systems before launching downloaded games. Avatar Play holds no liability for damage caused to systems or loss of data resulting from downloaded files.
                    </p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold flex items-center gap-3 text-foreground">
                        <span className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-sm font-bold shadow-md shadow-primary/20">3</span>
                        DMCA & Copyright Infringement Policy
                    </h2>
                    <p>
                        Avatar Play respects the intellectual property rights of others. In accordance with the Digital Millennium Copyright Act (DMCA), we will respond expeditiously to clear notices of alleged copyright infringement.
                    </p>
                    <p>
                        If you are a copyright owner or authorized agent thereof and believe that any content hosted or cataloged on this website infringes your copyrights, you may submit a formal notification by providing our team with the following information in writing:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 marker:text-primary">
                        <li>A physical or electronic signature of a person authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.</li>
                        <li>Identification of the copyrighted work claimed to have been infringed, or, if multiple copyrighted works at a single online site are covered by a single notification, a representative list of such works.</li>
                        <li>Identification of the material that is claimed to be infringing or to be the subject of infringing activity and that is to be removed or access to which is to be disabled, and information reasonably sufficient to permit us to locate the material (such as specific page URLs).</li>
                        <li>Information reasonably sufficient to permit us to contact you, such as an address, telephone number, and an email address.</li>
                        <li>A statement that you have a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.</li>
                        <li>A statement that the information in the notification is accurate, and under penalty of perjury, that you are authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.</li>
                    </ul>
                    <p>
                        Please submit your DMCA takedown requests via the support contact form on our 
                        <a href="/contact" className="text-primary hover:underline font-semibold ml-1">Contact Page</a>. We will process and address all valid takedown notices within 24-48 business hours.
                    </p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold flex items-center gap-3 text-foreground">
                        <span className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-sm font-bold shadow-md shadow-primary/20">4</span>
                        External Links
                    </h2>
                    <p>
                        Through this website, you are able to link to other websites which are not under the control of Avatar Play. We have no control over the nature, content, and availability of those sites. The inclusion of any links does not necessarily imply a recommendation or endorse the views expressed within them.
                    </p>
                </div>
            </section>
        </>
    )
}
