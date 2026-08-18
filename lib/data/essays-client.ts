import type { Essay } from "@/lib/supabase/types";
import { createClient as createBrowserSupabase } from "@/lib/supabase/client";
import { getDemoEssays } from "@/lib/mock-data/essays";
import { isClient } from "@/lib/utils";

/**
 * Client-side essay accessor for the Essay Coach editor. Seeds from mock data
 * and persists edits to localStorage in mock mode or Supabase when configured.
 */

const ESSAYS_STORAGE_KEY = "accesspath:essays";

function storageKey(userId: string): string {
  return `${ESSAYS_STORAGE_KEY}:${userId}`;
}

export async function getClientEssays(userId: string): Promise<Essay[]> {
  if (!userId) return [];
  try {
    const supabase = createBrowserSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from("essays")
        .select("*")
        .eq("student_id", userId)
        .order("updated_at", { ascending: false });
      if (!error && data && data.length > 0) return data as unknown as Essay[];
    }
  } catch {
    // fall back to mock
  }
  if (isClient()) {
    try {
      const raw = window.localStorage.getItem(storageKey(userId));
      if (raw) return JSON.parse(raw) as Essay[];
    } catch {
      // fall through to seed
    }
  }
  if (userId === "user-demo-student") {
    return getDemoEssays();
  }
  return [];
}

export async function persistClientEssays(
  userId: string,
  essays: Essay[]
): Promise<Essay[]> {
  const toSave = essays.map((e) => ({ ...e, updated_at: new Date().toISOString() }));
  try {
    const supabase = createBrowserSupabase();
    if (supabase) {
      const { error } = await supabase.from("essays").upsert(toSave);
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
      // storage unavailable — edits won't persist this session
    }
  }
  return toSave;
}

export async function updateClientEssay(userId: string, essay: Essay): Promise<Essay[]> {
  const current = await getClientEssays(userId);
  const idx = current.findIndex((e) => e.id === essay.id);
  const next = [...current];
  const stamped = { ...essay, updated_at: new Date().toISOString() };
  if (idx >= 0) {
    next[idx] = stamped;
  } else {
    next.push(stamped);
  }
  return persistClientEssays(userId, next);
}

export function wordCount(draft: string): number {
  return draft.trim().split(/\s+/).filter(Boolean).length;
}
