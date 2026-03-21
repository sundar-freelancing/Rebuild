import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users,
    ShieldCheck,
    Mail,
    Search,
    Filter,
    ShieldAlert,
    ShieldQuestion,
    Loader2,
    ArrowUpRight,
    ScanEye,
    Clock,
    CheckCircle2,
    MoreHorizontal,
    Trash2,
    Shield,
    User as UserIcon,
    Check
} from 'lucide-react';
import useAdminStore from '@/store/useAdminStore';
import useAuthStore from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { db } from '@/lib/firebase';
import { doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

const Roles = () => {
    const { users, loading } = useAdminStore();
    const currentUser = useAuthStore(s => s.user);
    const profile = useAuthStore(s => s.profile);
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState('');
    const [acting, setActing] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all');

    const isReadOnly = profile?.role === 'Viewer';

    // UI state
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [targetRole, setTargetRole] = useState('');

    const rolesList = profile?.role === 'Super Admin' 
        ? ['Super Admin', 'Admin', 'Viewer'] 
        : ['Admin', 'Viewer'];

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleFilterChange = (val) => {
        setActiveFilter(val);
    };

    const filteredUsers = users
        .filter(user => {
            // Role-based visibility
            if (profile?.role === 'Admin' || profile?.role === 'Viewer') {
                // Admins and Viewers see Admins and Viewers, but not Super Admins
                if (user.role === 'Super Admin') return false;
            }

            const matchesSearch =
                user.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchQuery.toLowerCase());

            if (!matchesSearch) return false;

            if (activeFilter === 'viewers') return user.role === 'Viewer';
            if (activeFilter === 'pending') return !user.isAuthorized;
            if (activeFilter === 'admins') return user.role === 'Admin' || user.role === 'Super Admin';

            return true;
        })
        .sort((a, b) => {
            // Logged user at the top (1st user)
            if (a.id === currentUser?.uid) return -1;
            if (b.id === currentUser?.uid) return 1;
            return 0;
        });

    const handleRoleUpdate = async () => {
        if (!selectedUser || !targetRole || selectedUser.id === currentUser?.uid || isReadOnly) return;
        setActing(true);
        try {
            await updateDoc(doc(db, 'users', selectedUser.id), {
                role: targetRole,
                updatedAt: serverTimestamp()
            });
            setIsUpdateModalOpen(false);
            setSelectedUser(null);
        } catch (error) {
            console.error("Error updating role:", error);
        } finally {
            setActing(false);
        }
    };

    const toggleLoginAccess = async (e, userId, currentStatus) => {
        e.stopPropagation();
        if (userId === currentUser?.uid || isReadOnly) return;
        setActing(true);
        try {
            await updateDoc(doc(db, 'users', userId), {
                isAuthorized: !currentStatus,
                updatedAt: serverTimestamp()
            });
        } catch (error) {
            console.error("Error updating login access:", error);
        } finally {
            setActing(false);
        }
    };

    const confirmDelete = async () => {
        if (!selectedUser || selectedUser.id === currentUser?.uid || isReadOnly) return;
        setActing(true);
        try {
            await deleteDoc(doc(db, 'users', selectedUser.id));
            setIsDeleteModalOpen(false);
            setSelectedUser(null);
        } catch (error) {
            console.error("Error deleting operator:", error);
        } finally {
            setActing(false);
        }
    };

    const stats = [
        { label: 'Total Users', val: filteredUsers.length.toString(), icon: Users, change: '+2.1%' },
        { label: 'Total Viewers', val: filteredUsers.filter(u => u.role === 'Viewer').length.toString(), icon: ScanEye, change: '+12%' },
        { label: 'Action Pending', val: filteredUsers.filter(u => !u.isAuthorized).length.toString(), icon: Clock, change: 'Focus' },
        { label: 'Total Admins', val: filteredUsers.filter(u => u.role === 'Admin' || u.role === 'Super Admin').length.toString(), icon: ShieldCheck, change: 'Active' },
    ];

    const getRoleBadge = (role) => {
        const base = "flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ";
        switch (role) {
            case 'Super Admin':
                return <div className={base + "bg-purple-500/10 text-purple-600 border-purple-500/20"}><ShieldAlert className="w-3 h-3" /> Super Admin</div>;
            case 'Admin':
                return <div className={base + "bg-blue-500/10 text-blue-600 border-blue-500/20"}><ShieldCheck className="w-3 h-3" /> Admin</div>;
            default:
                return <div className={base + "bg-slate-500/10 text-slate-500 border-slate-500/10"}><Shield className="w-3 h-3" /> Viewer</div>;
        }
    };

    if (loading && users.length === 0) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <p className="text-slate-500 font-bold tracking-tight animate-pulse">Scanning user database...</p>
            </div>
        );
    }

    const FILTER_OPTIONS = [
        { value: 'all', label: 'All Users' },
        { value: 'viewers', label: 'Viewers Only' },
        { value: 'admins', label: 'Admins Only' },
        { value: 'pending', label: 'Access Pending' },
    ];
    const activeFilterLabel = FILTER_OPTIONS.find(f => f.value === activeFilter)?.label ?? 'All Users';

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">System Personnel</h1>
                    <p className="text-slate-500 font-medium">Control system access, roles, and administrative privileges.</p>
                </div>
                <div className="flex items-center gap-3">
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
                            <div className={`text-sm font-semibold ${stat.label === 'Action Pending' ? 'text-red-600 bg-red-500/10' : 'text-green-600 bg-green-500/10'} px-2.5 py-1 rounded-full flex items-center gap-1`}>
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

            {/* Personnel Registry Table */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Authenticated Operators</h3>
                    </div>
                    <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            placeholder="Find by name or email..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm w-full md:w-80 focus:ring-primary focus:border-primary outline-none"
                        />
                    </div>
                </div>

                <div className="p-6">
                    <div className="rounded-xl border border-slate-100 dark:border-white/5 overflow-hidden">
                        <Table>
                            <TableHeader className="bg-slate-50/50 dark:bg-slate-900/50">
                                <TableRow>
                                    <TableHead className="text-xs font-semibold uppercase tracking-wider px-6 h-12 text-slate-500">Identity & Contact</TableHead>
                                    <TableHead className="text-xs font-semibold uppercase tracking-wider px-6 h-12 text-slate-500">Clearance Level</TableHead>
                                    <TableHead className="text-xs font-semibold uppercase tracking-wider px-6 h-12 text-slate-500">Last Session</TableHead>
                                    <TableHead className="text-xs font-semibold uppercase tracking-wider px-6 h-12 text-center text-slate-500">Login Access</TableHead>
                                    <TableHead className="text-xs font-semibold uppercase tracking-wider px-6 h-12 text-right text-slate-500">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="py-20 text-center">
                                            <div className="bg-slate-50 dark:bg-slate-900/50 size-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <ShieldQuestion className="w-8 h-8 text-slate-300" />
                                            </div>
                                            <h4 className="text-slate-900 dark:text-white font-bold">No operators found</h4>
                                            <p className="text-slate-500 text-sm">Try adjusting your search parameters.</p>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredUsers.map((user) => {
                                        const isSelf = user.id === currentUser?.uid;
                                        return (
                                            <TableRow
                                                key={user.id}
                                                onClick={() => navigate(`/admin/users/${user.id}`)}
                                                className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group cursor-pointer"
                                            >
                                                <TableCell className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden shrink-0">
                                                            {user.photoURL ? (
                                                                <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <UserIcon className="w-5 h-5 text-primary" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                                {user.displayName || 'Unnamed Agent'}
                                                                {isSelf && <span className="text-[8px] px-1.5 py-0.5 bg-primary/10 text-primary rounded-md uppercase font-bold">YOU</span>}
                                                            </div>
                                                            <div className="text-xs text-slate-500 lowercase flex items-center gap-1 mt-0.5">
                                                                <Mail className="w-3 h-3 opacity-50" />
                                                                {user.email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>

                                                <TableCell className="px-6 py-4">{getRoleBadge(user.role)}</TableCell>

                                                <TableCell className="px-6 py-4">
                                                    <div className="text-slate-900 dark:text-white font-medium text-xs">
                                                        {user.lastLogin?.toDate?.().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) || 'Just now'}
                                                    </div>
                                                    <div className="text-[10px] text-slate-400 mt-0.5">
                                                        {user.lastLogin?.toDate?.().toLocaleTimeString() || '--:--'}
                                                    </div>
                                                </TableCell>

                                                <TableCell className="px-6 py-4">
                                                    <div className="flex justify-center">
                                                        <Switch
                                                            checked={!!user.isAuthorized}
                                                            onCheckedChange={() => toggleLoginAccess({ stopPropagation: () => { } }, user.id, user.isAuthorized)}
                                                            disabled={isSelf || acting || isReadOnly}
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="data-[state=checked]:bg-emerald-500"
                                                        />
                                                    </div>
                                                </TableCell>

                                                <TableCell className="px-6 py-4 text-right">
                                                    <div onClick={(e) => e.stopPropagation()}>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg">
                                                                    <MoreHorizontal className="w-4 h-4 text-slate-500" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="w-48 rounded-xl border-slate-200 dark:border-white/10">
                                                                <DropdownMenuLabel className="text-[10px] uppercase font-bold text-slate-400">Modify Authority</DropdownMenuLabel>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem onClick={() => navigate(`/admin/users/${user.id}`)} className="text-xs font-semibold cursor-pointer py-2">
                                                                    <ScanEye className="w-3.5 h-3.5 mr-2 text-primary" /> View Details
                                                                </DropdownMenuItem>

                                                                {!isSelf && !isReadOnly && (
                                                                    <>
                                                                        <DropdownMenuSeparator />
                                                                        {rolesList.map(role => (
                                                                            <DropdownMenuItem
                                                                                key={role}
                                                                                onClick={() => { setSelectedUser(user); setTargetRole(role); setIsUpdateModalOpen(true); }}
                                                                                className="text-xs font-semibold cursor-pointer py-2"
                                                                            >
                                                                                <div className="flex items-center justify-between w-full">
                                                                                    <span className={user.role === role ? 'text-primary' : ''}>{role}</span>
                                                                                    {user.role === role && <Check className="w-3.5 h-3.5 text-primary" />}
                                                                                </div>
                                                                            </DropdownMenuItem>
                                                                        ))}
                                                                        <DropdownMenuSeparator />
                                                                        <DropdownMenuItem
                                                                            onClick={() => { setSelectedUser(user); setIsDeleteModalOpen(true); }}
                                                                            className="text-xs font-semibold cursor-pointer py-2 text-red-500"
                                                                        >
                                                                            <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete Account
                                                                        </DropdownMenuItem>
                                                                    </>
                                                                )}
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>

            {/* Role Update Modal */}
            <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
                <DialogContent className="sm:max-w-md rounded-2xl">
                    <DialogHeader>
                        <div className="mx-auto mb-3 size-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <ShieldCheck className="w-6 h-6 text-primary" />
                        </div>
                        <DialogTitle className="text-center text-slate-900 dark:text-white">Change Clearance Level?</DialogTitle>
                        <DialogDescription className="text-center">
                            Set <span className="font-bold text-slate-900 dark:text-white">{selectedUser?.displayName}</span> to <span className="font-bold text-primary">{targetRole}</span>?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex gap-2 sm:flex-row mt-2">
                        <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setIsUpdateModalOpen(false)}>Cancel</Button>
                        <Button className="flex-1 rounded-xl bg-primary" onClick={handleRoleUpdate} disabled={acting}>Confirm Update</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Modal */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent className="sm:max-w-md rounded-2xl">
                    <DialogHeader>
                        <div className="mx-auto mb-3 size-12 rounded-full bg-red-100 flex items-center justify-center">
                            <Trash2 className="w-6 h-6 text-red-600" />
                        </div>
                        <DialogTitle className="text-center text-slate-900 dark:text-white">Delete User?</DialogTitle>
                        <DialogDescription className="text-center">
                            Are you sure you want to delete <span className="font-bold text-slate-900 dark:text-white">{selectedUser?.displayName}</span>? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex gap-2 sm:flex-row mt-2">
                        <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
                        <Button variant="destructive" className="flex-1 rounded-xl" onClick={confirmDelete} disabled={acting}>Delete Account</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Roles;
