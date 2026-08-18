import type { StudentProfile, User } from "@/lib/supabase/types";
import { createClient as createServerSupabase } from "@/lib/supabase/server";
import { getRosterStudents, type RosterStudent } from "@/lib/mock-data/students";
import {
  getMockStudentProfile,
  setMockStudentProfile,
} from "@/lib/mock-data/profile-storage";

/** Fetches a student's profile. Returns null when there is no profile yet. */
export async function getStudentProfile(userId: string): Promise<StudentProfile | null> {
  try {
    const supabase = await createServerSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from("student_profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();
      if (error) throw error;
      if (data) return normalizeProfile(data);
    }
  } catch {
    // fall back to mock below
  }
  return getMockStudentProfile(userId);
}

/** Persists a student's profile. Returns the saved profile. */
export async function saveStudentProfile(
  profile: StudentProfile
): Promise<StudentProfile> {
  const toSave: StudentProfile = {
    ...profile,
    updated_at: new Date().toISOString(),
  };
  try {
    const supabase = await createServerSupabase();
    if (supabase) {
      const { error } = await supabase.from("student_profiles").upsert(toSave);
      if (error) throw error;
      return toSave;
    }
  } catch {
    // fall back to mock below
  }
  setMockStudentProfile(toSave);
  return toSave;
}

/** Returns the advisor's read-only roster of connected students. */
export async function getConnectedStudents(): Promise<RosterStudent[]> {
  try {
    const supabase = await createServerSupabase();
    if (supabase) {
      const { data: profiles, error } = await supabase
        .from("student_profiles")
        .select("*, users(*)");
      if (error) throw error;
      if (profiles && profiles.length > 0) {
        return profiles.map((row) => ({
          user: row.users as User,
          profile: normalizeProfile(row),
          joined_at: (row.created_at as string) ?? "",
        }));
      }
    }
  } catch {
    // fall back to mock below
  }
  return getRosterStudents();
}

function normalizeProfile(raw: Record<string, unknown>): StudentProfile {
  return {
    id: (raw.id as string) ?? "",
    user_id: (raw.user_id as string) ?? "",
    gpa: Number(raw.gpa ?? 0),
    test_scores: Array.isArray(raw.test_scores)
      ? (raw.test_scores as StudentProfile["test_scores"])
      : [],
    coursework: Array.isArray(raw.coursework)
      ? (raw.coursework as StudentProfile["coursework"])
      : [],
    extracurriculars: Array.isArray(raw.extracurriculars)
      ? (raw.extracurriculars as StudentProfile["extracurriculars"])
      : [],
    interests: Array.isArray(raw.interests) ? (raw.interests as string[]) : [],
    intended_majors: Array.isArray(raw.intended_majors)
      ? (raw.intended_majors as string[])
      : [],
    budget_range: {
      min: Number((raw.budget_range as { min?: number })?.min ?? 0),
      max: Number((raw.budget_range as { max?: number })?.max ?? 0),
    },
    needs_financial_aid: Boolean(raw.needs_financial_aid),
    class_rank: (raw.class_rank as string | undefined) ?? undefined,
    created_at: (raw.created_at as string) ?? new Date().toISOString(),
    updated_at: (raw.updated_at as string) ?? new Date().toISOString(),
  };
}
