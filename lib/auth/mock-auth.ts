import type { User, UserRole } from "@/lib/supabase/types";
import { MOCK_USER_STORAGE_KEY, findMockUserByEmail } from "@/lib/mock-data/users";
import { isClient } from "@/lib/utils";

/**
 * Mock authentication for demo mode (no Supabase credentials).
 * Persists the signed-in user to localStorage so the whole app is demoable
 * with zero configuration. Real credentials switch the app to Supabase Auth.
 */

export function getMockUser(): User | null {
  if (!isClient()) return null;
  try {
    const raw = window.localStorage.getItem(MOCK_USER_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function setMockUser(user: User | null): void {
  if (!isClient()) return;
  try {
    if (user) {
      window.localStorage.setItem(MOCK_USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(MOCK_USER_STORAGE_KEY);
    }
  } catch {
    // storage unavailable (private mode etc.) — auth simply doesn't persist
  }
}

export type MockAuthResult = { ok: true; user: User };
export type MockAuthError = { ok: false; error: string };
export type MockAuthResponse = MockAuthResult | MockAuthError;

/** Signs in against the seeded demo accounts, or returns a helpful error. */
export function mockSignIn(email: string, password: string): MockAuthResponse {
  const user = findMockUserByEmail(email);
  if (!user) {
    return {
      ok: false,
      error:
        "No mock account found. Try demo@accesspath.app (student) or advisor@accesspath.app (advisor) with any password.",
    };
  }
  if (!password || password.length < 4) {
    return { ok: false, error: "Mock accounts accept any password of 4+ characters." };
  }
  setMockUser(user);
  return { ok: true, user };
}

/** Signs up a fresh mock account and signs it in immediately. */
export function mockSignUp(
  email: string,
  password: string,
  name: string,
  role: UserRole
): MockAuthResponse {
  if (!email.includes("@")) {
    return { ok: false, error: "Please enter a valid email address." };
  }
  if (password.length < 6) {
    return { ok: false, error: "Password must be at least 6 characters." };
  }
  if (!name.trim()) {
    return { ok: false, error: "Please enter your name." };
  }
  const user: User = {
    id: `user-mock-${Date.now()}`,
    role,
    name: name.trim(),
    email: email.trim(),
    created_at: new Date().toISOString(),
  };
  setMockUser(user);
  return { ok: true, user };
}

export function mockSignOut(): void {
  setMockUser(null);
}
