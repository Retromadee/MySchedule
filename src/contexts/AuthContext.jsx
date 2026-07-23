import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
    AppleAuthProvider, GoogleAuthProvider, createUserWithEmailAndPassword,
    onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut,
} from 'firebase/auth';
import { get, ref, set } from 'firebase/database';
import { auth, database, isFirebaseConfigured } from '../firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isFirebaseConfigured) {
            setLoading(false);
            return undefined;
        }
        return onAuthStateChanged(auth, async (nextUser) => {
        setUser(nextUser);
        if (nextUser) {
            const snapshot = await get(ref(database, `users/${nextUser.uid}/profile`));
            setProfile(snapshot.val());
        } else {
            setProfile(null);
        }
        setLoading(false);
        });
    }, []);

    const ensureConfigured = () => {
        if (!isFirebaseConfigured) throw new Error('Firebase is not configured for this deployment.');
    };
    const signInWithProvider = (provider) => { ensureConfigured(); return signInWithPopup(auth, provider); };
    const signInWithGoogle = () => signInWithProvider(new GoogleAuthProvider());
    const signInWithApple = () => signInWithProvider(new AppleAuthProvider());

    const completeOnboarding = async ({ displayName, categories, events }) => {
        const nextProfile = {
            displayName: displayName || user.displayName || user.email?.split('@')[0] || 'Planner',
            categories,
            onboardingComplete: true,
            createdAt: Date.now(),
        };
        await set(ref(database, `users/${user.uid}/profile`), nextProfile);
        await set(ref(database, `users/${user.uid}/events`), Object.fromEntries(events.map(event => [event.id, event])));
        setProfile(nextProfile);
    };

    const value = useMemo(() => ({
        user, profile, loading,
        signInWithGoogle,
        signInWithApple,
        signInWithEmail: (email, password) => { ensureConfigured(); return signInWithEmailAndPassword(auth, email, password); },
        signUpWithEmail: (email, password) => { ensureConfigured(); return createUserWithEmailAndPassword(auth, email, password); },
        signOut: () => { ensureConfigured(); return signOut(auth); },
        completeOnboarding,
    }), [user, profile, loading]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used inside AuthProvider');
    return context;
}
