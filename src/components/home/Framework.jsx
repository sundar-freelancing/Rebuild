import React from 'react';
import { frameworkSteps } from "@/utils/constants";
import { motion as Motion } from "framer-motion";
import AOS from 'aos';
import { useEffect } from 'react';

import { useTheme } from '@/context/ThemeContext';

const Framework = () => {
    const { isDark } = useTheme();

    useEffect(() => {
        AOS.refresh();
    }, []);

    return (
        <section className="py-12 sm:py-16 md:py-24 relative overflow-hidden" id="framework">
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-primary/20 to-transparent"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10 sm:mb-14 md:mb-20" data-aos="fade-up">
                    <h2 className="text-sm font-semibold text-primary tracking-wide uppercase mb-3">The Process</h2>
                    <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-6 tracking-tight">
                        The 5-Step <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-blue-600">Mastery Blueprint</span>
                    </h3>
                    <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Our proven system designed to take you from manual testing basics to high-pay automation expert.</p>
                </div>
                <div className="relative">
                    <div
                        className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-800 -translate-x-1/2 hidden lg:block"
                        data-aos="fade-down"
                        data-aos-duration="1500"
                    ></div>
                    <div className="space-y-8 sm:space-y-10 lg:space-y-0">
                        {frameworkSteps.map((item, i) => (
                            <div
                                key={i}
                                className={`relative lg:flex lg:items-center lg:justify-between mb-8 sm:mb-10 lg:mb-24 ${item.reverse ? 'flex-row-reverse' : ''}`}
                            >
                                <div
                                    className={`lg:w-[45%] ${!item.reverse ? 'lg:text-right' : ''}`}
                                    data-aos={item.reverse ? "fade-left" : "fade-right"}
                                    data-aos-delay={i * 100}
                                >
                                    <Motion.div
                                        className="bg-white dark:bg-slate-800 p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 transition-all duration-500 overflow-hidden relative group"
                                        initial={{
                                            scale: 1
                                        }}
                                        whileInView={{
                                            scale: 1.02,
                                        }}
                                        whileHover={{
                                            scale: 1.03,
                                            transition: { duration: 0.2 }
                                        }}
                                        viewport={{ amount: 0.8, margin: "-10% 0px -10% 0px" }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <div className={`flex items-center justify-between gap-4 mb-3 sm:mb-5 ${!item.reverse ? 'flex-row-reverse' : ''}`}>
                                            <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-primary transition-colors">
                                                {item.title}
                                            </h4>
                                            <Motion.div
                                                className="shrink-0 size-9 sm:size-11 rounded-lg sm:rounded-xl flex items-center justify-center shadow-sm"
                                                initial={{
                                                    backgroundColor: isDark ? "rgba(51, 65, 85, 1)" : "rgba(241, 245, 249, 1)",
                                                    color: isDark ? "rgba(148, 163, 184, 1)" : "rgba(148, 163, 184, 1)",
                                                    rotate: 0
                                                }}
                                                whileInView={{
                                                    backgroundColor: "rgba(145, 75, 226, 1)",
                                                    color: "#ffffff",
                                                    rotate: 6,
                                                    scale: 1.1
                                                }}
                                                viewport={{ amount: 0.8, margin: "-10% 0px -10% 0px" }}
                                                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                                            >
                                                <item.icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                                            </Motion.div>
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-200 leading-relaxed text-sm sm:text-base">{item.desc}</p>
                                    </Motion.div>
                                </div>
                                <div
                                    className="hidden lg:flex absolute left-1/2 -translate-x-1/2 size-10 md:size-12 rounded-full bg-linear-to-br from-primary to-blue-600 text-white items-center justify-center font-semibold text-sm md:text-base z-10 shadow-lg shadow-primary/30 ring-8 ring-slate-50 dark:ring-slate-900 overflow-hidden"
                                    data-aos="zoom-in"
                                    data-aos-delay={i * 100 + 100}
                                >
                                    <span className="relative z-10">{i + 1}</span>
                                    <Motion.div
                                        className="absolute inset-0 bg-white/20"
                                        animate={{
                                            scale: [1, 1.5, 1],
                                            opacity: [0.3, 0.6, 0.3]
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                    />
                                </div>
                                <div className="lg:w-[45%]"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Framework;
