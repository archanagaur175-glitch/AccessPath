import type { Advisor, AdvisorRequest } from "@/lib/supabase/types";
import { createClient as createBrowserSupabase } from "@/lib/supabase/client";
import { getDemoAdvisors, getDemoAdvisorRequests } from "@/lib/mock-data/advisors";
import { isClient } from "@/lib/utils";

/**
 * Client-side advisor directory + request flow. Advisors seed from mock data;
 * requests persist to localStorage in mock mode or Supabase when configured.
 */

const REQUESTS_STORAGE_KEY = "accesspath:advisor-requests";

function requestsKey(userId: string): string {
  return `${REQUESTS_STORAGE_KEY}:${userId}`;
}

export async function getClientAdvisors(): Promise<Advisor[]> {
  try {
    const supabase = createBrowserSupabase();
    if (supabase) {
      const { data, error } = await supabase.from("advisors").select("*");
      if (!error && data && data.length > 0) return data as unknown as Advisor[];
    }
  } catch {
    // fall back to mock
  }
  return getDemoAdvisors();
}

export async function getClientAdvisorRequests(
  userId: string
): Promise<AdvisorRequest[]> {
  if (!userId) return [];
  try {
    const supabase = createBrowserSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from("advisor_requests")
        .select("*")
        .eq("student_id", userId);
      if (!error && data && data.length > 0) return data as unknown as AdvisorRequest[];
    }
  } catch {
    // fall back to mock
  }
  if (isClient()) {
    try {
      const raw = window.localStorage.getItem(requestsKey(userId));
      if (raw) return JSON.parse(raw) as AdvisorRequest[];
    } catch {
      // fall through to seed
    }
  }
  return getDemoAdvisorRequests(userId);
}

export async function submitAdvisorRequest(
  userId: string,
  advisorId: string,
  message: string
): Promise<AdvisorRequest[]> {
  const next: AdvisorRequest = {
    id: `req-${Date.now()}`,
    student_id: userId,
    advisor_id: advisorId,
    message: message.trim() || undefined,
    status: "pending",
    created_at: new Date().toISOString(),
  };
  const current = await getClientAdvisorRequests(userId);
  const updated = [next, ...current.filter((r) => r.advisor_id !== advisorId)];
  try {
    const supabase = createBrowserSupabase();
    if (supabase) {
      const { error } = await supabase.from("advisor_requests").upsert(updated);
      if (error) throw error;
      return updated;
    }
  } catch {
    // fall back to mock
  }
  if (isClient()) {
    try {
      window.localStorage.setItem(requestsKey(userId), JSON.stringify(updated));
    } catch {
      // storage unavailable — request won't persist this session
    }
  }
  return updated;
}
