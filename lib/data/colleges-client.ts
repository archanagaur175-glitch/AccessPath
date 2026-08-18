import type { College } from "@/lib/supabase/types";
import { createClient as createBrowserSupabase } from "@/lib/supabase/client";
import { mockColleges } from "@/lib/mock-data/colleges";

/** Client-safe college accessor: browser Supabase when configured, else mock. */
export async function getClientColleges(): Promise<College[]> {
  try {
    const supabase = createBrowserSupabase();
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
