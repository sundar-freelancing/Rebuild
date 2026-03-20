import React from 'react';
import { CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import AnimatedBackground from './AnimatedBackground';
import { useLeadCapture } from '@/context/LeadCaptureContext';

const HeroSection = () => {
    const { openModal } = useLeadCapture();

    return (
        <section className="relative overflow-hidden py-6 sm:py-10 pt-24 sm:pt-28 h-screen lg:min-h-[700px] max-h-[1000px] bg-white dark:bg-slate-950 hero-gradient flex items-center justify-center">
            <AnimatedBackground />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col items-center text-center">
                    <div className="inline-flex items-center px-3 py-1.5 sm:px-6 sm:py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-xs sm:text-sm font-semibold mb-6 sm:mb-10 md:mb-12 dark:text-white" data-aos="fade-down" data-aos-duration="600">
                        Career Acceleration Program
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-slate-900 dark:text-white leading-[1.15] tracking-tight max-w-4xl mb-4 sm:mb-6 md:mb-8" data-aos="fade-up" data-aos-duration="700" data-aos-delay="100">
                        Re-Engineer Your Career for <br /> <span className="text-primary">High-Impact Tech Roles</span>
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mb-4 sm:mb-6 md:mb-8" data-aos="fade-up" data-aos-duration="700" data-aos-delay="200">
                        A structured 6-month career acceleration framework designed for professionals who want strategic growth — not random certifications.
                    </p>
                    <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm font-medium mb-6 sm:mb-8 md:mb-12" data-aos="fade-up" data-aos-duration="700" data-aos-delay="300">
                        {[
                            "Enterprise-grade training",
                            "Live project implementation",
                            "Interview execution system",
                            "Placement preparation"
                        ].map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 sm:gap-2 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm">
                                <CheckCircle2 className="size-3.5 sm:size-4 text-primary shrink-0" />
                                <span>{feature}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-col items-center gap-4 sm:gap-6 w-full max-w-xs sm:max-w-none" data-aos="fade-up" data-aos-duration="700" data-aos-delay="400">
                        <Button 
                            size="lg" 
                            className="group relative pr-8 hover:pr-14 hover:px-12 transition-all overflow-hidden w-full sm:w-auto mt-2 sm:mt-4 text-sm sm:text-base"
                            onClick={() => openModal('Hero Section', {
                                title: 'Book Free Career Strategy Session',
                                subtitle: 'Get a 1-on-1 consultation with our senior tech leads.'
                            })}
                        >
                            <span>Book Free Career Strategy Session</span>
                            <ArrowRight className="size-4 sm:size-5 absolute right-6 opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                        </Button>
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 bg-white/50 dark:bg-slate-900/50 px-3 py-2 sm:px-4 rounded-lg border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-sm">
                            <ShieldCheck className="size-3.5 sm:size-4 text-emerald-500 shrink-0" />
                            Placement End-to-End Owned by ReBuild
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
