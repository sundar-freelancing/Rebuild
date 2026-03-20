import React from 'react';
import { whyTrustUsFeatures } from "@/utils/constants";

const WhyTrustUs = () => {
    return (
        <section className="py-12 sm:py-16 md:py-24 bg-white dark:bg-slate-950 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">
                    <div className="relative" data-aos="fade-right">
                        <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
                            <div
                                className="w-full h-[280px] sm:h-[360px] md:h-[420px] lg:h-[500px] bg-cover bg-center"
                                style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuD9uYGxPMWMGlcuYm7yPvihp4mPWWF9ef5LRYz7mcgn3-JWmT_NPHIf0z5r6efOvGOcG3dPqbATc_LnfwUAsTiHnNFCm_sa_s5Z4X-KhmNVzB6ylfKh70wkinrWo6zk5UNJsE2UpCIffOrRkmpklt51SMtCw-X_NC6auMBBNMfT-Kw2jPGvQie2WlE8KXJ9R3wH0hrO1_438t9owBNo2LDkkr6RKZqtUu0BZ7RdTvH3mZ0jUm56-gq1abl7DnHWX9vMzdivxg3IEnVz')` }}
                            ></div>
                        </div>
                        <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 md:-bottom-8 md:-right-8 bg-primary p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl text-white shadow-2xl">
                            <p className="text-2xl sm:text-3xl md:text-4xl font-bold">10+</p>
                            <p className="text-xs sm:text-sm font-semibold opacity-80 uppercase tracking-widest">Years Industry Exp</p>
                        </div>
                    </div>
                    <div className="space-y-5 sm:space-y-6 md:space-y-8" data-aos="fade-left">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Why Professionals Choose <span className="text-primary">Rebuild IT</span></h2>
                        <div className="space-y-4 sm:space-y-5 md:space-y-6">
                            {whyTrustUsFeatures.map((item, i) => {
                                const IconComp = item.icon;
                                return (
                                    <div key={i} className="flex gap-3 sm:gap-4 md:gap-5" data-aos="fade-up" data-aos-delay={i * 60}>
                                        <div className="shrink-0 size-10 sm:size-11 md:size-12 rounded-lg sm:rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-primary shadow-sm">
                                            <IconComp className="size-5 sm:size-6" />
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white mb-0.5 sm:mb-1">{item.title}</h4>
                                            <p className="text-slate-500 leading-relaxed text-sm sm:text-base">{item.desc}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyTrustUs;
