"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileText, History, PenLine, Plus, Sparkles } from "lucide-react";
import type { Essay } from "@/lib/supabase/types";
import { useSession } from "@/lib/auth/session-context";
import { getClientEssays, persistClientEssays } from "@/lib/data/essays-client";
import { analyzePrompt, typeBadgeTone } from "@/lib/essay-coach/prompt-analyzer";
import { wordCount } from "@/lib/data/essays-client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageSkeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `essay-${Date.now()}`;
}

function formatRelative(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function EssayListView() {
  const { user, status } = useSession();
  const router = useRouter();
  const [essays, setEssays] = useState<Essay[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newPrompt, setNewPrompt] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!user?.id) return;
      setLoading(true);
      try {
        const list = await getClientEssays(user.id);
        if (!cancelled) setEssays(list);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const createEssay = async () => {
    if (!user) return;
    const essay: Essay = {
      id: newId(),
      student_id: user.id,
      title: newTitle.trim() || "Untitled essay",
      prompt_text: newPrompt.trim(),
      draft_text: "",
      versions: [
        {
          id: newId(),
          version: 1,
          draft_text: "",
          updated_at: new Date().toISOString(),
        },
      ],
      updated_at: new Date().toISOString(),
    };
    await persistClientEssays(user.id, [...essays, essay]);
    setCreateOpen(false);
    setNewTitle("");
    setNewPrompt("");
    router.push(`/essays/${essay.id}`);
  };

  if (status === "loading" || loading) return <PageSkeleton />;

  if (status === "unauthenticated" || !user || user.role === "advisor") {
    return (
      <Card variant="glass" className="p-10 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-300">
          <PenLine className="h-7 w-7" aria-hidden />
        </div>
        <h2 className="mt-5 font-display text-xl font-bold">
          {user?.role === "advisor"
            ? "The Essay Coach lives in student workspaces"
            : "Sign in to open your essays"}
        </h2>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          {user?.role === "advisor"
            ? "Explore what the coach produces using the demo student's essays."
            : "Your prompts, drafts, and rubric feedback are stored with your account."}
        </p>
      </Card>
    );
  }

  return (
    <div className="animate-fade-up space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Essay Coach</h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-300">
            Analyze your prompt, generate an outline, and score your draft against the
            rubric.
          </p>
        </div>
        <Button variant="glass" className="sm:w-auto" onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" aria-hidden />
          New essay
        </Button>
      </div>

      {essays.length === 0 ? (
        <Card variant="glass" className="p-10 text-center">
          <Sparkles className="mx-auto h-8 w-8 text-brand-500" aria-hidden />
          <h2 className="mt-4 font-display text-lg font-bold">No essays yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-zinc-500 dark:text-zinc-400">
            Paste your first prompt and use the Coach to brainstorm, outline, and revise.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {essays.map((essay) => {
            const analysis = analyzePrompt(essay.prompt_text || "Tell us your story.");
            return (
              <Link
                key={essay.id}
                href={`/essays/${essay.id}`}
                className="glass group flex flex-col gap-3 rounded-3xl p-5 transition-all duration-300 hover:border-brand-400/60 hover:shadow-glass"
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-display text-lg font-bold leading-snug text-zinc-900 group-hover:text-brand-700 dark:text-white dark:group-hover:text-brand-300">
                    {essay.title}
                  </h2>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold",
                      typeBadgeTone(analysis.type)
                    )}
                  >
                    {analysis.typeLabel}
                  </span>
                </div>

                <p className="line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">
                  {essay.prompt_text || "No prompt attached"}
                </p>

                <div className="mt-auto flex items-center justify-between border-t border-zinc-200/60 pt-3 text-xs text-zinc-500 dark:border-white/10 dark:text-zinc-400">
                  <span className="inline-flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5" aria-hidden />
                    {wordCount(essay.draft_text)} words
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <History className="h-3.5 w-3.5" aria-hidden />
                    {essay.versions.length} version
                    {essay.versions.length === 1 ? "" : "s"}
                  </span>
                  <span>{formatRelative(essay.updated_at)}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="New essay"
        description="Paste an application prompt and the Coach will analyze it on the next screen."
        className="overflow-visible"
      >
        <div className="mt-5 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="new-title">Working title</Label>
            <Input
              id="new-title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. The Switchboard"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="new-prompt">Prompt</Label>
            <Textarea
              id="new-prompt"
              rows={4}
              value={newPrompt}
              onChange={(e) => setNewPrompt(e.target.value)}
              placeholder="Paste the prompt the college asked you to answer…"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => void createEssay()}>Create essay</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
