import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '@/store/useAuthStore';
import { ShieldCheck, Mail, Lock, Loader2, ArrowRight, AlertCircle, User, UserPlus, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Login = () => {
    const [mode, setMode] = useState('login'); // 'login' or 'signup'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const { login, signup, loginWithGoogle, signupWithGoogle } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (mode === 'login') {
                await login(email, password);
                navigate('/admin');
            } else {
                await signup(email, password, displayName);
                // navigate will be handled by auth state change
            }
        } catch (err) {
            console.error('Auth error:', err);
            handleError(err);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setGoogleLoading(true);
        setError('');
        try {
            if (mode === 'login') {
                await loginWithGoogle();
                navigate('/admin');
            } else {
                // For dual login, ensure password is provided during Google signup
                if (!password || password.length < 6) {
                    setError('Please enter a password (min 6 characters) below before choosing Google signup to enable dual login.');
                    setGoogleLoading(false);
                    return;
                }
                await signupWithGoogle(password);
                // navigate will be handled by auth state change
            }
        } catch (err) {
            console.error('Google Auth error:', err);
            handleError(err);
        } finally {
            setGoogleLoading(false);
        }
    };

    const handleError = (err) => {
        const message = err.message || '';
        const code = err.code || '';

        if (code === 'auth/user-not-found' || message === 'User is not found') {
            setError('Account not found. Please check your email or sign up.');
        } else if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
            setError('The password you entered is incorrect. Please try again.');
        } else if (code === 'auth/email-already-in-use' || message === 'Already user found') {
            setError('This email is already registered. Please sign in instead.');
        } else if (code === 'auth/invalid-email') {
            setError('Please enter a valid email address.');
        } else if (code === 'auth/weak-password') {
            setError('Password should be at least 6 characters.');
        } else if (code === 'auth/popup-closed-by-user') {
            setError('Login cancelled.');
        } else {
            setError(mode === 'login' ? 'Authentication failed.' : 'Registration failed.');
        }
    };

    const toggleMode = () => {
        setMode(prev => prev === 'login' ? 'signup' : 'login');
        setError('');
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8 animate-in fade-in duration-700">
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-xl mb-2 text-primary rotate-3">
                        {mode === 'login' ? <ShieldCheck className="size-8" /> : <UserPlus className="size-8" />}
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
                        {mode === 'login' ? 'Auth Access' : 'New Operator'}
                    </h1>
                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                        {mode === 'login' ? 'Secure terminal for authorized personnel' : 'Request system credentials below'}
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-white/5 rounded-[2rem] p-8 md:p-10 space-y-8 relative overflow-hidden">
                    <Button
                        onClick={handleGoogleLogin}
                        disabled={loading || googleLoading}
                        variant="outline"
                        className="w-full h-14 rounded-2xl transition-all flex items-center justify-center gap-3 font-black uppercase text-xs tracking-widest hover:bg-slate-50 dark:hover:bg-white/5 border-2 active:scale-[0.98]"
                    >
                        {googleLoading ? (
                            <Loader2 className="size-5 animate-spin" />
                        ) : (
                            <svg className="size-5" viewBox="0 0 48 48">
                                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z" />
                                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                                <path fill="none" d="M0 0h48v48H0z" />
                            </svg>
                        )}
                        <span>{mode === 'login' ? 'Google Authentication' : 'Google Rapid Signup'}</span>
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-100 dark:border-white/5" />
                        </div>
                        <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
                            <span className="bg-white dark:bg-slate-900 px-4 text-slate-400">Secure Protocol</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-500/10 border-l-4 border-red-500 rounded-xl flex items-center gap-3 text-red-600 dark:text-red-400 text-xs font-bold animate-shake">
                                <AlertCircle className="size-4 shrink-0" />
                                <p>{error}</p>
                            </div>
                        )}

                        <div className="space-y-5">
                            {mode === 'signup' && (
                                <div className="space-y-2 group">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-primary transition-colors">Personnel Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                                        <input
                                            required
                                            type="text"
                                            placeholder="Enter full name"
                                            value={displayName}
                                            onChange={(e) => setDisplayName(e.target.value)}
                                            className="w-full h-14 pl-12 pr-6 rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-950/50 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary font-bold text-slate-900 dark:text-white transition-all"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2 group">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-primary transition-colors">Digital Identity</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                                    <input
                                        required
                                        type="email"
                                        placeholder="operator@system.core"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full h-14 pl-12 pr-6 rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-950/50 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary font-bold text-slate-900 dark:text-white transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 group">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-primary transition-colors">Access Code</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                                    <input
                                        required
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full h-14 pl-12 pr-12 rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-950/50 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary font-bold text-slate-900 dark:text-white transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <Button
                            disabled={loading || googleLoading}
                            type="submit"
                            className="w-full h-16 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            {loading ? <Loader2 className="size-6 animate-spin mr-3" /> : (mode === 'login' ? 'Initiate Link' : 'Register Operator')}
                        </Button>
                    </form>

                    <div className="text-center">
                        <button
                            onClick={toggleMode}
                            type="button"
                            className="text-sm text-slate-500 hover:text-primary transition-colors font-medium"
                        >
                            {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                        </button>
                    </div>
                </div>

                <div className="text-center pt-4">
                    <button
                        onClick={() => navigate('/')}
                        className="text-xs text-slate-400 hover:text-slate-600 transition-colors inline-flex items-center gap-1"
                    >
                        <ArrowRight className="size-3 rotate-180" />
                        Back to homepage
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;


