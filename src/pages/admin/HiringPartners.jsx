import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { db } from '@/lib/firebase';
import useAdminStore from '@/store/useAdminStore';
import useAuthStore from '@/store/useAuthStore';
import { addDoc, collection, deleteDoc, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import {
    Building2,
    Edit2,
    ExternalLink,
    Globe,
    Image as ImageIcon,
    Loader2,
    Plus,
    Search,
    Trash2,
    Eye,
} from 'lucide-react';
import { useState } from 'react';

const AdminHiringPartners = () => {
    const { hiringPartners, loading } = useAdminStore();
    const profile = useAuthStore(s => s.profile);
    const isReadOnly = profile?.role === 'Viewer';
    const [searchQuery, setSearchQuery] = useState('');

    // Partner related state
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [currentPartner, setCurrentPartner] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const [acting, setActing] = useState(false);

    // Form states
    const [formData, setFormData] = useState({
        companyName: '',
        url: '',
        logoUrl: ''
    });

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const resetForm = () => {
        setFormData({
            companyName: '',
            url: '',
            logoUrl: ''
        });
        setCurrentPartner(null);
    };

    const handleOpenAddPartner = () => {
        if (isReadOnly) return;
        resetForm();
        setIsSheetOpen(true);
    };

    const handleOpenEditPartner = (partner) => {
        setCurrentPartner(partner);
        setFormData({
            companyName: partner.companyName || '',
            url: partner.url || '',
            logoUrl: partner.logoUrl || ''
        });
        setIsSheetOpen(true);
    };

    const handleSavePartner = async (e) => {
        e.preventDefault();
        if (isReadOnly) return;
        setActing(true);
        try {
            if (currentPartner) {
                await updateDoc(doc(db, 'hiringPartners', currentPartner.id), {
                    ...formData,
                    updatedAt: serverTimestamp()
                });
            } else {
                await addDoc(collection(db, 'hiringPartners'), {
                    ...formData,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                });
            }
            setIsSheetOpen(false);
            resetForm();
        } catch (error) {
            console.error("Error saving hiring partner:", error);
        } finally {
            setActing(false);
        }
    };

    const confirmDeletePartner = async () => {
        if (!deleteTarget || isReadOnly) return;
        setActing(true);
        try {
            await deleteDoc(doc(db, 'hiringPartners', deleteTarget.id));
            setIsDeleteDialogOpen(false);
            setDeleteTarget(null);
        } catch (error) {
            console.error("Error deleting hiring partner:", error);
        } finally {
            setActing(false);
        }
    };

    const filteredPartners = hiringPartners.filter(partner =>
        partner.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        partner.url?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Hiring Partners</h1>
                    <p className="text-slate-500 font-medium">Manage companies that hire our students.</p>
                </div>
                <div className="flex items-center gap-3">
                    {!isReadOnly && (
                        <Button onClick={handleOpenAddPartner}>
                            <Plus className="w-5 h-5 mr-2" />
                            Add New Partner
                        </Button>
                    )}
                </div>
            </div>

            {/* Content Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative group flex-1 max-w-xl">
                    <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-primary transition-colors" />
                    <input
                        placeholder="Search by company name or URL..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-sm w-full focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none text-slate-900 dark:text-white transition-all shadow-sm"
                    />
                </div>
            </div>

            {/* List Table */}
            {loading ? (
                <div className="py-40 flex flex-col items-center justify-center bg-white/50 dark:bg-slate-800/50 rounded-3xl border border-dashed border-slate-300 dark:border-white/10">
                    <div className="relative">
                        <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                        <Building2 className="w-6 h-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <p className="text-slate-500 font-bold mt-6 text-lg animate-pulse">Syncing partners...</p>
                </div>
            ) : filteredPartners.length === 0 ? (
                <div className="py-32 text-center bg-white dark:bg-slate-800 rounded-3xl border-2 border-dashed border-slate-200 dark:border-white/10">
                    <div className="bg-slate-50 dark:bg-slate-900/50 size-24 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300 transform rotate-12">
                        <Building2 className="w-12 h-12" />
                    </div>
                    <h4 className="text-slate-900 dark:text-white font-extrabold text-2xl">No Partners Found</h4>
                    <p className="text-slate-500 max-w-sm mx-auto mt-2 text-lg">Start by adding a hiring partner company.</p>
                    {!isReadOnly && (
                        <Button onClick={handleOpenAddPartner} size="lg" className="mt-6">
                            Add First Partner
                        </Button>
                    )}
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-slate-50/50 dark:bg-slate-900/50">
                                <TableRow>
                                    <TableHead className="text-xs font-semibold uppercase tracking-wider px-6 h-12 text-slate-500">Company</TableHead>
                                    <TableHead className="text-xs font-semibold uppercase tracking-wider px-6 h-12 text-slate-500">Website</TableHead>
                                    <TableHead className="text-xs font-semibold uppercase tracking-wider px-6 h-12 text-slate-500 text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredPartners.map((partner) => (
                                    <TableRow key={partner.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                                        <TableCell className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 overflow-hidden shadow-inner flex items-center justify-center">
                                                    {partner.logoUrl ? (
                                                        <img src={partner.logoUrl} alt={partner.companyName} className="w-full h-full object-contain p-2" />
                                                    ) : (
                                                        <Building2 className="w-6 h-6 text-slate-400" />
                                                    )}
                                                </div>
                                                <div className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors text-lg">
                                                    {partner.companyName}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            {partner.url ? (
                                                <a
                                                    href={partner.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                                                >
                                                    <Globe className="w-4 h-4" />
                                                    {partner.url.replace(/^https?:\/\/(www\.)?/, '')}
                                                    <ExternalLink className="w-3 h-3" />
                                                </a>
                                            ) : (
                                                <span className="text-slate-400 text-sm">No URL</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                {isReadOnly ? (
                                                    <button
                                                        onClick={() => handleOpenEditPartner(partner)}
                                                        className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors flex items-center gap-2"
                                                        title="View Partner"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                        <span className="text-xs font-bold">View</span>
                                                    </button>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => handleOpenEditPartner(partner)}
                                                            className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors"
                                                            title="Edit Partner"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => { setDeleteTarget(partner); setIsDeleteDialogOpen(true); }}
                                                            className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
                                                            title="Delete Partner"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            )}

            {/* Add/Edit Sheet */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent className="sm:max-w-xl w-full p-0 flex flex-col border-l border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden">
                    <SheetHeader className="p-6 pb-4 bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-white/5">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary/10 rounded-2xl">
                                {currentPartner ? <Edit2 className="w-6 h-6 text-primary" /> : <Plus className="w-6 h-6 text-primary" />}
                            </div>
                            <div className="space-y-1">
                                <SheetTitle className="text-2xl font-black text-slate-900 dark:text-white">
                                    {isReadOnly ? 'Partner Insights' : currentPartner ? 'Refine Partner' : 'New Hiring Partner'}
                                </SheetTitle>
                                <SheetDescription className="text-sm text-slate-500 font-medium">
                                    Add or update company information.
                                </SheetDescription>
                            </div>
                        </div>
                    </SheetHeader>

                    <form onSubmit={handleSavePartner} className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50/30 dark:bg-slate-900/10">
                        {/* Company Details */}
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2 px-1">
                                <div className="w-4 h-0.5 bg-primary/40 rounded-full" />
                                Company Details
                            </h3>
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-white/5 space-y-6 shadow-sm">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-slate-500 flex items-center gap-2"><Building2 className="w-3.5 h-3.5" /> Company Name</Label>
                                    <Input
                                        placeholder="e.g. Google"
                                        value={formData.companyName}
                                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                        required
                                        disabled={isReadOnly}
                                        className="rounded-2xl h-12 border-slate-200 focus:ring-primary/20 transition-all font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-slate-500 flex items-center gap-2"><ImageIcon className="w-3.5 h-3.5" /> Logo URL</Label>
                                    <div className="flex items-center gap-4">
                                        <div className="size-12 rounded-2xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center border-2 border-dashed border-slate-200 overflow-hidden shrink-0">
                                            {formData.logoUrl ? <img src={formData.logoUrl} className="w-full h-full object-contain p-1" alt="preview" /> : <ImageIcon className="w-5 h-5 text-slate-300" />}
                                        </div>
                                        <Input
                                            placeholder="https://...logo.png"
                                            value={formData.logoUrl}
                                            required
                                            onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                                            disabled={isReadOnly}
                                            className="rounded-2xl h-12 border-slate-200 focus:ring-primary/20 transition-all font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-slate-500 flex items-center gap-2"><Globe className="w-3.5 h-3.5" /> Company Website URL (Optional)</Label>
                                    <Input
                                        placeholder="https://google.com"
                                        value={formData.url}
                                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                        disabled={isReadOnly}
                                        className="rounded-2xl h-12 border-slate-200 focus:ring-primary/20 transition-all font-medium"
                                    />
                                </div>
                            </div>
                        </div>
                    </form>

                    <SheetFooter className="p-4 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-white/5 gap-3 flex flex-row justify-end">
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={() => setIsSheetOpen(false)}
                            className="rounded-xl h-10 font-bold px-6"
                        >
                            {isReadOnly ? 'Close' : 'Cancel'}
                        </Button>
                        {!isReadOnly && (
                            <Button
                                onClick={handleSavePartner}
                                disabled={acting}
                                className="rounded-xl h-10 font-bold px-6"
                            >
                                {acting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                                {currentPartner ? 'Update Partner' : 'Add Partner'}
                            </Button>
                        )}
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            {/* Delete Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-sm rounded-[2.5rem] p-8 border-none shadow-2xl overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-red-500" />
                    <DialogHeader>
                        <div className="mx-auto mb-6 size-20 rounded-3xl bg-red-500/10 flex items-center justify-center text-red-500 transform -rotate-12 transition-transform hover:rotate-0 duration-500">
                            <Trash2 className="w-10 h-10" />
                        </div>
                        <DialogTitle className="text-center text-2xl font-black text-slate-900 dark:text-white mb-2">Confirm Removal</DialogTitle>
                        <DialogDescription className="text-center font-bold text-lg text-slate-500 leading-relaxed">
                            Are you sure you want to delete <span className="text-red-500 font-black">{deleteTarget?.companyName}</span> from hiring partners?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex gap-4 sm:flex-row mt-8">
                        <Button variant="outline" className="flex-1 rounded-2xl h-14 font-bold border-2" onClick={() => setIsDeleteDialogOpen(false)} disabled={acting}>
                            Cancel
                        </Button>
                        <Button variant="destructive" className="flex-1 rounded-2xl h-14 font-bold shadow-lg shadow-red-500/20" onClick={confirmDeletePartner} disabled={acting}>
                            {acting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Remove
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminHiringPartners;
