import { useEffect, useMemo } from 'react';
import { ArrowRight, Clock, Star, BookOpen, HelpCircle } from 'lucide-react';
import PageHero from '@/components/common/PageHero';
import SEO from '@/components/SEO';
import GlassCard from '@/components/common/GlassCard';
import { Link } from 'react-router-dom';
import { useLeadCapture } from '@/context/LeadCaptureContext';
import usePublicStore from '@/store/usePublicStore';
import * as LucideIcons from 'lucide-react';

const DynamicIcon = ({ name, className }) => {
    const IconComponent = LucideIcons[name] || HelpCircle;
    return <IconComponent className={className} />;
};

const Courses = () => {
    const { openModal } = useLeadCapture();
    const { domains, courses, loadingCourses, initCourses } = usePublicStore();

    useEffect(() => {
        initCourses();
    }, [initCourses]);

    const groupedCourses = useMemo(() => {
        if (!domains.length) return [];

        return domains.map(domain => {
            const domainCourses = courses.filter(course => course.domainId === domain.id && !course.isDisabled);
            return {
                ...domain,
                courses: domainCourses
            };
        }).filter(group => group.courses.length > 0);
    }, [domains, courses]);

    if (loadingCourses) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <p className="text-slate-500 font-medium animate-pulse">Loading Knowledge Hub...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen overflow-hidden">
            <SEO title="Our Courses" description="Master the Digital Frontier with industry-vetted curriculum." url="/courses" />
            <PageHero
                badge="Knowledge Hub"
                icon={BookOpen}
                title="Master the"
                gradientText="Digital Frontier"
                subtitle="Industry-vetted curriculum designed to take you from fundamentals to enterprise-grade expertise."
            />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                {groupedCourses.map((category) => (
                    <section key={category.id} className="mb-24">
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                            <div data-aos="fade-right">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        <DynamicIcon name={category.icon} className="w-6 h-6" />
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">{category.name}</h2>
                                </div>
                                <p className="text-slate-600 dark:text-slate-400 max-w-xl">
                                    {category.description || `Professional certifications designed to meet the highest standards of the ${category.name} industry.`}
                                </p>
                            </div>
                            <Link to="/contact" className="text-primary font-bold flex items-center gap-2 hover:gap-4 transition-all">
                                Inquiry for this category <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                            {category.courses.map((course, index) => (
                                <GlassCard key={course.id} delay={index * 100} className="relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-700" />

                                    <div className="flex flex-col sm:flex-row gap-8">
                                        <div className="grow">
                                            <div className="flex items-center gap-2 mb-4">
                                                <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-[10px] font-bold uppercase tracking-widest border border-secondary/20">
                                                    {course.level}
                                                </span>
                                                {course.popular && (
                                                    <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500 text-[10px] font-bold uppercase tracking-widest border border-amber-200 dark:border-amber-500/20">
                                                        Popular
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-primary transition-colors">
                                                {course.courseName}
                                            </h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 line-clamp-2">
                                                {course.courseDesc}
                                            </p>
                                            <div className="flex flex-wrap gap-6 text-sm text-slate-500 font-medium">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4 text-primary" />
                                                    {course.duration}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Star className="w-4 h-4 text-secondary fill-secondary" />
                                                    {course.rating}/5 Rating
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-center shrink-0">
                                            <button
                                                onClick={() => openModal(`Course: ${course.courseName}`, {
                                                    title: `Enroll in ${course.courseName}`,
                                                    subtitle: `Start your journey to becoming a ${course.courseName} expert today.`
                                                })}
                                                className="w-full sm:w-auto px-8 py-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl font-bold text-slate-900 dark:text-white hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm"
                                            >
                                                Enroll Now
                                            </button>
                                        </div>
                                    </div>
                                </GlassCard>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
};


export default Courses;

