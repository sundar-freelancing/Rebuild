import { useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Clock, Star, BookOpen, HelpCircle } from 'lucide-react';
import PageHero from '@/components/common/PageHero';
import GlassCard from '@/components/common/GlassCard';
import { useLeadCapture } from '@/context/LeadCaptureContext';
import usePublicStore from '@/store/usePublicStore';
import * as LucideIcons from 'lucide-react';

const DynamicIcon = ({ name, className }) => {
    const IconComponent = LucideIcons[name] || HelpCircle;
    return <IconComponent className={className} />;
};

const DomainCourses = () => {
    const { domainId } = useParams();
    const { openModal } = useLeadCapture();
    const { domains, courses, loadingCourses, initCourses } = usePublicStore();

    useEffect(() => {
        initCourses();
    }, [initCourses]);

    const domain = useMemo(() => 
        domains.find(d => d.id === domainId),
        [domains, domainId]
    );

    const domainCourses = useMemo(() => 
        courses.filter(c => c.domainId === domainId && !c.isDisabled),
        [courses, domainId]
    );

    if (loadingCourses) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <p className="text-slate-500 font-medium animate-pulse">Loading Courses...</p>
                </div>
            </div>
        );
    }

    if (!domain) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-6">
                <h1 className="text-2xl font-bold">Domain not found</h1>
                <Link to="/courses" className="text-primary flex items-center gap-2">
                    <ArrowLeft className="w-5 h-5" /> Back to all domains
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen overflow-hidden">
            <PageHero
                badge={domain.name}
                icon={BookOpen}
                title="Explore Our"
                gradientText="Specialized Courses"
                subtitle={domain.description || `Master the latest technologies in ${domain.name} with our industry-led certification programs.`}
            />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pb-24">
                <Link to="/courses" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary font-semibold mb-12 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Knowledge Hub
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {domainCourses.map((course, index) => (
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
                    
                    {domainCourses.length === 0 && (
                        <div className="col-span-full py-20 text-center bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-white/10">
                            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Upcoming Courses</h3>
                            <p className="text-slate-500 mt-2">We're currently designing new curriculum for this domain. Stay tuned!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DomainCourses;
