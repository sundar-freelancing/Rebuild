import { create } from 'zustand';
import { auth, db, googleProvider } from '@/lib/firebase';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    createUserWithEmailAndPassword,
    updateProfile,
    signInWithPopup,
    linkWithCredential,
    EmailAuthProvider
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, onSnapshot, collection, query, where, getDocs } from 'firebase/firestore';

/**
 * Auth Zustand store — used ONLY in the admin (private) side.
 * Subscribes to Firebase Auth on first call to `init`, cleans up on `destroy`.
 */
const useAuthStore = create((set, get) => ({
    user: null,
    profile: null,
    loading: true,
    _unsubscribe: null,
    _unsubProfile: null,

    /** Start listening to Firebase auth state. Call once in AdminLayout mount. */
    init: () => {
        // Prevent double-subscription
        if (get()._unsubscribe) return;

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // Subscribe to profile
                const unsubProfile = onSnapshot(doc(db, 'users', user.uid), (snap) => {
                    if (snap.exists()) {
                        set({ profile: snap.data() });
                    } else {
                        console.warn("No firestore profile found for auth user. Logging out...");
                        signOut(auth).catch(console.error);
                        set({ profile: null, user: null });
                    }
                }, (error) => {
                    console.error("Profile listener error (e.g. invalid permissions). Logging out...", error);
                    signOut(auth).catch(console.error);
                    set({ profile: null, user: null });
                });
                set({ _unsubProfile: unsubProfile });
            } else {
                set({ profile: null });
                const unsubProf = get()._unsubProfile;
                if (unsubProf) unsubProf();
                set({ _unsubProfile: null });
            }
            set({ user, loading: false });
        });

        set({ _unsubscribe: unsubscribe });
    },

    /** Sync user profile to Firestore - only for signup */
    createUserProfile: async (user, displayName) => {
        try {
            const userRef = doc(db, 'users', user.uid);
            // Double check by email to prevent duplicate personnel records
            const q = query(collection(db, 'users'), where('email', '==', user.email));
            const qSnap = await getDocs(q);

            if (!qSnap.empty) {
                // Already exists as a personnel record by email
                // We'll update the UID if it's different and merge
                const existingDoc = qSnap.docs[0];
                await setDoc(doc(db, 'users', existingDoc.id), {
                    uid: user.uid,
                    lastLogin: serverTimestamp()
                }, { merge: true });
                return;
            }

            const nameToSave = displayName || user.displayName || 'New User';

            await setDoc(userRef, {
                uid: user.uid,
                email: user.email,
                displayName: nameToSave,
                photoURL: user.photoURL || '',
                role: 'Viewer', // Default role for new users
                isAuthorized: false, // Access must be granted by admin
                createdAt: serverTimestamp(),
                lastLogin: serverTimestamp(),
            });
        } catch (error) {
            console.error("Error creating user profile:", error);
            throw error;
        }
    },

    /** Stop listening. Call in AdminLayout unmount. */
    destroy: () => {
        const unsub = get()._unsubscribe;
        const unsubP = get()._unsubProfile;
        if (unsub) unsub();
        if (unsubP) unsubP();
        set({ _unsubscribe: null, _unsubProfile: null, user: null, profile: null, loading: true });
    },

    signup: async (email, password, displayName) => {
        // Firebase Auth will throw if user exists in Auth
        const res = await createUserWithEmailAndPassword(auth, email, password);
        if (displayName) {
            await updateProfile(res.user, { displayName });
        }
        await get().createUserProfile(res.user, displayName);
        return res;
    },

    signupWithGoogle: async (password) => {
        const res = await signInWithPopup(auth, googleProvider);
        const { user } = res;

        const q = query(collection(db, 'users'), where('email', '==', user.email));
        const qSnap = await getDocs(q);

        if (!qSnap.empty) {
            // User already exists in personnel list, just update
            await setDoc(doc(db, 'users', qSnap.docs[0].id), {
                uid: user.uid,
                lastLogin: serverTimestamp()
            }, { merge: true });
        } else {
            // New user, create their profile
            await get().createUserProfile(user, user.displayName);
        }

        // If password is provided, link the EmailAuthProvider to this Google account
        if (password) {
            try {
                const credential = EmailAuthProvider.credential(user.email, password);
                await linkWithCredential(user, credential);
            } catch (err) {
                console.warn("Account merging via linking failed (might already be linked):", err);
            }
        }
        return res;
    },

    login: async (email, password) => {
        const res = await signInWithEmailAndPassword(auth, email, password);
        const userRef = doc(db, 'users', res.user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            await signOut(auth);
            throw { code: 'auth/user-not-found', message: 'User is not found' };
        }
        await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
        return res;
    },

    loginWithGoogle: async () => {
        const res = await signInWithPopup(auth, googleProvider);
        const { user } = res;

        // Find personnel record by email (handles cases where UID changed or was not linked)
        const q = query(collection(db, 'users'), where('email', '==', user.email));
        const qSnap = await getDocs(q);

        if (qSnap.empty) {
            await signOut(auth);
            throw { code: 'auth/user-not-found', message: 'User is not found' };
        }

        // Personnel found, update last login and latest auth UID
        const userDocRef = doc(db, 'users', qSnap.docs[0].id);
        await setDoc(userDocRef, {
            uid: user.uid,
            lastLogin: serverTimestamp()
        }, { merge: true });

        return res;
    },

    logout: () => signOut(auth),
}));

export default useAuthStore;
