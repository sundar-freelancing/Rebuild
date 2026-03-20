import React, { useEffect } from 'react';
import { BarChart, ChevronRight, Clock, HelpCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useLeadCapture } from '@/context/LeadCaptureContext';
import usePublicStore from '@/store/usePublicStore';
import * as LucideIcons from 'lucide-react';
import { Link } from 'react-router-dom';

const DynamicIcon = ({ name, className }) => {
    const IconComponent = LucideIcons[name] || HelpCircle;
    return <IconComponent className={className} />;
};

const Courses = () => {
    const { openModal } = useLeadCapture();
    const { courses, initCourses, loadingCourses } = usePublicStore();

    useEffect(() => {
        initCourses();
    }, [initCourses]);

    // Filter for popular courses or just take the first 3 if none marked popular
    const displayCourses = React.useMemo(() => {
        const popular = courses.filter(c => c.popular && !c.isDisabled);
        if (popular.length >= 3) return popular.slice(0, 3);

        // If not enough popular, fill with others
        const others = courses.filter(c => !c.popular && !c.isDisabled);
        return [...popular, ...others].slice(0, 3);
    }, [courses]);

    if (loadingCourses || displayCourses.length === 0) {
        return null; // Or a skeleton
    }

    return (
        <section className="py-12 sm:py-16 md:py-24 bg-white dark:bg-slate-950" id="courses">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8 sm:mb-12" data-aos="fade-up">
                    <div>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2 sm:mb-4">Core Modules</h2>
                        <p className="text-sm sm:text-base text-slate-500">Specialized training programs led by industry veterans.</p>
                    </div>
                    <Link to="/courses" className="text-primary font-semibold flex items-center gap-1.5 sm:gap-2 hover:gap-3 transition-all text-sm sm:text-base">
                        View All Modules <ChevronRight className="size-4 sm:size-5" />
                    </Link>
                </div>
                <div className="grid md:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
                    {displayCourses.map((course, i) => {
                        const midCourse = Math.floor(displayCourses.length / 2) === i;
                        return (
                            <div key={course.id} data-aos="fade-up" data-aos-delay={100 + i * 80} className="h-full">
                                <div className={`h-full bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 border hover:shadow-2xl transition-all hover:-translate-y-2 relative ${midCourse ? 'border-2 border-primary shadow-2xl md:-translate-y-5!' : 'border-slate-200 dark:border-slate-800'}`}>
                                    {course.popular && <div className="absolute top-3 right-3 sm:top-4 sm:right-4 px-2 py-0.5 sm:py-1 bg-primary text-white text-[10px] font-semibold rounded uppercase">Most Popular</div>}
                                    <div className="size-10 sm:size-12 md:size-14 bg-primary/10 rounded-lg sm:rounded-xl flex items-center justify-center text-primary mb-4 sm:mb-6">
                                        <DynamicIcon name={course.IconName} className="size-6 sm:size-7 md:size-8" />
                                    </div>
                                    <h3 className="text-base sm:text-lg md:text-xl font-semibold text-slate-900 dark:text-white mb-2 sm:mb-3">{course.courseName}</h3>
                                    <p className="text-slate-500 text-xs sm:text-sm mb-4 sm:mb-6 leading-relaxed line-clamp-2">{course.courseDesc}</p>
                                    <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-8 text-xs font-semibold text-slate-400">
                                        <span className="flex items-center gap-1"><Clock className="size-3.5 sm:size-4" /> {course.duration}</span>
                                        <span className="flex items-center gap-1"><BarChart className="size-3.5 sm:size-4" /> {course.level}</span>
                                    </div>
                                    <Button
                                        variant={midCourse ? "default" : "outline"}
                                        className="w-full text-sm sm:text-base"
                                        onClick={() => openModal(`Course: ${course.courseName}`, {
                                            title: `Enroll in ${course.courseName}`,
                                            subtitle: `Start your journey to becoming a ${course.courseName} expert today.`
                                        })}
                                    >
                                        Enroll Now
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};


export default Courses;
