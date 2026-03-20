import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import * as LucideIcons from 'lucide-react';
import {
    Edit2,
    LayoutGrid,
    Plus,
    Trash2
} from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const DynamicIcon = ({ name, className }) => {
    const IconComponent = LucideIcons[name] || LucideIcons.HelpCircle;
    return <IconComponent className={className} />;
};

const DomainTableRow = React.memo(({ domain, courses, onEdit, onDelete, onToggle, isReadOnly }) => {
    const navigate = useNavigate();
    const courseCount = courses.filter(c => c.domainId === domain.id).length;

    return (
        <TableRow className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group cursor-pointer"
            onClick={() => navigate(`/admin/courses/${domain.id}`)}>
            <TableCell className="px-6 py-4" >
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 transition-all group-hover:bg-primary group-hover:text-white shadow-sm">
                        <DynamicIcon name={domain.icon} className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                        <div className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{domain.name}</div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">#{domain.id?.slice(0, 8)}</div>
                    </div>
                </div>
            </TableCell>
            <TableCell className="px-6 py-4">
                <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed max-w-xs xl:max-w-md">
                    {domain.description || 'No specialized description provided for this architectural domain classification.'}
                </p>
            </TableCell>
            <TableCell className="px-6 py-4">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        if (!isReadOnly) onToggle(domain);
                    }}
                    disabled={isReadOnly}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider w-fit border transition-all ${isReadOnly ? 'cursor-default' : 'hover:scale-105 active:scale-95'} ${domain.isDisabled ? 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20' : 'bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20'}`}
                    title={isReadOnly ? (domain.isDisabled ? "Private" : "Live") : (domain.isDisabled ? "Enable Domain" : "Disable Domain")}
                >
                    {domain.isDisabled ? <LucideIcons.EyeOff className="w-3 h-3" /> : <LucideIcons.Eye className="w-3 h-3" />}
                    {domain.isDisabled ? 'Private' : 'Live'}
                </button>
            </TableCell>
            <TableCell className="px-6 py-4">
                <span className="px-2.5 py-1 bg-slate-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    {courseCount} Modules
                </span>
            </TableCell>
            <TableCell className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-1">
                    {!isReadOnly && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); navigate(`/admin/courses/manage?domainId=${domain.id}`); }}
                                className="p-2 hover:bg-amber-500/10 text-amber-500 rounded-lg transition-colors"
                                title="Add Course"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); onEdit(domain); }}
                                className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors"
                                title="Edit Architecture"
                            >
                                <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); onDelete(domain); }}
                                className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
                                title="Remove Domain"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </>
                    )}
                </div>
            </TableCell>
        </TableRow>
    );
});

const DomainTable = ({ domains, courses, onEdit, onDelete, onToggle, isReadOnly }) => {
    return (
        <div className="rounded-xl border border-slate-100 dark:border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader className="bg-slate-50/50 dark:bg-slate-900/50">
                        <TableRow>
                            <TableHead className="text-xs font-semibold uppercase tracking-wider px-6 h-12 text-slate-500">Domain Node</TableHead>
                            <TableHead className="text-xs font-semibold uppercase tracking-wider px-6 h-12 text-slate-500">Contextual Info</TableHead>
                            <TableHead className="text-xs font-semibold uppercase tracking-wider px-6 h-12 text-slate-500">Status</TableHead>
                            <TableHead className="text-xs font-semibold uppercase tracking-wider px-6 h-12 text-slate-500">Density</TableHead>
                            <TableHead className="text-xs font-semibold uppercase tracking-wider px-6 h-12 text-right text-slate-500">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {domains.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-64 text-center text-slate-500">
                                    <div className="flex flex-col items-center justify-center gap-4">
                                        <div className="size-16 rounded-full bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center text-slate-300">
                                            <LayoutGrid className="w-8 h-8" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-bold text-slate-900 dark:text-white">No Domains Found</p>
                                            <p className="text-xs text-slate-500">Initialize your first domain to begin.</p>
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            domains.map((domain) => (
                                <DomainTableRow
                                    key={domain.id}
                                    domain={domain}
                                    courses={courses}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    onToggle={onToggle}
                                    isReadOnly={isReadOnly}
                                />
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default React.memo(DomainTable);
