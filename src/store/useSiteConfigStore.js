import { create } from 'zustand';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { DEFAULT_CONFIG } from '@/utils/defaultSiteConfigContent';

/**
 * SiteConfig Zustand store — used ONLY on public-facing pages.
 * 
 * Strategy:
 *  - Starts with DEFAULT_CONFIG immediately (no loading / no blank state for users).
 *  - Once Firebase returns data, seamlessly replaces without any loading gate.
 *  - Init is called in PublicLayout on mount; cleanup on unmount.
 */
const useSiteConfigStore = create((set, get) => ({
    // Start with defaults so public pages always render immediately
    config: DEFAULT_CONFIG,
    _unsubscribe: null,

    /** Start listening to Firestore siteConfig/main. Called in PublicLayout. */
    init: () => {
        // Prevent double subscription
        if (get()._unsubscribe) return;

        const unsub = onSnapshot(
            doc(db, 'siteConfig', 'main'),
            (snap) => {
                if (!snap.exists()) return; // keep defaults if not set yet

                const data = snap.data();
                set({
                    config: {
                        whatsappNumber: data.whatsappNumber ?? DEFAULT_CONFIG.whatsappNumber,
                        whatsappMessage: data.whatsappMessage ?? DEFAULT_CONFIG.whatsappMessage,
                        officeAddress: data.officeAddress ?? DEFAULT_CONFIG.officeAddress,
                        mapEmbedUrl: data.mapEmbedUrl ?? DEFAULT_CONFIG.mapEmbedUrl,
                        ceoName: data.ceoName ?? DEFAULT_CONFIG.ceoName,
                        ceoPictureUrl: data.ceoPictureUrl ?? DEFAULT_CONFIG.ceoPictureUrl,
                        ceoSignUrl: data.ceoSignUrl ?? DEFAULT_CONFIG.ceoSignUrl,
                        contactEmails: Array.isArray(data.contactEmails)
                            ? data.contactEmails
                            : data.contactEmail
                                ? [data.contactEmail]
                                : DEFAULT_CONFIG.contactEmails,
                        contactPhones: Array.isArray(data.contactPhones)
                            ? data.contactPhones
                            : data.contactPhone
                                ? [data.contactPhone]
                                : DEFAULT_CONFIG.contactPhones,
                        officeHours: Array.isArray(data.officeHours)
                            ? data.officeHours
                            : DEFAULT_CONFIG.officeHours,
                        siteStatus: data.siteStatus || null,
                    },
                });
            },
            (err) => console.error('[SiteConfig]', err)
        );

        set({ _unsubscribe: unsub });
    },

    /** Stop Firestore listener. Called in PublicLayout cleanup. */
    destroy: () => {
        const unsub = get()._unsubscribe;
        if (unsub) unsub();
        set({ _unsubscribe: null, config: DEFAULT_CONFIG });
    },
}));

export default useSiteConfigStore;
