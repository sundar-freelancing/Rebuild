import React, { useState } from 'react';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { 
    Plus, Edit2, Activity, LayoutGrid, Type, BookOpen, 
    User, Image as ImageIcon, FileText, Calendar, 
    Clock, Layers, Loader2, HelpCircle 
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';

const DynamicIcon = ({ name, className }) => {
    const IconComponent = LucideIcons[name] || HelpCircle;
    return <IconComponent className={className} />;
};

const CourseForm = ({ open, onOpenChange, course, domains, onSave, acting }) => {
    const [formData, setFormData] = useState({
        courseName: course?.courseName || '',
        courseDesc: course?.courseDesc || '',
        duration: course?.duration || '',
        rating: course?.rating || '4.9',
        isDisabled: course?.isDisabled || false,
        syllabus: course?.syllabus || '',
        level: course?.level || 'Intermediate',
        IconName: course?.IconName || 'BookOpen',
        popular: course?.popular || false,
        instructorName: course?.instructorName || '',
        instructorImage: course?.instructorImage || '',
        domainId: course?.domainId || ''
    });

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-xl w-full p-0 flex flex-col border-l border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden">
                <SheetHeader className="p-6 pb-4 bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-primary/10 rounded-xl">
                            {course ? <Edit2 className="w-5 h-5 text-primary" /> : <Plus className="w-5 h-5 text-primary" />}
                        </div>
                        <div className="space-y-0.5">
                            <SheetTitle className="text-xl font-bold text-slate-900 dark:text-white">
                                {course ? 'Edit Course' : 'Create New Course'}
                            </SheetTitle>
                            <SheetDescription className="text-xs text-slate-500 font-medium">
                                Configure core identity, instructor details and course metadata.
                            </SheetDescription>
                        </div>
                    </div>
                </SheetHeader>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar bg-slate-50/30 dark:bg-slate-900/10">
                    {/* Course Identity */}
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2 px-1">
                            <div className="w-4 h-0.5 bg-primary/40 rounded-full" />
                            Course Identity
                        </h3>
                        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-white/5 space-y-5 shadow-sm">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-semibold text-slate-500 flex items-center gap-2"><LayoutGrid className="w-3.5 h-3.5" /> Domain</Label>
                                    <Select value={formData.domainId} onValueChange={(val) => handleChange('domainId', val)}>
                                        <SelectTrigger className="rounded-xl h-10 border-slate-200">
                                            <SelectValue placeholder="Select domain" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            {domains.map(d => (
                                                <SelectItem key={d.id} value={d.id} className="font-medium">{d.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold text-slate-500 flex items-center gap-2"><Type className="w-3.5 h-3.5" /> Course Title</Label>
                                <Input
                                    placeholder="Introduction to Full Stack Development"
                                    value={formData.courseName}
                                    onChange={(e) => handleChange('courseName', e.target.value)}
                                    required
                                    className="rounded-xl h-10 border-slate-200"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold text-slate-500 flex items-center gap-2"><BookOpen className="w-3.5 h-3.5" /> Icon Name (Lucide)</Label>
                                <div className="relative">
                                    <Input
                                        placeholder="Code, Shield, etc."
                                        value={formData.IconName}
                                        onChange={(e) => handleChange('IconName', e.target.value)}
                                        required
                                        className="rounded-xl h-10 border-slate-200 pl-10"
                                    />
                                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary">
                                        <DynamicIcon name={formData.IconName} className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Instructor Info */}
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2 px-1">
                            <div className="w-4 h-0.5 bg-primary/40 rounded-full" />
                            Instructor Details
                        </h3>
                        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-white/5 space-y-5 shadow-sm">
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold text-slate-500 flex items-center gap-2"><User className="w-3.5 h-3.5" /> Instructor Name</Label>
                                <Input
                                    placeholder="Dr. Sarah Connor"
                                    value={formData.instructorName}
                                    onChange={(e) => handleChange('instructorName', e.target.value)}
                                    className="rounded-xl h-10 border-slate-200"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold text-slate-500 flex items-center gap-2"><ImageIcon className="w-3.5 h-3.5" /> Profile Image URL</Label>
                                <div className="flex items-center gap-4">
                                    {formData.instructorImage && (
                                        <img src={formData.instructorImage} className="w-10 h-10 rounded-lg object-cover border" alt="preview" />
                                    )}
                                    <Input
                                        placeholder="https://..."
                                        value={formData.instructorImage}
                                        onChange={(e) => handleChange('instructorImage', e.target.value)}
                                        className="rounded-xl h-10 border-slate-200"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description & Syllabus */}
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2 px-1">
                            <div className="w-4 h-0.5 bg-primary/40 rounded-full" />
                            Content & Summary
                        </h3>
                        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-white/5 space-y-5 shadow-sm">
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold text-slate-500 flex items-center gap-2"><FileText className="w-3.5 h-3.5" /> Course Description</Label>
                                <Textarea
                                    placeholder="Enter course description..."
                                    rows={3}
                                    value={formData.courseDesc}
                                    onChange={(e) => handleChange('courseDesc', e.target.value)}
                                    className="rounded-xl border-slate-200 resize-none text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold text-slate-500 flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> Syllabus Overview</Label>
                                <Textarea
                                    placeholder="Module 1, Module 2, ..."
                                    rows={2}
                                    value={formData.syllabus}
                                    onChange={(e) => handleChange('syllabus', e.target.value)}
                                    className="rounded-xl border-slate-200 resize-none text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Metadata & Visibility */}
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2 px-1">
                            <div className="w-4 h-0.5 bg-primary/40 rounded-full" />
                            Attributes & Visibility
                        </h3>
                        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-white/5 space-y-6 shadow-sm">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-semibold text-slate-500">Duration</Label>
                                    <Input
                                        value={formData.duration}
                                        onChange={(e) => handleChange('duration', e.target.value)}
                                        className="rounded-xl h-9 text-xs"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-semibold text-slate-500">Complexity</Label>
                                    <Select value={formData.level} onValueChange={(val) => handleChange('level', val)}>
                                        <SelectTrigger className="rounded-xl h-9 text-xs">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Beginner">Beginner</SelectItem>
                                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                                            <SelectItem value="Advanced">Advanced</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5">
                                <div className="space-y-0.5">
                                    <Label className="text-xs font-bold text-slate-900 dark:text-white">Public Status</Label>
                                    <p className="text-[10px] text-slate-500">Enable to show on live site</p>
                                </div>
                                <Switch
                                    checked={!formData.isDisabled}
                                    onCheckedChange={(val) => handleChange('isDisabled', !val)}
                                    className="scale-75 data-[state=checked]:bg-green-500"
                                />
                            </div>

                            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5">
                                <div className="space-y-0.5">
                                    <Label className="text-xs font-bold text-slate-900 dark:text-white">Hot Choice</Label>
                                    <p className="text-[10px] text-slate-500">Highlight with \"Popular\" badge</p>
                                </div>
                                <Switch
                                    checked={formData.popular}
                                    onCheckedChange={(val) => handleChange('popular', val)}
                                    className="scale-75 data-[state=checked]:bg-amber-500"
                                />
                            </div>
                        </div>
                    </div>
                </form>

                <SheetFooter className="p-4 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-white/5 gap-3 flex flex-row justify-end">
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={() => onOpenChange(false)}
                        className="rounded-xl h-10 font-bold px-6"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={acting}
                        className="rounded-xl h-10 font-bold px-6"
                    >
                        {acting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        {course ? 'Update Course' : 'Create Course'}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};

export default React.memo(CourseForm);
