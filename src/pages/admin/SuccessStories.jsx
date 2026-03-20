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
import { Textarea } from '@/components/ui/textarea';
import { db } from '@/lib/firebase';
import useAdminStore from '@/store/useAdminStore';
import useAuthStore from '@/store/useAuthStore';
import { addDoc, collection, deleteDoc, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import {
    Briefcase,
    Edit2,
    Image as ImageIcon,
    LayoutDashboard,
    Loader2,
    MessageSquare,
    Plus,
    Quote,
    Search,
    Trash2,
    User,
    Eye,
} from 'lucide-react';
import { useState } from 'react';

const AdminSuccessStories = () => {
    const { successStories, loading } = useAdminStore();
    const profile = useAuthStore(s => s.profile);
    const isReadOnly = profile?.role === 'Viewer';
    const [searchQuery, setSearchQuery] = useState('');

    // Story related state
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [currentStory, setCurrentStory] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const [acting, setActing] = useState(false);

    // Form states
    const [formData, setFormData] = useState({
        studentName: '',
        feedback: '',
        imageUrl: '',
        companyName: '',
        Role: ''
    });

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const resetForm = () => {
        setFormData({
            studentName: '',
            feedback: '',
            imageUrl: '',
            companyName: '',
            Role: ''
        });
        setCurrentStory(null);
    };

    const handleOpenAddStory = () => {
        if (isReadOnly) return;
        resetForm();
        setIsSheetOpen(true);
    };

    const handleOpenEditStory = (story) => {
        setCurrentStory(story);
        setFormData({
            studentName: story.studentName || '',
            feedback: story.feedback || '',
            imageUrl: story.imageUrl || '',
            companyName: story.companyName || '',
            Role: story.Role || ''
        });
        setIsSheetOpen(true);
    };

    const handleSaveStory = async (e) => {
        e.preventDefault();
        if (isReadOnly) return;
        setActing(true);
        try {
            if (currentStory) {
                await updateDoc(doc(db, 'successStories', currentStory.id), {
                    ...formData,
                    updatedAt: serverTimestamp()
                });
            } else {
                await addDoc(collection(db, 'successStories'), {
                    ...formData,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                });
            }
            setIsSheetOpen(false);
            resetForm();
        } catch (error) {
            console.error("Error saving success story:", error);
        } finally {
            setActing(false);
        }
    };

    const confirmDeleteStory = async () => {
        if (!deleteTarget || isReadOnly) return;
        setActing(true);
        try {
            await deleteDoc(doc(db, 'successStories', deleteTarget.id));
            setIsDeleteDialogOpen(false);
            setDeleteTarget(null);
        } catch (error) {
            console.error("Error deleting success story:", error);
        } finally {
            setActing(false);
        }
    };

    const filteredStories = successStories.filter(story =>
        story.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.Role?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Success Stories</h1>
                    <p className="text-slate-500 font-medium">Manage student testimonials and career achievements.</p>
                </div>
                <div className="flex items-center gap-3">
                    {!isReadOnly && (
                        <Button onClick={handleOpenAddStory}>
                            <Plus className="w-5 h-5 mr-2" />
                            Add New Story
                        </Button>
                    )}
                </div>
            </div>

            {/* Content Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative group flex-1 max-w-xl">
                    <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-primary transition-colors" />
                    <input
                        placeholder="Search by student, company or role..."
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
                        <Quote className="w-6 h-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <p className="text-slate-500 font-bold mt-6 text-lg animate-pulse">Syncing testimonials...</p>
                </div>
            ) : filteredStories.length === 0 ? (
                <div className="py-32 text-center bg-white dark:bg-slate-800 rounded-3xl border-2 border-dashed border-slate-200 dark:border-white/10">
                    <div className="bg-slate-50 dark:bg-slate-900/50 size-24 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300 transform rotate-12">
                        <Quote className="w-12 h-12" />
                    </div>
                    <h4 className="text-slate-900 dark:text-white font-extrabold text-2xl">No Stories Found</h4>
                    <p className="text-slate-500 max-w-sm mx-auto mt-2 text-lg">Start by adding a success story of your student.</p>
                    {!isReadOnly && (
                        <Button onClick={handleOpenAddStory} size="lg" className="mt-6">
                            Add First Story
                        </Button>
                    )}
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-slate-50/50 dark:bg-slate-900/50">
                                <TableRow>
                                    <TableHead className="text-xs font-semibold uppercase tracking-wider px-6 h-12 text-slate-500">Student & Feedback</TableHead>
                                    <TableHead className="text-xs font-semibold uppercase tracking-wider px-6 h-12 text-slate-500">Placement Info</TableHead>
                                    <TableHead className="text-xs font-semibold uppercase tracking-wider px-6 h-12 text-slate-500 text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredStories.map((story) => (
                                    <TableRow key={story.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                                        <TableCell className="px-6 py-4">
                                            <div className="flex items-start gap-4 max-w-md overflow-hidden">
                                                <div className="shrink-0 pt-1">
                                                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 overflow-hidden shadow-inner">
                                                        {story.imageUrl ? (
                                                            <img src={story.imageUrl} alt={story.studentName} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                                <User className="w-6 h-6" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="space-y-1 overflow-hidden">
                                                    <div className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors text-lg truncate w-full">{story.studentName}</div>
                                                    <p className="text-sm text-slate-500 line-clamp-2 italic font-medium">"{story.feedback}"</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <div className="flex flex-col gap-1.5 justify-center">
                                                <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                                                    <Briefcase className="w-4 h-4 text-primary/70" />
                                                    {story.Role}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs font-bold text-primary bg-primary/5 px-2.5 py-1 rounded-lg border border-primary/10 w-fit uppercase tracking-tighter">
                                                    {story.companyName}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                {isReadOnly ? (
                                                    <button
                                                        onClick={() => handleOpenEditStory(story)}
                                                        className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors flex items-center gap-2"
                                                        title="View Story"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                        <span className="text-xs font-bold">View</span>
                                                    </button>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => handleOpenEditStory(story)}
                                                            className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors"
                                                            title="Edit Story"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => { setDeleteTarget(story); setIsDeleteDialogOpen(true); }}
                                                            className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
                                                            title="Delete Story"
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
                                {currentStory ? <Edit2 className="w-6 h-6 text-primary" /> : <Plus className="w-6 h-6 text-primary" />}
                            </div>
                            <div className="space-y-1">
                                <SheetTitle className="text-2xl font-black text-slate-900 dark:text-white">
                                    {isReadOnly ? 'Story Insights' : currentStory ? 'Refine Story' : 'New Success Story'}
                                </SheetTitle>
                                <SheetDescription className="text-sm text-slate-500 font-medium">
                                    Document student success and placement details.
                                </SheetDescription>
                            </div>
                        </div>
                    </SheetHeader>

                    <form onSubmit={handleSaveStory} className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50/30 dark:bg-slate-900/10">
                        {/* Student Profile */}
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2 px-1">
                                <div className="w-4 h-0.5 bg-primary/40 rounded-full" />
                                Student Profile
                            </h3>
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-white/5 space-y-6 shadow-sm">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-slate-500 flex items-center gap-2"><User className="w-3.5 h-3.5" /> Full Name</Label>
                                    <Input
                                        placeholder="e.g. Atharva Kulkarni"
                                        value={formData.studentName}
                                        onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                                        required
                                        disabled={isReadOnly}
                                        className="rounded-2xl h-12 border-slate-200 focus:ring-primary/20 transition-all font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-slate-500 flex items-center gap-2"><ImageIcon className="w-3.5 h-3.5" /> Photo URL</Label>
                                    <div className="flex items-center gap-4">
                                        <div className="size-12 rounded-2xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center border-2 border-dashed border-slate-200 overflow-hidden shrink-0">
                                            {formData.imageUrl ? <img src={formData.imageUrl} className="w-full h-full object-cover" alt="preview" /> : <ImageIcon className="w-5 h-5 text-slate-300" />}
                                        </div>
                                        <Input
                                            placeholder="https://..."
                                            value={formData.imageUrl}
                                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                            disabled={isReadOnly}
                                            className="rounded-2xl h-12 border-slate-200 focus:ring-primary/20 transition-all font-medium"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Placement Info */}
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2 px-1">
                                <div className="w-4 h-0.5 bg-primary/40 rounded-full" />
                                Placement Details
                            </h3>
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-white/5 space-y-6 shadow-sm">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-500 flex items-center gap-2"><Briefcase className="w-3.5 h-3.5" /> Job Role</Label>
                                        <Input
                                            placeholder="e.g. Software Engineer"
                                            value={formData.Role}
                                            onChange={(e) => setFormData({ ...formData, Role: e.target.value })}
                                            required
                                            disabled={isReadOnly}
                                            className="rounded-2xl h-11 border-slate-200 font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-500 flex items-center gap-2"><LayoutDashboard className="w-3.5 h-3.5" /> Company</Label>
                                        <Input
                                            placeholder="e.g. Google"
                                            value={formData.companyName}
                                            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                            required
                                            disabled={isReadOnly}
                                            className="rounded-2xl h-11 border-slate-200 font-medium"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Feedback */}
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2 px-1">
                                <div className="w-4 h-0.5 bg-primary/40 rounded-full" />
                                Student Feedback
                            </h3>
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-white/5 space-y-4 shadow-sm">
                                <Label className="text-xs font-bold text-slate-500 flex items-center gap-2"><MessageSquare className="w-3.5 h-3.5" /> Testimonial Content</Label>
                                <Textarea
                                    placeholder="Write the student's success feedback here..."
                                    rows={5}
                                    value={formData.feedback}
                                    onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                                    required
                                    disabled={isReadOnly}
                                    className="rounded-2xl border-slate-200 font-medium leading-relaxed resize-none"
                                />
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
                                onClick={handleSaveStory}
                                disabled={acting}
                                className="rounded-xl h-10 font-bold px-6"
                            >
                                {acting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                                {currentStory ? 'Update Story' : 'Publish Story'}
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
                            Are you sure you want to delete <span className="text-red-500 font-black">{deleteTarget?.studentName}</span>'s story?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex gap-4 sm:flex-row mt-8">
                        <Button variant="outline" className="flex-1 rounded-2xl h-14 font-bold border-2" onClick={() => setIsDeleteDialogOpen(false)} disabled={acting}>
                            Cancel
                        </Button>
                        <Button variant="destructive" className="flex-1 rounded-2xl h-14 font-bold shadow-lg shadow-red-500/20" onClick={confirmDeleteStory} disabled={acting}>
                            {acting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Remove
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminSuccessStories;
