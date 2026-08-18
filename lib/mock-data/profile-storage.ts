import type { StudentProfile } from "@/lib/supabase/types";
import { isClient } from "@/lib/utils";
import { demoStudentProfile } from "@/lib/mock-data/students";

/**
 * localStorage-backed mock profile store. Kept free of any server-only imports
 * so both server components and client components can use it safely.
 */

export const PROFILE_STORAGE_KEY = "accesspath:profile";

export function profileStorageKey(userId: string): string {
  return `${PROFILE_STORAGE_KEY}:${userId}`;
}

export function getMockStudentProfile(userId: string): StudentProfile | null {
  if (!isClient()) return null;
  try {
    const raw = window.localStorage.getItem(profileStorageKey(userId));
    if (raw) return JSON.parse(raw) as StudentProfile;
  } catch {
    // fall through to the seeded profile
  }
  if (userId === "user-demo-student") {
    return demoStudentProfile;
  }
  return null;
}

export function setMockStudentProfile(profile: StudentProfile): void {
  if (!isClient()) return;
  try {
    window.localStorage.setItem(
      profileStorageKey(profile.user_id),
      JSON.stringify(profile)
    );
  } catch {
    // storage unavailable — changes just won't persist in this session
  }
}

export function hasPersistedMockProfile(userId: string): boolean {
  if (!isClient()) return false;
  try {
    return Boolean(window.localStorage.getItem(profileStorageKey(userId)));
  } catch {
    return false;
  }
}
