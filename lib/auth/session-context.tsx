"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { User, UserRole } from "@/lib/supabase/types";
import { createClient as createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  getMockUser,
  mockSignIn,
  mockSignOut,
  mockSignUp,
  type MockAuthResponse,
} from "@/lib/auth/mock-auth";

export type SessionStatus = "loading" | "authenticated" | "unauthenticated";

export interface AuthResult {
  ok: boolean;
  error?: string;
}

interface SessionContextValue {
  user: User | null;
  status: SessionStatus;
  /** True when running against Supabase with live credentials. */
  isLive: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (
    email: string,
    password: string,
    name: string,
    role: UserRole
  ) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
}

const SessionContext = createContext<SessionContextValue | null>(null);

const isSupabaseConfigured = () =>
  typeof process !== "undefined" &&
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<SessionStatus>("loading");
  const isLive = isSupabaseConfigured();

  const refresh = useCallback(async () => {
    if (isSupabaseConfigured()) {
      const supabase = createSupabaseBrowserClient();
      if (!supabase) {
        setUser(null);
        setStatus("unauthenticated");
        return;
      }
      const {
        data: { user: sbUser },
      } = await supabase.auth.getUser();
      if (sbUser) {
        const meta = sbUser.user_metadata as Record<string, unknown> | undefined;
        setUser({
          id: sbUser.id,
          email: sbUser.email ?? "",
          name: (meta?.name as string) ?? sbUser.email ?? "Student",
          role: ((meta?.role as UserRole) ?? "student") as UserRole,
          created_at: sbUser.created_at,
        });
        setStatus("authenticated");
      } else {
        setUser(null);
        setStatus("unauthenticated");
      }
      return;
    }

    const mock = getMockUser();
    setUser(mock);
    setStatus(mock ? "authenticated" : "unauthenticated");
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      void refresh();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [refresh]);

  // Keep mock mode in sync across tabs.
  useEffect(() => {
    if (isSupabaseConfigured()) return;
    const onStorage = (event: StorageEvent) => {
      if (event.key === "accesspath:mock-user") {
        void refresh();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [refresh]);

  const signIn = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      if (isSupabaseConfigured()) {
        const supabase = createSupabaseBrowserClient();
        if (!supabase) return { ok: false, error: "Supabase client unavailable." };
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return { ok: false, error: error.message };
        await refresh();
        return { ok: true };
      }

      const result: MockAuthResponse = mockSignIn(email, password);
      if (!result.ok) return { ok: false, error: result.error };
      setUser(result.user);
      setStatus("authenticated");
      return { ok: true };
    },
    [refresh]
  );

  const signUp = useCallback(
    async (
      email: string,
      password: string,
      name: string,
      role: UserRole
    ): Promise<AuthResult> => {
      if (isSupabaseConfigured()) {
        const supabase = createSupabaseBrowserClient();
        if (!supabase) return { ok: false, error: "Supabase client unavailable." };
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name, role },
            emailRedirectTo: `${window.location.origin}/login`,
          },
        });
        if (error) return { ok: false, error: error.message };
        await refresh();
        return { ok: true };
      }

      const result: MockAuthResponse = mockSignUp(email, password, name, role);
      if (!result.ok) return { ok: false, error: result.error };
      setUser(result.user);
      setStatus("authenticated");
      return { ok: true };
    },
    [refresh]
  );

  const signOut = useCallback(async () => {
    if (isSupabaseConfigured()) {
      const supabase = createSupabaseBrowserClient();
      await supabase?.auth.signOut();
    } else {
      mockSignOut();
    }
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  const value = useMemo(
    () => ({
      user,
      status,
      isLive,
      signIn,
      signUp,
      signOut,
      refresh,
    }),
    [user, status, isLive, signIn, signUp, signOut, refresh]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return ctx;
}
