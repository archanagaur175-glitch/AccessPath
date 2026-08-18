import type { College, CollegeCategory, StudentProfile } from "@/lib/supabase/types";
import { clamp } from "@/lib/utils";

/**
 * Admission Strength Index — an explainable 0–100 score of how strong a given
 * student profile is relative to a college's admitted class.
 *
 * Four weighted dimensions:
 *   1. Academic fit  (45%)  — GPA, test percentile, and course rigor vs.
 *                             the college's admitted class and selectivity
 *   2. Engagement    (25%)  — depth of extracurriculars (roles, hours,
 *                             leadership, impact)
 *   3. Program fit   (20%)  — overlap between the student's majors/interests
 *                             and the college's programs and signals
 *   4. Cost fit      (10%)  — how well tuition fits the family budget and aid
 *                             needs
 *
 * Every dimension returns a human-readable note so the score is explainable.
 */

export interface ScoreDimension {
  name: string;
  score: number;
  weight: number;
  note: string;
}

export interface MatchResult {
  college: College;
  strengthIndex: number;
  category: CollegeCategory;
  dimensions: ScoreDimension[];
  rationale: string[];
}

/* ── helpers ─────────────────────────────────────────────────────────────── */

const LEADERSHIP_PATTERN =
  /\b(captain|president|founder|chair|lead|director|editor|vice|treasurer|head|coordinator)\b/i;

export function getMatchCategory(admitRate: number): CollegeCategory {
  if (admitRate <= 0.2) return "reach";
  if (admitRate <= 0.55) return "target";
  return "safety";
}

export function bestTestPercentile(profile: StudentProfile): number | null {
  const explicit = profile.test_scores
    .map((ts) => (typeof ts.percentile === "number" ? ts.percentile : null))
    .filter((p): p is number => p !== null);
  if (explicit.length > 0) return Math.max(...explicit);

  // Fallback mapping for common scores without a percentile.
  let fallback: number | null = null;
  for (const ts of profile.test_scores) {
    const value = parseFloat(ts.value);
    if (!Number.isFinite(value)) continue;
    if (ts.name === "SAT")
      fallback = Math.max(fallback ?? 0, clamp((value - 800) / 14, 0, 100));
    if (ts.name === "ACT")
      fallback = Math.max(fallback ?? 0, clamp((value - 15) * 4.5, 0, 100));
  }
  return fallback;
}

function rigorScore(profile: StudentProfile): number {
  if (profile.coursework.length === 0) return 0.4;
  const points: Record<string, number> = {
    dual: 1,
    ap: 1,
    ib: 1,
    honors: 0.7,
    standard: 0.35,
  };
  const total = profile.coursework.reduce(
    (sum, cw) => sum + (points[cw.level] ?? 0.35),
    0
  );
  return clamp(total / profile.coursework.length, 0.1, 1);
}

function engagementScore(profile: StudentProfile): number {
  const ecs = profile.extracurriculars;
  if (ecs.length === 0) return 0.15;
  const hours = ecs.reduce((sum, ec) => sum + ec.hours_per_week, 0) / ecs.length;
  const years = ecs.reduce((sum, ec) => sum + ec.years, 0) / ecs.length;
  const leadership =
    ecs.filter((ec) => LEADERSHIP_PATTERN.test(ec.role)).length / ecs.length;
  const impact = ecs.filter((ec) => ec.impact.trim().length > 40).length / ecs.length;

  const countScore = clamp(ecs.length / 4, 0.2, 1);
  const depthScore = clamp(0.3 + hours * 0.05 + years * 0.05, 0.2, 1);
  const qualityScore = clamp(0.3 + leadership * 0.5 + impact * 0.4, 0.2, 1);

  return clamp(0.3 * countScore + 0.35 * depthScore + 0.35 * qualityScore, 0.05, 1);
}

function programFitScore(profile: StudentProfile, college: College): number {
  const haystack = [...(college.programs ?? []), ...college.tags].map((s) =>
    s.toLowerCase()
  );

  const majors = profile.intended_majors.map((m) => m.toLowerCase());
  const interests = profile.interests.map((m) => m.toLowerCase());
  if (majors.length === 0 && interests.length === 0) return 0.5;

  const tokenize = (text: string): string[] =>
    text
      .replace(/[^a-z0-9 ]/g, " ")
      .split(/\s+/)
      .filter(Boolean);

  const searchTokens = [...majors.flatMap(tokenize), ...interests.flatMap(tokenize)];
  const matches = searchTokens.filter((token) =>
    haystack.some((h) => h.includes(token))
  ).length;
  const ratio = searchTokens.length > 0 ? matches / searchTokens.length : 0;

  const directMajorHit = majors.some((m) => haystack.some((h) => h.includes(m)));
  return clamp(ratio * 0.8 + (directMajorHit ? 0.2 : 0), 0.05, 1);
}

function costFitScore(profile: StudentProfile, college: College): number {
  const { max } = profile.budget_range;
  if (college.tuition_estimate <= 0) return 1;
  if (max > 0 && college.tuition_estimate <= max) {
    return profile.needs_financial_aid && college.tags.includes("aid-friendly")
      ? 1
      : 0.85;
  }
  if (max > 0) {
    const overage = college.tuition_estimate / max;
    if (college.tags.includes("aid-friendly") && profile.needs_financial_aid) {
      // Need-based aid can bring the real cost well below sticker price.
      return clamp(0.8 - (overage - 1) * 0.15, 0.2, 0.8);
    }
    return clamp(0.6 - (overage - 1) * 0.35, 0.05, 0.6);
  }
  return 0.5;
}

/* ── the engine ──────────────────────────────────────────────────────────── */

export function computeMatch(profile: StudentProfile, college: College): MatchResult {
  const gpa = profile.gpa > 0 ? profile.gpa : 3.0;
  const testPct = bestTestPercentile(profile);

  // 1. Academic fit
  const gpaDelta = gpa - college.avg_gpa;
  const gpaFit = clamp(0.5 + gpaDelta * 1.2, 0.05, 1);
  const expectedTest = college.avg_test_score;
  const testFit =
    testPct === null
      ? 0.4 + gpaFit * 0.4
      : clamp(0.5 + (testPct - expectedTest) / 30, 0.05, 1);
  const expectedRigor = clamp(0.25 + (1 - college.admit_rate) / 1.5, 0.25, 0.9);
  const rigorFit = clamp(0.5 + (rigorScore(profile) - expectedRigor) * 1.5, 0.05, 1);

  const academic = 0.6 * gpaFit + 0.25 * testFit + 0.15 * rigorFit;

  // 2. Engagement
  const engagement = engagementScore(profile);

  // 3. Program fit
  const program = programFitScore(profile, college);

  // 4. Cost fit
  const cost = costFitScore(profile, college);

  // Weighted 0–100 index
  const strengthIndex = clamp(
    Math.round(100 * (academic * 0.45 + engagement * 0.25 + program * 0.2 + cost * 0.1)),
    0,
    100
  );

  const category = getMatchCategory(college.admit_rate);

  const dimensions: ScoreDimension[] = [
    {
      name: "Academic fit",
      score: academic,
      weight: 0.45,
      note: `${gpa.toFixed(2)} GPA is ${Math.abs(gpaDelta) >= 0.05 ? (gpaDelta > 0 ? "above" : "below") : "right at"} the ${college.avg_gpa.toFixed(2)} average of admitted students${
        testPct !== null
          ? `; test percentile ${testPct} vs. ${expectedTest} at the admitted-class median`
          : ""
      }.`,
    },
    {
      name: "Engagement",
      score: engagement,
      weight: 0.25,
      note:
        profile.extracurriculars.length > 0
          ? `${profile.extracurriculars.length} activities with meaningful roles${
              profile.extracurriculars.some((ec) => LEADERSHIP_PATTERN.test(ec.role))
                ? ", including leadership"
                : ""
            }.`
          : "No extracurriculars yet — add activities to strengthen your profile.",
    },
    {
      name: "Program fit",
      score: program,
      weight: 0.2,
      note:
        program >= 0.6
          ? `${college.name} offers strong alignment with ${profile.intended_majors.join(", ") || "your interests"}.`
          : program <= 0.35
            ? `Limited overlap between your interests and ${college.name}'s program emphasis.`
            : `Partial alignment with ${college.name}'s programs.`,
    },
    {
      name: "Cost fit",
      score: cost,
      weight: 0.1,
      note:
        college.tuition_estimate <= (profile.budget_range.max || Infinity)
          ? `Tuition (~$${(college.tuition_estimate / 1000).toFixed(0)}k) fits your budget${profile.needs_financial_aid ? " and they are aid-friendly" : ""}.`
          : `Sticker price ($${(college.tuition_estimate / 1000).toFixed(0)}k) is above your $${(profile.budget_range.max / 1000).toFixed(0)}k budget${
              college.tags.includes("aid-friendly") && profile.needs_financial_aid
                ? " — though generous need-based aid may still make it feasible"
                : ""
            }.`,
    },
  ];

  const rationale = dimensions
    .filter((d) => d.score >= 0.5 || d.score <= 0.35)
    .map((d) => d.note);

  rationale.push(
    category === "reach"
      ? `Admit rate of ${(college.admit_rate * 100).toFixed(1)}% makes this a reach — still worth applying if it's a top choice.`
      : category === "target"
        ? `Admit rate of ${(college.admit_rate * 100).toFixed(0)}% puts this firmly in target territory.`
        : `Admit rate of ${(college.admit_rate * 100).toFixed(0)}% makes this a comfortable safety.`
  );

  return { college, strengthIndex, category, dimensions, rationale };
}

export function computeMatches(
  profile: StudentProfile,
  colleges: College[]
): MatchResult[] {
  return colleges
    .map((college) => computeMatch(profile, college))
    .sort((a, b) => b.strengthIndex - a.strengthIndex);
}

export function categoryDistribution(
  results: MatchResult[]
): Record<CollegeCategory, number> {
  return results.reduce<Record<CollegeCategory, number>>(
    (acc, r) => {
      acc[r.category] += 1;
      return acc;
    },
    { reach: 0, target: 0, safety: 0 }
  );
}
