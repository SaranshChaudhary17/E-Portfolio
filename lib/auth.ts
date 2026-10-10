"use client";
import { useEffect, useState } from "react";
import {
  signInWithPopup,
  signOut as fbSignOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth, googleProvider } from "./firebase";

export const AUTHORIZED_EMAIL =
  process.env.NEXT_PUBLIC_ADMIN_EMAIL || "saranshchaudhary17@gmail.com";

export function useAdminAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const email = firebaseUser.email?.toLowerCase().trim() || "";
        const authorized = email === AUTHORIZED_EMAIL.toLowerCase().trim();
        setIsAuthorized(authorized);
      } else {
        setUser(null);
        setIsAuthorized(false);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const email = result.user.email?.toLowerCase().trim() || "";
      if (email !== AUTHORIZED_EMAIL.toLowerCase().trim()) {
        await fbSignOut(auth);
        throw new Error("Access Denied. Only Malik has access.");
      }
      return result.user;
    } catch (err: unknown) {
      throw err;
    }
  };

  const logout = async () => {
    await fbSignOut(auth);
  };

  return { user, loading, isAuthorized, loginWithGoogle, logout };
}
