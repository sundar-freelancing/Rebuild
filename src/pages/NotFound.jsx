import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, Search, BookOpen } from 'lucide-react';

const NotFound = () => {
    return (
        <main className="min-h-screen pt-20 bg-slate-50 dark:bg-slate-900">
            <section className="relative py-16 sm:py-24 md:py-32 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] max-w-2xl h-64 bg-primary/5 dark:bg-primary/10 blur-[100px] rounded-full" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-2xl mx-auto">
                        <p className="text-6xl sm:text-8xl md:text-9xl font-bold text-primary/20 dark:text-primary/30 select-none leading-none">
                            404
                        </p>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-2 sm:mt-4 -translate-y-4 sm:-translate-y-6">
                            Page not found
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2 sm:mt-4">
                            The page you're looking for doesn't exist or has been moved. Let's get you back on track.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-8 sm:mt-10">
                            <Button asChild size="lg" className="gap-2">
                                <Link to="/">
                                    <Home className="size-4" />
                                    Back to Home
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="gap-2">
                                <Link to="/contact">
                                    <ArrowLeft className="size-4" />
                                    Contact Us
                                </Link>
                            </Button>
                        </div>

                        <div className="mt-12 sm:mt-16 pt-8 border-t border-slate-200 dark:border-slate-800">
                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-500 mb-4">Quick links</p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <Link to="/courses" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                                    <BookOpen className="size-4" />
                                    Courses
                                </Link>
                                <Link to="/about" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                                    <Search className="size-4" />
                                    About
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default NotFound;
