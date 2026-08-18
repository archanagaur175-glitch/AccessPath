/**
 * Deterministic, offline prompt analyzer. No LLM required: it classifies the
 * prompt by keyword signals and returns what admissions officers are really
 * asking for + a must-address checklist.
 */

export type PromptType =
  | "personal-narrative"
  | "challenge-growth"
  | "identity-community"
  | "why-college"
  | "activity-impact"
  | "topic-choice";

export interface PromptAnalysis {
  type: PromptType;
  typeLabel: string;
  audience: string;
  keyQuestions: string[];
  mustAddress: string[];
  keywords: string[];
}

const TYPE_SIGNALS: Record<PromptType, { label: string; words: string[] }> = {
  "personal-narrative": {
    label: "Personal narrative",
    words: [
      "your story",
      "tell us",
      "tell us your story",
      "unique",
      "shaped",
      "background",
    ],
  },
  "challenge-growth": {
    label: "Challenge & growth",
    words: [
      "challenge",
      "setback",
      "failure",
      "difficult",
      "obstacle",
      "mistake",
      "overcame",
    ],
  },
  "identity-community": {
    label: "Identity & community",
    words: [
      "identity",
      "community",
      "diversity",
      "heritage",
      "culture",
      "background",
      "perspective",
    ],
  },
  "why-college": {
    label: "Why this college",
    words: [
      "why",
      "contribute",
      "campus",
      "community",
      "program",
      "this college",
      "this university",
    ],
  },
  "activity-impact": {
    label: "Activity & impact",
    words: [
      "activity",
      "experience",
      "meaningful",
      "intended major",
      "passion",
      "project",
      "volunteer",
    ],
  },
  "topic-choice": {
    label: "Topic of your choice",
    words: [
      "topic of your choice",
      "pleasure of it",
      "anything",
      "question you would like to answer",
    ],
  },
};

const PRIORITY: PromptType[] = [
  "why-college",
  "challenge-growth",
  "personal-narrative",
  "identity-community",
  "activity-impact",
  "topic-choice",
];

function extractKeywords(prompt: string): string[] {
  const stop = new Set([
    "you",
    "your",
    "tell",
    "how",
    "what",
    "why",
    "which",
    "when",
    "where",
    "who",
    "the",
    "a",
    "an",
    "and",
    "or",
    "of",
    "to",
    "for",
    "in",
    "on",
    "at",
    "has",
    "have",
    "had",
    "this",
    "that",
    "does",
    "did",
    "please",
    "us",
    "will",
  ]);
  const tokens = prompt.toLowerCase().match(/[a-z]+(?:['-][a-z]+)*/g) ?? [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const token of tokens) {
    if (stop.has(token) || seen.has(token) || token.length < 4) continue;
    seen.add(token);
    out.push(token);
    if (out.length >= 8) break;
  }
  return out;
}

function matches(prompt: string, words: string[]): number {
  const lower = prompt.toLowerCase();
  return words.filter((w) => lower.includes(w)).length;
}

export function analyzePrompt(prompt: string): PromptAnalysis {
  const keywords = extractKeywords(prompt);
  const counts = Object.fromEntries(
    (Object.keys(TYPE_SIGNALS) as PromptType[]).map((t) => [
      t,
      matches(prompt, TYPE_SIGNALS[t].words),
    ])
  ) as Record<PromptType, number>;

  const type = PRIORITY.reduce<PromptType>(
    (best, candidate) => (counts[candidate] > counts[best] ? candidate : best),
    "topic-choice"
  );

  const analysis = TYPE_SIGNALS[type];

  const mustAddress: string[] = (() => {
    switch (type) {
      case "personal-narrative":
        return [
          "One concrete story or scene",
          "A specific transformation or lesson",
          "What the reader learns about you",
        ];
      case "challenge-growth":
        return [
          "The obstacle itself (concrete, not vague)",
          "Your response or actions",
          "What you learned and how you changed",
        ];
      case "identity-community":
        return [
          "A defining part of your identity or community",
          "How it shapes how you see the world",
          "A specific example or memory",
        ];
      case "why-college":
        return [
          "Specific details about the college (not generic)",
          "How you will contribute",
          "What you will take from it",
        ];
      case "activity-impact":
        return [
          "The activity and your specific role",
          "Visible impact or what you built",
          "Connection to your goals or major",
        ];
      case "topic-choice":
        return [
          "Something you genuinely enjoy",
          "Why it delights you, not why it impresses",
          "A moment or detail that makes it yours",
        ];
    }
  })();

  const keyQuestions: string[] = (() => {
    switch (type) {
      case "why-college":
        return ["Why is this college/exact fit for you?", "What will you give back?"];
      case "challenge-growth":
        return ["What happened, concretely?", "How are you different on the other side?"];
      case "personal-narrative":
        return ["What story best captures who you are?", "What insight does it reveal?"];
      case "identity-community":
        return [
          "What defines you beyond a label?",
          "How has it shaped your perspective?",
        ];
      case "activity-impact":
        return ["What did you actually do?", "What difference did it make?"];
      case "topic-choice":
        return [
          "What makes this genuinely interesting to you?",
          "Can you make the reader feel it too?",
        ];
    }
  })();

  return {
    type,
    typeLabel: analysis.label,
    audience:
      type === "why-college"
        ? "Admissions officers are checking self-awareness and fit — they want evidence you researched honestly."
        : "Admissions officers are looking for a specific, honest window into how you became yourself — not a resume recap.",
    keyQuestions,
    mustAddress,
    keywords,
  };
}

/** Title of the analysis type label used for display badges. */
export function typeBadgeTone(type: PromptType): string {
  switch (type) {
    case "challenge-growth":
      return "bg-reach-500/15 text-reach-700 dark:text-reach-300";
    case "why-college":
      return "bg-target-500/15 text-target-700 dark:text-target-300";
    case "identity-community":
      return "bg-violet-500/15 text-violet-700 dark:text-violet-300";
    case "activity-impact":
      return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300";
    default:
      return "bg-brand-500/15 text-brand-700 dark:text-brand-300";
  }
}
