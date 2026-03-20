import { useState, useId } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2 } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const LeadForm = ({ title, subtitle, source, onSuccess }) => {
    const [form, setForm] = useState({
        name: '',
        mobile: '',
        email: '',
        message: '',
        consent: false,
        source: source || 'Direct',
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [charCount, setCharCount] = useState(0);
    const consentId = useId();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === 'message') setCharCount(value.length);
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const leadsRef = collection(db, 'userData');
            await addDoc(leadsRef, {
                ...form,
                createdAt: serverTimestamp(),
                metadata: {
                    userAgent: navigator.userAgent,
                    url: window.location.href,
                    referrer: document.referrer,
                },
                status: 'Pending' // Initial status for admin
            });

            setSubmitted(true);
            if (onSuccess) onSuccess();
            setForm({ name: '', mobile: '', email: '', message: '', consent: false, source: source || 'Direct' });
            setCharCount(0);
            setTimeout(() => setSubmitted(false), 5000);
        } catch (err) {
            console.error('Error saving lead:', err);
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            <h2 className="text-2xl sm:text-3xl font-light text-slate-800 dark:text-white mb-2 tracking-tight">
                {title || 'Send us a Message'}
            </h2>
            <p className="text-sm text-primary/80 mb-6 font-light">
                {subtitle || "Fill out the form below and we'll get back to you soon."}
            </p>

            {submitted ? (
                <div className="flex flex-col items-center justify-center py-8 text-center gap-4">
                    <div className="size-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center animate-bounce">
                        <ArrowRight className="size-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-medium text-slate-800 dark:text-white">Message Sent!</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-light">We'll get back to you within 24 hours. 🚀</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-xl text-xs text-red-600 dark:text-red-400 font-medium animate-in fade-in slide-in-from-top-1">
                            {error}
                        </div>
                    )}
                    <div className="grid sm:grid-cols-2 gap-4">
                        {/* Name */}
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-widest font-semibold text-slate-400 dark:text-slate-500 ml-1">
                                Name <span className="text-primary">*</span>
                            </label>
                            <input
                                required
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                type="text"
                                placeholder="John Doe"
                                disabled={loading}
                                className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/50 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 disabled:opacity-50"
                            />
                        </div>

                        {/* Mobile */}
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-widest font-semibold text-slate-400 dark:text-slate-500 ml-1">
                                Mobile No <span className="text-primary">*</span>
                            </label>
                            <input
                                required
                                name="mobile"
                                value={form.mobile}
                                onChange={handleChange}
                                type="tel"
                                placeholder="+91 00000 00000"
                                disabled={loading}
                                className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/50 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 disabled:opacity-50"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-widest font-semibold text-slate-400 dark:text-slate-500 ml-1">
                            Email ID
                        </label>
                        <input
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            type="email"
                            placeholder="hello@example.com"
                            disabled={loading}
                            className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/50 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 disabled:opacity-50"
                        />
                    </div>

                    {/* Message */}
                    <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-widest font-semibold text-slate-400 dark:text-slate-500 ml-1">
                            Message
                        </label>
                        <textarea
                            name="message"
                            value={form.message}
                            onChange={handleChange}
                            rows={3}
                            maxLength={5000}
                            placeholder="Write your message here..."
                            disabled={loading}
                            className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/50 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 resize-none disabled:opacity-50"
                        />
                        <div className="flex justify-end">
                            <span className="text-[8px] uppercase tracking-widest font-bold text-slate-400">{charCount}/5000</span>
                        </div>
                    </div>

                    {/* Consent checkbox */}
                    <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-800">
                        <input
                            id={consentId}
                            name="consent"
                            type="checkbox"
                            checked={form.consent}
                            onChange={handleChange}
                            disabled={loading}
                            className="mt-1 size-3.5 accent-primary cursor-pointer rounded-sm disabled:opacity-50"
                        />
                        <label htmlFor={consentId} className="text-slate-600 dark:text-slate-400 leading-relaxed cursor-pointer font-normal opacity-90">
                            I authorize ReBuild IT to contact me with updates and notifications.
                        </label>
                    </div>

                    {/* Submit */}
                    <Button
                        type="submit"
                        size="lg"
                        disabled={loading}
                        className="w-full group transition-all duration-500 hover:shadow-xl hover:shadow-primary/20"
                    >
                        {loading ? (
                            <Loader2 className="size-4 animate-spin mr-2" />
                        ) : (
                            <ArrowRight className="size-4 ml-2 group-hover:translate-x-1 transition-transform order-last" />
                        )}
                        <span className="relative z-10">{loading ? 'Sending...' : 'Send Message'}</span>
                    </Button>
                </form>
            )}
        </div>
    );
};

export default LeadForm;
