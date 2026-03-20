import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from 'lucide-react';
import { useLeadCapture } from '@/context/LeadCaptureContext';

const FinalCTA = () => {
    const { openModal } = useLeadCapture();

    return (
        <section className="relative pb-16 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div
                    className="relative group overflow-hidden rounded-[2.5rem] bg-slate-900 border border-slate-800 p-8 sm:p-12 shadow-2xl"
                    data-aos="fade-up"
                >
                    {/* Creative Background Accents */}
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-linear-to-l from-primary/10 to-transparent pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-linear-to-r from-transparent via-primary/40 to-transparent" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                        <div className="flex-1 text-center md:text-left">
                            <div className="inline-flex items-center gap-2 text-primary text-[10px] sm:text-xs font-black uppercase tracking-widest mb-4">
                                <Sparkles className="size-4 animate-pulse" />
                                <span>Limited Slots Available</span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight tracking-tight">
                                Ready to build your <span className="text-primary italic">dream career?</span>
                            </h2>
                            <p className="text-slate-400 text-sm sm:text-base font-light max-w-xl">
                                Join 500+ successful students who transitioned into high-paying automation roles.
                                Your roadmap starts with a single click.
                            </p>
                        </div>

                        <div className="shrink-0 w-full md:w-auto">
                            <Button
                                size="lg"
                                onClick={() => openModal('Final CTA', {
                                    title: 'Get Started with ReBuild IT',
                                    subtitle: 'Take the first step towards your high-impact tech career.'
                                })}
                            >
                                Get Started Free
                                <ArrowRight className="ml-2 size-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FinalCTA;
