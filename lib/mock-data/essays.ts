import type { Essay, EssayVersion, RubricFeedback } from "@/lib/supabase/types";

/**
 * Seeded essays for the demo student (Avery Chen). Each essay carries its own
 * prompt text plus a version history so the Essay Coach has something to show.
 */

function v(
  id: string,
  version: number,
  draft: string,
  updated_at: string,
  summary?: string
): EssayVersion {
  return { id, version, draft_text: draft, updated_at, summary };
}

const SWITCHBOARD_DRAFT = `My grandmother ran a switchboard in the 1980s. Not the kind with wires and plugs — she owned a small phone repair stall in Dehradun, where neighbors came when their cordless phone stopped ringing or their answering machine ate a message. I spent my summers between a bin full of motherboards and a stack of handwritten timetables, learning that "out of order" was rarely a verdict — just a state someone could fix.

When we moved to Austin, I carried that mindset across a data center instead of a stall. I started a repair club at school, resold refurbished laptops at cost, and discovered that technology wasn't about the newest chip but about the people who kept old things working. That is what I hope to bring to UT: the patience of my grandmother's workshop and the stubbornness to treat every outage as a fixable story.`;

const XRAY_DRAFT = `The summer my brother broke his arm, our living room became a triage unit. Ice packs on the couch, a sling on the hook, and my mother on hold with the insurance company for forty minutes. I sat beside her, listening to her repeat our claim number to a voice on the other end. Nothing got fixed that day, but I learned what "patient advocacy" actually costs.`;

const SWITCHBOARD_V1 = `My grandmother ran a telephone stall in Dehradun. When the phone stopped ringing, people brought it to her. She would open it, tap the circuit board, and hand it back fixed. I helped her on weekends. It seemed simple, but I realized much later that she was selling attention as much as repairs. Everyone in the neighborhood trusted her. That shaped how I think about service.`;

const SCHOOL_PLAY_DRAFT = `In the fall of junior year I auditioned for the school play and got the last speaking role: the stage manager. I ran lights, tracked props, and whispered cues. The show was a comedy about a mismatched orchestra, and by closing night I had fallen in love with the backstage chaos. None of it will appear on a transcript, but it is where I learned to lead without being seen.`;

const RICE_PROMPT = "How will you contribute to the Rice community?";

const MIT_PLEASURE_PROMPT =
  "Tell us about something you do simply for the pleasure of it.";

const UT_MAIN_PROMPT =
  "Tell us your story. What unique opportunities or challenges have you experienced throughout your high school career that have shaped who you are today?";

const CAREER_PROMPT =
  "Describe an activity that has been meaningful to you and how it connects to your intended major.";

const BERKELEY_IDENTITY_PROMPT =
  "Describe how you have taken advantage of a significant opportunity, or explain how a personal identity has shaped your perspective.";

function rubricSwitchboard(): RubricFeedback {
  return {
    dimensions: [
      {
        name: "Ideas & Content",
        score: 5,
        note: "Concrete scene, unusual metaphor, clear arc from repair stall to repair club.",
      },
      {
        name: "Structure",
        score: 4,
        note: "Two strong beats; consider a closing line that circles back to the switchboard.",
      },
      {
        name: "Voice & Tone",
        score: 5,
        note: "Confident, specific, and warm without sentimentality.",
      },
      {
        name: "Craft & Language",
        score: 5,
        note: "Precise sensory detail; varied sentence rhythm.",
      },
      { name: "Mechanics", score: 5, note: "No mechanical issues detected." },
    ],
    redFlags: [],
    overall:
      "Strong personal story with a memorable central image. Tie the final line back to the opening image for a perfectly rounded essay.",
  };
}

export const demoEssays: Essay[] = [
  {
    id: "essay-switchboard",
    student_id: "user-demo-student",
    application_id: "app-05",
    title: "The Switchboard",
    prompt_text: UT_MAIN_PROMPT,
    draft_text: SWITCHBOARD_DRAFT,
    rubric_feedback: rubricSwitchboard(),
    versions: [
      v(
        "ver-1",
        1,
        SWITCHBOARD_V1,
        "2026-07-22T10:00:00Z",
        "Opening draft: switched from general nostalgia to a scene."
      ),
      v(
        "ver-2",
        2,
        SWITCHBOARD_DRAFT,
        "2026-08-01T18:30:00Z",
        "Added the Austin move and repair-club payoff."
      ),
    ],
    updated_at: "2026-08-01T18:30:00Z",
  },
  {
    id: "essay-xray",
    student_id: "user-demo-student",
    application_id: "app-06",
    title: "The X-Ray of a Phone Call",
    prompt_text: RICE_PROMPT,
    draft_text: XRAY_DRAFT,
    versions: [v("ver-1", 1, XRAY_DRAFT, "2026-08-10T09:00:00Z")],
    updated_at: "2026-08-10T09:00:00Z",
  },
  {
    id: "essay-stage-manager",
    student_id: "user-demo-student",
    title: "Stage Manager in the Dark",
    prompt_text: MIT_PLEASURE_PROMPT,
    draft_text: SCHOOL_PLAY_DRAFT,
    versions: [v("ver-1", 1, SCHOOL_PLAY_DRAFT, "2026-08-12T20:00:00Z")],
    updated_at: "2026-08-12T20:00:00Z",
  },
  {
    id: "essay-repair-club",
    student_id: "user-demo-student",
    application_id: "app-04",
    title: "Repair Club, Ten Cents a Fix",
    prompt_text: BERKELEY_IDENTITY_PROMPT,
    draft_text:
      "I started a repair club with a screwdriver set and a Wi-Fi password. We fix laptops for students who can't afford new ones. I come from a family where broken was normal and fixed was a good week. The club taught me that identity isn't just where you're from — it's what you refuse to throw away.",
    versions: [
      v(
        "ver-1",
        1,
        "Repair club. We fix laptops. Broke things get fixed now.",
        "2026-07-30T12:00:00Z",
        "Very early outline."
      ),
    ],
    updated_at: "2026-07-30T12:00:00Z",
  },
  {
    id: "essay-summer-lead",
    student_id: "user-demo-student",
    application_id: "app-10",
    title: "Camp Leader Between Two Summers",
    prompt_text: CAREER_PROMPT,
    draft_text:
      "Teaching kids to debug their first Python program at a summer camp changed my planned major from business to computer science. Every kid who stopped shouting 'it doesn't work' and started reading the error message got something bigger than a grade: they got the permission to be curious.",
    versions: [
      v(
        "ver-1",
        1,
        "I taught Python at a camp. It made me want to study CS.",
        "2026-08-15T14:00:00Z"
      ),
      v(
        "ver-2",
        2,
        "I went to a summer camp to teach Python primarily to decide if I liked CS. I did.",
        "2026-08-16T09:00:00Z"
      ),
      v(
        "ver-3",
        3,
        "I taught Python at a summer camp and found a career.",
        "2026-08-17T09:00:00Z"
      ),
    ],
    updated_at: "2026-08-17T09:00:00Z",
  },
];

export function getDemoEssays(): Essay[] {
  return demoEssays;
}

export function getDemoEssayById(id: string): Essay | undefined {
  return demoEssays.find((e) => e.id === id);
}

/** A few classic prompts used by the analyzer when a draft has no incoming prompt. */
export const commonPromptBank: string[] = [
  "Tell us your story. What unique opportunities or challenges have shaped who you are today?",
  "Describe a time you faced a challenge, setback, or failure. How did it affect you, and what did you learn?",
  "Reflect on a time when you questioned or challenged a belief or idea. What prompted your thinking?",
  "Describe a meaningful activity or interest. Why does it matter to you?",
  "How will you contribute to our campus community?",
  "Tell us about something you do simply for the pleasure of it.",
  "What is a question you would like to answer in the next ten years?",
];
