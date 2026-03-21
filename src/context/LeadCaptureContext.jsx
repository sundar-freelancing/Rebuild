/* eslint-disable react-refresh/only-export-components -- context file exports Provider + hook */
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import LeadForm from '@/components/common/LeadForm';
import { useLenis } from 'lenis/react';

const LeadCaptureContext = createContext({
    openModal: () => { },
    closeModal: () => { },
});

export const useLeadCapture = () => useContext(LeadCaptureContext);

export const LeadCaptureProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const lenis = useLenis();
    const [config, setConfig] = useState({
        title: 'Book a Career Strategy Session',
        subtitle: 'Fill out the form below to connect with our experts.',
        source: 'Automatic',
    });

    const openModal = (source = 'General', customConfig = {}) => {
        setConfig({
            title: customConfig.title || 'Book a Career Strategy Session',
            subtitle: customConfig.subtitle || 'Fill out the form below to connect with our experts.',
            source: source,
        });
        setIsOpen(true);
    };

    const closeModal = () => setIsOpen(false);

    // Automatic popup after 1 minute
    useEffect(() => {
        const timer = setTimeout(() => {
            const hasSeenPopup = localStorage.getItem('hasSeenLeadPopup');
            if (!hasSeenPopup) {
                openModal('Automatic Timer', {
                    title: 'Ready to Accelerate Your Career?',
                    subtitle: 'Join ReBuild IT and get a personalized career roadmap from industry experts.'
                });
            }
        }, 60000); // 60 seconds

        return () => clearTimeout(timer);
    }, []);

    // Stop/Start Lenis scroll when modal is open/closed
    useEffect(() => {
        if (!lenis) return;
        
        if (isOpen) {
            lenis.stop();
        } else {
            lenis.start();
        }

        // Cleanup to ensure scrolling is re-enabled if component unmounts
        return () => {
            lenis.start();
        };
    }, [isOpen, lenis]);

    return (
        <LeadCaptureContext.Provider value={{ openModal, closeModal }}>
            {children}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[500px] rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden bg-white dark:bg-slate-900">
                    {/* Screen reader only headers for accessibility */}
                    <DialogHeader className="sr-only">
                        <DialogTitle>{config.title}</DialogTitle>
                        <DialogDescription>{config.subtitle}</DialogDescription>
                    </DialogHeader>

                    <div className="p-8 sm:p-10">
                        <LeadForm
                            key={`${config.source}-${isOpen}`}
                            title={config.title}
                            subtitle={config.subtitle}
                            source={config.source}
                            onSuccess={() => {
                                localStorage.setItem('hasSeenLeadPopup', 'true');
                                setTimeout(closeModal, 2000);
                            }}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </LeadCaptureContext.Provider>
    );
};
