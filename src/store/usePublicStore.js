import { create } from 'zustand';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, collectionGroup } from 'firebase/firestore';

/**
 * Public Data Zustand store — manages dynamic content for the public site.
 */
const usePublicStore = create((set, get) => ({
    successStories: [],
    loadingStories: true,
    hiringPartners: [],
    loadingPartners: true,
    domains: [],
    courses: [],
    loadingCourses: true,
    _unsubStories: null,
    _unsubPartners: null,
    _unsubDomains: null,
    _unsubCourses: null,

    /** Initialize success stories listener */
    initStories: () => {
        if (get()._unsubStories) return;

        const q = query(collection(db, 'successStories'), orderBy('createdAt', 'desc'));
        const unsub = onSnapshot(q, (snapshot) => {
            const stories = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            set({ successStories: stories, loadingStories: false });
        }, (err) => {
            console.error('[PublicStore] Error fetching success stories:', err);
            set({ loadingStories: false });
        });

        set({ _unsubStories: unsub });
    },

    /** Initialize hiring partners listener */
    initPartners: () => {
        if (get()._unsubPartners) return;

        const q = query(collection(db, 'hiringPartners'), orderBy('createdAt', 'desc'));
        const unsub = onSnapshot(q, (snapshot) => {
            const partners = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            set({ hiringPartners: partners, loadingPartners: false });
        }, (err) => {
            console.error('[PublicStore] Error fetching hiring partners:', err);
            set({ loadingPartners: false });
        });

        set({ _unsubPartners: unsub });
    },

    /** Initialize courses and domains listener */
    initCourses: () => {
        const { _unsubDomains, _unsubCourses } = get();
        if (_unsubDomains && _unsubCourses) return;

        // Fetch Domains
        const qDomains = query(collection(db, 'domains'), orderBy('createdAt', 'desc'));
        const unsubDomains = onSnapshot(qDomains, (snapshot) => {
            const fetchedDomains = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            set({ domains: fetchedDomains });
        });

        // Fetch Courses (via collectionGroup)
        const qCourses = query(collectionGroup(db, 'courses'));
        const unsubCourses = onSnapshot(qCourses, (snapshot) => {
            const fetchedCourses = snapshot.docs.map(d => ({ 
                id: d.id, 
                domainId: d.ref.parent.parent.id,
                ...d.data() 
            }));
            set({ courses: fetchedCourses, loadingCourses: false });
        }, (err) => {
            console.error('[PublicStore] Error fetching courses:', err);
            set({ loadingCourses: false });
        });

        set({ _unsubDomains: unsubDomains, _unsubCourses: unsubCourses });
    },

    /** Cleanup listeners */
    destroy: () => {
        const { _unsubStories, _unsubPartners, _unsubDomains, _unsubCourses } = get();
        if (_unsubStories) _unsubStories();
        if (_unsubPartners) _unsubPartners();
        if (_unsubDomains) _unsubDomains();
        if (_unsubCourses) _unsubCourses();
        set({ 
            _unsubStories: null, 
            _unsubPartners: null, 
            _unsubDomains: null,
            _unsubCourses: null,
            successStories: [], 
            hiringPartners: [], 
            domains: [],
            courses: [],
            loadingStories: true, 
            loadingPartners: true,
            loadingCourses: true
        });
    }
}));

export default usePublicStore;
