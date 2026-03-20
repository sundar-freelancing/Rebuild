import logo from '@/assets/logo/logo.png';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { mainMenus } from '@/utils/constants';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';

let initialRender = false;

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [sheetOpen, setSheetOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        initialRender = true;
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinkClass = (href) =>
        `block py-2.5 sm:py-3 text-sm sm:text-base tracking-wide transition-colors ${location.pathname === href
            ? 'text-primary dark:text-primary font-semibold'
            : 'text-slate-900 hover:text-primary dark:text-slate-300 dark:hover:text-primary'
        }`;

    return (
        <header className={`fixed top-0 z-50 w-full transition-all duration-300 ${isScrolled ? 'bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800' : 'bg-transparent border-transparent'}`} data-aos={!initialRender ? "fade-down" : undefined} data-aos-duration="500" data-aos-delay="0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-14 sm:h-20 min-[993px]:h-20">
                    <div className="flex items-center shrink-0" data-aos={!initialRender ? "fade-right" : undefined} data-aos-duration="500" data-aos-delay="150">
                        <Link to="/">
                            <img src={logo} alt="Logo" className="h-8 sm:h-9 min-[993px]:h-10" />
                        </Link>
                    </div>

                    {/* Desktop: nav + contact (visible from 993px) */}
                    <nav className="hidden min-[993px]:flex flex-1 justify-center gap-4 lg:gap-8 xl:gap-10" data-aos={!initialRender ? "fade-down" : undefined} data-aos-duration="500" data-aos-delay="200">
                        {mainMenus().map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`group relative text-sm lg:text-[15px] tracking-wide transition-colors ${location.pathname === item.href
                                    ? 'text-primary dark:text-primary font-semibold'
                                    : "text-slate-900 hover:text-primary dark:text-slate-300 dark:hover:text-primary"
                                    }`}
                            >
                                {item.name}
                                <span className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-[2px] bg-primary transition-all duration-300 rounded-full ${location.pathname === item.href
                                    ? 'w-full opacity-100'
                                    : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'
                                    }`}></span>
                            </Link>
                        ))}
                    </nav>
                    <div className="hidden min-[993px]:flex items-center justify-end shrink-0" data-aos={!initialRender ? "fade-left" : undefined} data-aos-duration="500" data-aos-delay="250">
                        <Button asChild size='sm'>
                            <Link to="/contact">
                                Contact
                            </Link>
                        </Button>
                    </div>

                    {/* Mobile: menu button + sheet (visible below 992px) */}
                    <div className="flex min-[993px]:hidden items-center justify-end shrink-0">
                        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" aria-label="Open menu">
                                    <Menu className="size-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className='w-full max-w-[min(100vw,20rem)] sm:max-w-sm'>
                                <SheetHeader>
                                    <SheetTitle className="font-normal text-base sm:text-lg">Main Menus</SheetTitle>
                                </SheetHeader>
                                <nav className="flex flex-col gap-0.5 px-2 sm:px-4">
                                    {mainMenus().map((item) => (
                                        <Link
                                            key={item.name}
                                            to={item.href}
                                            className={navLinkClass(item.href)}
                                            onClick={() => setSheetOpen(false)}
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                    <div className="pt-3 sm:pt-4">
                                        <Button asChild size="sm">
                                            <Link to="/contact" onClick={() => setSheetOpen(false)}>
                                                Contact
                                            </Link>
                                        </Button>
                                    </div>
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
