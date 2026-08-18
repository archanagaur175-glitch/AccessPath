import type { College } from "@/lib/supabase/types";
import { createClient as createServerSupabase } from "@/lib/supabase/server";
import { mockColleges } from "@/lib/mock-data/colleges";

export async function getColleges(): Promise<College[]> {
  try {
    const supabase = await createServerSupabase();
    if (supabase) {
      const { data, error } = await supabase.from("colleges").select("*").order("name");
      if (error) throw error;
      if (data && data.length > 0) return data as unknown as College[];
    }
  } catch {
    // fall back to mock
  }
  return mockColleges;
}

export async function getCollegeById(id: string): Promise<College | null> {
  const college = mockColleges.find((c) => c.id === id);
  if (!college) return null;
  return college;
}
