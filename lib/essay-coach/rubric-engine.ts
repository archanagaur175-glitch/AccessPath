import type { RubricFeedback, RubricDimension } from "@/lib/supabase/types";

/**
 * Deterministic rubric engine. Scores five dimensions on a 1–5 scale using
 * lightweight text heuristics — word count, paragraphing, sentence rhythm,
 * voice markers, and common mechanical slips. Fully offline & explainable.
 */

const IDEAL_MIN_WORDS = 350;
const IDEAL_MAX_WORDS = 700;

const GENERIC_OPENERS = [
  "i was born",
  "ever since i was",
  "from a young age",
  "in today's world",
  "i have always been",
  "life is like",
  "the dictionary defines",
  "when i was younger",
  "this is the story of",
];

function words(text: string): string[] {
  return text.trim().split(/\s+/).filter(Boolean);
}

function sentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function paragraphs(text: string): string[] {
  return text
    .split(/\n+\s*/)
    .map((p) => p.trim())
    .filter(Boolean);
}

function wordFreq(words: string[]): Map<string, number> {
  const freq = new Map<string, number>();
  for (const w of words) {
    const key = w.toLowerCase();
    freq.set(key, (freq.get(key) ?? 0) + 1);
  }
  return freq;
}

function repeatedWordDensity(words: string[]): number {
  if (words.length < 20) return 0;
  const freq = wordFreq(words);
  let repeats = 0;
  for (const [key, count] of freq) {
    if (key.length <= 2) continue;
    if (count >= 4) repeats += count - 3;
  }
  return repeats / words.length;
}

function clampScore(n: number): number {
  return Math.max(1, Math.min(5, Math.round(n)));
}

function sentenceVariety(lengths: number[]): number {
  if (lengths.length < 4) return 0;
  const mean = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  const variance =
    lengths.reduce((acc, len) => acc + (len - mean) ** 2, 0) / lengths.length;
  return Math.sqrt(variance) / (mean || 1);
}

function mechanicalIssues(text: string): string[] {
  const issues: string[] = [];
  if (/\s{2,}/.test(text)) issues.push("double spaces");
  if (/[;,](?=\S)/.test(text)) issues.push("missing space after a comma/semicolon");
  if (/(?<=[a-z])(?=[A-Z])/.test(text)) issues.push("missing space between sentences");
  if (/\b(\w+)\s+\1\b/i.test(text)) issues.push("repeated word");
  if (/[.!?](?=[a-z])/.test(text)) issues.push("missing capital after a sentence end");
  return issues;
}

export function scoreDraft(draft: string): RubricFeedback {
  const text = draft.trim();
  const wordList = words(text);
  const paraList = paragraphs(text);
  const sentList = sentences(text);
  const count = wordList.length;
  const lower = text.toLowerCase();

  const withinRange = count >= IDEAL_MIN_WORDS && count <= IDEAL_MAX_WORDS;
  const genericOpener = GENERIC_OPENERS.some((g) => lower.startsWith(g));
  const hasFirstPerson = /\b(i|me|my|mine)\b/i.test(text);
  const paragraphCount = paraList.length;
  const variety = sentenceVariety(sentList.map((s) => s.length));
  const repeatDensity = repeatedWordDensity(wordList);
  const issues = mechanicalIssues(text);

  const dims: RubricDimension[] = [];

  // Ideas & Content
  const contentScore = clampScore(
    2.4 +
      (withinRange ? 1.2 : count < 150 ? 0.2 : 0.7) +
      (count >= 60 ? 0.5 : 0) +
      (/\d|\$\d|percent|twice|three/.test(text) ? 0.5 : 0) +
      (count > 150 && count < IDEAL_MAX_WORDS * 1.6 ? 0.3 : 0)
  );
  dims.push({
    name: "Ideas & Content",
    score: contentScore,
    note:
      count < 150
        ? "Too thin for a personal statement — add a concrete scene with sensory detail."
        : withinRange
          ? "Strong word budget for a personal statement."
          : "Over the typical 650-word target — tighten scenes, keep what moves the story.",
  });

  // Structure
  const structureScore = clampScore(
    4 -
      (paragraphCount < 2
        ? 2.4
        : paragraphCount === 1
          ? 1.8
          : paragraphCount > 6
            ? 0.8
            : 0) +
      (hasFirstPerson ? 0.4 : 0) -
      (genericOpener ? 1.6 : 0)
  );
  dims.push({
    name: "Structure",
    score: structureScore,
    note:
      paragraphCount < 2
        ? "One block of text — split into 3–5 paragraphs with one idea each."
        : genericOpener
          ? "Hedge the generic opener; start mid-scene instead."
          : "Good paragraph flow; keep each beat moving the story.",
  });

  // Voice
  const voiceScore = clampScore(
    2 +
      (hasFirstPerson ? 1.6 : 0) +
      (/-/.test(text) ? 0 : 0.7) +
      (variety >= 0.3 ? 0.8 : 0.2)
  );
  dims.push({
    name: "Voice & Tone",
    score: voiceScore,
    note: hasFirstPerson
      ? "First-person voice present — keep specific verbs and avoid telling instead of showing."
      : "No first-person perspective detected — this is a personal statement, say 'I'.",
  });

  // Craft
  const craftScore = clampScore(
    5 - repeatDensity * 30 - (variety < 0.22 ? 1.4 : 0) + (variety >= 0.4 ? 0.4 : 0)
  );
  dims.push({
    name: "Craft & Language",
    score: craftScore,
    note:
      variety < 0.22
        ? "Sentences share the same rhythm — mix short punches with longer flowing lines."
        : repeatDensity > 0.015
          ? "Some words repeat often — the thesaurus is not your friend, but synonyms within range are."
          : "Sentence rhythm is varied; trim any filler adverbs.",
  });

  // Mechanics
  const mechanicsScore = clampScore(5 - issues.length * 1.4);
  dims.push({
    name: "Mechanics",
    score: mechanicsScore,
    note:
      issues.length === 0
        ? "No mechanical issues detected."
        : `Fix: ${issues.join(", ")}.`,
  });

  const total = dims.reduce((acc, d) => acc + d.score, 0);
  const average = total / dims.length;

  const redFlags: string[] = [];
  if (count < 150) redFlags.push(`Only ${count} words — far under the 350–650 target.`);
  if (count > 1200)
    redFlags.push(`${count} words is very long for a personal statement.`);
  if (paragraphCount < 2) redFlags.push("Single unbroken paragraph hurts scannability.");
  if (genericOpener) redFlags.push("Starts with an overused opener.");
  if (!hasFirstPerson) redFlags.push("Missing first-person voice.");
  if (issues.length > 0) redFlags.push("Mechanical slips present.");
  if (repeatDensity > 0.025) redFlags.push("Repetitive vocabulary dilutes the writing.");

  const overall =
    average >= 4.5
      ? "Near-polished. Read it aloud once, then cut your favorite adjective."
      : average >= 3.5
        ? "Solid draft. Focus on the two lowest-scoring dimensions before the next revision."
        : average >= 2.5
          ? "Workable skeleton — pick one scene and make it fully concrete before revising."
          : "Early stage. Generate an outline, write one vivid scene, then rescan.";

  return { dimensions: dims, redFlags, overall };
}
