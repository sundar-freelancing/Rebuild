import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    Plus, Search, ArrowLeft, BookOpen, Layers, Edit2, Trash2, Eye, EyeOff, MoreVertical, LayoutGrid, Calendar, Clock
} from 'lucide-react';
import useAdminStore from '@/store/useAdminStore';
import useAuthStore from '@/store/useAuthStore';
import CourseTable from '@/components/admin/courses/CourseTable';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/firebase';
import { deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const DomainDetail = () => {
    const { domainId } = useParams();
    const navigate = useNavigate();
    const { courses, domains, loading } = useAdminStore();
    const profile = useAuthStore(s => s.profile);
    const isReadOnly = profile?.role === 'Viewer';
    const [searchQuery, setSearchQuery] = useState('');
    const [isCourseDeleteOpen, setIsCourseDeleteOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [acting, setActing] = useState(false);

    const domain = useMemo(() => domains.find(d => d.id === domainId), [domains, domainId]);
    const domainCourses = useMemo(() =>
        courses.filter(c => c.domainId === domainId && (
            c.courseName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.id?.toLowerCase().includes(searchQuery.toLowerCase())
        )),
        [courses, domainId, searchQuery]
    );

    const handleOpenAddCourse = () => {
        navigate(`/admin/courses/manage?domainId=${domainId}`);
    };

    const handleToggleCourseStatus = async (course) => {
        if (isReadOnly) return;
        try {
            await updateDoc(doc(db, 'domains', domainId, 'courses', course.id), {
                isDisabled: !course.isDisabled,
                updatedAt: serverTimestamp()
            });
        } catch (error) {
            console.error("Error toggling course status:", error);
        }
    };

    const confirmDeleteCourse = async () => {
        if (!deleteTarget || isReadOnly) return;
        setActing(true);
        try {
            await deleteDoc(doc(db, 'domains', domainId, 'courses', deleteTarget.id));
            setIsCourseDeleteOpen(false);
            setDeleteTarget(null);
        } catch (error) {
            console.error("Error deleting course:", error);
        } finally {
            setActing(false);
        }
    };

    if (loading) {
        return (
            <div className="py-40 flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                <p className="text-slate-500 font-bold mt-6 tracking-wide">Syncing domain details...</p>
            </div>
        );
    }

    if (!domain) {
        return (
            <div className="py-20 text-center">
                <h1 className="text-2xl font-bold mb-4">Domain not found</h1>
                <Button onClick={() => navigate('/admin/courses')}>Back to Domains</Button>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/admin/courses')}
                        className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-500 hover:text-primary transition-all hover:scale-110 active:scale-95 shadow-sm"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{domain.name}</h1>
                            <span className="text-sm font-bold bg-primary/10 text-primary px-3 py-1 rounded-full">{domainCourses.length} Courses</span>
                        </div>
                        <p className="text-slate-500 font-medium">Managing courses for {domain.name} domain.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {!isReadOnly && (
                        <Button onClick={handleOpenAddCourse} className="h-12 px-6 rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                            <Plus className="w-5 h-5 mr-2" />
                            Create New Course
                        </Button>
                    )}
                </div>
            </div>

            {/* List Table container */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
                {/* Search Bar */}
                <div className="p-6 border-b border-slate-200 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative group max-w-md w-full">
                        <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-primary transition-colors" />
                        <input
                            placeholder="Search courses in this domain..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm w-full focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="p-6">
                    <CourseTable
                        courses={domainCourses}
                        onDelete={(course) => { setDeleteTarget(course); setIsCourseDeleteOpen(true); }}
                        onToggle={handleToggleCourseStatus}
                        isReadOnly={isReadOnly}
                    />
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isCourseDeleteOpen} onOpenChange={setIsCourseDeleteOpen}>
                <DialogContent className="sm:max-w-sm rounded-[2.5rem] p-8 border-none shadow-2xl">
                    <div className="mx-auto mb-6 size-20 rounded-3xl bg-red-500/10 flex items-center justify-center text-red-500 transform -rotate-12 transition-transform hover:rotate-0 duration-500">
                        <Trash2 className="w-10 h-10" />
                    </div>
                    <DialogTitle className="text-center text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Confirm Removal</DialogTitle>
                    <DialogDescription className="text-center font-bold text-lg text-slate-500 leading-relaxed">
                        Are you sure you want to delete <span className="text-red-500 font-black">{deleteTarget?.courseName}</span>? This action cannot be undone.
                    </DialogDescription>
                    <DialogFooter className="flex gap-4 sm:flex-row mt-8">
                        <Button variant="outline" className="flex-1 rounded-2xl h-14 font-black border-2" onClick={() => setIsCourseDeleteOpen(false)} disabled={acting}>
                            Keep It
                        </Button>
                        <Button variant="destructive" className="flex-1 rounded-2xl h-14 font-black shadow-lg shadow-red-500/20" onClick={confirmDeleteCourse} disabled={acting}>
                            {acting ? 'Removing...' : 'Remove Course'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default DomainDetail;
