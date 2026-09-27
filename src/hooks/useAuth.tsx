"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import { getFirebaseAuth, getGoogleProvider } from "@/src/lib/firebase";

export type Tier = "free" | "pro";

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  tier: Tier;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshToken: () => Promise<string | null>;
  sync: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
  refreshToken: async () => null,
  sync: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

/**
 * Get the current Firebase ID Token, refreshing if necessary.
 * Returns null if not signed in.
 */
export async function getIdToken(): Promise<string | null> {
  const auth = getFirebaseAuth();
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken();
}

/**
 * Call /api/auth/sync to ensure the server-side user record exists
 * and get the current tier.
 */
async function syncWithServer(idToken: string): Promise<Tier> {
  try {
    const res = await fetch("/api/auth/sync", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
    });
    if (!res.ok) {
      console.error("[useAuth] sync failed:", res.status);
      return "free";
    }
    const data = (await res.json()) as { tier?: string };
    return data?.tier === "pro" ? "pro" : "free";
  } catch (err) {
    console.error("[useAuth] sync error:", err);
    return "free";
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getFirebaseAuth();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      if (firebaseUser) {
        try {
          const idToken = await firebaseUser.getIdToken();
          const tier = await syncWithServer(idToken);
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            tier,
          });
        } catch (err) {
          console.error("[useAuth] onAuthStateChanged error:", err);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = useCallback(async () => {
    const auth = getFirebaseAuth();
    const provider = getGoogleProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      // onAuthStateChanged will handle the rest
      console.log("[useAuth] sign-in success:", result.user.uid);
    } catch (err: unknown) {
      // Ignore popup-closed-by-user errors
      if (err instanceof Error && err.message.includes("popup-closed-by-user")) {
        return;
      }
      console.error("[useAuth] sign-in error:", err);
      throw err;
    }
  }, []);

  const signOut = useCallback(async () => {
    const auth = getFirebaseAuth();
    await firebaseSignOut(auth);
    setUser(null);
  }, []);

  const refreshToken = useCallback(async (): Promise<string | null> => {
    const auth = getFirebaseAuth();
    const currentUser = auth.currentUser;
    if (!currentUser) return null;
    return currentUser.getIdToken(true);
  }, []);

  const sync = useCallback(async () => {
    const auth = getFirebaseAuth();
    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        const idToken = await currentUser.getIdToken(true);
        const tier = await syncWithServer(idToken);
        setUser({
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
          tier,
        });
      } catch (err) {
        console.error("[useAuth] sync error:", err);
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, refreshToken, sync }}>
      {children}
    </AuthContext.Provider>
  );
}
