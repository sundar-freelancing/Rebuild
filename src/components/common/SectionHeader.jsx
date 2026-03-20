import React from 'react';

const SectionHeader = ({ badge, title, subtitle, centered = true }) => {
    return (
        <div className={`mb-16 ${centered ? 'text-center mx-auto' : ''} max-w-3xl`}>
            {badge && (
                <div 
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 font-bold text-xs mb-4 border border-slate-200 dark:border-white/10 uppercase tracking-widest`}
                    data-aos="fade-up"
                >
                    {badge}
                </div>
            )}
            <h2 
                className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight"
                data-aos="fade-up"
                data-aos-delay="100"
            >
                {title}
            </h2>
            {subtitle && (
                <p 
                    className="text-lg text-slate-600 dark:text-slate-400"
                    data-aos="fade-up"
                    data-aos-delay="200"
                >
                    {subtitle}
                </p>
            )}
        </div>
    );
};

export default SectionHeader;
