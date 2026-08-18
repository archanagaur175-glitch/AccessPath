import type { StudentProfile } from "@/lib/supabase/types";
import { createClient as createBrowserSupabase } from "@/lib/supabase/client";
import {
  getMockStudentProfile,
  setMockStudentProfile,
  hasPersistedMockProfile,
} from "@/lib/mock-data/profile-storage";

/**
 * Client-safe profile accessors for interactive components.
 * Tries the browser Supabase client first, then falls back to the localStorage
 * mock store (seeded from lib/mock-data/students.ts).
 */

export async function getClientStudentProfile(
  userId: string
): Promise<StudentProfile | null> {
  try {
    const supabase = createBrowserSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from("student_profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();
      if (error) throw error;
      if (data) return data as unknown as StudentProfile;
    }
  } catch {
    // fall back to mock
  }
  return getMockStudentProfile(userId);
}

export async function saveClientStudentProfile(
  profile: StudentProfile
): Promise<StudentProfile> {
  const toSave: StudentProfile = {
    ...profile,
    updated_at: new Date().toISOString(),
  };
  try {
    const supabase = createBrowserSupabase();
    if (supabase) {
      const { error } = await supabase.from("student_profiles").upsert(toSave);
      if (error) throw error;
      return toSave;
    }
  } catch {
    // fall back to mock
  }
  setMockStudentProfile(toSave);
  return toSave;
}

export { hasPersistedMockProfile };
