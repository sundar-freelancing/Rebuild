import React from 'react';
import { Link } from 'react-router-dom';
import { Cookie, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CookiePolicy = () => {
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
                            <Cookie className="size-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                                Cookie Policy
                            </h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Last updated: March 2024</p>
                        </div>
                    </div>

                    <div className="prose prose-slate dark:prose-invert prose-headings:font-semibold prose-headings:text-slate-900 dark:prose-headings:text-white prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-li:text-slate-600 dark:prose-li:text-slate-400 max-w-none space-y-8 text-sm sm:text-base">
                        <p className="lead text-slate-700 dark:text-slate-300">
                            This Cookie Policy explains how Rebuild IT Solutions ("we", "us", or "our") uses cookies and similar technologies when you visit our website and use our services. It should be read together with our <Link to="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>.
                        </p>

                        <section>
                            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">1. What Are Cookies?</h2>
                            <p>Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit a website. They are widely used to make websites work more efficiently, remember your preferences, and provide information to site owners. Similar technologies include local storage, session storage, and pixel tags, which we may also use where relevant.</p>
                        </section>

                        <section>
                            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">2. How We Use Cookies</h2>
                            <p>We use cookies and similar technologies for the following purposes:</p>
                            <ul className="list-disc pl-6 space-y-1 mt-2">
                                <li><strong>Essential operation</strong> — to keep you logged in, maintain your session, and ensure security (e.g., CSRF protection, load balancing).</li>
                                <li><strong>Preferences</strong> — to remember your settings, such as language, region, or theme (e.g., light/dark mode), so your experience is consistent across visits.</li>
                                <li><strong>Analytics and performance</strong> — to understand how visitors use our site (e.g., pages viewed, time spent, device type) so we can improve content and usability. We may use first-party or third-party analytics tools.</li>
                                <li><strong>Marketing (where applicable)</strong> — to deliver relevant ads or measure the effectiveness of our campaigns, only where you have given consent as required by law.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">3. Types of Cookies We Use</h2>
                            <table className="w-full border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden text-left">
                                <thead>
                                    <tr className="bg-slate-100 dark:bg-slate-800">
                                        <th className="px-4 py-3 text-slate-900 dark:text-white font-semibold">Type</th>
                                        <th className="px-4 py-3 text-slate-900 dark:text-white font-semibold">Purpose</th>
                                        <th className="px-4 py-3 text-slate-900 dark:text-white font-semibold">Duration</th>
                                    </tr>
                                </thead>
                                <tbody className="text-slate-600 dark:text-slate-400">
                                    <tr className="border-t border-slate-200 dark:border-slate-700">
                                        <td className="px-4 py-3 font-medium">Strictly necessary</td>
                                        <td className="px-4 py-3">Session, security, load balancing</td>
                                        <td className="px-4 py-3">Session or short-lived</td>
                                    </tr>
                                    <tr className="border-t border-slate-200 dark:border-slate-700">
                                        <td className="px-4 py-3 font-medium">Preference</td>
                                        <td className="px-4 py-3">Theme, language, settings</td>
                                        <td className="px-4 py-3">Up to 1 year</td>
                                    </tr>
                                    <tr className="border-t border-slate-200 dark:border-slate-700">
                                        <td className="px-4 py-3 font-medium">Analytics</td>
                                        <td className="px-4 py-3">Usage statistics, performance</td>
                                        <td className="px-4 py-3">Varies (e.g., 2 years)</td>
                                    </tr>
                                    <tr className="border-t border-slate-200 dark:border-slate-700">
                                        <td className="px-4 py-3 font-medium">Marketing</td>
                                        <td className="px-4 py-3">Ads, retargeting (with consent)</td>
                                        <td className="px-4 py-3">Varies</td>
                                    </tr>
                                </tbody>
                            </table>
                        </section>

                        <section>
                            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">4. Third-Party Cookies</h2>
                            <p>We may allow third-party services (e.g., analytics providers, video embeds, or payment gateways) to set their own cookies when you use our site. These parties have their own privacy and cookie policies. We encourage you to review their policies to understand how they use cookies and your data.</p>
                        </section>

                        <section>
                            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">5. Your Choices</h2>
                            <p>You can control and manage cookies in several ways:</p>
                            <ul className="list-disc pl-6 space-y-1 mt-2">
                                <li><strong>Browser settings</strong> — Most browsers let you block or delete cookies via settings. Note that blocking all cookies may affect site functionality (e.g., login, preferences).</li>
                                <li><strong>Consent banner</strong> — Where we use non-essential cookies (e.g., analytics or marketing), we will seek your consent via a cookie banner or preference center when required by law.</li>
                                <li><strong>Opt-out links</strong> — For specific third-party analytics or advertising tools, we may provide opt-out links in our Privacy Policy or cookie preferences.</li>
                            </ul>
                            <p className="mt-3">If you have previously consented and wish to withdraw consent, you can clear cookies via your browser or use our cookie preference tool (if available) and we will respect your choice on your next visit.</p>
                        </section>

                        <section>
                            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">6. Updates</h2>
                            <p>We may update this Cookie Policy from time to time to reflect changes in our practices, technology, or legal requirements. We will post the updated policy on this page and update the "Last updated" date. We encourage you to review this page periodically.</p>
                        </section>

                        <section>
                            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">7. Contact</h2>
                            <p>For questions about our use of cookies or this Cookie Policy, contact us at:</p>
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
                            <Link to="/privacy-policy">Privacy Policy</Link>
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

export default CookiePolicy;
