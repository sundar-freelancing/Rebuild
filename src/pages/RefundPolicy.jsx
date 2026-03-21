import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const RefundPolicy = () => {
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
                                Refund Policy
                            </h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Last updated: March 2024</p>
                        </div>
                    </div>

                    <div className="prose prose-slate dark:prose-invert prose-headings:font-semibold prose-headings:text-slate-900 dark:prose-headings:text-white prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-li:text-slate-600 dark:prose-li:text-slate-400 max-w-none space-y-8 text-sm sm:text-base">
                        <p className="lead text-slate-700 dark:text-slate-300">
                            At Rebuild IT Solutions, we are dedicated to providing high-quality courses and mentorship programs. Please read our refund policy below.
                        </p>

                        <section>
                            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">1. General Refund Terms</h2>
                            <p>We believe in our curriculum and the value it brings. Due to the digital nature of our courses and the extensive mentorship resources provided from the moment of enrollment, we generally do not offer refunds once you have gained access to the materials and platform.</p>
                        </section>

                        <section>
                            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">2. Exceptions</h2>
                            <p>Refunds may only be considered under the following exceptional circumstances:</p>
                            <ul className="list-disc pl-6 space-y-1 mt-2">
                                <li>If you mistakenly purchased the same course twice in a single transaction period.</li>
                                <li>If there are technical issues on our end that entirely prevent you from accessing the course for an extended period and our support team is unable to resolve them.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">3. Process for Requesting a Refund</h2>
                            <p>If you believe you qualify for a refund under our exceptions:</p>
                            <ul className="list-disc pl-6 space-y-1 mt-2">
                                <li>Contact our support team at <a href="mailto:info@rebuildit.in" className="text-primary hover:underline">info@rebuildit.in</a> within 7 days of purchase.</li>
                                <li>Provide your order details, registered email address, and a clear explanation of the issue.</li>
                                <li>Our team will review your request and usually respond within 3-5 business days.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">4. Contact Us</h2>
                            <p>For questions regarding our refund policy, please contact us at:</p>
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

export default RefundPolicy;
