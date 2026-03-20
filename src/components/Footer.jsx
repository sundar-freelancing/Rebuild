import { footerCourseLinks, footerLegalLinks, mainMenus } from '@/utils/constants';
import { Globe, Mail, MapPin, MessageCircle, Phone, Sun, Moon, Monitor } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import useSiteConfigStore from '@/store/useSiteConfigStore';
import logo from '@/assets/logo/logo.png';

const Footer = () => {
    const { theme, setTheme } = useTheme();
    const config = useSiteConfigStore((s) => s.config);

    const primaryEmail = config.contactEmails[0] || 'info@rebuildit.in';
    const primaryPhone = config.contactPhones[0] || '+91 98765 43210';

    const cycleTheme = () => {
        setTheme(theme === 'system' ? 'light' : theme === 'light' ? 'dark' : 'system');
    };

    const themeLabel = theme === 'system' ? 'System' : theme === 'light' ? 'Light' : 'Dark';
    const ThemeIcon = theme === 'system' ? Monitor : theme === 'light' ? Sun : Moon;

    return (
        <footer className="bg-slate-950 dark:bg-slate-950 border-t border-slate-800 dark:border-slate-800 text-slate-200 py-8 sm:py-12 md:py-16 relative overflow-hidden">
            {/* Dark Premium Background Effects */}
            <div className="absolute inset-0 w-full h-full pointer-events-none">
                <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[60%] rounded-full bg-primary/5 blur-[120px]"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid md:grid-cols-4 gap-8 sm:gap-10 md:gap-12 mb-8 sm:mb-10 md:mb-12 border-b border-slate-800/80 pb-8 sm:pb-10 md:pb-12" data-aos="fade-up">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center mb-4 sm:mb-6">
                            <img src={logo} alt="Logo" className="h-8 sm:h-9 md:h-10" />
                        </div>
                        <p className="text-sm sm:text-base leading-relaxed mb-4 sm:mb-6 text-slate-200 font-light">
                            Empowering manual testers to become industry-leading automation experts through structured mentorship and enterprise projects.
                        </p>
                        <div className="flex gap-3 sm:gap-4">
                            <Link to="#" className="size-8 sm:size-10 rounded-full bg-slate-800/50 border border-slate-700 flex items-center justify-center hover:bg-primary hover:border-primary text-slate-100 hover:text-white transition-all duration-300 shadow-sm hover:shadow-primary/30 hover:-translate-y-1.5" aria-label="Email Us">
                                <Mail className="size-4" />
                            </Link>
                            <Link to="#" className="size-8 sm:size-10 rounded-full bg-slate-800/50 border border-slate-700 flex items-center justify-center hover:bg-primary hover:border-primary text-slate-100 hover:text-white transition-all duration-300 shadow-sm hover:shadow-primary/30 hover:-translate-y-1.5" aria-label="Website">
                                <Globe className="size-4" />
                            </Link>
                            <Link to="#" className="size-8 sm:size-10 rounded-full bg-slate-800/50 border border-slate-700 flex items-center justify-center hover:bg-primary hover:border-primary text-slate-100 hover:text-white transition-all duration-300 shadow-sm hover:shadow-primary/30 hover:-translate-y-1.5" aria-label="Message Us">
                                <MessageCircle className="size-4" />
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h5 className="text-white font-light mb-3 sm:mb-6 tracking-wide text-base sm:text-lg">Quick Links</h5>
                        <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base font-light">
                            {mainMenus(true).map((link, index) => (
                                <li key={index}>
                                    <Link className="text-slate-200 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block" to={link.href}>
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h5 className="text-white font-light mb-3 sm:mb-6 tracking-wide text-base sm:text-lg">Courses</h5>
                        <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base font-light">
                            {footerCourseLinks.map((link, index) => (
                                <li key={index}>
                                    <Link className="text-slate-200 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block" to={link.href}>
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h5 className="text-white font-light mb-3 sm:mb-6 tracking-wide text-base sm:text-lg">Contact Us</h5>
                        <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base font-light text-slate-200">
                            <li>
                                <a href={`mailto:${primaryEmail}`} className="flex items-center gap-3 text-slate-200 hover:text-white transition-all duration-300 group">
                                    <div className="size-8 rounded-full bg-slate-800/50 border border-slate-700 flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/40 transition-all duration-300">
                                        <Mail className="size-3.5 text-slate-100 group-hover:text-white transition-colors duration-300" />
                                    </div>
                                    {primaryEmail}
                                </a>
                            </li>
                            <li>
                                <a href={`tel:${primaryPhone.replace(/\s+/g, '')}`} className="flex items-center gap-3 text-slate-200 hover:text-white transition-all duration-300 group">
                                    <div className="size-8 rounded-full bg-slate-800/50 border border-slate-700 flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/40 transition-all duration-300">
                                        <Phone className="size-3.5 text-slate-100 group-hover:text-white transition-colors duration-300" />
                                    </div>
                                    {primaryPhone}
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="size-8 rounded-full bg-slate-800/50 border border-slate-700 flex items-center justify-center shrink-0">
                                    <MapPin className="size-3.5 text-slate-100" />
                                </div>
                                <span className="leading-tight text-slate-200">{config.officeAddress || 'Tech Hub, Bangalore, India'}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-3 sm:gap-4 justify-between items-center text-xs sm:text-sm mb-6 sm:mb-8 text-center md:text-left">
                    <p className="text-slate-200 tracking-wide font-light">© 2024 Rebuild IT Solutions. All Rights Reserved.</p>
                    <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 font-light">
                        <button
                            type="button"
                            onClick={cycleTheme}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-800/80 hover:bg-primary/90 border border-slate-700 hover:border-primary text-slate-200 hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-slate-950 cursor-pointer"
                            aria-label={`Theme: ${themeLabel}. Click to switch.`}
                            title={`Theme: ${themeLabel}`}
                        >
                            <ThemeIcon className="size-4 shrink-0" />
                            <span className="font-medium">{themeLabel}</span>
                        </button>
                        {footerLegalLinks.map((link, index) => (
                            <Link key={index} className="text-slate-200 hover:text-white transition-all duration-300" to={link.href}>
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
