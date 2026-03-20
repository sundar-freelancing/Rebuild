import React, { useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
    ArrowLeft, Edit2, BookOpen, Clock, Star, Layers, User, Calendar, ExternalLink, Shield, Target, GraduationCap, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import useAdminStore from '@/store/useAdminStore';
import useAuthStore from '@/store/useAuthStore';
import * as LucideIcons from 'lucide-react';

const DynamicIcon = ({ name, className }) => {
    const IconComponent = LucideIcons[name] || LucideIcons.HelpCircle;
    return <IconComponent className={className} />;
};

const CourseView = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { courses, domains, loading } = useAdminStore();
    const { profile } = useAuthStore();
    const isReadOnly = profile?.role === 'Viewer';

    const course = useMemo(() => courses.find(c => c.id === courseId), [courses, courseId]);
    const domain = useMemo(() => course ? domains.find(d => d.id === course.domainId) : null, [course, domains]);

    if (loading) {
        return (
            <div className="py-40 flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                <p className="text-slate-500 font-bold mt-6 tracking-wide animate-pulse">Analyzing course data...</p>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="py-20 text-center">
                <div className="mx-auto mb-6 size-24 rounded-3xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-300 transform rotate-12">
                    <BookOpen className="w-12 h-12" />
                </div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight uppercase">Resource Not Found</h1>
                <p className="text-slate-500 font-medium max-w-sm mx-auto mb-8 leading-relaxed">The educational resource you are looking for might have been moved or permanently deleted from our records.</p>
                <Button onClick={() => navigate('/admin/courses')} className="h-14 px-8 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                    Return to Knowledge Hub
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header / Breadcrumbs */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
                <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm font-black uppercase tracking-widest text-slate-400">
                        <Link to="/admin/courses" className="hover:text-primary transition-colors">Courses</Link>
                        <ChevronRight className="w-4 h-4" />
                        <Link to={`/admin/courses/${course.domainId}`} className="hover:text-primary transition-colors">{domain?.name || 'Domain'}</Link>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="p-5 bg-primary/10 rounded-3xl text-primary border border-primary/20 shadow-xl shadow-primary/10">
                            <DynamicIcon name={course.IconName} className="w-10 h-10" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">{course.courseName}</h1>
                            <div className="flex flex-wrap items-center gap-4 text-sm font-bold">
                                <span className={`px-3 py-1 rounded-full uppercase tracking-tighter border ${course.isDisabled ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-green-500/10 text-green-600 border-green-500/20'}`}>
                                    {course.isDisabled ? 'Private / Draft' : 'Public / Live'}
                                </span>
                                <span className="text-slate-400">#RD-{course.id?.slice(-6).toUpperCase()}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {!isReadOnly && (
                        <Button 
                            onClick={() => navigate(`/admin/courses/manage/${course.id}`)}
                            className="h-14 px-8 rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all font-black text-lg bg-primary hover:bg-primary/90"
                        >
                            <Edit2 className="w-5 h-5 mr-3" />
                            Refine Course
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 px-4 pb-24">
                {/* Main Analysis Column */}
                <div className="lg:col-span-2 space-y-10">
                    <div className="bg-white dark:bg-slate-800 p-10 rounded-[3rem] border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden group">
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000" />
                        
                        <div className="relative space-y-8">
                            <div className="flex items-center gap-4 border-b border-slate-100 dark:border-white/5 pb-8">
                                <div className="p-3 bg-primary/10 rounded-2xl"><Shield className="w-6 h-6 text-primary" /></div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Overview & Description</h3>
                                    <p className="text-slate-500 font-medium italic">High-level summary of the educational resource.</p>
                                </div>
                            </div>
                            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                                {course.courseDesc}
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6">
                                <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-100 dark:border-white/5 space-y-2 group/stat">
                                    <Clock className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                                    <div className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Duration</div>
                                    <div className="text-lg font-black text-slate-900 dark:text-white">{course.duration}</div>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-100 dark:border-white/5 space-y-2 group/stat">
                                    <Star className="w-5 h-5 text-amber-500 fill-amber-500 group-hover:scale-110 transition-transform" />
                                    <div className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Rating</div>
                                    <div className="text-lg font-black text-slate-900 dark:text-white">{course.rating || '4.5'}/5.0</div>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-100 dark:border-white/5 space-y-2 group/stat">
                                    <Layers className="w-5 h-5 text-secondary group-hover:scale-110 transition-transform" />
                                    <div className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Level</div>
                                    <div className="text-lg font-black text-slate-900 dark:text-white">{course.level}</div>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-100 dark:border-white/5 space-y-2 group/stat">
                                    <Calendar className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform" />
                                    <div className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Added On</div>
                                    <div className="text-lg font-black text-slate-900 dark:text-white">
                                        {course.dateOfCreation?.toDate?.().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) || 'Recent'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-10 rounded-[3rem] border border-slate-200 dark:border-white/10 shadow-sm space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-secondary/10 rounded-2xl"><Target className="w-6 h-6 text-secondary" /></div>
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Technical Curriculum</h3>
                                <p className="text-slate-500 font-medium underline decoration-secondary/30 underline-offset-4 decoration-2">Breakdown of the syllabus & roadmap.</p>
                            </div>
                        </div>
                        <div className="bg-slate-50/50 dark:bg-slate-900/30 p-8 rounded-3xl border-2 border-dashed border-slate-100 dark:border-white/5">
                            <pre className="whitespace-pre-wrap font-medium text-slate-600 dark:text-slate-300 leading-loose text-lg font-mono">
                                {course.syllabus || "Course syllabus has not been added to the system database yet. Reach out to the course administrator for details."}
                            </pre>
                        </div>
                    </div>
                </div>

                {/* Info Sidebar */}
                <div className="space-y-10">
                    {/* Instructor Profile Card */}
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden relative group">
                        <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
                        <div className="flex flex-col items-center text-center space-y-6">
                            <div className="relative">
                                <div className="size-28 rounded-3xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center border-4 border-white dark:border-slate-800 rotate-3 group-hover:rotate-0 transition-transform duration-500 overflow-hidden shadow-2xl">
                                    {course.instructorImage ? <img src={course.instructorImage} className="w-full h-full object-cover" alt="inst" /> : <User className="w-10 h-10 text-slate-300" />}
                                </div>
                                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-xl shadow-lg shadow-emerald-500/30">
                                    <GraduationCap className="w-4 h-4" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-[10px] uppercase font-black text-primary tracking-[0.2em]">Authorized Instructor</div>
                                <h4 className="text-2xl font-black text-slate-900 dark:text-white">
                                    {course.instructorName || 'Unassigned Instructor'}
                                </h4>
                                <p className="text-sm text-slate-500 font-medium px-4">Subject Matter Expert specializing in high-performance computing and enterprise architecture.</p>
                            </div>
                            <div className="pt-4 w-full">
                                <Button variant="outline" className="w-full h-12 rounded-xl border-2 font-bold hover:bg-slate-50">View Mentor Profile</Button>
                            </div>
                        </div>
                    </div>

                    {/* Stats & Metadata */}
                    <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl space-y-8 relative overflow-hidden">
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
                        
                        <div className="space-y-6 relative">
                            <h3 className="text-xs uppercase font-black text-slate-400 tracking-widest border-b border-white/10 pb-4">Real-time Metrics</h3>
                            
                            <div className="space-y-6">
                                <div className="flex justify-between items-center group/met">
                                    <div className="flex items-center gap-3">
                                        <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-sm font-bold text-slate-300">Popularity Status</span>
                                    </div>
                                    <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${course.popular ? 'bg-amber-500/20 text-amber-500' : 'bg-slate-800 text-slate-500'}`}>
                                        {course.popular ? 'Trending' : 'Standard'}
                                    </div>
                                </div>
                                <div className="flex justify-between items-center group/met">
                                    <div className="flex items-center gap-3">
                                        <div className="size-2 rounded-full bg-blue-500" />
                                        <span className="text-sm font-bold text-slate-300">Course Index</span>
                                    </div>
                                    <div className="text-sm font-black text-white">{courseId.slice(0, 8).toUpperCase()}</div>
                                </div>
                                <div className="flex justify-between items-center group/met">
                                    <div className="flex items-center gap-3">
                                        <div className="size-2 rounded-full bg-indigo-500" />
                                        <span className="text-sm font-bold text-slate-300">External View</span>
                                    </div>
                                    <Link 
                                        to={`/courses/${course.domainId}`} // Or specific course detail if implemented
                                        className="p-2 hover:bg-white/10 rounded-lg transition-all text-primary"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseView;
