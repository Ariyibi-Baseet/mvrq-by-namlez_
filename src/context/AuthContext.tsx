import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import { SignOutLoader } from "../components/admin/SignOutLoader";

interface AuthContextType {
  isAdminAuthenticated: boolean;
  /** True until Firebase has told us whether someone is already signed in. */
  authLoading: boolean;
  /** True while the sign-out loader is showing. */
  isSigningOut: boolean;
  /** Throws a Firebase error (with a `code`) if the email or password is wrong. */
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Keeps the loader on screen long enough to feel intentional instead of flashing
const MIN_SIGN_OUT_MS = 900;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Firebase remembers the session across reloads.
  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email.trim(), password);
  };

  const logout = async () => {
    setIsSigningOut(true);
    setIsAdminOpen(false); // so the login modal doesn't pop up after signing out
    try {
      await Promise.all([
        signOut(auth),
        new Promise((r) => setTimeout(r, MIN_SIGN_OUT_MS)),
      ]);
      window.scrollTo({ top: 0 });
    } catch (err) {
      console.error("Sign out failed:", err);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAdminAuthenticated: !!user,
        authLoading,
        isSigningOut,
        login,
        logout,
        isAdminOpen,
        setIsAdminOpen,
      }}
    >
      {children}
      {isSigningOut && <SignOutLoader />}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
