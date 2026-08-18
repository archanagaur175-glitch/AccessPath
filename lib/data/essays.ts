import type { Essay } from "@/lib/supabase/types";
import { createClient } from "@/lib/supabase/server";
import { getDemoEssays, getDemoEssayById } from "@/lib/mock-data/essays";

/**
 * Server-side essay accessor. Returns Supabase rows when configured and
 * falls back to the seeded demo essays in mock mode.
 */

export async function getEssaysForStudent(studentId: string): Promise<Essay[]> {
  try {
    const supabase = await createClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("essays")
        .select("*")
        .eq("student_id", studentId)
        .order("updated_at", { ascending: false });
      if (!error && data && data.length > 0) {
        return data as unknown as Essay[];
      }
    }
  } catch {
    // fall back to mock
  }
  if (studentId === "user-demo-student") {
    return getDemoEssays();
  }
  return [];
}

export async function getEssayById(essayId: string): Promise<Essay | null> {
  try {
    const supabase = await createClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("essays")
        .select("*")
        .eq("id", essayId)
        .maybeSingle();
      if (!error && data) return data as unknown as Essay;
    }
  } catch {
    // fall back to mock
  }
  return getDemoEssayById(essayId) ?? null;
}
