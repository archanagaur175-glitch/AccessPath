import type { PromptType } from "@/lib/essay-coach/prompt-analyzer";

/**
 * Deterministic outline generator. If a draft exists it is split into beats and
 * suggestions are attached to the weakest parts; otherwise a structure is
 * proposed from the prompt type.
 */

export interface OutlineSection {
  heading: string;
  points: string[];
}

export interface EssayOutline {
  hook: string;
  sections: OutlineSection[];
  conclusionTip: string;
}

const HOOKS: Record<PromptType, string> = {
  "personal-narrative":
    "Open mid-scene: a sound, an object, a bright moment — not a summary.",
  "challenge-growth":
    "Start just before the turning point; let the reader feel the stakes first.",
  "identity-community": "Begin with a sensory detail from that community or identity.",
  "why-college": "Open with a concrete thing the college does that you want to do there.",
  "activity-impact": "Open with the moment something you built first worked.",
  "topic-choice": "Open with the object, habit, or ritual you love most.",
};

const SECTION_TEMPLATES: Record<PromptType, string[]> = {
  "personal-narrative": [
    "Setup: where the story takes you",
    "The scene that matters most",
    "The turn: what changed",
    "Reflection",
  ],
  "challenge-growth": [
    "The obstacle, concretely",
    "Your response and actions",
    "Moment of growth",
    "What you carry forward",
  ],
  "identity-community": [
    "The identity or community",
    "A vivid example or memory",
    "How it shaped your perspective",
    "Connection to your future",
  ],
  "why-college": [
    "The specific thing you found",
    "Why it fits your goals",
    "What you would contribute",
    "Closing tie-back",
  ],
  "activity-impact": [
    "The activity and your role",
    "What you built or did",
    "The impact you saw",
    "Connection to your major/goals",
  ],
  "topic-choice": [
    "The ritual or object",
    "Why it delights you",
    "A tiny, telling detail",
    "What it says about you",
  ],
};

const CONCLUSION_TIPS: Record<PromptType, string> = {
  "personal-narrative": "End with a quiet beat that echoes the opening image.",
  "challenge-growth": "Show the changed you performing one small, new action.",
  "identity-community": "End on what you now see that you couldn't before.",
  "why-college": "Tie your contribution back to the specific program you opened with.",
  "activity-impact": "End with the impact, not a resume summary.",
  "topic-choice": "Let the last line be the purest example of your delight.",
};

export function generateOutline(promptType: PromptType, draft?: string): EssayOutline {
  const paragraphs = (draft ?? "")
    .split(/\n{2,}|\r\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  const sections: OutlineSection[] = SECTION_TEMPLATES[promptType].map((heading) => ({
    heading,
    points: [],
  }));

  if (paragraphs.length > 0) {
    sections.forEach((section, index) => {
      const text = paragraphs[index];
      if (text) {
        section.points.push(
          `Draft beat present: "${truncate(text, 72)}" — expand with one specific detail.`
        );
      } else {
        section.points.push(
          "Missing in the current draft — write one concrete moment here."
        );
      }
      if (index === 0) {
        section.points.push(
          "Add a sensory detail (sound, light, texture) within the first two sentences."
        );
      }
      if (index === sections.length - 1) {
        section.points.push("End with what the reader should remember about you.");
      }
    });
  } else {
    sections.forEach((section) => {
      section.points.push("One example or moment that proves this beat.");
      section.points.push("A detail only you would notice.");
    });
  }

  return {
    hook: HOOKS[promptType],
    sections,
    conclusionTip: CONCLUSION_TIPS[promptType],
  };
}

function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max)}…` : text;
}
