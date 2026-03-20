import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
    ArrowLeft, Save, Loader2, BookOpen, Clock, Star, Layers, User, Image as ImageIcon, CheckCircle2, AlertCircle, Info, ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import * as LucideIcons from 'lucide-react';
import { db } from '@/lib/firebase';
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import useAdminStore from '@/store/useAdminStore';

const DynamicIcon = ({ name, className }) => {
    const IconComponent = LucideIcons[name] || LucideIcons.HelpCircle;
    return <IconComponent className={className} />;
};

const CourseManage = () => {
    const { courseId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { courses, domains, loading } = useAdminStore();
    const [acting, setActing] = useState(false);

    const [formData, setFormData] = useState({
        courseName: '',
        courseDesc: '',
        duration: '',
        rating: '4.5',
        level: 'Intermediate',
        IconName: 'BookOpen',
        instructorName: '',
        instructorImage: '',
        popular: false,
        isDisabled: false,
        syllabus: '',
        domainId: searchParams.get('domainId') || '',
    });

    const isEditing = !!courseId;
    const course = useMemo(() => courses.find(c => c.id === courseId), [courses, courseId]);

    useEffect(() => {
        if (isEditing && course) {
            setFormData({
                courseName: course.courseName || '',
                courseDesc: course.courseDesc || '',
                duration: course.duration || '',
                rating: course.rating || '4.5',
                level: course.level || 'Intermediate',
                IconName: course.IconName || 'BookOpen',
                instructorName: course.instructorName || '',
                instructorImage: course.instructorImage || '',
                popular: course.popular || false,
                isDisabled: course.isDisabled || false,
                syllabus: course.syllabus || '',
                domainId: course.domainId || '',
            });
        }
    }, [course, isEditing]);

    // Fix double scrollbar issue specifically for this page
    useEffect(() => {
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
        return () => {
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
        };
    }, []);


    const handleSave = async (e) => {
        if (e) e.preventDefault();
        if (!formData.domainId) {
            alert("Please select a domain first.");
            return;
        }
        setActing(true);
        try {
            if (isEditing) {
                // Update implementation (assuming standard path - logic might need adjustment based on how it was stored)
                await updateDoc(doc(db, 'domains', formData.domainId, 'courses', courseId), {
                    ...formData,
                    updatedAt: serverTimestamp()
                });
            } else {
                await addDoc(collection(db, 'domains', formData.domainId, 'courses'), {
                    ...formData,
                    dateOfCreation: serverTimestamp(),
                    updatedAt: serverTimestamp()
                });
            }
            navigate(`/admin/courses/${formData.domainId}`);
        } catch (error) {
            console.error("Error saving course:", error);
            // Some databases use flat 'courses' collection instead of nested ones. 
            // In case the above fails, you might want to try a flat update if that's the architecture.
        } finally {
            setActing(false);
        }
    };

    if (loading && isEditing) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                <p className="text-slate-500 font-bold mt-6 tracking-wide">Fetching course details...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-500 hover:text-primary transition-all hover:scale-110 active:scale-95 shadow-sm"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                            {isEditing ? 'Refine Curriculum' : 'Architect New Course'}
                        </h1>
                        <p className="text-slate-500 font-medium">Configure all aspects of this educational module.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        onClick={() => navigate(-1)}
                        className="h-12 px-6 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 transition-all"
                    >
                        Discard
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={acting}
                        className="h-12 px-8 rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all font-black uppercase tracking-wider bg-primary text-white border-none"
                    >
                        {acting ? (
                            <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Syncing...</>
                        ) : (
                            <><Save className="w-5 h-5 mr-2" />{isEditing ? 'Sync Changes' : 'Deploy Course'}</>
                        )}
                    </Button>
                </div>
            </div>

            <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column - Main Details */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Core Information Section */}
                    <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-sm p-8 md:p-10 space-y-10">
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Course Foundation</h3>
                            <p className="text-slate-500 font-medium text-sm">Primary metadata and categorization.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="md:col-span-2 space-y-3">
                                <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Domain Classification</Label>
                                <Select
                                    value={formData.domainId}
                                    onValueChange={(val) => setFormData({ ...formData, domainId: val })}
                                    disabled={isEditing}
                                >
                                    <SelectTrigger className="h-14 rounded-2xl border-2 border-slate-100 dark:border-white/5 focus:ring-4 focus:ring-primary/10 font-bold px-6 bg-slate-50/50 dark:bg-slate-900/50">
                                        <SelectValue placeholder="Identify the Subject / Industry" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl p-2">
                                        {domains.map(d => (
                                            <SelectItem key={d.id} value={d.id} className="rounded-xl py-3 text-sm font-bold">
                                                {d.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="md:col-span-2 space-y-3">
                                <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Academic Title</Label>
                                <Input
                                    placeholder="Enter Course Nomenclature"
                                    value={formData.courseName}
                                    onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                                    required
                                    className="h-14 rounded-2xl border-2 border-slate-100 dark:border-white/5 focus:ring-4 focus:ring-primary/10 font-black text-lg px-6 bg-slate-50/50 dark:bg-slate-900/50"
                                />
                            </div>

                            <div className="md:col-span-2 space-y-3">
                                <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Strategic Description</Label>
                                <Textarea
                                    rows={4}
                                    placeholder="Summarize the educational value proposition..."
                                    value={formData.courseDesc}
                                    onChange={(e) => setFormData({ ...formData, courseDesc: e.target.value })}
                                    required
                                    className="rounded-2xl border-2 border-slate-100 dark:border-white/5 focus:ring-4 focus:ring-primary/10 font-medium p-6 resize-none leading-relaxed bg-slate-50/50 dark:bg-slate-900/50 min-h-[120px]"
                                />
                            </div>

                            <div className="space-y-3">
                                <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Temporal Duration</Label>
                                <div className="relative">
                                    <Clock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                                    <Input
                                        placeholder="e.g. 6 Months"
                                        value={formData.duration}
                                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                        className="h-14 rounded-2xl border-2 border-slate-100 dark:border-white/5 pl-12 pr-6 focus:ring-primary/10 font-bold bg-slate-50/50 dark:bg-slate-900/50"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Complexity Level</Label>
                                <Select value={formData.level} onValueChange={(v) => setFormData({ ...formData, level: v })}>
                                    <SelectTrigger className="h-14 rounded-2xl border-2 border-slate-100 dark:border-white/5 font-bold px-6 bg-slate-50/50 dark:bg-slate-900/50">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl font-bold">
                                        <SelectItem value="Beginner">Beginner</SelectItem>
                                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                                        <SelectItem value="Advanced">Advanced</SelectItem>
                                        <SelectItem value="Mastery">Mastery</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Syllabus Detail Section */}
                    <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-sm p-8 space-y-6">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4 px-2">
                            <div className="flex items-center gap-3">
                                <Layers className="size-5 text-primary" />
                                <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Curriculum Roadmap</h3>
                            </div>
                        </div>
                        <Textarea
                            rows={8}
                            placeholder="Map out the technical milestones..."
                            value={formData.syllabus}
                            onChange={(e) => setFormData({ ...formData, syllabus: e.target.value })}
                            className="rounded-3xl border-2 border-slate-100 dark:border-white/5 focus:ring-4 focus:ring-primary/10 font-medium p-8 resize-none leading-loose bg-slate-50/50 dark:bg-slate-900/50 min-h-[250px]"
                        />
                    </div>
                </div>

                {/* Right Column - Controls & Info */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Instructor Profile Card */}
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-sm space-y-8">
                        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-white/5 pb-4">
                            <User className="w-5 h-5 text-primary" />
                            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-[10px]">Lead Instructor</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Assigned Scholar</Label>
                                <Input
                                    placeholder="Enter Name"
                                    value={formData.instructorName}
                                    onChange={(e) => setFormData({ ...formData, instructorName: e.target.value })}
                                    className="rounded-xl border-slate-200 focus:ring-primary/20 font-bold bg-slate-50/50 h-12"
                                />
                            </div>
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Avatar Resource (URL)</Label>
                                <div className="flex items-center gap-4">
                                    <div className="size-16 rounded-2xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center border border-slate-200 overflow-hidden shrink-0 shadow-inner group">
                                        {formData.instructorImage ? <img src={formData.instructorImage} className="w-full h-full object-cover" alt="prev" /> : <ImageIcon className="w-6 h-6 text-slate-300 group-hover:text-primary transition-colors" />}
                                    </div>
                                    <Input
                                        placeholder="https://images.com/..."
                                        value={formData.instructorImage}
                                        onChange={(e) => setFormData({ ...formData, instructorImage: e.target.value })}
                                        className="rounded-xl border-slate-200 focus:ring-primary/20 font-medium text-xs bg-slate-50/50 h-10"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Technical Config & Icon */}
                    <div className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 p-8 rounded-[2.5rem] shadow-2xl space-y-10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-bl-full z-0 group-hover:scale-150 transition-transform duration-700" />

                        <div className="space-y-6 relative z-10">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <div className="text-sm font-black tracking-tight flex items-center gap-2 italic">
                                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                        Priority Status
                                    </div>
                                    <p className="text-[10px] opacity-60 font-medium">Highlight this course</p>
                                </div>
                                <Switch
                                    checked={formData.popular}
                                    onCheckedChange={(c) => setFormData({ ...formData, popular: c })}
                                    className="data-[state=checked]:bg-primary"
                                />
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-white/10 dark:border-slate-100">
                                <div className="space-y-1 mt-4">
                                    <div className="text-sm font-black tracking-tight flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 opacity-70" />
                                        Is Disabled
                                    </div>
                                    <p className="text-[10px] opacity-60 font-medium">Hide this course from public view</p>
                                </div>
                                <Switch
                                    checked={formData.isDisabled}
                                    onCheckedChange={(c) => setFormData({ ...formData, isDisabled: c })}
                                />
                            </div>
                        </div>

                        {/* Icon Selection - Redesigned as requested */}
                        <div className="space-y-4 relative z-10">
                            <div className="flex items-center justify-between px-1">
                                <Label className="text-[10px] font-black uppercase text-white/50 dark:text-slate-400 tracking-widest">Visual Identifer</Label>
                                <a
                                    href="https://lucide.dev/icons"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-1.5 text-[10px] font-bold text-primary bg-primary/10 hover:bg-primary/20 px-2 py-1 rounded-full transition-all"
                                >
                                    <Info className="size-3" />
                                    Lucide Guide
                                    <ExternalLink className="size-2.5 opacity-60" />
                                </a>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="size-14 rounded-2xl bg-white/10 dark:bg-slate-100 flex items-center justify-center border border-white/20 dark:border-slate-200 text-primary shadow-lg shrink-0 scale-100 group-hover:scale-110 transition-transform">
                                    <DynamicIcon name={formData.IconName} className="w-7 h-7" />
                                </div>
                                <Input
                                    placeholder="e.g. Code2, Globe, Cpu"
                                    value={formData.IconName}
                                    onChange={(e) => setFormData({ ...formData, IconName: e.target.value })}
                                    className="rounded-xl border-white/20 dark:border-slate-200 bg-white/5 dark:bg-slate-50 focus:ring-primary/20 font-bold h-12 flex-1"
                                />
                            </div>
                            <p className="text-[9px] font-medium opacity-50 px-2 leading-relaxed">
                                Enter any Lucide icon identifier. Refer to the guide for available node symbols.
                            </p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CourseManage;
