import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult,
    GoogleAuthProvider,
    signOut,
    updateProfile,
    sendPasswordResetEmail,
    type User,
} from "firebase/auth";
import {
    doc,
    setDoc,
    getDoc,
    serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "./firebase";

// ─── User Profile in Firestore ──────────────────────────────────────────────
export interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    photoURL?: string;
    phone?: string;
    countryCode?: string;
    gender?: string;
    dateOfBirth?: string;
    createdAt: any;
    updatedAt: any;
    provider: "email" | "google";
}

// ─── Auth Context ───────────────────────────────────────────────────────────
interface AuthContextType {
    user: User | null;
    userProfile: UserProfile | null;
    loading: boolean;
    loginWithEmail: (email: string, password: string) => Promise<void>;
    registerWithEmail: (email: string, password: string, name: string) => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const googleProvider = new GoogleAuthProvider();

async function createOrUpdateUserDoc(user: User, provider: "email" | "google", extraData?: Partial<UserProfile>) {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        // New user — create profile
        const profile: UserProfile = {
            uid: user.uid,
            email: user.email ?? "",
            displayName: user.displayName ?? extraData?.displayName ?? "",
            photoURL: user.photoURL ?? undefined,
            phone: "",
            countryCode: "+91",
            gender: "",
            dateOfBirth: "",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            provider,
            ...extraData,
        };
        await setDoc(userRef, profile);
        return profile;
    } else {
        // Existing user — update last login
        await setDoc(userRef, { updatedAt: serverTimestamp() }, { merge: true });
        return userSnap.data() as UserProfile;
    }
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Handle redirect result if user just returned from Google sign-in redirect
        getRedirectResult(auth)
            .then(async (result) => {
                if (result?.user) {
                    const profile = await createOrUpdateUserDoc(result.user, "google");
                    setUserProfile(profile);
                }
            })
            .catch((err) => {
                console.error("Error resolving Google Sign In redirect:", err);
            });

        const unsub = onAuthStateChanged(auth, async (fbUser) => {
            setUser(fbUser);
            if (fbUser) {
                try {
                    const userRef = doc(db, "users", fbUser.uid);
                    const snap = await getDoc(userRef);
                    if (snap.exists()) {
                        setUserProfile(snap.data() as UserProfile);
                    }
                } catch (err) {
                    console.error("Error loading profile:", err);
                }
            } else {
                setUserProfile(null);
            }
            setLoading(false);
        });
        return unsub;
    }, []);

    const loginWithEmail = async (email: string, password: string) => {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        const profile = await createOrUpdateUserDoc(cred.user, "email");
        setUserProfile(profile);
    };

    const registerWithEmail = async (email: string, password: string, name: string) => {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName: name });
        const profile = await createOrUpdateUserDoc(cred.user, "email", { displayName: name });
        setUserProfile(profile);
    };

    const loginWithGoogle = async () => {
        try {
            const cred = await signInWithPopup(auth, googleProvider);
            const profile = await createOrUpdateUserDoc(cred.user, "google");
            setUserProfile(profile);
        } catch (error: any) {
            console.error("Google popup sign-in failed, trying redirect fallback:", error);
            const fallbackCodes = [
                "auth/popup-blocked",
                "auth/popup-closed-by-user",
                "auth/cancelled-popup-request",
                "auth/internal-error"
            ];

            if (
                fallbackCodes.includes(error?.code) ||
                error?.message?.includes("popup") ||
                error?.message?.includes("Cross-Origin-Opener-Policy")
            ) {
                await signInWithRedirect(auth, googleProvider);
                throw { code: "auth/redirect-started", message: "Redirecting to Google..." };
            } else {
                throw error;
            }
        }
    };

    const logout = async () => {
        await signOut(auth);
        setUser(null);
        setUserProfile(null);
    };

    const resetPassword = async (email: string) => {
        await sendPasswordResetEmail(auth, email);
    };

    const updateUserProfile = async (data: Partial<UserProfile>) => {
        if (!user) return;
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
        setUserProfile((prev) => prev ? { ...prev, ...data } : prev);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                userProfile,
                loading,
                loginWithEmail,
                registerWithEmail,
                loginWithGoogle,
                logout,
                resetPassword,
                updateUserProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
}
