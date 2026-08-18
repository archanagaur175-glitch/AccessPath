import type { Advisor } from "@/lib/supabase/types";
import { createClient } from "@/lib/supabase/server";
import { getDemoAdvisors } from "@/lib/mock-data/advisors";

export async function getAdvisors(): Promise<Advisor[]> {
  try {
    const supabase = await createClient();
    if (supabase) {
      const { data, error } = await supabase.from("advisors").select("*");
      if (!error && data && data.length > 0) return data as unknown as Advisor[];
    }
  } catch {
    // fall back to mock
  }
  return getDemoAdvisors();
}
