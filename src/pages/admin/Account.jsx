import React, { useState, useEffect } from 'react';
import {
    User, Mail, Calendar, ShieldCheck, Loader2, Save,
    Image as ImageIcon, CheckCircle2, AlertCircle, Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import useAuthStore from '@/store/useAuthStore';
import { db } from '@/lib/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';

const Account = () => {
    const { profile, loading: authLoading } = useAuthStore();

    const [displayName, setDisplayName] = useState('');
    const [photoURL, setPhotoURL] = useState('');
    const [acting, setActing] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (profile) {
            setDisplayName(profile.displayName || '');
            setPhotoURL(profile.photoURL || '');
        }
    }, [profile]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        if (!profile) return;

        setActing(true);
        setMessage({ type: '', text: '' });

        try {
            await updateDoc(doc(db, 'users', profile.uid), {
                displayName,
                photoURL,
                updatedAt: serverTimestamp()
            });
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            console.error("Error updating profile:", error);
            setMessage({ type: 'error', text: 'Failed to update profile.' });
        } finally {
            setActing(false);
        }
    };

    if (authLoading) {
        return (
            <div className="py-40 flex flex-col items-center justify-center">
                <Loader2 className="w-16 h-16 text-primary animate-spin" />
                <p className="text-slate-500 font-bold mt-6 tracking-wide animate-pulse uppercase">Accessing Your Account...</p>
            </div>
        );
    }

    if (!profile) return null;

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 px-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-1">
                        Personal Settings <span className="text-primary opacity-50">•</span> Profile Hub
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">My Account</h1>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Profile Overview Sidebar */}
                <div className="space-y-8">
                    <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl group-hover:scale-150 transition-all duration-1000" />
                        <div className="relative space-y-8">
                            <div className="flex flex-col items-center">
                                <div className="size-32 rounded-[2.5rem] bg-white/10 border-4 border-white/10 shadow-2xl overflow-hidden mb-6 group-hover:rotate-3 transition-transform duration-500">
                                    {photoURL ? (
                                        <img src={photoURL} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-primary/20">
                                            <User className="w-12 h-12 text-primary" />
                                        </div>
                                    )}
                                </div>
                                <h4 className="text-xl font-black text-center">{profile.displayName || 'Unnamed User'}</h4>
                                <div className="mt-2 px-4 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                                    {profile.role || 'Viewer'}
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-white/10">
                                <div className="flex items-center gap-3">
                                    <Mail className="w-4 h-4 text-primary" />
                                    <span className="text-xs font-bold text-slate-400 truncate">{profile.email}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Shield className="w-4 h-4 text-emerald-400" />
                                    <span className="text-xs font-bold text-slate-400">Clearance: {profile.role}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-4 h-4 text-indigo-400" />
                                    <span className="text-xs font-bold text-slate-400">Since: {profile.createdAt?.toDate?.().toLocaleDateString() || 'N/A'}</span>
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
                            Your role and system authorization can only be modified by a Super Admin. Profile updates are reflected throughout the system immediately.
                        </p>
                    </div>
                </div>

                {/* Edit Form */}
                <div className="lg:col-span-2 space-y-8">
                    <form onSubmit={handleUpdateProfile} className="bg-white dark:bg-slate-800 p-10 rounded-[3rem] border border-slate-200 dark:border-white/10 shadow-sm space-y-10">
                        <div className="flex items-center gap-4 border-b border-slate-100 dark:border-white/5 pb-6">
                            <div className="p-3 bg-primary/10 rounded-2xl"><User className="w-6 h-6 text-primary" /></div>
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Profile Details</h3>
                                <p className="text-slate-500 font-medium">Update your public identity within the personnel hub.</p>
                            </div>
                        </div>

                        {message.text && (
                            <div className={`p-4 rounded-2xl flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-red-500/10 text-red-600 border border-red-500/20'}`}>
                                {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                <p className="text-sm font-bold">{message.text}</p>
                            </div>
                        )}

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                <div className="relative">
                                    <User className="w-4 h-4 absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        className="w-full h-14 pl-12 pr-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Avatar Image URL</label>
                                <div className="relative">
                                    <ImageIcon className="w-4 h-4 absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="url"
                                        value={photoURL}
                                        onChange={(e) => setPhotoURL(e.target.value)}
                                        className="w-full h-14 pl-12 pr-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                                        placeholder="https://example.com/photo.jpg"
                                    />
                                </div>
                                <p className="text-[10px] text-slate-400 font-medium ml-1">Provide a direct link to your professional portrait.</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address (Read-only)</label>
                                <div className="relative opacity-60">
                                    <Mail className="w-4 h-4 absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="email"
                                        value={profile.email}
                                        disabled
                                        className="w-full h-14 pl-12 pr-6 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/5 font-bold text-slate-500 cursor-not-allowed"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button
                                type="submit"
                                disabled={acting}
                                className="w-full h-16 rounded-2xl shadow-xl shadow-primary/20 font-black text-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                {acting ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                    <>
                                        <Save className="w-5 h-5 mr-3" />
                                        Update Personnel Profile
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Account;
