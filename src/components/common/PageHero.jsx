import React from 'react';

const PageHero = ({ badge, title, subtitle, gradientText, icon: Icon }) => {
    return (
        <section className="relative pt-32 pb-20 sm:pt-40 overflow-hidden mb-16 sm:mb-20">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/10 blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
                <div className="text-center max-w-3xl mx-auto">
                    {badge && (
                        <div
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6 border border-primary/20"
                            data-aos="fade-up"
                        >
                            {Icon && <Icon className="w-4 h-4" />}
                            <span>{badge}</span>
                        </div>
                    )}
                    <h1
                        className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight tracking-tight"
                        data-aos="fade-up"
                        data-aos-delay="100"
                    >
                        {title} {gradientText && (
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">
                                {gradientText}
                            </span>
                        )}
                    </h1>
                    <p
                        className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-light"
                        data-aos="fade-up"
                        data-aos-delay="200"
                    >
                        {subtitle}
                    </p>
                </div>
            </div>
        </section>
    );
};

export default PageHero;
