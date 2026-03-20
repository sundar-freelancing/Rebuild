import React, { useState, useEffect } from 'react';
import {
    ShieldAlert,
    Settings2,
    Power,
    Construction,
    Save,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Eye,
    EyeOff,
    Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import useAdminStore from '@/store/useAdminStore';
import { db } from '@/lib/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';

const SuperController = () => {
    const { siteConfig } = useAdminStore();
    const [acting, setActing] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Local transient state for text fields to avoid jitter while typing
    const [localSiteStatus, setLocalSiteStatus] = useState({
        enabledDesc: '',
        maintenanceDesc: ''
    });

    useEffect(() => {
        if (siteConfig?.siteStatus) {
            setLocalSiteStatus({
                enabledDesc: siteConfig.siteStatus.enabledDesc || '',
                maintenanceDesc: siteConfig.siteStatus.maintenanceDesc || ''
            });
        }
    }, [siteConfig]);

    const showMsg = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    const updateSystemConfig = async (update) => {
        setActing(true);
        try {
            await updateDoc(doc(db, 'siteConfig', 'main'), {
                ...update,
                updatedAt: serverTimestamp()
            });
            showMsg('success', 'System parameters synchronized.');
        } catch (error) {
            console.error(error);
            showMsg('error', 'Sync failed.');
        } finally {
            setActing(false);
        }
    };

    const togglePermission = (menu, role) => {
        const currentPerms = siteConfig?.menuPermissions || {};
        const menuPerms = currentPerms[menu] || { Admin: true, Viewer: true };

        const updatedPerms = {
            ...currentPerms,
            [menu]: {
                ...menuPerms,
                [role]: !menuPerms[role]
            }
        };

        updateSystemConfig({ menuPermissions: updatedPerms });
    };

    const toggleSiteStatus = (key) => {
        const currentStatus = siteConfig?.siteStatus || {};
        const updatedStatus = {
            ...currentStatus,
            [key]: !currentStatus[key]
        };
        updateSystemConfig({ siteStatus: updatedStatus });
    };

    const handleTextBlur = (key) => {
        const currentStatus = siteConfig?.siteStatus || {};
        if (currentStatus[key] === localSiteStatus[key]) return; // No change

        const updatedStatus = {
            ...currentStatus,
            [key]: localSiteStatus[key]
        };
        updateSystemConfig({ siteStatus: updatedStatus });
    };

    // Use default values for table if nothing in firebase yet
    const menuList = [
        'Site Settings',
        'Courses',
        'Success Stories',
        'Hiring Partners',
        'System Personnel',
        'Account'
    ];

    if (!siteConfig) return (
        <div className="flex flex-col items-center justify-center py-40 gap-4 opacity-50">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="font-black text-xs uppercase tracking-widest">Waking Up Controller...</p>
        </div>
    );

    const siteStatus = siteConfig.siteStatus || {};
    const permissions = siteConfig.menuPermissions || {};

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-white/10">
                <div>
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-primary mb-2">
                        <ShieldAlert className="w-4 h-4" /> Root Authorization Panel
                    </div>
                    <div className="flex items-center gap-4">
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Super Admin Controller</h1>
                        {acting && (
                            <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 animate-pulse">
                                <Loader2 className="w-3 h-3 animate-spin" /> Syncing Live
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {message.text && (
                <div className={`p-5 rounded-3xl flex items-center gap-4 animate-in slide-in-from-top-4 duration-300 fixed top-24 right-8 z-50 shadow-2xl ${message.type === 'success'
                        ? 'bg-white dark:bg-slate-800 text-emerald-600 border-2 border-emerald-500/20'
                        : 'bg-white dark:bg-slate-800 text-red-600 border-2 border-red-500/20'
                    }`}>
                    {message.type === 'success' ? <CheckCircle2 className="w-6 h-6 shrink-0" /> : <AlertCircle className="w-6 h-6 shrink-0" />}
                    <p className="font-black text-sm tracking-tight">{message.text}</p>
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">

                {/* ── Page Visibility Controls ──────────────────────── */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 px-2">
                        <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-500">
                            <Settings2 className="w-5 h-5" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Access Permissions</h3>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-white/5">
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Section Name</th>
                                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Admin Access</th>
                                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Viewer Access</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                    <tr className="bg-emerald-500/5 dark:bg-emerald-500/10 italic">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,1)]" />
                                                <span className="font-black text-slate-900 dark:text-white opacity-50">Lead Dashboard</span>
                                            </div>
                                        </td>
                                        <td colSpan={2} className="px-6 py-5 text-center text-[10px] font-black uppercase tracking-widest text-emerald-600">
                                            System Default (Always Enabled)
                                        </td>
                                    </tr>
                                    {menuList.map((menu) => (
                                        <tr key={menu} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                                            <td className="px-8 py-5">
                                                <span className="font-bold text-slate-700 dark:text-slate-200">{menu}</span>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <Switch
                                                    checked={permissions[menu]?.Admin ?? true}
                                                    onCheckedChange={() => togglePermission(menu, 'Admin')}
                                                    disabled={acting}
                                                    className="data-[state=checked]:bg-primary"
                                                />
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <Switch
                                                    checked={permissions[menu]?.Viewer ?? true}
                                                    onCheckedChange={() => togglePermission(menu, 'Viewer')}
                                                    disabled={acting}
                                                    className="data-[state=checked]:bg-primary"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* ── Global Site Status ────────────────────────────── */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 px-2">
                        <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-500">
                            <Power className="w-5 h-5" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">System Global Status</h3>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {/* Site Active Status */}
                        <div className="bg-white dark:bg-slate-800 p-8 rounded-[3rem] border border-slate-200 dark:border-white/10 shadow-sm space-y-6 relative overflow-hidden group">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h4 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Production Access</h4>
                                    <p className="text-xs text-slate-500 font-medium">Toggle if public site is live or offline.</p>
                                </div>
                                <Switch
                                    checked={siteStatus.enabled ?? true}
                                    onCheckedChange={() => toggleSiteStatus('enabled')}
                                    disabled={acting}
                                    className="scale-110 data-[state=checked]:bg-emerald-500"
                                />
                            </div>

                            <div className="space-y-3 pt-2">
                                <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Public Offline Message (Auto-saves on blur)</Label>
                                <Textarea
                                    value={localSiteStatus.enabledDesc}
                                    onChange={(e) => setLocalSiteStatus(s => ({ ...s, enabledDesc: e.target.value }))}
                                    onBlur={() => handleTextBlur('enabledDesc')}
                                    placeholder="Enter message for public users..."
                                    className="min-h-[100px] rounded-3xl border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/50 font-medium text-sm leading-relaxed"
                                />
                            </div>
                        </div>

                        {/* Maintenance Mode */}
                        <div className="bg-white dark:bg-slate-800 p-8 rounded-[3rem] border border-slate-200 dark:border-white/10 shadow-sm space-y-6 relative overflow-hidden group">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h4 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Maintenance Protocol</h4>
                                    <p className="text-xs text-slate-500 font-medium">Toggle global maintenance curtain.</p>
                                </div>
                                <Switch
                                    checked={siteStatus.maintenance ?? false}
                                    onCheckedChange={() => toggleSiteStatus('maintenance')}
                                    disabled={acting}
                                    className="scale-110 data-[state=checked]:bg-amber-500"
                                />
                            </div>

                            <div className="space-y-3 pt-2">
                                <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Maintenance Description (Auto-saves on blur)</Label>
                                <Textarea
                                    value={localSiteStatus.maintenanceDesc}
                                    onChange={(e) => setLocalSiteStatus(s => ({ ...s, maintenanceDesc: e.target.value }))}
                                    onBlur={() => handleTextBlur('maintenanceDesc')}
                                    placeholder="Explain the maintenance reason..."
                                    className="min-h-[100px] rounded-3xl border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/50 font-medium text-sm leading-relaxed"
                                />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SuperController;
