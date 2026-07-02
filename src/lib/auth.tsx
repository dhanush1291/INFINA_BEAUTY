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
import { toast } from "sonner";

const ADMIN_EMAILS = [
    "admin@infina.com",
    "admin@infina-beauty.com",
    "anjalisimmalapudi@gmail.com",
];

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
    role?: "admin" | "user";
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
    const isDefaultAdmin = user.email && ADMIN_EMAILS.includes(user.email.toLowerCase());

    try {
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
                role: isDefaultAdmin ? "admin" : "user",
                ...extraData,
            };
            try {
                await setDoc(userRef, profile);
            } catch (writeErr) {
                console.error("Firestore write failed, returning local profile", writeErr);
            }
            return profile;
        } else {
            // Existing user — update last login
            const existingData = userSnap.data() as UserProfile;
            const updatedProfile: UserProfile = {
                ...existingData,
                role: existingData.role || (isDefaultAdmin ? "admin" : "user"),
                updatedAt: new Date().toISOString(),
            };
            try {
                await setDoc(userRef, { 
                    updatedAt: serverTimestamp(),
                    role: updatedProfile.role 
                }, { merge: true });
            } catch (writeErr) {
                console.error("Firestore update failed", writeErr);
            }
            return updatedProfile;
        }
    } catch (dbErr) {
        console.error("Error in createOrUpdateUserDoc, falling back to local object", dbErr);
        // Return a local fallback profile so the user is not locked out of the app
        return {
            uid: user.uid,
            email: user.email ?? "",
            displayName: user.displayName ?? extraData?.displayName ?? "",
            photoURL: user.photoURL ?? undefined,
            phone: "",
            countryCode: "+91",
            gender: "",
            dateOfBirth: "",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            provider,
            role: isDefaultAdmin ? "admin" : "user",
            ...extraData,
        };
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
                toast.error(`Google Sign-In redirect failed: ${err?.message || err}`);
            });

        const unsub = onAuthStateChanged(auth, async (fbUser) => {
            setUser(fbUser);
            if (fbUser) {
                try {
                    const userRef = doc(db, "users", fbUser.uid);
                    const snap = await getDoc(userRef);
                    if (snap.exists()) {
                        setUserProfile(snap.data() as UserProfile);
                    } else {
                        // Document doesn't exist yet, attempt to create it
                        const provider = fbUser.providerData[0]?.providerId === "google.com" ? "google" : "email";
                        const profile = await createOrUpdateUserDoc(fbUser, provider);
                        setUserProfile(profile);
                    }
                } catch (err) {
                    console.error("Error loading profile:", err);
                    // Fallback to local profile based on auth credentials
                    const isDefaultAdmin = fbUser.email && ADMIN_EMAILS.includes(fbUser.email.toLowerCase());
                    setUserProfile({
                        uid: fbUser.uid,
                        email: fbUser.email ?? "",
                        displayName: fbUser.displayName ?? "",
                        photoURL: fbUser.photoURL ?? undefined,
                        phone: "",
                        countryCode: "+91",
                        gender: "",
                        dateOfBirth: "",
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        provider: fbUser.providerData[0]?.providerId === "google.com" ? "google" : "email",
                        role: isDefaultAdmin ? "admin" : "user",
                    });
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
