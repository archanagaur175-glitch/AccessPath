import type { Resource } from "@/lib/supabase/types";
import { createClient as createBrowserSupabase } from "@/lib/supabase/client";
import { getDemoResources } from "@/lib/mock-data/resources";

export async function getClientResources(): Promise<Resource[]> {
  try {
    const supabase = createBrowserSupabase();
    if (supabase) {
      const { data, error } = await supabase.from("resources").select("*");
      if (!error && data && data.length > 0) return data as unknown as Resource[];
    }
  } catch {
    // fall back to mock
  }
  return getDemoResources();
}
