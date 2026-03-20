import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import PageHero from '@/components/common/PageHero';
import LeadForm from '@/components/common/LeadForm';
import useSiteConfigStore from '@/store/useSiteConfigStore';

/* ─────────────────────────────────────────────────────────
   CONTACT PAGE
 ───────────────────────────────────────────────────────── */
const Contact = () => {
    const config = useSiteConfigStore((s) => s.config);

    const dynamicContactInfo = [
        {
            icon: MapPin,
            label: 'Visit Us',
            lines: config.officeAddress.split(',').map(s => s.trim()),
            href: '#',
        },
        {
            icon: Phone,
            label: 'Call Us',
            lines: config.contactPhones,
            href: config.contactPhones.length > 0 ? `tel:${config.contactPhones[0].replace(/\s+/g, '')}` : '',
        },
        {
            icon: Mail,
            label: 'Email Us',
            lines: config.contactEmails,
            href: config.contactEmails.length > 0 ? `mailto:${config.contactEmails[0]}` : '',
        },
        {
            icon: Clock,
            label: 'Office Hours',
            lines: config.officeHours,
            href: null,
        },
    ];

    return (
        <div className="min-h-screen selection:bg-primary/20">

            {/* ════════════════════════════════════════════════
                1. SIMPLE & ATTRACTIVE HERO
            ════════════════════════════════════════════════ */}
            <PageHero
                badge="Get In Touch"
                icon={Mail}
                title="Let's"
                gradientText="Connect"
                subtitle="Have a project in mind or just want to say hello? We're here to build something amazing together."
            />

            {/* ════════════════════════════════════════════════
                2. FORM  +  CONTACT CARDS  (Side by Side)
            ════════════════════════════════════════════════ */}
            <section className="pb-16 sm:pb-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">

                        {/* LEFT — Send a Message Form */}
                        <div data-aos="fade-right" data-aos-delay="100">
                            <LeadForm
                                title="Send us a Message"
                                subtitle="Fill out the form below and we'll get back to you soon."
                                source="Contact Page"
                            />
                        </div>

                        {/* RIGHT — Get in Touch + Modern Cards */}
                        <div className="lg:pt-6" data-aos="fade-left" data-aos-delay="100">
                            <h2 className="text-3xl sm:text-4xl font-light text-slate-800 dark:text-white mb-3 tracking-tight">
                                Get in <span className="font-medium">Touch</span>
                            </h2>
                            <p className="text-lg text-slate-500 dark:text-slate-400 mb-10 leading-relaxed font-light">
                                We're here to help and answer any questions you might have. We look forward to hearing from you.
                            </p>

                            <div className="grid gap-6">
                                {dynamicContactInfo.map((card, idx) => {
                                    const Wrapper = card.href ? 'a' : 'div';
                                    const wrapperProps = card.href
                                        ? { href: card.href, target: card.href.startsWith('http') ? '_blank' : undefined, rel: 'noopener noreferrer' }
                                        : {};

                                    return (
                                        <Wrapper
                                            key={idx}
                                            {...wrapperProps}
                                            className="flex items-center gap-6 p-6 rounded-[1.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-primary/40 hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all duration-500 group relative overflow-hidden"
                                        >
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>

                                            <div className={`size-14 sm:size-16 rounded-2xl bg-primary shadow-lg shadow-primary/20 flex items-center justify-center shrink-0 group-hover:rotate-12 transition-all duration-500`}>
                                                <card.icon className="size-7 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-xs uppercase tracking-[0.2em] font-bold text-primary mb-2 opacity-60">{card.label}</p>
                                                {card.lines.map((line, i) => (
                                                    <p key={i} className="text-slate-700 dark:text-slate-200 leading-relaxed">
                                                        {line}
                                                    </p>
                                                ))}
                                            </div>
                                        </Wrapper>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════════
                3. GOOGLE MAP
            ════════════════════════════════════════════════ */}
            <section className="pb-24 sm:pb-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div
                        className="rounded-[2.5rem] overflow-hidden border-8 border-white dark:border-slate-900 shadow-2xl relative"
                        data-aos="zoom-in"
                    >
                        <iframe
                            title="ReBuild IT Office Location"
                            src={config.mapEmbedUrl}
                            width="100%"
                            height="500"
                            style={{ border: 0, filter: 'grayscale(0.5) contrast(1.2) brightness(0.9)' }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="w-full grayscale hover:grayscale-0 transition-all duration-1000"
                        />
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Contact;
