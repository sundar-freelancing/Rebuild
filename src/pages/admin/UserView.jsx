import React, { useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
    ArrowLeft, Edit2, Shield, Calendar, Mail, User, Clock, 
    ShieldCheck, ShieldAlert, Loader2, Trash2, AlertCircle,
    CheckCircle2, XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import useAdminStore from '@/store/useAdminStore';
import useAuthStore from '@/store/useAuthStore';
import { db } from '@/lib/firebase';
import { doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

const AdminUserView = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { users, loading } = useAdminStore();
    const currentUser = useAuthStore(s => s.user);
    const profile = useAuthStore(s => s.profile);
    const isReadOnly = profile?.role === 'Viewer';
    
    const [acting, setActing] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const user = useMemo(() => users.find(u => u.id === userId), [users, userId]);
    const isSelf = currentUser?.uid === userId;

    const rolesList = profile?.role === 'Super Admin' 
        ? ['Super Admin', 'Admin', 'Viewer'] 
        : ['Admin', 'Viewer'];

    const handleRoleUpdate = async (newRole) => {
        if (isSelf || isReadOnly) return;
        setActing(true);
        try {
            await updateDoc(doc(db, 'users', userId), {
                role: newRole,
                updatedAt: serverTimestamp()
            });
        } catch (error) {
            console.error("Error updating role:", error);
            alert("Failed to update role.");
        } finally {
            setActing(false);
        }
    };

    const toggleLoginAccess = async () => {
        if (isSelf || isReadOnly) return;
        setActing(true);
        try {
            await updateDoc(doc(db, 'users', userId), {
                isAuthorized: !user.isAuthorized,
                updatedAt: serverTimestamp()
            });
        } catch (error) {
            console.error("Error updating login access:", error);
            alert("Failed to update login access.");
        } finally {
            setActing(false);
        }
    };

    const confirmDelete = async () => {
        if (isSelf || isReadOnly) return;
        setActing(true);
        try {
            await deleteDoc(doc(db, 'users', userId));
            navigate('/admin/roles');
        } catch (error) {
            console.error("Error deleting operator:", error);
            alert("Failed to delete operator record.");
        } finally {
            setActing(false);
            setIsDeleteDialogOpen(false);
        }
    };

    if (loading) {
        return (
            <div className="py-40 flex flex-col items-center justify-center">
                <Loader2 className="w-16 h-16 text-primary animate-spin" />
                <p className="text-slate-500 font-bold mt-6 tracking-wide animate-pulse uppercase">Accessing Personnel File...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="py-20 text-center">
                <div className="mx-auto mb-6 size-24 rounded-3xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-300 transform rotate-12">
                    <User className="w-12 h-12" />
                </div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight uppercase">Agent Record Not Found</h1>
                <p className="text-slate-500 font-medium max-w-sm mx-auto mb-8 leading-relaxed">The personnel record you are looking for does not exist in the secure database.</p>
                <Button onClick={() => navigate('/admin/roles')} className="h-14 px-8 rounded-2xl font-bold">
                    Return to Personnel Registry
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
                <div className="flex items-center gap-6">
                    <button 
                        onClick={() => navigate('/admin/roles')}
                        className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 transition-colors shadow-sm"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-500" />
                    </button>
                    <div>
                        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-1">
                            Personnel Record <span className="text-primary opacity-50">•</span> #{user.id.slice(0, 8).toUpperCase()}
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{user.displayName || 'Unnamed Agent'}</h1>
                    </div>
                </div>
                {!isSelf && !isReadOnly && (
                    <Button 
                        variant="destructive"
                        onClick={() => setIsDeleteDialogOpen(true)}
                        className="h-14 px-8 rounded-2xl shadow-xl shadow-red-500/10 hover:scale-105 active:scale-95 transition-all font-black"
                    >
                        <Trash2 className="w-5 h-5 mr-3" />
                        Terminate Access
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 px-4">
                {/* Profile Overview */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white dark:bg-slate-800 p-10 rounded-[3rem] border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8">
                            <Shield className={`w-24 h-24 ${user.isAuthorized ? 'text-emerald-500/5' : 'text-slate-500/5'}`} />
                        </div>
                        
                        <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-10">
                            <div className="size-40 rounded-[2.5rem] bg-slate-100 dark:bg-slate-900 border-4 border-white dark:border-slate-800 shadow-2xl overflow-hidden shrink-0 rotate-3 hover:rotate-0 transition-transform duration-500">
                                {user.photoURL ? (
                                    <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <User className="w-16 h-16 text-slate-300" />
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 space-y-6 text-center sm:text-left">
                                <div className="space-y-1">
                                    <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Identity Verification</h3>
                                    <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3">
                                        <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${user.isAuthorized ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                                            {user.isAuthorized ? 'Authorized' : 'Unauthorized'}
                                        </span>
                                        {isSelf && (
                                            <span className="px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary border border-primary/20">
                                                Current User
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-white/5">
                                        <div className="p-2.5 bg-white dark:bg-slate-800 rounded-xl shadow-sm"><Mail className="w-4 h-4 text-primary" /></div>
                                        <div className="text-left">
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Digital Address</div>
                                            <div className="font-bold text-slate-900 dark:text-white truncate max-w-[200px]">{user.email}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-white/5">
                                        <div className="p-2.5 bg-white dark:bg-slate-800 rounded-xl shadow-sm"><Calendar className="w-4 h-4 text-primary" /></div>
                                        <div className="text-left">
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Enlisted Since</div>
                                            <div className="font-bold text-slate-900 dark:text-white">
                                                {user.createdAt?.toDate?.().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) || 'Direct Entry'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-10 rounded-[3rem] border border-slate-200 dark:border-white/10 shadow-sm space-y-8">
                        <div className="flex items-center gap-4 border-b border-slate-100 dark:border-white/5 pb-6">
                            <div className="p-3 bg-primary/10 rounded-2xl"><ShieldCheck className="w-6 h-6 text-primary" /></div>
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Privilege Configuration</h3>
                                <p className="text-slate-500 font-medium">Define this operator's reach within the secure system.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Assigned Designation</label>
                                <Select 
                                    value={user.role || 'Viewer'} 
                                    onValueChange={handleRoleUpdate}
                                    disabled={isSelf || acting || isReadOnly}
                                >
                                    <SelectTrigger className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-white/5 font-bold text-slate-900 dark:text-white">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-slate-200 dark:border-white/10">
                                        {rolesList.map(r => (
                                            <SelectItem key={r} value={r} className="font-bold py-3">{r}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {(isSelf || isReadOnly) && <p className="text-[10px] text-amber-500 font-bold ml-1 italic">{isReadOnly ? 'Read-only access.' : 'Current session protection: cannot alter own role.'}</p>}
                            </div>

                            <div className="space-y-4">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">System Authorization</label>
                                <div className={`flex items-center justify-between h-14 px-6 rounded-2xl border ${user.isAuthorized ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                                    <span className="font-bold text-slate-700 dark:text-slate-300">Grant Login Access</span>
                                    <Switch 
                                        checked={!!user.isAuthorized}
                                        onCheckedChange={toggleLoginAccess}
                                        disabled={isSelf || acting || isReadOnly}
                                        className="data-[state=checked]:bg-emerald-500"
                                    />
                                </div>
                                {(isSelf || isReadOnly) && <p className="text-[10px] text-amber-500 font-bold ml-1 italic">{isReadOnly ? 'Read-only access.' : 'Security lock: cannot revoke own system clearance.'}</p>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status Column */}
                <div className="space-y-8">
                    <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl group-hover:scale-150 transition-all duration-1000" />
                        <div className="relative space-y-8">
                            <div className="space-y-2">
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Operational Status</div>
                                <div className="flex items-center gap-3">
                                    <div className={`size-3 rounded-full ${user.isAuthorized ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]'} animate-pulse`} />
                                    <h4 className="text-2xl font-black">{user.isAuthorized ? 'Active Operator' : 'Suspended'}</h4>
                                </div>
                            </div>

                            <div className="space-y-6 pt-4 border-t border-white/10">
                                <div className="flex justify-between items-center group/item">
                                    <div className="flex items-center gap-3">
                                        <Clock className="w-4 h-4 text-primary" />
                                        <span className="text-sm font-bold text-slate-400">Last Telemetry</span>
                                    </div>
                                    <span className="text-sm font-black text-white">
                                        {user.lastLogin?.toDate?.().toLocaleDateString() || 'Pending'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center group/item">
                                    <div className="flex items-center gap-3">
                                        <Shield className="w-4 h-4 text-indigo-400" />
                                        <span className="text-sm font-bold text-slate-400">Designation</span>
                                    </div>
                                    <span className="text-sm font-black text-white">{user.role || 'Viewer'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 rounded-[2.5rem] bg-amber-500/5 border border-amber-500/10 space-y-4">
                        <div className="flex items-center gap-3 text-amber-500">
                            <AlertCircle className="w-5 h-5" />
                            <h4 className="text-sm font-black uppercase tracking-widest">Protocol Note</h4>
                        </div>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed italic">
                            Administrators possess the authority to modify and terminate personnel files. Changes to authorization take effect immediately upon the next user session or system refresh.
                        </p>
                    </div>
                </div>
            </div>

            {/* Termination Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-md rounded-[2.5rem] p-10 border-none shadow-2xl">
                    <div className="flex flex-col items-center text-center space-y-6">
                        <div className="size-20 bg-red-500/10 rounded-3xl flex items-center justify-center text-red-500 transform -rotate-12">
                            <Trash2 className="w-10 h-10" />
                        </div>
                        
                        <div className="space-y-2">
                            <DialogTitle className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Purge Record?</DialogTitle>
                            <DialogDescription className="text-slate-500 font-bold text-lg leading-relaxed px-4">
                                You are about to permanently delete <span className="text-red-500">{user.displayName}</span>'s records from the personnel hub. This protocol is irreversible.
                            </DialogDescription>
                        </div>

                        <DialogFooter className="flex gap-4 w-full sm:flex-row pt-4">
                            <Button 
                                variant="outline" 
                                className="flex-1 rounded-2xl h-14 font-black border-2" 
                                onClick={() => setIsDeleteDialogOpen(false)}
                                disabled={acting}
                            >
                                Abort
                            </Button>
                            <Button 
                                variant="destructive"
                                className="flex-1 rounded-2xl h-14 font-black shadow-xl shadow-red-500/20" 
                                onClick={confirmDelete}
                                disabled={acting}
                            >
                                {acting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Purge'}
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminUserView;
