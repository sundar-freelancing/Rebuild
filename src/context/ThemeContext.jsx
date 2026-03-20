/* eslint-disable react-refresh/only-export-components -- context file exports Provider + hook */
import { createContext, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'rebuild-theme';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
    const [theme, setThemeState] = useState(() => {
        if (typeof window === 'undefined') return 'system';
        return localStorage.getItem(STORAGE_KEY) || 'system';
    });

    const isDark = (value) => {
        if (typeof window === 'undefined') return false;
        if (value === 'dark') return true;
        if (value === 'light') return false;
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    };

    const [resolvedDark, setResolvedDark] = useState(() => isDark(theme));

    useEffect(() => {
        const root = document.documentElement;
        const apply = (dark) => {
            root.classList.toggle('dark', dark);
            setResolvedDark(dark);
        };
        if (theme === 'system') {
            const mq = window.matchMedia('(prefers-color-scheme: dark)');
            apply(mq.matches);
            const handler = (e) => apply(e.matches);
            mq.addEventListener('change', handler);
            return () => mq.removeEventListener('change', handler);
        }
        apply(theme === 'dark');
    }, [theme]);

    useEffect(() => {
        if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, theme);
    }, [theme]);

    const setTheme = (value) => setThemeState(value);

    const value = { theme, setTheme, resolvedDark, isDark: resolvedDark };

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
    return ctx;
}
