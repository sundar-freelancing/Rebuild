import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import {
    BookOpen, User, Eye, EyeOff, Star, Clock, Layers, Edit2, Trash2, MoreVertical
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';

const DynamicIcon = ({ name, className }) => {
    const IconComponent = LucideIcons[name] || LucideIcons.HelpCircle;
    return <IconComponent className={className} />;
};

const CourseTableRow = React.memo(({ course, onDelete, onToggle }) => {
    const navigate = useNavigate();
    return (
        <TableRow
            className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group cursor-pointer"
            onClick={() => navigate(`/admin/courses/manage/${course.id}`)}
        >
            <TableCell className="px-6 py-4">
                <div className="flex items-center gap-4">
                    <div className="relative shrink-0">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                            <DynamicIcon name={course.IconName} className="w-6 h-6" />
                        </div>
                        {course.instructorImage && (
                            <img
                                src={course.instructorImage}
                                alt={course.instructorName}
                                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white dark:border-slate-800 object-cover shadow-sm"
                            />
                        )}
                    </div>
                    <div className="space-y-0.5">
                        <div className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{course.courseName}</div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                            <span className="uppercase tracking-wider">#{course.id?.slice(0, 8)}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                            <span className="flex items-center gap-1"><User className="w-3 h-3 text-primary/70" /> {course.instructorName || 'Unassigned'}</span>
                        </div>
                    </div>
                </div>
            </TableCell>
            <TableCell className="px-6 py-4">
                <div className="flex flex-col gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggle(course);
                        }}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider w-fit border transition-all hover:scale-105 active:scale-95 ${course.isDisabled ? 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20' : 'bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20'}`}
                        title={course.isDisabled ? "Enable Course" : "Disable Course"}
                    >
                        {course.isDisabled ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        {course.isDisabled ? 'Private' : 'Live'}
                    </button>
                    {course.popular && (
                        <div className="flex items-center gap-1 bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-lg w-fit border border-amber-500/20">
                            <Star className="w-3 h-3 fill-amber-500" /> Hot Choice
                        </div>
                    )}
                </div>
            </TableCell>
            <TableCell className="px-6 py-4">
                <div className="flex flex-col gap-1.5 font-medium text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2 text-xs">
                        <Clock className="w-3.5 h-3.5 text-primary/60" />
                        {course.duration}
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                        <Layers className="w-3.5 h-3.5 text-primary/60" />
                        {course.level}
                    </div>
                </div>
            </TableCell>
            <TableCell className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-1">
                    <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/admin/courses/manage/${course.id}`); }}
                        className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors"
                        title="View & Edit Course"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(course); }}
                        className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
                        title="Delete Course"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </TableCell>
        </TableRow>
    );
});

const CourseTable = ({ courses, onDelete, onToggle }) => {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader className="bg-slate-50/50 dark:bg-slate-900/50">
                        <TableRow>
                            <TableHead className="text-xs font-semibold uppercase tracking-wider px-6 h-12 text-slate-500">Course & Instructor</TableHead>
                            <TableHead className="text-xs font-semibold uppercase tracking-wider px-6 h-12 text-slate-500">Status & Popularity</TableHead>
                            <TableHead className="text-xs font-semibold uppercase tracking-wider px-6 h-12 text-slate-500">Course Specs</TableHead>
                            <TableHead className="text-xs font-semibold uppercase tracking-wider px-6 h-12 text-slate-500 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {courses.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-32 text-center text-slate-500">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <BookOpen className="w-8 h-8 opacity-20" />
                                        <p className="font-medium">No courses in this domain yet.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : courses.map((course) => (
                            <CourseTableRow
                                key={course.id}
                                course={course}
                                onDelete={onDelete}
                                onToggle={onToggle}
                            />
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default React.memo(CourseTable);
