import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle
} from '@/components/ui/dialog';
import { db } from '@/lib/firebase';
import useAdminStore from '@/store/useAdminStore';
import useAuthStore from '@/store/useAuthStore';
import { addDoc, collection, deleteDoc, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import * as LucideIcons from 'lucide-react';
import {
    Loader2,
    Plus,
    Search,
    Trash2
} from 'lucide-react';
import { useMemo, useState } from 'react';

// Sub-components
import DomainDialog from '@/components/admin/courses/DomainDialog';
import DomainTable from '@/components/admin/courses/DomainTable';

const DynamicIcon = ({ name, className }) => {
    const IconComponent = LucideIcons[name] || LucideIcons.HelpCircle;
    return <IconComponent className={className} />;
};

const Courses = () => {
    const { domains, courses, loading } = useAdminStore();
    const { profile } = useAuthStore();
    const isReadOnly = profile?.role === 'Viewer';
    const [searchQuery, setSearchQuery] = useState('');

    // Dialog/Sheet visibility
    const [isDomainDialogOpen, setIsDomainDialogOpen] = useState(false);
    const [isDomainDeleteOpen, setIsDomainDeleteOpen] = useState(false);

    // Current selection for edit/delete
    const [currentDomain, setCurrentDomain] = useState(null);
    const [deleteDomainTarget, setDeleteDomainTarget] = useState(null);

    const [acting, setActing] = useState(false);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Domain Handlers
    const handleSaveDomain = async (domainData) => {
        if (isReadOnly) return;
        setActing(true);
        try {
            if (currentDomain) {
                await updateDoc(doc(db, 'domains', currentDomain.id), {
                    ...domainData,
                    updatedAt: serverTimestamp()
                });
            } else {
                await addDoc(collection(db, 'domains'), {
                    ...domainData,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                });
            }
            setIsDomainDialogOpen(false);
            setCurrentDomain(null);
        } catch (error) {
            console.error("Error saving domain:", error);
        } finally {
            setActing(false);
        }
    };

    const handleToggleDomainStatus = async (domain) => {
        if (isReadOnly) return;
        try {
            await updateDoc(doc(db, 'domains', domain.id), {
                isDisabled: !domain.isDisabled,
                updatedAt: serverTimestamp()
            });
        } catch (error) {
            console.error("Error toggling domain status:", error);
        }
    };

    const confirmDeleteDomain = async () => {
        if (!deleteDomainTarget || isReadOnly) return;
        const domainCourses = courses.filter(c => c.domainId === deleteDomainTarget.id);
        if (domainCourses.length > 0) {
            alert("Cannot delete domain while it contains courses. Please delete or move those courses first.");
            setIsDomainDeleteOpen(false);
            return;
        }

        setActing(true);
        try {
            await deleteDoc(doc(db, 'domains', deleteDomainTarget.id));
            setIsDomainDeleteOpen(false);
            setDeleteDomainTarget(null);
        } catch (error) {
            console.error("Error deleting domain:", error);
        } finally {
            setActing(false);
        }
    };

    const filteredDomains = useMemo(() => {
        return domains.filter(domain =>
            domain.name?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [domains, searchQuery]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Educational Architecture</h1>
                    <p className="text-slate-500 font-medium">Manage your domains and specialized training modules.</p>
                </div>
                <div className="flex items-center gap-3">
                    {!isReadOnly && (
                        <Button onClick={() => { setCurrentDomain(null); setIsDomainDialogOpen(true); }} className="h-12 px-6 rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                            <Plus className="w-5 h-5 mr-2" />
                            Architect New Domain
                        </Button>
                    )}
                </div>
            </div>

            {/* Domains Section */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
                {/* Table Header Bar */}
                <div className="p-6 border-b border-slate-200 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Domain Nodes</h3>
                    </div>
                    <div className="relative group max-w-xl w-full md:w-80">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-primary transition-colors" />
                        <input
                            placeholder="Search by domain node name..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm w-full focus:ring-primary focus:border-primary outline-none transition-all"
                        />
                    </div>
                </div>

                {/* Table Content */}
                <div className="p-6">
                    {loading ? (
                        <div className="py-20 flex flex-col items-center justify-center">
                            <Loader2 className="w-12 h-12 text-primary animate-spin" />
                            <p className="text-slate-500 font-bold mt-6 tracking-wide">Syncing data architecture...</p>
                        </div>
                    ) : (
                        <DomainTable
                            domains={filteredDomains}
                            courses={courses}
                            onEdit={(domain) => { setCurrentDomain(domain); setIsDomainDialogOpen(true); }}
                            onDelete={(domain) => { setDeleteDomainTarget(domain); setIsDomainDeleteOpen(true); }}
                            onToggle={handleToggleDomainStatus}
                            isReadOnly={isReadOnly}
                        />
                    )}
                </div>
            </div>

            <DomainDialog
                key={isDomainDialogOpen ? (currentDomain?.id || 'new') : 'closed'}
                open={isDomainDialogOpen}
                onOpenChange={setIsDomainDialogOpen}
                domain={currentDomain}
                onSave={handleSaveDomain}
                acting={acting}
            />

            <Dialog open={isDomainDeleteOpen} onOpenChange={setIsDomainDeleteOpen}>
                <DialogContent className="sm:max-w-sm rounded-[2.5rem] p-8 border-none shadow-2xl">
                    <div className="mx-auto mb-6 size-20 rounded-3xl bg-red-500/10 flex items-center justify-center text-red-500 transform -rotate-12 transition-transform hover:rotate-0 duration-500">
                        <Trash2 className="w-10 h-10" />
                    </div>
                    <DialogTitle className="text-center text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Confirm Removal</DialogTitle>
                    <DialogDescription className="text-center font-bold text-lg text-slate-500 leading-relaxed">
                        Are you sure you want to delete <span className="text-red-500 font-black">{deleteDomainTarget?.name}</span>? This action is permanent.
                        <br /><span className="text-xs opacity-70 mt-2 block italic text-slate-400">Requirement: Domain must be empty of all courses.</span>
                    </DialogDescription>
                    <DialogFooter className="flex gap-4 sm:flex-row mt-8">
                        <Button variant="outline" className="flex-1 rounded-2xl h-14 font-black border-2" onClick={() => setIsDomainDeleteOpen(false)} disabled={acting}>
                            Cancel
                        </Button>
                        <Button variant="destructive" className="flex-1 rounded-2xl h-14 font-black shadow-lg shadow-red-500/20" onClick={confirmDeleteDomain} disabled={acting}>
                            {acting ? 'Deleting...' : 'Confirm Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Courses;
