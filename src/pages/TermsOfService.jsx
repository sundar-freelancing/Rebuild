import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TermsOfService = () => {
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
                            <FileText className="size-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                                Terms of Service
                            </h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Last updated: March 2024</p>
                        </div>
                    </div>

                    <div className="prose prose-slate dark:prose-invert prose-headings:font-semibold prose-headings:text-slate-900 dark:prose-headings:text-white prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-li:text-slate-600 dark:prose-li:text-slate-400 max-w-none space-y-8 text-sm sm:text-base">
                        <p className="lead text-slate-700 dark:text-slate-300">
                            Welcome to Rebuild IT Solutions. By accessing or using our website, courses, mentorship programs, and related services ("Services"), you agree to be bound by these Terms of Service ("Terms"). Please read them carefully.
                        </p>

                        <section>
                            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">1. Acceptance of Terms</h2>
                            <p>By creating an account, enrolling in a course, booking a consultation, or otherwise using our Services, you confirm that you are at least 16 years of age, have the legal capacity to enter into a binding agreement, and agree to these Terms and our Privacy Policy. If you are using the Services on behalf of an organization, you represent that you have authority to bind that organization.</p>
                        </section>

                        <section>
                            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">2. Description of Services</h2>
                            <p>Rebuild IT Solutions provides career acceleration programs, including but not limited to:</p>
                            <ul className="list-disc pl-6 space-y-1 mt-2">
                                <li>Structured training in manual testing, Selenium automation, Cucumber BDD, and related technologies.</li>
                                <li>Mentorship, live project simulation, and placement preparation.</li>
                                <li>Consultation sessions, webinars, and learning materials accessed via our website and affiliated platforms.</li>
                            </ul>
                            <p className="mt-3">We reserve the right to modify, suspend, or discontinue any part of the Services with reasonable notice where practicable.</p>
                        </section>

                        <section>
                            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">3. Registration and Account</h2>
                            <p>You must provide accurate, current, and complete information when registering. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. Notify us immediately of any unauthorized use or security breach.</p>
                        </section>

                        <section>
                            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">4. Fees and Payment</h2>
                            <p>Fees for courses and services are as displayed at the time of enrollment. You agree to pay all applicable charges. Refund and cancellation policies are stated at checkout and in your enrollment confirmation. We may use third-party payment processors; your payment data is subject to their terms and privacy policies.</p>
                        </section>

                        <section>
                            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">5. Use of Services and Conduct</h2>
                            <p>You agree to use the Services only for lawful purposes and in accordance with these Terms. You must not:</p>
                            <ul className="list-disc pl-6 space-y-1 mt-2">
                                <li>Copy, redistribute, or resell our course content, materials, or credentials without written permission.</li>
                                <li>Use the Services to harass, defame, or harm others or to distribute malware or illegal content.</li>
                                <li>Attempt to gain unauthorized access to our systems, other users' accounts, or any non-public areas of the Services.</li>
                                <li>Use automated means (e.g., bots, scrapers) to access or collect data from the Services unless we have expressly permitted it.</li>
                            </ul>
                            <p className="mt-3">We may suspend or terminate your access if we reasonably believe you have violated these Terms or applicable law.</p>
                        </section>

                        <section>
                            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">6. Intellectual Property</h2>
                            <p>All content, materials, logos, and software provided through the Services (including but not limited to text, videos, code, and designs) are owned by Rebuild IT Solutions or our licensors and are protected by copyright, trademark, and other laws. You receive a limited, non-exclusive, non-transferable license to access and use the Services for your personal, non-commercial learning purposes only. You may not remove any proprietary notices or create derivative works without our prior written consent.</p>
                        </section>

                        <section>
                            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">7. Placement and Outcomes</h2>
                            <p>We provide placement support, resume guidance, and interview preparation as part of our programs. We do not guarantee any specific job offer, salary, or career outcome. Results depend on individual effort, market conditions, and employer decisions. Testimonials and success stories reflect individual experiences and are not guarantees.</p>
                        </section>

                        <section>
                            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">8. Disclaimers</h2>
                            <p>The Services are provided "as is" and "as available" without warranties of any kind, express or implied. We do not warrant that the Services will be uninterrupted, error-free, or free of harmful components. You assume all risk for your use of the Services and any decisions you make based on our content or advice.</p>
                        </section>

                        <section>
                            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">9. Limitation of Liability</h2>
                            <p>To the maximum extent permitted by applicable law, Rebuild IT Solutions and its officers, directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or for loss of profits, data, or goodwill, arising out of or related to your use of the Services. Our total liability for any claims arising from these Terms or the Services shall not exceed the amount you paid us in the twelve (12) months preceding the claim.</p>
                        </section>

                        <section>
                            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">10. Indemnification</h2>
                            <p>You agree to indemnify and hold harmless Rebuild IT Solutions and its affiliates from any claims, damages, losses, or expenses (including reasonable attorneys' fees) arising from your use of the Services, your violation of these Terms, or your violation of any third-party rights.</p>
                        </section>

                        <section>
                            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">11. Governing Law and Disputes</h2>
                            <p>These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Bangalore, India. If any provision of these Terms is found unenforceable, the remaining provisions will remain in effect.</p>
                        </section>

                        <section>
                            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">12. Changes</h2>
                            <p>We may update these Terms from time to time. We will post the updated Terms on this page and update the "Last updated" date. Material changes may be communicated via email or a notice on our website. Your continued use of the Services after changes constitutes acceptance of the revised Terms.</p>
                        </section>

                        <section>
                            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">13. Contact</h2>
                            <p>For questions about these Terms of Service, contact us at:</p>
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

export default TermsOfService;
