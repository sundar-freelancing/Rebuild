import React from 'react';
import { AlertTriangle, CheckCircle, Rocket, XCircle } from 'lucide-react';
import { problemList, solutionList } from '@/utils/constants';

const ProblemSolution = () => {
    return (
        <section className="py-12 sm:py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="text-center mb-8 sm:mb-12 md:mb-16" data-aos="fade-up">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2 sm:mb-4">The Reality vs. Our Approach</h2>
                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">Why thousands of testers choose Rebuild IT for their career pivot</p>
                </div>
                <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
                    <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 md:p-8 lg:p-12 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800" data-aos="fade-right" data-aos-delay="100">
                        <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-red-500 mb-4 sm:mb-6 md:mb-8 flex items-center gap-2 sm:gap-3">
                            <AlertTriangle className="size-5 sm:size-6 shrink-0" /> The Reality
                        </h3>
                        <div className="space-y-4 sm:space-y-6">
                            {problemList.map((item, i) => (
                                <div key={i} className="flex gap-3 sm:gap-4">
                                    <XCircle className="text-slate-400 mt-1 size-5 sm:size-6 shrink-0" />
                                    <div className="min-w-0">
                                        <h4 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">{item.title}</h4>
                                        <p className="text-slate-500 text-xs sm:text-sm">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-primary/5 dark:bg-primary/10 p-5 sm:p-6 md:p-8 lg:p-12 rounded-2xl sm:rounded-3xl border border-primary/20 relative overflow-hidden" data-aos="fade-left" data-aos-delay="100">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full"></div>
                        <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-primary mb-4 sm:mb-6 md:mb-8 flex items-center gap-2 sm:gap-3">
                            <Rocket className="size-5 sm:size-6 shrink-0" /> Our Approach
                        </h3>
                        <div className="space-y-4 sm:space-y-6">
                            {solutionList.map((item, i) => (
                                <div key={i} className="flex gap-3 sm:gap-4">
                                    <CheckCircle className="text-primary mt-1 size-5 sm:size-6 shrink-0" />
                                    <div className="min-w-0">
                                        <h4 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">{item.title}</h4>
                                        <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProblemSolution;
