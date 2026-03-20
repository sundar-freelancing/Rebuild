import logo from '@/assets/logo/logo.png';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import useAuthStore from '@/store/useAuthStore';
import Login from '@/pages/admin/Login';
import useAdminStore from '@/store/useAdminStore';
import { BookOpen, Building2, Clock, Globe, LayoutDashboard, Loader2, LogOut, Menu, Quote, Settings2, ShieldAlert, ShieldCheck, UserCircle } from 'lucide-react';
import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const adminMenus = [
    { name: 'Lead Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Site Settings', href: '/admin/site-config', icon: Settings2 },
    { name: 'Courses', href: '/admin/courses', icon: BookOpen, },
    { name: 'Success Stories', href: '/admin/success-stories', icon: Quote },
    { name: 'Hiring Partners', href: '/admin/hiring-partners', icon: Building2 },
    { name: 'System Personnel', href: '/admin/roles', icon: ShieldCheck },
    { name: 'Super Controller', href: '/admin/super-controller', icon: ShieldAlert, roles: ['Super Admin'] },
    { name: 'Account', href: '/admin/account', icon: UserCircle },
    { name: 'View Live Site', href: '/', target: '_blank', icon: Globe },
];

export const AdminLayout = () => {
    const user = useAuthStore((s) => s.user);
    const profile = useAuthStore((s) => s.profile);
    const authLoading = useAuthStore((s) => s.loading);
    const authInit = useAuthStore((s) => s.init);
    const authDestroy = useAuthStore((s) => s.destroy);
    const logout = useAuthStore((s) => s.logout);
    const { siteConfig, initAdminData, cleanupAdminData, loading: storeLoading, initialized } = useAdminStore();
    const checkAuthorization = (item) => {
        if (!item) return true; // Fallback if no specific menu item found for route

        // 1. Super Admin bypasses everything
        if (profile?.role === 'Super Admin') return true;

        // 2. Static role-based restriction (e.g. Super Controller page)
        if (item.roles && !item.roles.includes(profile?.role)) return false;

        // 3. Dynamic Dynamic permission check for Admin/Viewer roles
        if (siteConfig?.menuPermissions && (profile?.role === 'Admin' || profile?.role === 'Viewer')) {
            const dynamicPerm = siteConfig.menuPermissions[item.name];
            // If dynamic permission is explicitly set to false, restrict access
            if (dynamicPerm && dynamicPerm[profile.role] === false) return false;
        }

        return true;
    };

    const filteredMenus = adminMenus.filter(checkAuthorization);
    const [sheetOpen, setSheetOpen] = useState(false);
    const location = useLocation();

    // Start Firebase auth listener when admin layout mounts
    React.useEffect(() => {
        authInit();
        return () => authDestroy();
    }, [authInit, authDestroy]);

    React.useEffect(() => {
        if (user && profile?.isAuthorized) {
            initAdminData();
        }
        return () => {
            cleanupAdminData();
        };
    }, [user, profile?.isAuthorized, initAdminData, cleanupAdminData]);

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 gap-4">
                <Loader2 className="size-8 animate-spin text-primary" />
                <p className="text-slate-500 font-medium animate-pulse">Verifying Admin Session...</p>
            </div>
        );
    }

    if (!user) return <Login />;

    // Handle Unauthenticated or Unauthorized Access
    if (profile && !profile.isAuthorized) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
                <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 shadow-2xl border border-slate-200 dark:border-white/5 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="size-20 bg-amber-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 transform rotate-12">
                        <ShieldCheck className="size-10 text-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.3)]" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">Your account verification under process</h2>
                    <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                        Your account <span className="text-primary font-bold">{profile.email}</span> has been registered successfully. Please wait while an administrator verifies and activates your access.
                    </p>

                    <button
                        onClick={handleLogout}
                        className="mt-6 text-red-500 font-black text-sm uppercase tracking-widest hover:text-red-600 transition-colors flex items-center justify-center gap-2 mx-auto"
                    >
                        <LogOut className="size-4" />
                        Exit Session
                    </button>
                </div>
            </div>
        );
    }

    if (!initialized || storeLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 gap-4">
                <Loader2 className="size-8 animate-spin text-primary" />
                <p className="text-slate-500 font-medium animate-pulse">Loading Admin Data...</p>
            </div>
        );
    }

    const navLinkClass = (href) =>
        `flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all ${location.pathname === href
            ? 'text-primary bg-primary/10'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
        }`;

    const currentMenuItem = adminMenus.find(item => {
        if (item.href === '/admin') return location.pathname === '/admin';
        
        // Special case for user details which doesn't start with /admin/roles
        if (location.pathname.startsWith('/admin/users/')) {
            return item.name === 'System Personnel';
        }

        return location.pathname.startsWith(item.href);
    });

    const isAuthorizedRoute = checkAuthorization(currentMenuItem);

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900">
            {/* Desktop Sidebar */}
            <aside className="w-64 h-screen bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-white/10 hidden md:flex flex-col shrink-0">
                <Link to={'/admin'} className="p-5 border-b border-slate-200 dark:border-white/10 flex justify-center">
                    <img src={logo} alt="ReBuild Logo" className="h-10 w-auto object-contain" />
                </Link>

                <nav className="flex-1 p-4 space-y-2">
                    {filteredMenus.map((item) => (
                        <Link key={item.href} to={item.href} className={navLinkClass(item.href)} target={item.target}>
                            <item.icon className="w-5 h-5" />
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-200 dark:border-white/10">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all w-full"
                    >
                        <LogOut className="w-5 h-5" />
                        Log Out Admin
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-white/10 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
                    <div className="flex items-center gap-2">
                        {/* Mobile hamburger — visible only below md */}
                        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                            <SheetTrigger asChild>
                                <button
                                    aria-label="Open admin menu"
                                    className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                                >
                                    <Menu className="w-5 h-5" />
                                </button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-full max-w-[min(100vw,20rem)] sm:max-w-sm p-0 flex flex-col">
                                {/* Sheet header with logo */}
                                <SheetHeader className="p-5 border-b border-slate-200 dark:border-white/10 flex justify-center items-center">
                                    <img src={logo} alt="ReBuild Logo" className="h-9 w-auto object-contain" />
                                    <SheetTitle className="sr-only">Admin Menu</SheetTitle>
                                </SheetHeader>

                                {/* Nav links */}
                                <nav className="flex-1 p-4 space-y-2">
                                    {filteredMenus.map((item) => (
                                        <Link
                                            key={item.href}
                                            to={item.href}
                                            className={navLinkClass(item.href)}
                                            onClick={() => setSheetOpen(false)}
                                        >
                                            <item.icon className="w-5 h-5" />
                                            {item.name}
                                        </Link>
                                    ))}
                                </nav>

                                {/* Logout at bottom */}
                                <div className="p-4 border-t border-slate-200 dark:border-white/10">
                                    <button
                                        onClick={() => { setSheetOpen(false); handleLogout(); }}
                                        className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all w-full"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        Log Out Admin
                                    </button>
                                </div>
                            </SheetContent>
                        </Sheet>

                        <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                            <LayoutDashboard className="w-4 h-4" />
                            <span>Admin Dashboard</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden xs:flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-600 rounded-full text-[10px] font-bold uppercase tracking-wider border border-green-500/20">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            Live System
                        </div>

                        {/* Account Hub */}
                        <Link to="/admin/account" className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 px-2 py-1 rounded-xl transition-all">
                            <div className="text-right hidden sm:block">
                                <div className="text-xs font-black text-slate-900 dark:text-white leading-none mb-1">
                                    {profile?.displayName?.split(' ')[0] || 'Operator'}
                                </div>
                                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                                    {profile?.role || 'Viewer'}
                                </div>
                            </div>
                            <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-900 border-2 border-white dark:border-slate-700 shadow-sm overflow-hidden flex items-center justify-center shrink-0">
                                {profile?.photoURL ? (
                                    <img src={profile.photoURL} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <UserCircle className="w-6 h-6 text-slate-400" />
                                )}
                            </div>
                        </Link>
                    </div>
                </header>

                <div className="p-4 md:p-8">
                    {isAuthorizedRoute ? (
                        <Outlet />
                    ) : (
                        <div className="py-20 flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <div className="size-24 bg-red-500/10 rounded-3xl flex items-center justify-center mb-8 transform -rotate-12">
                                <ShieldCheck className="size-12 text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)]" />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Access Restricted</h2>
                            <p className="text-slate-500 font-medium max-w-md mx-auto mb-10 leading-relaxed text-lg">
                                Your current clearance level <span className="text-red-500 font-bold">({profile?.role})</span> does not have authorization to access this sector of the system.
                            </p>
                            <Link
                                to="/admin"
                                className="px-8 h-14 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl"
                            >
                                <LayoutDashboard className="w-5 h-5" />
                                Return to Command Center
                            </Link>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};
