"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  FilePlus2,
  Lightbulb,
  ListChecks,
  RotateCcw,
  Save,
  Sparkles,
  Target,
} from "lucide-react";
import type { Essay, EssayVersion } from "@/lib/supabase/types";
import { useSession } from "@/lib/auth/session-context";
import { updateClientEssay, wordCount } from "@/lib/data/essays-client";
import { analyzePrompt, typeBadgeTone } from "@/lib/essay-coach/prompt-analyzer";
import { generateOutline } from "@/lib/essay-coach/outline-generator";
import { scoreDraft } from "@/lib/essay-coach/rubric-engine";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const TARGET = 650;

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `id-${Date.now()}`;
}

function formatDate(date: string): string {
  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

const BRAINSTORM_BANK = [
  "What is one object you could lose and would immediately rebuild?",
  "Describe a small ritual from your life that outsiders would find strange.",
  "Who corrected you in a way that changed something you do?",
  "What were you doing when you felt most like yourself this year?",
  "Name a question you'd ask a stranger at a bus stop — then answer it.",
  "What did you fix, break, or build with your own hands recently?",
];

export function EssayDetail({ initialEssay }: { initialEssay: Essay }) {
  const { user } = useSession();
  const [draft, setDraft] = useState(initialEssay.draft_text);
  const [essay, setEssay] = useState<Essay>(initialEssay);
  const [saved, setSaved] = useState(false);
  const [toggled, setToggled] = useState<Set<number>>(new Set());
  const [selectedVersion, setSelectedVersion] = useState<EssayVersion | null>(null);

  const analysis = useMemo(
    () => analyzePrompt(essay.prompt_text || "Tell us your story."),
    [essay.prompt_text]
  );
  const outline = useMemo(
    () => generateOutline(analysis.type, draft),
    [analysis.type, draft]
  );
  const feedback = useMemo(() => scoreDraft(draft), [draft]);
  const count = useMemo(() => wordCount(draft), [draft]);

  const persist = useCallback(
    async (next: Essay) => {
      if (!user) return;
      try {
        const list = await updateClientEssay(user.id, next);
        const savedEssay = list.find((e) => e.id === next.id);
        if (savedEssay) setEssay(savedEssay);
        setSaved(true);
      } catch {
        setSaved(false);
      }
    },
    [user]
  );

  const handleSave = () => {
    setSaved(false);
    void persist({ ...essay, draft_text: draft });
  };

  const handleNewVersion = () => {
    const maxVersion = essay.versions.reduce((m, v) => Math.max(m, v.version), 0);
    const version: EssayVersion = {
      id: newId(),
      version: maxVersion + 1,
      draft_text: draft,
      updated_at: new Date().toISOString(),
    };
    setSaved(false);
    void persist({ ...essay, draft_text: draft, versions: [...essay.versions, version] });
  };

  const restoreVersion = (version: EssayVersion) => {
    setDraft(version.draft_text);
    setSaved(false);
    setSelectedVersion(version);
  };

  const toggleAddress = (index: number) => {
    setToggled((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const targetPct = Math.min(100, Math.round((count / TARGET) * 100));
  const targetTone =
    count < 350 ? "bg-reach-500" : count <= TARGET ? "bg-target-500" : "bg-safety-500";

  return (
    <div className="animate-fade-up space-y-6">
      <div>
        <Link
          href="/essays"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 transition-colors hover:text-brand-600 dark:text-zinc-400 dark:hover:text-brand-300"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          All essays
        </Link>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl font-bold tracking-tight">
              {essay.title}
            </h1>
            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-[10px] font-semibold",
                typeBadgeTone(analysis.type)
              )}
            >
              {analysis.typeLabel}
            </span>
          </div>
          <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500">
            {saved ? (
              <span className="inline-flex items-center gap-1 text-safety-600 dark:text-safety-300">
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden /> Saved
              </span>
            ) : (
              "Unsaved changes"
            )}
          </span>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Card className="p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Save
                  className="h-4 w-4 text-brand-600 dark:text-brand-300"
                  aria-hidden
                />
                <h2 className="font-display text-lg font-bold">Draft editor</h2>
              </div>
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                {count} / {TARGET} words
              </span>
            </div>

            <div
              className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-zinc-200/70 dark:bg-white/10"
              aria-hidden
            >
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  targetTone
                )}
                style={{ width: `${targetPct}%` }}
              />
            </div>
            <p className="mt-1.5 text-xs text-zinc-400 dark:text-zinc-500">
              Personal statements typically land between 350 and 650 words.
            </p>

            <Textarea
              className="mt-3 min-h-[340px] leading-relaxed"
              value={draft}
              onChange={(e) => {
                setDraft(e.target.value);
                setSaved(false);
              }}
              placeholder="Start writing… the rubric on the right rescans as you type."
              spellCheck
            />

            <div className="mt-3 flex flex-wrap gap-2">
              <Button onClick={handleSave} disabled={!draft.trim()}>
                <Save className="h-4 w-4" aria-hidden />
                Save draft
              </Button>
              <Button variant="glass" onClick={handleNewVersion} disabled={!draft.trim()}>
                <FilePlus2 className="h-4 w-4" aria-hidden />
                Save as new version
              </Button>
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="p-5">
            <div className="flex items-center gap-2">
              <Target
                className="h-4 w-4 text-brand-600 dark:text-brand-300"
                aria-hidden
              />
              <h2 className="font-display text-lg font-bold">Rubric</h2>
            </div>
            <div className="mt-4 space-y-4">
              {feedback.dimensions.map((dim) => (
                <div key={dim.name}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-zinc-700 dark:text-zinc-200">
                      {dim.name}
                    </span>
                    <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
                      {dim.score}/5
                    </span>
                  </div>
                  <div
                    className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-zinc-200/70 dark:bg-white/10"
                    aria-hidden
                  >
                    <div
                      className={cn(
                        "h-full rounded-full",
                        dim.score >= 4
                          ? "bg-safety-500"
                          : dim.score >= 3
                            ? "bg-target-500"
                            : "bg-reach-500"
                      )}
                      style={{ width: `${(dim.score / 5) * 100}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                    {dim.note}
                  </p>
                </div>
              ))}
            </div>

            {feedback.redFlags.length > 0 ? (
              <div className="mt-4 rounded-2xl border border-reach-500/30 bg-reach-500/10 p-3.5">
                <p className="text-xs font-bold uppercase tracking-wide text-reach-700 dark:text-reach-300">
                  Red flags
                </p>
                <ul className="mt-1.5 list-disc space-y-1 pl-4 text-xs text-zinc-600 dark:text-zinc-300">
                  {feedback.redFlags.map((flag) => (
                    <li key={flag}>{flag}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="mt-4 rounded-2xl bg-brand-500/10 p-3.5">
              <p className="text-xs font-bold uppercase tracking-wide text-brand-700 dark:text-brand-300">
                Coach says
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-700 dark:text-zinc-200">
                {feedback.overall}
              </p>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-2">
              <RotateCcw
                className="h-4 w-4 text-brand-600 dark:text-brand-300"
                aria-hidden
              />
              <h2 className="font-display text-lg font-bold">Version history</h2>
            </div>
            <ul className="mt-4 space-y-2">
              {[...essay.versions].reverse().map((version) => (
                <li key={version.id}>
                  <button
                    type="button"
                    onClick={() => restoreVersion(version)}
                    onMouseEnter={() => setSelectedVersion(version)}
                    className={cn(
                      "w-full rounded-2xl border px-3.5 py-2.5 text-left transition-all",
                      selectedVersion?.id === version.id
                        ? "border-brand-400 bg-brand-500/10"
                        : "border-zinc-200 bg-white/60 hover:border-brand-400/60 dark:border-white/10 dark:bg-white/5"
                    )}
                  >
                    <span className="block text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                      v{version.version}
                      <span className="ml-2 text-xs font-normal text-zinc-400">
                        {formatDate(version.updated_at)}
                      </span>
                    </span>
                    {version.summary ? (
                      <span className="mt-0.5 block text-xs text-zinc-500 dark:text-zinc-400">
                        {version.summary}
                      </span>
                    ) : null}
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-zinc-400 dark:text-zinc-500">
              Click a version to restore its text into the editor.
            </p>
          </Card>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="p-5">
          <div className="flex items-center gap-2">
            <Sparkles
              className="h-4 w-4 text-brand-600 dark:text-brand-300"
              aria-hidden
            />
            <h2 className="font-display text-lg font-bold">Prompt analysis</h2>
          </div>
          <p className="mt-3 rounded-2xl border border-zinc-200 bg-white/60 p-3.5 text-sm italic leading-relaxed text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
            {essay.prompt_text ||
              "No prompt attached — the Coach worked from a generic personal prompt."}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
            {analysis.audience}
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">
                Key questions
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-zinc-600 dark:text-zinc-300">
                {analysis.keyQuestions.map((q) => (
                  <li key={q}>{q}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">
                Must address
              </p>
              <ul className="mt-2 space-y-1">
                {analysis.mustAddress.map((item, index) => (
                  <li key={item}>
                    <button
                      type="button"
                      onClick={() => toggleAddress(index)}
                      className={cn(
                        "flex w-full items-start gap-2 text-left text-sm transition-colors",
                        toggled.has(index)
                          ? "text-zinc-400 line-through dark:text-zinc-500"
                          : "text-zinc-600 hover:text-brand-600 dark:text-zinc-300 dark:hover:text-brand-300"
                      )}
                    >
                      <span
                        className={cn(
                          "mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                          toggled.has(index)
                            ? "border-safety-500 bg-safety-500 text-white"
                            : "border-zinc-300 dark:border-zinc-600"
                        )}
                        aria-hidden
                      >
                        {toggled.has(index) ? <CheckCircle2 className="h-3 w-3" /> : null}
                      </span>
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2">
            <ListChecks
              className="h-4 w-4 text-brand-600 dark:text-brand-300"
              aria-hidden
            />
            <h2 className="font-display text-lg font-bold">Outline & brainstorm</h2>
          </div>
          <p className="mt-3 rounded-xl bg-brand-500/10 px-3.5 py-2.5 text-sm font-medium text-brand-700 dark:text-brand-300">
            Hook — {outline.hook}
          </p>
          <ol className="mt-4 space-y-3">
            {outline.sections.map((section) => (
              <li
                key={section.heading}
                className="rounded-2xl border border-zinc-200 p-3.5 dark:border-white/10"
              >
                <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100">
                  {section.heading}
                </p>
                <ul className="mt-1.5 list-disc space-y-1 pl-4 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                  {section.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
          <p className="mt-3 flex items-start gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
            <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
            {outline.conclusionTip}
          </p>
          <div className="mt-4 border-t border-zinc-200 pt-3 dark:border-white/10">
            <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">
              Brainstorm prompts
            </p>
            <ul className="mt-2 space-y-1.5">
              {BRAINSTORM_BANK.slice(0, 4).map((b) => (
                <li key={b} className="text-sm text-zinc-600 dark:text-zinc-300">
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}
