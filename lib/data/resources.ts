import type { Resource } from "@/lib/supabase/types";
import { createClient } from "@/lib/supabase/server";
import { getDemoResources } from "@/lib/mock-data/resources";

export async function getResources(): Promise<Resource[]> {
  try {
    const supabase = await createClient();
    if (supabase) {
      const { data, error } = await supabase.from("resources").select("*");
      if (!error && data && data.length > 0) return data as unknown as Resource[];
    }
  } catch {
    // fall back to mock
  }
  return getDemoResources();
}
