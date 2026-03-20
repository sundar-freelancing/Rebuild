import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';

const ConsultationForm = () => {

    // Controlled Form wrapper for enterprise standard
    const handleSubmit = (e) => {
        e.preventDefault();
        // Here we could handle form submission via fetch/axios
        console.log("Form submitted!");
    };

    return (
        <section className="py-12 sm:py-16 md:py-24" id="contact">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-slate-900 dark:bg-slate-800 rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] p-5 sm:p-6 md:p-10 lg:p-16 text-white shadow-2xl relative overflow-hidden" data-aos="zoom-in">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px]"></div>
                    <div className="relative z-10">
                        <div className="text-center mb-6 sm:mb-8 md:mb-12" data-aos="fade-down" data-aos-delay="100">
                            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 sm:mb-4">Not Sure What To Learn Next?</h2>
                            <p className="text-slate-400 text-sm sm:text-base">Get a personalized career strategy from our mentors. No strings attached.</p>
                        </div>
                        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                            <div className="space-y-1.5 sm:space-y-2">
                                <label className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-slate-400">Full Name</label>
                                <input required className="w-full bg-slate-800 dark:bg-slate-900 border-slate-700 rounded-lg sm:rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base focus:ring-primary focus:border-primary" placeholder="John Doe" type="text" />
                            </div>
                            <div className="space-y-1.5 sm:space-y-2">
                                <label className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-slate-400">Email Address</label>
                                <input required className="w-full bg-slate-800 dark:bg-slate-900 border-slate-700 rounded-lg sm:rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base focus:ring-primary focus:border-primary" placeholder="john@example.com" type="email" />
                            </div>
                            <div className="space-y-1.5 sm:space-y-2">
                                <label className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-slate-400">Current Experience</label>
                                <select className="w-full bg-slate-800 dark:bg-slate-900 border-slate-700 rounded-lg sm:rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base focus:ring-primary focus:border-primary">
                                    <option>0-2 Years</option>
                                    <option>2-5 Years</option>
                                    <option>5+ Years</option>
                                </select>
                            </div>
                            <div className="space-y-1.5 sm:space-y-2">
                                <label className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-slate-400">Target Role</label>
                                <input required className="w-full bg-slate-800 dark:bg-slate-900 border-slate-700 rounded-lg sm:rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base focus:ring-primary focus:border-primary" placeholder="e.g. SDET / Lead" type="text" />
                            </div>
                            <div className="md:col-span-2 mt-2 sm:mt-4">
                                <Button type="submit" size="lg" className="w-full group relative pr-8 hover:pr-14 hover:px-12 transition-all overflow-hidden text-sm sm:text-base">
                                    <span>Request Free Consultation</span>
                                    <ArrowRight className="size-4 sm:size-5 absolute right-4 sm:right-6 opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ConsultationForm;
