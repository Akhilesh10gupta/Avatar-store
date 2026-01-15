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
                        Agreement to Terms
                    </h2>
                    <p>
                        By accessing our website at Avatar Play, you agree to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                    </p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold flex items-center gap-3 text-foreground">
                        <span className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-sm font-bold shadow-md shadow-primary/20">2</span>
                        Use License
                    </h2>
                    <p>
                        Permission is granted to temporarily download one copy of the materials (information or software) on Avatar Play's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 marker:text-primary">
                        <li>Modify or copy the materials;</li>
                        <li>Use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
                        <li>Attempt to decompile or reverse engineer any software contained on Avatar Play's website;</li>
                        <li>Remove any copyright or other proprietary notations from the materials; or</li>
                        <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
                    </ul>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold flex items-center gap-2 text-foreground">
                        <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">3</span>
                        User Account
                    </h2>
                    <div className="bg-blue-500/5 border border-blue-500/20 p-6 rounded-xl">
                        <p className="mb-0 text-blue-200/80">
                            If you create an account on the Website, you are responsible for maintaining the security of your account and you are fully responsible for all activities that occur under the account. You must immediately notify us of any unauthorized uses of your account or any other breaches of security.
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold flex items-center gap-2 text-foreground">
                        <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">4</span>
                        Termination
                    </h2>
                    <p>
                        We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                    </p>
                </div>
            </section>
        </>
    )
}
