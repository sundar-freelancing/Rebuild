import React, { useState } from 'react';
import {
    Users,
    MessageSquare,
    TrendingUp,
    Calendar,
    Search,
    Filter,
    ArrowUpRight,
    Loader2,
    Phone,
    ScanEye,
    Trash2,
    FileText,
    FileSpreadsheet,
    Download,
    CheckCircle2,
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { db } from '@/lib/firebase';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import useAdminStore from '@/store/useAdminStore';
import useAuthStore from '@/store/useAuthStore';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import LeadDetailSheet from '@/components/admin/LeadDetailSheet';
import { STATUS_CONFIG } from '@/components/admin/leadConstants';

/* ─── helpers ─── */
const formatDate = (timestamp) => {
    if (!timestamp) return 'Just now';
    const date = timestamp.toDate();
    const diffDays = Math.round((date - new Date()) / (1000 * 60 * 60 * 24));
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(diffDays, 'day');
};

/* ══════════════════════════════════════════════ */
const Dashboard = () => {
    const { leads } = useAdminStore();
    const { profile } = useAuthStore();
    const isReadOnly = profile?.role === 'Viewer';
    
    const [searchQuery, setSearchQuery]   = useState('');
    const [currentPage, setCurrentPage]   = useState(1);
    const [selectedLead, setSelectedLead] = useState(null);
    const [sheetOpen, setSheetOpen]       = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting]         = useState(false);
    const [activeFilter, setActiveFilter] = useState('all');
    const [exportDialogOpen, setExportDialogOpen] = useState(false);
    const itemsPerPage = 10;

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const updateStatus = async (leadId, newStatus) => {
        if (isReadOnly) return;
        try {
            await updateDoc(doc(db, 'userData', leadId), { status: newStatus });
            if (selectedLead?.id === leadId) {
                setSelectedLead(prev => ({ ...prev, status: newStatus }));
            }
        } catch (err) { console.error(err); }
    };

    const handleDeleteRequest = (lead) => {
        if (isReadOnly) return;
        setSheetOpen(false);
        setDeleteTarget(lead);
    };

    const confirmDelete = async () => {
        if (!deleteTarget || isReadOnly) return;
        setDeleting(true);
        try {
            await deleteDoc(doc(db, 'userData', deleteTarget.id));
            if (selectedLead?.id === deleteTarget.id) {
                setSelectedLead(null);
            }
        } catch (err) { console.error(err); }
        finally {
            setDeleting(false);
            setDeleteTarget(null);
        }
    };

    const openSheet = (lead) => {
        setSelectedLead(lead);
        setSheetOpen(true);
    };

    /* Filter labels for UI */
    const FILTER_OPTIONS = [
        { value: 'all',      label: 'All Leads' },
        { value: 'today',    label: 'New Today' },
        { value: 'converted',label: 'Conversion' },
        { value: 'pending',  label: 'Actions Pending' },
    ];
    const activeFilterLabel = FILTER_OPTIONS.find(f => f.value === activeFilter)?.label ?? 'All Leads';

    const handleFilterChange = (val) => {
        setActiveFilter(val);
        setCurrentPage(1);
    };

    /* Filtered + paginated data */
    const filteredLeads = leads.filter(lead => {
        /* text search */
        const matchesSearch =
            lead.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lead.mobile?.includes(searchQuery);
        if (!matchesSearch) return false;
        /* quick-filter */
        if (activeFilter === 'today') {
            const today = new Date();
            const ld    = lead.createdAt?.toDate();
            return ld && ld.toDateString() === today.toDateString();
        }
        if (activeFilter === 'converted') return lead.status === 'Converted';
        if (activeFilter === 'pending')   return lead.status === 'Pending';
        return true; // 'all'
    });
    const totalPages     = Math.ceil(filteredLeads.length / itemsPerPage);
    const paginatedLeads = filteredLeads.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    /* ── Export helpers ── */
    const exportRows = filteredLeads.map((l, i) => ([
        i + 1,
        l.name || '',
        l.email || '',
        l.mobile || '',
        l.source || '',
        l.status || 'Pending',
        l.createdAt?.toDate().toLocaleString() || '',
    ]));
    const exportHeaders = ['#', 'Name', 'Email', 'Mobile', 'Source', 'Status', 'Date'];

    const exportToPDF = () => {
        const doc = new jsPDF({ orientation: 'landscape' });
        doc.setFontSize(16);
        doc.text(`Lead Report — ${activeFilterLabel}`, 14, 16);
        doc.setFontSize(9);
        doc.text(`Generated: ${new Date().toLocaleString()}  |  Total: ${filteredLeads.length}`, 14, 22);
        autoTable(doc, {
            head: [exportHeaders],
            body: exportRows,
            startY: 28,
            styles: { fontSize: 8, cellPadding: 3 },
            headStyles: { fillColor: [99, 102, 241], textColor: 255, fontStyle: 'bold' },
            alternateRowStyles: { fillColor: [245, 247, 250] },
        });
        doc.save(`lead-report-${activeFilter}-${Date.now()}.pdf`);
        setExportDialogOpen(false);
    };

    const exportToExcel = () => {
        const ws = XLSX.utils.aoa_to_sheet([exportHeaders, ...exportRows]);
        /* column widths */
        ws['!cols'] = [4, 20, 28, 14, 14, 14, 24].map(w => ({ wch: w }));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Leads');
        XLSX.writeFile(wb, `lead-report-${activeFilter}-${Date.now()}.xlsx`);
        setExportDialogOpen(false);
    };

    /* Stats */
    const stats = [
        {
            label: 'Total Leads',
            val: leads.length.toString(),
            change: '+5.4%',
            icon: MessageSquare,
        },
        {
            label: 'New Today',
            val: leads.filter(l => {
                const today    = new Date();
                const leadDate = l.createdAt?.toDate();
                return leadDate && leadDate.toDateString() === today.toDateString();
            }).length.toString(),
            change: '+12%',
            icon: Users,
        },
        {
            label: 'Conversion',
            val: leads.length > 0
                ? `${((leads.filter(l => l.status === 'Converted').length / leads.length) * 100).toFixed(1)}%`
                : '0%',
            change: '+0.2%',
            icon: TrendingUp,
        },
        {
            label: 'Actions Pending',
            val: leads.filter(l => l.status === 'Pending').length.toString(),
            change: 'Focus',
            icon: Calendar,
        },
    ];

    /* ── JSX ── */
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">System Overview</h1>
                    <p className="text-slate-500 font-medium">Monitoring visitors and lead submissions in real-time.</p>
                </div>
                <div className="flex items-center gap-3">

                    {/* ── Filter Dropdown ── */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors">
                                <Filter className="w-4 h-4" />
                                {activeFilterLabel}
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-xl">
                            <DropdownMenuLabel className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Quick Filter</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioGroup value={activeFilter} onValueChange={handleFilterChange}>
                                {FILTER_OPTIONS.map(opt => (
                                    <DropdownMenuRadioItem
                                        key={opt.value}
                                        value={opt.value}
                                        className="text-sm font-medium cursor-pointer"
                                    >
                                        {opt.label}
                                        {activeFilter === opt.value && (
                                            <CheckCircle2 className="w-3.5 h-3.5 ml-auto text-primary" />
                                        )}
                                    </DropdownMenuRadioItem>
                                ))}
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* ── Export Report Button ── */}
                    <button
                        onClick={() => setExportDialogOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        Export Report
                    </button>

                    {/* ── Export Format Dialog ── */}
                    <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
                        <DialogContent className="sm:max-w-sm rounded-2xl">
                            <DialogHeader>
                                <div className="mx-auto mb-3 size-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Download className="w-6 h-6 text-primary" />
                                </div>
                                <DialogTitle className="text-center text-slate-900 dark:text-white">
                                    Export Report
                                </DialogTitle>
                                <DialogDescription className="text-center">
                                    Exporting&nbsp;
                                    <span className="font-bold text-slate-900 dark:text-white">{filteredLeads.length} lead{filteredLeads.length !== 1 ? 's' : ''}</span>
                                    &nbsp;({activeFilterLabel}). Choose your format:
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-2 gap-3 mt-2">
                                <button
                                    onClick={exportToPDF}
                                    className="flex flex-col items-center gap-3 p-5 rounded-xl border-2 border-slate-200 dark:border-white/10 hover:border-red-400 hover:bg-red-500/5 transition-all group"
                                >
                                    <FileText className="w-8 h-8 text-red-500 group-hover:scale-110 transition-transform" />
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">PDF</span>
                                    <span className="text-[10px] text-slate-400">Printable report</span>
                                </button>
                                <button
                                    onClick={exportToExcel}
                                    className="flex flex-col items-center gap-3 p-5 rounded-xl border-2 border-slate-200 dark:border-white/10 hover:border-emerald-400 hover:bg-emerald-500/5 transition-all group"
                                >
                                    <FileSpreadsheet className="w-8 h-8 text-emerald-500 group-hover:scale-110 transition-transform" />
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Excel</span>
                                    <span className="text-[10px] text-slate-400">Spreadsheet (.xlsx)</span>
                                </button>
                            </div>
                            <DialogFooter className="mt-2">
                                <Button variant="outline" className="w-full rounded-xl" onClick={() => setExportDialogOpen(false)}>
                                    Cancel
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-xl bg-primary/10 text-primary">
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div className="text-sm font-semibold text-green-600 bg-green-500/10 px-2.5 py-1 rounded-full flex items-center gap-1">
                                <ArrowUpRight className="w-3.5 h-3.5" />
                                {stat.change}
                            </div>
                        </div>
                        <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">{stat.label}</div>
                        <div className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{stat.val}</div>
                        <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-primary/5 rounded-full blur-2xl group-hover:scale-150 transition-all duration-700" />
                    </div>
                ))}
            </div>

            {/* Leads Table */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
                {/* Table header bar */}
                <div className="p-6 border-b border-slate-200 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Recent Lead Submissions</h3>
                    </div>
                    <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            placeholder="Search by name, email or mobile..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm w-full md:w-80 focus:ring-primary focus:border-primary outline-none"
                        />
                    </div>
                </div>

                <div className="p-6">
                    {paginatedLeads.length === 0 ? (
                        <div className="py-20 text-center">
                            <div className="bg-slate-50 dark:bg-slate-900/50 size-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MessageSquare className="w-8 h-8 text-slate-300" />
                            </div>
                            <h4 className="text-slate-900 dark:text-white font-bold">No leads found</h4>
                            <p className="text-slate-500 text-sm">Try adjusting your search or wait for new submissions.</p>
                        </div>
                    ) : (
                        <>
                            <div className="rounded-xl border border-slate-100 dark:border-white/5 overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-slate-50/50 dark:bg-slate-900/50">
                                        <TableRow>
                                            <TableHead className="text-xs font-semibold uppercase tracking-wider px-6 h-12 text-slate-500">Name &amp; Contact</TableHead>
                                            <TableHead className="text-xs font-semibold uppercase tracking-wider px-6 h-12 text-slate-500">Source</TableHead>
                                            <TableHead className="text-xs font-semibold uppercase tracking-wider px-6 h-12 text-slate-500">Date</TableHead>
                                            <TableHead className="text-xs font-semibold uppercase tracking-wider px-6 h-12 text-center text-slate-500">Status</TableHead>
                                            <TableHead className="text-xs font-semibold uppercase tracking-wider px-6 h-12 text-right text-slate-500">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {paginatedLeads.map((lead) => (
                                            <TableRow key={lead.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">

                                                {/* Name & Contact */}
                                                <TableCell className="px-6 py-4">
                                                    <div className="font-bold text-slate-900 dark:text-white">{lead.name}</div>
                                                    <div className="text-xs text-slate-500 flex flex-col gap-0.5 mt-1">
                                                        <span>{lead.email}</span>
                                                        <span className="text-primary/70">{lead.mobile}</span>
                                                    </div>
                                                </TableCell>

                                                {/* Source */}
                                                <TableCell className="px-6 py-4">
                                                    <span className="px-2.5 py-1 bg-slate-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-slate-600 dark:text-slate-400">
                                                        {lead.source}
                                                    </span>
                                                </TableCell>

                                                {/* Date */}
                                                <TableCell className="px-6 py-4">
                                                    <div className="text-slate-900 dark:text-white font-medium text-xs">{formatDate(lead.createdAt)}</div>
                                                    <div className="text-[10px] text-slate-400 mt-0.5">
                                                        {lead.createdAt?.toDate().toLocaleString() || 'Pending...'}
                                                    </div>
                                                </TableCell>

                                                {/* Status select */}
                                                <TableCell className="px-6 py-4">
                                                    <div className="flex justify-center">
                                                        <Select
                                                            value={lead.status || 'Pending'}
                                                            onValueChange={(val) => updateStatus(lead.id, val)}
                                                            disabled={isReadOnly}
                                                        >
                                                            <SelectTrigger className={`w-32 h-9 text-[11px] font-bold uppercase tracking-wide border border-transparent transition-all
                                                                ${STATUS_CONFIG[lead.status] || STATUS_CONFIG.Pending} ${isReadOnly ? 'opacity-90 cursor-default' : ''}`}>
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent className="rounded-xl border-slate-200 dark:border-white/10">
                                                                <SelectItem value="Pending"   className="text-xs font-semibold">PENDING</SelectItem>
                                                                <SelectItem value="Contacted" className="text-xs font-semibold">CONTACTED</SelectItem>
                                                                <SelectItem value="Converted" className="text-xs font-semibold text-emerald-600">CONVERTED</SelectItem>
                                                                <SelectItem value="DNP"       className="text-xs font-semibold text-slate-500">DNP</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </TableCell>

                                                {/* Actions */}
                                                <TableCell className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        {/* Call */}
                                                        <a
                                                            href={`tel:${lead.mobile}`}
                                                            className="p-2 hover:bg-green-500/10 text-green-600 rounded-lg transition-colors"
                                                            title="Call Lead"
                                                        >
                                                            <Phone className="w-4 h-4" />
                                                        </a>
                                                        {/* Preview / View */}
                                                        <button
                                                            onClick={() => openSheet(lead)}
                                                            className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors"
                                                            title="Preview Lead"
                                                        >
                                                            <ScanEye className="w-4 h-4" />
                                                        </button>
                                                        {/* Delete */}
                                                        {!isReadOnly && (
                                                            <button
                                                                onClick={() => handleDeleteRequest(lead)}
                                                                className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
                                                                title="Delete Lead"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </TableCell>

                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="mt-8 flex items-center justify-between border-t border-slate-100 dark:border-white/5 pt-6">
                                    <p className="text-xs text-slate-500 font-medium">
                                        Showing{' '}
                                        <span className="text-slate-900 dark:text-white font-bold">{paginatedLeads.length}</span>
                                        {' '}of{' '}
                                        <span className="text-slate-900 dark:text-white font-bold">{filteredLeads.length}</span>
                                        {' '}leads
                                    </p>
                                    <Pagination className="justify-end w-auto mx-0">
                                        <PaginationContent>
                                            <PaginationItem>
                                                <PaginationPrevious
                                                    href="#"
                                                    onClick={(e) => { e.preventDefault(); if (currentPage > 1) setCurrentPage(currentPage - 1); }}
                                                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                                />
                                            </PaginationItem>
                                            {[...Array(totalPages)].map((_, i) => {
                                                const page = i + 1;
                                                if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                                                    return (
                                                        <PaginationItem key={page}>
                                                            <PaginationLink
                                                                href="#"
                                                                isActive={currentPage === page}
                                                                onClick={(e) => { e.preventDefault(); setCurrentPage(page); }}
                                                            >
                                                                {page}
                                                            </PaginationLink>
                                                        </PaginationItem>
                                                    );
                                                } else if (page === currentPage - 2 || page === currentPage + 2) {
                                                    return <PaginationItem key={page}><PaginationEllipsis /></PaginationItem>;
                                                }
                                                return null;
                                            })}
                                            <PaginationItem>
                                                <PaginationNext
                                                    href="#"
                                                    onClick={(e) => { e.preventDefault(); if (currentPage < totalPages) setCurrentPage(currentPage + 1); }}
                                                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                                />
                                            </PaginationItem>
                                        </PaginationContent>
                                    </Pagination>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Lead Detail Sheet */}
            <LeadDetailSheet
                lead={selectedLead}
                open={sheetOpen}
                onOpenChange={setSheetOpen}
                onUpdateStatus={updateStatus}
                onDeleteRequest={handleDeleteRequest}
                isReadOnly={isReadOnly}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
                <DialogContent className="sm:max-w-sm rounded-2xl">
                    <DialogHeader>
                        <div className="mx-auto mb-3 size-12 rounded-full bg-red-500/10 flex items-center justify-center">
                            <Trash2 className="w-6 h-6 text-red-500" />
                        </div>
                        <DialogTitle className="text-center text-slate-900 dark:text-white">Delete Lead?</DialogTitle>
                        <DialogDescription className="text-center">
                            You are about to permanently delete{' '}
                            <span className="font-bold text-slate-900 dark:text-white">{deleteTarget?.name}</span>
                            &apos;s lead record. This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex gap-2 sm:flex-row mt-2">
                        <Button
                            variant="outline"
                            className="flex-1 rounded-xl"
                            onClick={() => setDeleteTarget(null)}
                            disabled={deleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            className="flex-1 rounded-xl"
                            onClick={confirmDelete}
                            disabled={deleting}
                        >
                            {deleting
                                ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Deleting...</>
                                : <><Trash2 className="w-4 h-4 mr-2" />Yes, Delete</>
                            }
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
};

export default Dashboard;
