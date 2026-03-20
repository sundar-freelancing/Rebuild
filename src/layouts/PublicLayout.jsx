import Footer from "@/components/Footer";
import FinalCTA from "@/components/home/FinalCTA";
import Navbar from "@/components/Navbar";
import { Outlet } from "react-router-dom";
import WhatsAppButton from "@/components/common/WhatsAppButton";
import { LeadCaptureProvider } from "@/context/LeadCaptureContext";
import { ReactLenis } from "lenis/react";
import { useEffect } from "react";
import useSiteConfigStore from "@/store/useSiteConfigStore";
import { Power, Construction, Mail } from "lucide-react";

export const PublicLayout = () => {
  const init = useSiteConfigStore((s) => s.init);
  const destroy = useSiteConfigStore((s) => s.destroy);
  const config = useSiteConfigStore((s) => s.config);

  useEffect(() => {
    init();
    return () => destroy();
  }, [init, destroy]);

  // Handle Maintenance or Site Disabled
  const status = config.siteStatus;
  if (status) {
    const isOffline = status.enabled === false;
    const isMaintenance = status.maintenance === true;

    if (isOffline || isMaintenance) {
      return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-1000">
          <div className={`p-8 rounded-[3rem] ${isOffline ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'} mb-10 transform -rotate-6`}>
            {isOffline ? <Power className="size-16" /> : <Construction className="size-16" />}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-4">
            {isOffline ? 'System Temporarily Offline' : 'Undergoing Evolution'}
          </h1>
          <p className="text-slate-500 font-medium max-w-lg mx-auto mb-12 leading-relaxed text-lg italic">
            "{isOffline ? status.enabledDesc : status.maintenanceDesc}"
          </p>
          <div className="flex flex-col items-center gap-4">
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Direct Inquiries</div>
            <a href={`mailto:${config.contactEmails?.[0] || 'info@rebuild.com'}`} className="flex items-center gap-2 text-slate-900 font-bold hover:text-primary transition-colors border-b-2 border-slate-200 pb-1">
              <Mail className="size-4" />
              {config.contactEmails?.[0] || 'support@rebuild.com'}
            </a>
          </div>
        </div>
      );
    }
  }

  return (
    <ReactLenis root>
      <LeadCaptureProvider>
        <Navbar />
        <Outlet />
        <FinalCTA />
        <Footer />
        <WhatsAppButton />
      </LeadCaptureProvider>
    </ReactLenis>
  );
};
