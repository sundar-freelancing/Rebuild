import { create } from 'zustand';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, collectionGroup } from 'firebase/firestore';

const useAdminStore = create((set, get) => ({
    leads: [],
    courses: [],
    domains: [],
    successStories: [],
    hiringPartners: [],
    siteConfig: null,
    loading: false,
    initialized: false,
    unsubLeads: null,
    unsubCourses: null,
    unsubDomains: null,
    unsubSuccessStories: null,
    unsubHiringPartners: null,
    unsubUsers: null,
    unsubConfig: null,
    users: [],

    initAdminData: async () => {
        const { initialized, loading } = get();
        if (initialized || loading) return;

        set({ loading: true, initialized: true }); // Set both immediately to block other calls

        try {
        // Live firestore listener for Site Config
        const unsubConfig = onSnapshot(doc(db, 'siteConfig', 'main'), (snap) => {
            if (snap.exists()) {
                set({ siteConfig: snap.data() });
            }
        });

        // Live firestore listener for Leads
        const qLeads = query(collection(db, 'userData'), orderBy('createdAt', 'desc'));
        const unsubLeads = onSnapshot(qLeads, (snapshot) => {
            set({ leads: snapshot.docs.map(d => ({ id: d.id, ...d.data() })) });
        });

        // Live firestore listener for Domains
        const qDomains = query(collection(db, 'domains'), orderBy('createdAt', 'desc'));
        const unsubDomains = onSnapshot(qDomains, (snapshot) => {
            const fetchedDomains = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            set({ domains: fetchedDomains });
        });

        // Live firestore listener for Success Stories
        const qSuccessStories = query(collection(db, 'successStories'), orderBy('createdAt', 'desc'));
        const unsubSuccessStories = onSnapshot(qSuccessStories, (snapshot) => {
            set({ successStories: snapshot.docs.map(d => ({ id: d.id, ...d.data() })) });
        });

        // Live firestore listener for Hiring Partners
        const qHiringPartners = query(collection(db, 'hiringPartners'), orderBy('createdAt', 'desc'));
        const unsubHiringPartners = onSnapshot(qHiringPartners, (snapshot) => {
            set({ hiringPartners: snapshot.docs.map(d => ({ id: d.id, ...d.data() })) });
        });

        // Live firestore listener for Users/Admins
        const qUsers = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
        const unsubUsers = onSnapshot(qUsers, (snapshot) => {
            set({ users: snapshot.docs.map(d => ({ id: d.id, ...d.data() })) });
        }, (error) => {
            console.error("Failed to fetch users (might not have permission or collection doesn't exist):", error);
        });

        // Live firestore listener for Courses (Collection Group)
        const qCourses = query(collectionGroup(db, 'courses'));
        const unsubCourses = onSnapshot(qCourses, (snapshot) => {
            const fetchedCourses = snapshot.docs.map(d => ({ 
                id: d.id, 
                domainId: d.ref.parent.parent.id, // Get the parent domain document ID
                ...d.data() 
            })).sort((a, b) => {
                const dateA = a.dateOfCreation?.toDate?.() || new Date(0);
                const dateB = b.dateOfCreation?.toDate?.() || new Date(0);
                return dateB - dateA;
            });
            set({ courses: fetchedCourses });
        });

        set({ 
            unsubLeads, 
            unsubDomains, 
            unsubCourses, 
            unsubSuccessStories, 
            unsubHiringPartners,
            unsubUsers,
            unsubConfig,
            loading: false 
        });
        } catch (error) {
            console.error("Critical error in admin data initialization:", error);
            set({ loading: false });
        }
    },

    cleanupAdminData: () => {
        const { unsubLeads, unsubCourses, unsubDomains, unsubSuccessStories, unsubHiringPartners, unsubUsers, unsubConfig } = get();
        if (unsubLeads) unsubLeads();
        if (unsubCourses) unsubCourses();
        if (unsubDomains) unsubDomains();
        if (unsubSuccessStories) unsubSuccessStories();
        if (unsubHiringPartners) unsubHiringPartners();
        if (unsubUsers) unsubUsers();
        if (unsubConfig) unsubConfig();
        set({ 
            initialized: false, 
            unsubLeads: null, 
            unsubCourses: null, 
            unsubDomains: null, 
            unsubSuccessStories: null,
            unsubHiringPartners: null,
            unsubUsers: null,
            unsubConfig: null,
            users: []
        });
    },

    setDomains: (domains) => set({ domains }),
    setCourses: (courses) => set({ courses }),
    setSuccessStories: (successStories) => set({ successStories }),
    setHiringPartners: (hiringPartners) => set({ hiringPartners }),
    setSiteConfig: (newConfig) => set({ siteConfig: newConfig })
}));

export default useAdminStore;
