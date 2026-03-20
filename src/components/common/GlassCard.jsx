import React from 'react';

const GlassCard = ({ children, className = "", delay = 0 }) => {
    return (
        <div 
            data-aos="fade-up"
            data-aos-delay={delay}
            className={`group bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 p-8 rounded-[2rem] hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 ${className}`}
        >
            {children}
        </div>
    );
};

export default GlassCard;
