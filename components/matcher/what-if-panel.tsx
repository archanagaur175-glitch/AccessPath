"use client";

import { useState } from "react";
import { FlaskConical } from "lucide-react";
import type { StudentProfile } from "@/lib/supabase/types";
import type { MatchResult } from "@/lib/matching/scoring-engine";
import { computeMatches } from "@/lib/matching/scoring-engine";
import { StrengthTrendChart } from "@/components/matcher/strength-trend-chart";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";

interface WhatIfPanelProps {
  profile: StudentProfile;
  matches: MatchResult[];
}

type Scenario = "gpa-plus" | "gpa-minus" | "test-plus" | "rigor-plus" | "ec-plus";

const scenarios: { value: Scenario; label: string; describe: string }[] = [
  { value: "gpa-plus", label: "GPA +0.2", describe: "What if your GPA improved by 0.2?" },
  { value: "gpa-minus", label: "GPA −0.2", describe: "What if your GPA slipped by 0.2?" },
  {
    value: "test-plus",
    label: "Stronger test score",
    describe: "What if your best test percentile rose by 10?",
  },
  {
    value: "rigor-plus",
    label: "Two more APs",
    describe: "What if you added two rigorous courses?",
  },
  {
    value: "ec-plus",
    label: "Leadership depth",
    describe: "What if your EC impact deepened?",
  },
];

function applyScenario(profile: StudentProfile, scenario: Scenario): StudentProfile {
  switch (scenario) {
    case "gpa-plus":
      return { ...profile, gpa: Math.min(5, profile.gpa + 0.2) };
    case "gpa-minus":
      return { ...profile, gpa: Math.max(0, profile.gpa - 0.2) };
    case "test-plus": {
      const shifted = profile.test_scores.map((ts) => ({
        ...ts,
        percentile:
          typeof ts.percentile === "number"
            ? Math.min(99, ts.percentile + 10)
            : ts.percentile,
      }));
      return { ...profile, test_scores: shifted };
    }
    case "rigor-plus": {
      const extra = Array.from({ length: 2 }, (_, i) => ({
        id: `cw-whatif-${i}`,
        course: "AP (scenario)",
        level: "ap" as const,
        grade: "A",
      }));
      return { ...profile, coursework: [...profile.coursework, ...extra] };
    }
    case "ec-plus": {
      const boosted = profile.extracurriculars.map((ec) => ({
        ...ec,
        impact: `${ec.impact} Scaled an initiative from idea to impact, growing reach across the school.`,
        role: /captain|president|founder/i.test(ec.role)
          ? ec.role
          : `Lead ${ec.role || "Organizer"}`,
      }));
      return { ...profile, extracurriculars: boosted };
    }
  }
}

export function WhatIfPanel({ profile, matches }: WhatIfPanelProps) {
  const [scenario, setScenario] = useState<Scenario>("gpa-plus");
  const adjustedProfile = applyScenario(profile, scenario);
  const adjustedMatches = computeMatches(
    adjustedProfile,
    matches.map((m) => m.college)
  );

  return (
    <Card variant="glass" className="p-6">
      <CardHeader className="p-0">
        <CardTitle className="flex items-center gap-2">
          <FlaskConical className="h-5 w-5 text-brand-500" aria-hidden />
          What-if explorer
        </CardTitle>
        <CardDescription className="mt-1">
          See how your strength indexes move as your profile changes.
        </CardDescription>
      </CardHeader>
      <div className="mt-5 space-y-4">
        <Select
          value={scenario}
          onChange={(e) => setScenario(e.target.value as Scenario)}
          aria-label="What-if scenario"
        >
          {scenarios.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </Select>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          {scenarios.find((s) => s.value === scenario)?.describe}
        </p>
        <StrengthTrendChart current={matches} adjusted={adjustedMatches} />
      </div>
    </Card>
  );
}
