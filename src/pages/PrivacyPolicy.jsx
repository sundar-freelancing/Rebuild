import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PrivacyPolicy = () => {
    return (
        <main className="min-h-screen pt-20 bg-slate-50 dark:bg-slate-900">
            <article className="py-12 sm:py-16 md:py-24">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline mb-8">
                        <ArrowLeft className="size-4" />
                        Back to Home
                    </Link>

                    <div className="flex items-center gap-3 mb-6">
                        <div className="size-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                            <Shield className="size-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                                Privacy Policy
                            </h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Last updated: March 2024</p>
                        </div>
                    </div>

                    <div className="prose prose-slate dark:prose-invert prose-headings:font-semibold prose-headings:text-slate-900 dark:prose-headings:text-white prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-li:text-slate-600 dark:prose-li:text-slate-400 max-w-none space-y-8 text-sm sm:text-base">
                        <p className="lead text-slate-700 dark:text-slate-300">
                            Rebuild IT Solutions ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services, including our career acceleration programs and mentorship offerings.
                        </p>

                        <section>
                            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">1. Information We Collect</h2>
                            <p>We may collect information that you provide directly to us, including:</p>
                            <ul className="list-disc pl-6 space-y-1 mt-2">
                                <li><strong>Contact information</strong> — name, email address, phone number, and mailing address when you register, book a consultation, or contact us.</li>
                                <li><strong>Account and profile data</strong> — usernames, passwords (hashed), and preferences when you create an account or enroll in a course.</li>
                                <li><strong>Career and education details</strong> — resume, work experience, skills, and learning goals to personalize your mentorship and placement support.</li>
                                <li><strong>Communications</strong> — messages, feedback, and correspondence you send to us.</li>
                                <li><strong>Usage data</strong> — how you interact with our website and learning platform (e.g., pages visited, time spent, device type) to improve our services.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">2. How We Use Your Information</h2>
                            <p>We use the information we collect to:</p>
                            <ul className="list-disc pl-6 space-y-1 mt-2">
                                <li>Deliver, maintain, and improve our courses, mentorship, and placement services.</li>
                                <li>Personalize your learning path and career strategy sessions.</li>
                                <li>Send you updates, newsletters, and marketing communications (with your consent where required).</li>
                                <li>Process payments and comply with legal and tax obligations.</li>
                                <li>Respond to your inquiries and provide customer support.</li>
                                <li>Analyze trends and usage to enhance our platform and content.</li>
                                <li>Protect against fraud, abuse, and security incidents.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">3. Sharing and Disclosure</h2>
                            <p>We do not sell your personal information. We may share your information only in these circumstances:</p>
                            <ul className="list-disc pl-6 space-y-1 mt-2">
                                <li><strong>Service providers</strong> — with trusted partners who assist in hosting, analytics, payment processing, or communication, under strict confidentiality agreements.</li>
                                <li><strong>Placement partners</strong> — with employers or recruitment partners only when you explicitly opt in to placement or job-referral programs.</li>
                                <li><strong>Legal requirements</strong> — when required by law, court order, or to protect our rights, safety, or property.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">4. Data Security</h2>
                            <p>We implement industry-standard technical and organizational measures to protect your data, including encryption, access controls, and regular security assessments. No method of transmission over the internet is 100% secure; we strive to protect your information to the best of our ability.</p>
                        </section>

                        <section>
                            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">5. Your Rights</h2>
                            <p>Depending on your location, you may have the right to:</p>
                            <ul className="list-disc pl-6 space-y-1 mt-2">
                                <li>Access, correct, or delete your personal data.</li>
                                <li>Object to or restrict certain processing.</li>
                                <li>Data portability.</li>
                                <li>Withdraw consent where processing is consent-based.</li>
                                <li>Lodge a complaint with a supervisory authority.</li>
                            </ul>
                            <p className="mt-3">To exercise these rights, contact us at <a href="mailto:info@rebuildit.in" className="text-primary hover:underline">info@rebuildit.in</a>.</p>
                        </section>

                        <section>
                            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">6. Retention</h2>
                            <p>We retain your information only as long as necessary to fulfill the purposes described in this policy, comply with legal obligations, resolve disputes, and enforce our agreements. Account and course-related data may be retained for a reasonable period after your last activity for support and legal purposes.</p>
                        </section>

                        <section>
                            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">7. Children's Privacy</h2>
                            <p>Our services are not directed to individuals under 16. We do not knowingly collect personal information from children. If you believe we have collected such information, please contact us so we can delete it.</p>
                        </section>

                        <section>
                            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">8. Changes to This Policy</h2>
                            <p>We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated policy on this page and updating the "Last updated" date. Your continued use of our services after changes constitutes acceptance of the revised policy.</p>
                        </section>

                        <section>
                            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">9. Contact Us</h2>
                            <p>For questions about this Privacy Policy or our data practices, contact us at:</p>
                            <p className="mt-2">
                                Rebuild IT Solutions<br />
                                Email: <a href="mailto:info@rebuildit.in" className="text-primary hover:underline">info@rebuildit.in</a><br />
                                Address: Tech Hub, Bangalore, India
                            </p>
                        </section>
                    </div>

                    <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-4">
                        <Button asChild variant="outline" size="sm">
                            <Link to="/">Back to Home</Link>
                        </Button>
                        <Button asChild size="sm">
                            <Link to="/contact">Contact Us</Link>
                        </Button>
                    </div>
                </div>
            </article>
        </main>
    );
};

export default PrivacyPolicy;
