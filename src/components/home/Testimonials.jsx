import React, { useRef, useEffect } from 'react';
import { Quote, Star, User } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import AutoScroll from "embla-carousel-auto-scroll";
import usePublicStore from '@/store/usePublicStore';
import { Skeleton } from '@/components/ui/skeleton';

const TestimonialSkeleton = () => (
    <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative h-full flex flex-col justify-between overflow-hidden">
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-8 opacity-10">
            <Quote className="size-8 sm:size-10 md:size-12" />
        </div>
        <div className="space-y-3 mb-5 sm:mb-6 md:mb-8 grow">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-4 w-[85%]" />
        </div>
        <div className="flex items-center gap-3 sm:gap-4 mt-auto">
            <Skeleton className="size-10 sm:size-12 rounded-full shrink-0" />
            <div className="space-y-2 grow">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
            </div>
        </div>
    </div>
);

const Testimonials = () => {
    const plugin = useRef(AutoScroll({ speed: 1.5, stopOnInteraction: false, stopOnMouseEnter: true }));
    const { successStories, loadingStories, initStories } = usePublicStore();

    useEffect(() => {
        initStories();
    }, [initStories]);

    // If no stories yet and not loading, we could show fallback or nothing
    // But per instructions, we show 5 skeletons while fetching
    const displayItems = loadingStories ? [...Array(5)] : successStories;

    return (
        <section className="py-12 sm:py-16 md:py-24">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8 sm:mb-12 md:mb-16" data-aos="fade-up">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2 sm:mb-4">Learner Success Stories</h2>
                    <div className="flex justify-center gap-0.5 sm:gap-1 text-primary">
                        {[1, 2, 3, 4, 5].map(i => <Star key={i} className="fill-primary size-5 sm:size-6" />)}
                    </div>
                    <p className="mt-2 sm:mt-4 text-slate-500 font-semibold text-sm sm:text-base">4.9/5 Average Rating from 500+ Alumni</p>
                </div>

                <div className="relative w-full" data-aos="fade-up" data-aos-delay="150">
                    <Carousel
                        plugins={[plugin.current]}
                        className="w-full"
                        opts={{
                            align: "start",
                            loop: true,
                            dragFree: true,
                        }}
                    >
                        <CarouselContent className="-ml-4 sm:-ml-6 md:-ml-8">
                            {displayItems.length > 0 ? (
                                displayItems.map((item, i) => (
                                    <CarouselItem key={i} className="pl-4 sm:pl-6 md:pl-8 basis-full md:basis-1/2 lg:basis-1/3">
                                        {loadingStories ? (
                                            <TestimonialSkeleton />
                                        ) : (
                                            <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative h-full flex flex-col justify-between transition-all duration-300">
                                                <Quote className="absolute top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-8 text-primary/20 size-8 sm:size-10 md:size-12 shrink-0" />
                                                <p className="text-slate-600 dark:text-slate-400 italic mb-5 sm:mb-6 md:mb-8 relative z-10 grow text-sm sm:text-base leading-relaxed">
                                                    "{item.feedback}"
                                                </p>
                                                <div className="flex items-center gap-3 sm:gap-4 mt-auto">
                                                    <div className="size-10 sm:size-12 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700">
                                                        {item.imageUrl ? (
                                                            <img
                                                                src={item.imageUrl}
                                                                alt={item.studentName}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    e.target.style.display = 'none';
                                                                    e.target.nextSibling.style.display = 'flex';
                                                                }}
                                                            />
                                                        ) : null}
                                                        <div className={`w-full h-full flex items-center justify-center text-slate-400 ${item.imageUrl ? 'hidden' : 'flex'}`}>
                                                            <User className="size-5 sm:size-6" />
                                                        </div>
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h5 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base truncate">{item.studentName}</h5>
                                                        <p className="text-xs text-slate-500 font-bold uppercase tracking-tighter truncate">
                                                            {item.Role} @ {item.companyName}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </CarouselItem>
                                ))
                            ) : !loadingStories && (
                                // Optional: Fallback if collection is empty
                                <div className="w-full text-center py-10 text-slate-400 font-medium">
                                    More success stories coming soon!
                                </div>
                            )}
                        </CarouselContent>
                    </Carousel>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
