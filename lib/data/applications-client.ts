import type { Application } from "@/lib/supabase/types";
import { createClient as createBrowserSupabase } from "@/lib/supabase/client";
import { getDemoApplications } from "@/lib/mock-data/applications";
import { isClient } from "@/lib/utils";

/**
 * Application tracker data layer. Seeded from mock data, persisted to
 * localStorage in mock mode, and upserted to Supabase when configured.
 */

const APPLICATIONS_STORAGE_KEY = "accesspath:applications";

function storageKey(userId: string): string {
  return `${APPLICATIONS_STORAGE_KEY}:${userId}`;
}

export async function getClientApplications(userId: string): Promise<Application[]> {
  if (!userId) return [];
  try {
    const supabase = createBrowserSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from("applications")
        .select("*")
        .eq("student_id", userId)
        .order("deadline", { ascending: true });
      if (error) throw error;
      if (data && data.length > 0) return data as unknown as Application[];
    }
  } catch {
    // fall back to mock
  }
  if (isClient()) {
    try {
      const raw = window.localStorage.getItem(storageKey(userId));
      if (raw) return JSON.parse(raw) as Application[];
    } catch {
      // fall through to seed
    }
  }
  if (userId === "user-demo-student") {
    return getDemoApplications();
  }
  return [];
}

export async function persistClientApplications(
  userId: string,
  applications: Application[]
): Promise<Application[]> {
  const toSave = applications.map((app) => ({
    ...app,
    updated_at: new Date().toISOString(),
  }));
  try {
    const supabase = createBrowserSupabase();
    if (supabase) {
      const { error } = await supabase.from("applications").upsert(toSave);
      if (error) throw error;
      return toSave;
    }
  } catch {
    // fall back to mock
  }
  if (isClient()) {
    try {
      window.localStorage.setItem(storageKey(userId), JSON.stringify(toSave));
    } catch {
      // storage unavailable — changes won't persist this session
    }
  }
  return toSave;
}

export async function updateClientApplication(
  userId: string,
  application: Application
): Promise<Application[]> {
  const current = await getClientApplications(userId);
  const idx = current.findIndex((a) => a.id === application.id);
  const next = [...current];
  if (idx >= 0) {
    next[idx] = { ...application, updated_at: new Date().toISOString() };
  } else {
    next.push(application);
  }
  return persistClientApplications(userId, next);
}

export function daysUntil(date: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}
