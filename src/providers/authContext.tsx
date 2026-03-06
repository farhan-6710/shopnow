"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js"; // Re-using User type for simplicity for now
import { clearCartLocal } from "@/redux/slices/cartSlice";
import { clearWishlistLocal } from "@/redux/slices/wishlistSlice";
import { useDispatch } from "react-redux";
import { authApi } from "@/services/authApi";
import { setMemoryAuthStatus } from "@/utils/auth";
import { API_URL } from "@/constants/api";

interface AppUser {
  id: string;
  name: string;
  email: string;
  picture: string;
}

interface AuthContextType {
  user: AppUser | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (
    email: string,
    password: string,
    fullName: string,
  ) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await authApi.me();
        if (data.status === "success") {
          setUser({
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            picture: data.user.picture || "",
          });
          setSession({ user: data.user } as unknown as Session);
          setMemoryAuthStatus(true);
        } else {
          setMemoryAuthStatus(false);
        }
      } catch {
        // 401 is expected when user is not logged in — not an error
        setMemoryAuthStatus(false);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const signInWithGoogle = async () => {
    window.location.href = API_URL.AUTH.GOOGLE_INIT.url;
  };

  const signInWithEmail = async (email: string, password: string) => {
    const data = await authApi.login(email, password);
    if (data.status === "success") {
      setUser({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        picture: data.user.picture || "",
      });
      setSession({ user: data.user } as unknown as Session);
      setMemoryAuthStatus(true);
    } else {
      throw new Error(data.error || "Login failed");
    }
  };

  const signUpWithEmail = async (
    email: string,
    password: string,
    fullName: string,
  ) => {
    const data = await authApi.signup(email, password, fullName);
    if (data.status === "success") {
      setUser({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        picture: data.user.picture || "",
      });
      setSession({ user: data.user } as unknown as Session);
      setMemoryAuthStatus(true);
    } else {
      throw new Error(data.error || "Signup failed");
    }
  };

  const signOut = async () => {
    // Clear cart and wishlist locally BEFORE signing out to prevent API calls with invalid tokens
    if (typeof window !== "undefined") {
      dispatch(clearCartLocal());
      dispatch(clearWishlistLocal());
      localStorage.removeItem("persist:root");
    }

    try {
      await authApi.logout();
    } catch (e) {
      console.error("Logout API failed, but clearing local state anyway.", e);
    } finally {
      setUser(null);
      setSession(null);
      setMemoryAuthStatus(false);
    }
  };

  const value = {
    user,
    session,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
