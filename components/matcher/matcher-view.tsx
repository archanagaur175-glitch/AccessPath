"use client";

import { useEffect, useMemo, useState } from "react";
import { BarChart3, Scale, Radar, UserRound } from "lucide-react";
import type { College, StudentProfile } from "@/lib/supabase/types";
import { useSession } from "@/lib/auth/session-context";
import { getClientStudentProfile } from "@/lib/data/profiles-client";
import { getClientColleges } from "@/lib/data/colleges-client";
import {
  computeMatches,
  categoryDistribution,
  type MatchResult,
} from "@/lib/matching/scoring-engine";
import type { CategoryFilter, MatchSort } from "@/components/matcher/category-filter-bar";
import { CategoryFilterBar } from "@/components/matcher/category-filter-bar";
import { MatchCard } from "@/components/matcher/match-card";
import { ComparisonView } from "@/components/matcher/comparison-view";
import { DistributionDonut } from "@/components/matcher/distribution-donut";
import { WhatIfPanel } from "@/components/matcher/what-if-panel";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageSkeleton } from "@/components/ui/skeleton";

const REGION_META: Record<string, string> = {
  "region-northeast": "Northeast",
  "region-midwest": "Midwest",
  "region-south": "South",
  "region-southwest": "Southwest",
  "region-west": "West",
};

function regionLabel(tags: string[]): string | null {
  const tag = tags.find((t) => t.startsWith("region-"));
  return tag ? (REGION_META[tag] ?? tag.replace("region-", "")) : null;
}

export function MatcherView() {
  const { user, status } = useSession();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [region, setRegion] = useState("all");
  const [sort, setSort] = useState<MatchSort>("index-desc");
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const [collegeList, existingProfile] = await Promise.all([
          getClientColleges(),
          user?.id ? getClientStudentProfile(user.id) : Promise.resolve(null),
        ]);
        if (!cancelled) {
          setColleges(collegeList);
          setProfile(existingProfile);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const regions = useMemo(() => {
    const labels = new Set<string>();
    for (const college of colleges) {
      const label = regionLabel(college.tags);
      if (label) labels.add(label);
    }
    return [...labels].sort();
  }, [colleges]);

  const matches = useMemo(
    () => (profile ? computeMatches(profile, colleges) : []),
    [profile, colleges]
  );

  const filtered = useMemo(() => {
    let list = matches;
    if (category !== "all") {
      list = list.filter((m) => m.category === category);
    }
    if (region !== "all") {
      list = list.filter((m) => regionLabel(m.college.tags) === region);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (m) =>
          m.college.name.toLowerCase().includes(q) ||
          m.college.location.toLowerCase().includes(q) ||
          (m.college.programs ?? []).some((p) => p.toLowerCase().includes(q)) ||
          m.college.tags.some((t) => t.replace(/^region-/, "").includes(q))
      );
    }
    switch (sort) {
      case "index-asc":
        list = [...list].sort((a, b) => a.strengthIndex - b.strengthIndex);
        break;
      case "admit-rate":
        list = [...list].sort((a, b) => a.college.admit_rate - b.college.admit_rate);
        break;
      case "tuition":
        list = [...list].sort(
          (a, b) => a.college.tuition_estimate - b.college.tuition_estimate
        );
        break;
      default:
        list = [...list].sort((a, b) => b.strengthIndex - a.strengthIndex);
    }
    return list;
  }, [matches, category, region, search, sort]);

  const distribution = useMemo(() => categoryDistribution(matches), [matches]);
  const selectedMatches = compareIds
    .map((id) => matches.find((m) => m.college.id === id))
    .filter((m): m is MatchResult => Boolean(m));

  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  return (
    <div className="animate-fade-up space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">
            College Matcher
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-300">
            Every score is explainable — expand a card to see exactly why it matches.
          </p>
        </div>
        <Button
          variant="glass"
          onClick={() => compareIds.length > 0 && setCompareOpen(true)}
          disabled={compareIds.length === 0}
          className="sm:w-auto"
        >
          <Scale className="h-4 w-4" aria-hidden />
          Compare ({compareIds.length}/3)
        </Button>
      </div>

      {loading ? (
        <PageSkeleton />
      ) : status === "unauthenticated" || !user ? (
        <Card variant="glass" className="p-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-300">
            <UserRound className="h-7 w-7" aria-hidden />
          </div>
          <h2 className="mt-5 font-display text-xl font-bold">
            Sign in to see your matches
          </h2>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            Your matches are computed live from your profile.
          </p>
        </Card>
      ) : !profile ? (
        user.role === "advisor" ? (
          <Card variant="glass" className="p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-300">
              <Radar className="h-7 w-7" aria-hidden />
            </div>
            <h2 className="mt-5 font-display text-xl font-bold">
              The matcher lives in student profiles
            </h2>
            <p className="mt-2 text-zinc-500 dark:text-zinc-400">
              Explore what the engine produces using the demo student&apos;s profile.
            </p>
            <Button className="mt-5" onClick={() => void loadDemoProfile()}>
              Load demo student profile
            </Button>
          </Card>
        ) : (
          <Card variant="glass" className="p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-300">
              <UserRound className="h-7 w-7" aria-hidden />
            </div>
            <h2 className="mt-5 font-display text-xl font-bold">
              Build your profile first
            </h2>
            <p className="mt-2 text-zinc-500 dark:text-zinc-400">
              The matcher scores every school against your GPA, tests, rigor, and
              activities.
            </p>
            <a href="/profile" className="mt-5 inline-flex">
              <Button>Build my profile</Button>
            </a>
          </Card>
        )
      ) : (
        <>
          <CategoryFilterBar
            search={search}
            onSearch={setSearch}
            category={category}
            onCategory={setCategory}
            region={region}
            onRegion={setRegion}
            regions={regions}
            sort={sort}
            onSort={setSort}
            counts={distribution}
          />

          <div className="grid gap-6 xl:grid-cols-3">
            <div className="space-y-6">
              {filtered.length === 0 ? (
                <Card variant="glass" className="p-8 text-center">
                  <p className="text-zinc-500 dark:text-zinc-400">
                    No schools match those filters. Try widening your search.
                  </p>
                </Card>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                  {filtered.map((match) => (
                    <MatchCard
                      key={match.college.id}
                      match={match}
                      selected={compareIds.includes(match.college.id)}
                      onToggleCompare={() => toggleCompare(match.college.id)}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <Card variant="glass" className="p-6">
                <CardHeader className="p-0">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-brand-500" aria-hidden />
                    List health
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {matches.length} schools in your list — a balanced spread is key.
                  </CardDescription>
                </CardHeader>
                <div className="mt-4">
                  <DistributionDonut counts={distribution} total={matches.length} />
                </div>
              </Card>

              <WhatIfPanel profile={profile} matches={matches} key={profile.updated_at} />
            </div>
          </div>
        </>
      )}

      <ComparisonView
        open={compareOpen}
        onClose={() => setCompareOpen(false)}
        matches={selectedMatches}
      />
    </div>
  );

  async function loadDemoProfile() {
    setLoading(true);
    try {
      const demo = await getClientStudentProfile("user-demo-student");
      setProfile(demo);
    } finally {
      setLoading(false);
    }
  }
}
