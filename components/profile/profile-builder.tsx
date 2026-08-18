"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Save, Loader2, CheckCircle2, Sparkles } from "lucide-react";
import type {
  CourseworkEntry,
  Extracurricular,
  StudentProfile,
  TestScore,
} from "@/lib/supabase/types";
import { useSession } from "@/lib/auth/session-context";
import {
  getClientStudentProfile,
  saveClientStudentProfile,
} from "@/lib/data/profiles-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const LEVELS: { value: CourseworkEntry["level"]; label: string }[] = [
  { value: "standard", label: "Standard" },
  { value: "honors", label: "Honors" },
  { value: "ap", label: "AP / Advanced" },
  { value: "ib", label: "IB" },
  { value: "dual", label: "Dual enrollment" },
];

const GRADES = ["A", "A-", "B+", "B", "B-", "C+", "C", "Pass"];

const TEST_NAMES = ["SAT", "ACT", "AP", "IB", "TOEFL", "IELTS", "Other"];

const uid = () => Math.random().toString(36).slice(2, 10);

function ChipInput({
  label,
  values,
  onChange,
  placeholder,
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder: string;
}) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const value = draft.trim();
    if (value && !values.some((v) => v.toLowerCase() === value.toLowerCase())) {
      onChange([...values, value]);
    }
    setDraft("");
  };
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input
          value={draft}
          placeholder={placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
        />
        <Button
          type="button"
          variant="secondary"
          onClick={add}
          aria-label={`Add ${label.toLowerCase()}`}
        >
          <Plus className="h-4 w-4" aria-hidden />
        </Button>
      </div>
      {values.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {values.map((value) => (
            <Badge key={value} variant="brand" className="gap-1.5 py-1 pl-3 pr-1.5">
              {value}
              <button
                type="button"
                onClick={() => onChange(values.filter((v) => v !== value))}
                aria-label={`Remove ${value}`}
                className="rounded-full p-0.5 transition-colors hover:bg-white/40"
              >
                <Trash2 className="h-3 w-3" aria-hidden />
              </button>
            </Badge>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Card variant="glass" className="p-6">
      <CardHeader className="p-0">
        <CardTitle>{title}</CardTitle>
        {description ? (
          <CardDescription className="mt-1">{description}</CardDescription>
        ) : null}
      </CardHeader>
      <CardContent className="p-0 pt-5">{children}</CardContent>
    </Card>
  );
}

function ListAddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <Button type="button" variant="secondary" size="sm" onClick={onClick}>
      <Plus className="h-4 w-4" aria-hidden />
      {label}
    </Button>
  );
}

export function ProfileBuilder() {
  const { user, status } = useSession();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const userId = user?.id;
        if (!userId) return;
        const existing = await getClientStudentProfile(userId);
        if (!cancelled) {
          setProfile(existing);
          setError(null);
        }
      } catch {
        if (!cancelled) setError("Could not load your profile.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const patch = <K extends keyof StudentProfile>(key: K, value: StudentProfile[K]) => {
    setProfile((prev) => (prev ? { ...prev, [key]: value } : prev));
    setSaved(false);
  };

  const patchTest = (
    id: string,
    field: keyof TestScore,
    value: string | number | undefined
  ) => {
    if (!profile) return;
    patch(
      "test_scores",
      profile.test_scores.map((ts) => {
        if (ts.id !== id) return ts;
        if (field === "percentile") {
          return { ...ts, percentile: typeof value === "number" ? value : undefined };
        }
        return { ...ts, [field]: value } as TestScore;
      })
    );
  };

  const patchCoursework = (id: string, field: keyof CourseworkEntry, value: string) => {
    if (!profile) return;
    patch(
      "coursework",
      profile.coursework.map((cw) => (cw.id === id ? { ...cw, [field]: value } : cw))
    );
  };

  const patchEc = (id: string, field: keyof Extracurricular, value: string | number) => {
    if (!profile) return;
    patch(
      "extracurriculars",
      profile.extracurriculars.map((ec) =>
        ec.id === id ? { ...ec, [field]: value } : ec
      )
    );
  };

  const onSave = async () => {
    if (!profile || !user) return;
    setSaving(true);
    setError(null);
    try {
      const savedProfile = await saveClientStudentProfile({
        ...profile,
        user_id: user.id,
      });
      setProfile(savedProfile);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Could not save your profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="space-y-6">
        <div className="skeleton h-8 w-64" />
        <div className="skeleton h-64 w-full" />
      </div>
    );
  }

  if (status === "unauthenticated" || !user) {
    return (
      <Card variant="glass" className="p-10 text-center">
        <h1 className="font-display text-2xl font-bold">Sign in to build your profile</h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          Your profile powers the matcher, tracker, and essay coach.
        </p>
      </Card>
    );
  }

  if (user.role === "advisor") {
    return (
      <Card variant="glass" className="p-10 text-center">
        <h1 className="font-display text-2xl font-bold">
          Advisor profiles are managed by students
        </h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          This builder is for student applicants. Head to the Advisor view to see your
          roster.
        </p>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-8 w-64" />
        <div className="grid gap-6">
          <div className="skeleton h-64 w-full" />
          <div className="skeleton h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <Card variant="glass" className="p-10 text-center">
        <p className="text-zinc-500 dark:text-zinc-400">
          No profile found. Please try again.
        </p>
      </Card>
    );
  }

  return (
    <div className="animate-fade-up space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-3xl font-bold tracking-tight">My Profile</h1>
            {saved ? (
              <span className="inline-flex items-center gap-1 text-sm font-medium text-safety-600 dark:text-safety-400">
                <CheckCircle2 className="h-4 w-4" aria-hidden />
                Saved
              </span>
            ) : null}
          </div>
          <p className="mt-2 text-zinc-600 dark:text-zinc-300">
            This is the data the Matcher uses to score colleges and the Tracker uses to
            plan your applications.
          </p>
        </div>
        <Button size="lg" onClick={onSave} disabled={saving} className="sm:w-auto">
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <Save className="h-4 w-4" aria-hidden />
          )}
          Save profile
        </Button>
      </div>

      {error ? (
        <p
          role="alert"
          className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300"
        >
          {error}
        </p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Academic profile */}
        <Section
          title="Academic profile"
          description="GPA, test scores, and class standing"
        >
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="gpa">GPA (0.0 – 5.0)</Label>
                <Input
                  id="gpa"
                  type="number"
                  min={0}
                  max={5}
                  step={0.01}
                  value={profile.gpa}
                  onChange={(e) => patch("gpa", Number(e.target.value))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="rank">Class rank (optional)</Label>
                <Input
                  id="rank"
                  placeholder="e.g. Top 10%"
                  value={profile.class_rank ?? ""}
                  onChange={(e) => patch("class_rank", e.target.value || undefined)}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Test scores</Label>
                <ListAddButton
                  label="Add score"
                  onClick={() =>
                    patch("test_scores", [
                      ...profile.test_scores,
                      { id: uid(), name: "SAT", value: "", percentile: undefined },
                    ])
                  }
                />
              </div>
              {profile.test_scores.length === 0 ? (
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  No scores yet — add your best results to strengthen your matches.
                </p>
              ) : (
                profile.test_scores.map((ts) => (
                  <div key={ts.id} className="flex items-end gap-2">
                    <div className="flex-1 space-y-1">
                      <Label className="sr-only">Test name</Label>
                      <Select
                        value={ts.name}
                        onChange={(e) => patchTest(ts.id, "name", e.target.value)}
                        aria-label="Test name"
                      >
                        {TEST_NAMES.map((name) => (
                          <option key={name} value={name}>
                            {name}
                          </option>
                        ))}
                      </Select>
                    </div>
                    <div className="w-28 space-y-1">
                      <Label className="sr-only">Score</Label>
                      <Input
                        placeholder="Score"
                        value={ts.value}
                        onChange={(e) => patchTest(ts.id, "value", e.target.value)}
                        aria-label="Score value"
                      />
                    </div>
                    <div className="w-28 space-y-1">
                      <Label className="sr-only">Percentile</Label>
                      <Input
                        type="number"
                        min={1}
                        max={99}
                        placeholder="%ile"
                        value={ts.percentile ?? ""}
                        onChange={(e) =>
                          patchTest(
                            ts.id,
                            "percentile",
                            e.target.value ? Number(e.target.value) : ""
                          )
                        }
                        aria-label="Percentile"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Remove test score"
                      onClick={() =>
                        patch(
                          "test_scores",
                          profile.test_scores.filter((s) => s.id !== ts.id)
                        )
                      }
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </Section>

        {/* Course rigor */}
        <Section
          title="Course rigor"
          description="The classes that show admissions teams how you challenge yourself"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Coursework</Label>
              <ListAddButton
                label="Add course"
                onClick={() =>
                  patch("coursework", [
                    ...profile.coursework,
                    { id: uid(), course: "", level: "standard", grade: "A" },
                  ])
                }
              />
            </div>
            {profile.coursework.length === 0 ? (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Add your most rigorous courses (honors, AP, IB, dual enrollment).
              </p>
            ) : (
              profile.coursework.map((cw) => (
                <div key={cw.id} className="flex flex-wrap items-end gap-2">
                  <div className="min-w-40 flex-1 space-y-1">
                    <Label className="sr-only">Course name</Label>
                    <Input
                      placeholder="Course name"
                      value={cw.course}
                      onChange={(e) => patchCoursework(cw.id, "course", e.target.value)}
                      aria-label="Course name"
                    />
                  </div>
                  <div className="w-36 space-y-1">
                    <Label className="sr-only">Level</Label>
                    <Select
                      value={cw.level}
                      onChange={(e) => patchCoursework(cw.id, "level", e.target.value)}
                      aria-label="Course level"
                    >
                      {LEVELS.map((level) => (
                        <option key={level.value} value={level.value}>
                          {level.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="w-24 space-y-1">
                    <Label className="sr-only">Grade</Label>
                    <Select
                      value={cw.grade}
                      onChange={(e) => patchCoursework(cw.id, "grade", e.target.value)}
                      aria-label="Grade"
                    >
                      {GRADES.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Remove course"
                    onClick={() =>
                      patch(
                        "coursework",
                        profile.coursework.filter((c) => c.id !== cw.id)
                      )
                    }
                  >
                    <Trash2 className="h-4 w-4" aria-hidden />
                  </Button>
                </div>
              ))
            )}
          </div>
        </Section>

        {/* Extracurriculars */}
        <Section
          title="Extracurriculars"
          description="Depth beats breadth — show roles, commitment, and impact"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Activities</Label>
              <ListAddButton
                label="Add activity"
                onClick={() =>
                  patch("extracurriculars", [
                    ...profile.extracurriculars,
                    {
                      id: uid(),
                      activity: "",
                      role: "",
                      years: 1,
                      hours_per_week: 1,
                      impact: "",
                    },
                  ])
                }
              />
            </div>
            {profile.extracurriculars.length === 0 ? (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Add up to your most meaningful activities with leadership roles and
                impact.
              </p>
            ) : (
              profile.extracurriculars.map((ec) => (
                <div
                  key={ec.id}
                  className={cn(
                    "rounded-2xl border border-zinc-200 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5",
                    "transition-shadow hover:shadow-glass"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-zinc-800 dark:text-zinc-100">
                      {ec.activity || "New activity"}
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Remove ${ec.activity || "activity"}`}
                      onClick={() =>
                        patch(
                          "extracurriculars",
                          profile.extracurriculars.filter((a) => a.id !== ec.id)
                        )
                      }
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                    </Button>
                  </div>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                      <Label className="text-xs">Activity</Label>
                      <Input
                        placeholder="e.g. Robotics Club"
                        value={ec.activity}
                        onChange={(e) => patchEc(ec.id, "activity", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Role</Label>
                      <Input
                        placeholder="e.g. Team Captain"
                        value={ec.role}
                        onChange={(e) => patchEc(ec.id, "role", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Years</Label>
                      <Input
                        type="number"
                        min={0}
                        max={12}
                        value={ec.years}
                        onChange={(e) => patchEc(ec.id, "years", Number(e.target.value))}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Hours / week</Label>
                      <Input
                        type="number"
                        min={0}
                        max={60}
                        value={ec.hours_per_week}
                        onChange={(e) =>
                          patchEc(ec.id, "hours_per_week", Number(e.target.value))
                        }
                      />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <Label className="text-xs">Impact</Label>
                      <Textarea
                        rows={2}
                        placeholder="What did you change? Who did you help? What did you build?"
                        value={ec.impact}
                        onChange={(e) => patchEc(ec.id, "impact", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Section>

        {/* Interests & majors */}
        <Section
          title="Interests & intended majors"
          description="Used to weight programs and tags when matching schools"
        >
          <div className="space-y-5">
            <ChipInput
              label="Intended majors"
              placeholder="e.g. Computer Science"
              values={profile.intended_majors}
              onChange={(v) => patch("intended_majors", v)}
            />
            <ChipInput
              label="Interests"
              placeholder="e.g. artificial intelligence"
              values={profile.interests}
              onChange={(v) => patch("interests", v)}
            />
          </div>
        </Section>

        {/* Budget & aid */}
        <Section
          title="Budget & financial aid"
          description="Keep matches affordable — no surprise price tags"
        >
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="budget-min">Annual budget (min)</Label>
                <Input
                  id="budget-min"
                  type="number"
                  min={0}
                  step={1000}
                  value={profile.budget_range.min}
                  onChange={(e) =>
                    patch("budget_range", {
                      ...profile.budget_range,
                      min: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="budget-max">Annual budget (max)</Label>
                <Input
                  id="budget-max"
                  type="number"
                  min={0}
                  step={1000}
                  value={profile.budget_range.max}
                  onChange={(e) =>
                    patch("budget_range", {
                      ...profile.budget_range,
                      max: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>
            <div className="flex items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white/60 px-4 py-3 dark:border-white/10 dark:bg-white/5">
              <div>
                <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100">
                  I need financial aid
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Adds an aid-friendliness signal to your matches.
                </p>
              </div>
              <Toggle
                checked={profile.needs_financial_aid}
                onCheckedChange={(checked) => patch("needs_financial_aid", checked)}
                label="Needs financial aid"
              />
            </div>
          </div>
        </Section>
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-dashed border-brand-500/40 bg-brand-500/5 px-5 py-4">
        <p className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
          <Sparkles className="h-4 w-4 text-brand-500" aria-hidden />
          The Matcher turns this profile into an explainable strength index for every
          college.
        </p>
        <Button onClick={onSave} disabled={saving} className="shrink-0">
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <Save className="h-4 w-4" aria-hidden />
          )}
          Save
        </Button>
      </div>
    </div>
  );
}
