import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import PageHero from '@/components/common/PageHero';
import SectionHeader from '@/components/common/SectionHeader';
import GlassCard from '@/components/common/GlassCard';
import { placementServices, placementProcessSteps, SEO_TITLES } from '@/utils/constants';
import SocialProof from '@/components/home/SocialProof';
import Testimonials from '@/components/home/Testimonials';
import FinalCTA from '@/components/home/FinalCTA';
import SEO from '@/components/SEO';

const Services = () => {
    return (
        <div className="min-h-screen overflow-hidden">
            <SEO title={SEO_TITLES.services} description="Transform your career with Rebuild It Solution's expert mentorship, mock interviews, resume reviews, and placement services designed for tech professionals." url="/services" />
            {/* Hero Section */}
            <PageHero
                badge="Career Accelerator"
                icon={Sparkles}
                title="Your Future,"
                gradientText="Re-Engineered"
                subtitle="We don't just teach technology; we build careers. Our placement engine is designed to transform skilled individuals into industry-ready leaders."
            />


            {/* Core Placement Services */}
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl mb-32">
                <SectionHeader
                    badge="What we offer"
                    title="Placement-First Services"
                    subtitle="Strategic support designed to help you bypass recruitment filters and land your dream role in tech."
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {placementServices.map((service, index) => (
                        <GlassCard key={index} delay={index * 100}>
                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                                    <service.icon className="w-7 h-7 text-primary" />
                                </div>
                                <div className="grow">
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
                                        {service.title}
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                                        {service.desc}
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {service.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                                <CheckCircle2 className="w-4 h-4 text-secondary" />
                                                {feature}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            </section>

            {/* The 4-Step Process */}
            <section className="mb-32 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative">
                {/* Background blob for visual interest */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-secondary/5 blur-[120px] -z-10 rounded-full" />

                <SectionHeader
                    badge="Our Workflow"
                    title="How We Get You Hired"
                    subtitle="A systematic, data-driven approach to career transition that works for every candidate."
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {placementProcessSteps.map((item, index) => (
                        <div
                            key={index}
                            data-aos="fade-up"
                            data-aos-delay={index * 150}
                            className="relative group p-8 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl hover:border-primary/50 transition-all duration-300"
                        >
                            <div className="absolute top-4 right-6 text-6xl font-black text-slate-100 dark:text-white/5 group-hover:text-primary/10 transition-colors">
                                {item.step}
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/10 transition-all text-primary">
                                <item.icon className="w-7 h-7" />
                            </div>
                            <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{item.title}</h4>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <SocialProof />
            <Testimonials />
        </div>
    );
};

export default Services;



