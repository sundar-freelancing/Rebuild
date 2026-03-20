import React, { useRef, useState, useEffect } from 'react';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import AutoScroll from "embla-carousel-auto-scroll";
import { Skeleton } from '@/components/ui/skeleton';
import usePublicStore from '@/store/usePublicStore';
import { cn } from "@/lib/utils";

const AnimatedCounter = ({ end, duration = 2000, suffix = "", prefix = "" }) => {
    const [count, setCount] = useState(0);
    const countRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.disconnect();
            }
        }, { threshold: 0.5 });

        if (countRef.current) {
            observer.observe(countRef.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }, [isVisible, end, duration]);

    return <span ref={countRef}>{prefix}{count}{suffix}</span>;
}

const PartnerSkeleton = () => (
    <div className="flex items-center justify-center p-4 h-24">
        <Skeleton className="h-10 w-24 md:w-32 rounded-lg opacity-40" />
    </div>
);

const SocialProof = () => {
    const plugin = useRef(AutoScroll({ speed: 1.5, stopOnInteraction: false, stopOnMouseEnter: true }));
    const { hiringPartners, loadingPartners, initPartners } = usePublicStore();
    const [api, setApi] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        initPartners();
    }, [initPartners]);

    useEffect(() => {
        if (!api) return;

        const updateIndex = () => {
            setActiveIndex(api.selectedScrollSnap());
        };

        api.on("select", updateIndex);
        api.on("reInit", updateIndex);

        // Initial update
        updateIndex();

        return () => {
            api.off("select", updateIndex);
            api.off("reInit", updateIndex);
        };
    }, [api]);

    const displayItems = loadingPartners ? [...Array(6)] : hiringPartners;

    return (
        <section className="py-16 md:py-24 relative overflow-hidden" data-aos="fade-up">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-linear-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent"></div>

            <div className="mx-auto px-4 max-w-7xl">
                <div className="text-center mb-12 md:mb-16 max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
                        Our Hiring Partners
                    </h2>
                    <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                        Our learners have successfully cleared interviews and secured high-impact roles at some of the world's most innovative tech organizations.
                    </p>
                </div>

                <div className="relative w-full mx-auto px-4">
                    <Carousel
                        setApi={setApi}
                        plugins={[plugin.current]}
                        className="w-full"
                        opts={{
                            align: "center",
                            loop: true,
                            dragFree: true,
                        }}
                    >
                        <CarouselContent className="flex items-center -ml-4">
                            {displayItems.length > 0 ? (
                                displayItems.map((partner, idx) => (
                                    <CarouselItem key={loadingPartners ? `skeleton-${idx}` : partner.id} className="pl-4 basis-1/3 md:basis-1/4 lg:basis-1/6">
                                        {loadingPartners ? (
                                            <PartnerSkeleton />
                                        ) : (
                                            <div className={cn(
                                                "flex items-center justify-center p-4 group h-24 transition-all duration-500",
                                                activeIndex === idx ? " z-10" : "scale-90"
                                            )}>
                                                <img
                                                    src={partner.logoUrl}
                                                    alt={`${partner.companyName} logo`}
                                                    className={cn(
                                                        "max-h-14 max-w-full object-contain filter transition-all duration-500 ease-out hover:brightness-110 hover:opacity-100 hover:grayscale-0",
                                                        activeIndex !== idx
                                                            ? "grayscale opacity-80 brightness-110 scale-90"
                                                            : "grayscale-0 opacity-100 scale-125"
                                                    )}
                                                />
                                            </div>
                                        )}
                                    </CarouselItem>
                                ))
                            ) : !loadingPartners && (
                                <div className="w-full text-center py-10 text-slate-400 font-medium">
                                    Our partner network is growing!
                                </div>
                            )}
                        </CarouselContent>
                    </Carousel>
                </div>

                <div className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto" data-aos="fade-up" data-aos-delay="200">
                    <div className="flex flex-col items-center justify-center py-6 px-4 rounded-xl bg-primary/5 dark:bg-primary/10 border border-primary/10 dark:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30 group">
                        <h3 className="text-3xl md:text-4xl font-bold mb-2 text-slate-900 dark:text-white group-hover:scale-105 transition-transform duration-500 ease-out">
                            <AnimatedCounter end={5} suffix="-Step" />
                        </h3>
                        <p className="text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400 text-center">
                            Framework for Success
                        </p>
                    </div>

                    <div className="flex flex-col items-center justify-center py-6 px-4 rounded-xl bg-primary/5 dark:bg-primary/10 border border-primary/10 dark:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30 group">
                        <h3 className="text-3xl md:text-4xl font-bold mb-2 text-slate-900 dark:text-white group-hover:scale-105 transition-transform duration-500 ease-out">
                            <AnimatedCounter end={100} suffix="%" />
                        </h3>
                        <p className="text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400 text-center">
                            Project Focused Strategy
                        </p>
                    </div>

                    <div className="flex flex-col items-center justify-center py-6 px-4 rounded-xl bg-primary/5 dark:bg-primary/10 border border-primary/10 dark:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30 group sm:col-span-2 md:col-span-1">
                        <h3 className="text-3xl md:text-4xl font-bold mb-2 text-slate-900 dark:text-white group-hover:scale-105 transition-transform duration-500 ease-out">
                            <AnimatedCounter end={200} suffix="+" />
                        </h3>
                        <p className="text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400 text-center">
                            Hiring Partners Globally
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SocialProof;
