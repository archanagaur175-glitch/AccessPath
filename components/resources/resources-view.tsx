"use client";

import { useEffect, useMemo, useState } from "react";
import { GraduationCap, Search, Send, Users } from "lucide-react";
import type {
  Advisor,
  AdvisorRequest,
  Resource,
  ResourceType,
} from "@/lib/supabase/types";
import { useSession } from "@/lib/auth/session-context";
import { getClientResources } from "@/lib/data/resources-client";
import {
  getClientAdvisors,
  getClientAdvisorRequests,
  submitAdvisorRequest,
} from "@/lib/data/advisors-client";
import { ResourceCard } from "@/components/resources/resource-card";
import { AdvisorCard } from "@/components/resources/advisor-card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Card } from "@/components/ui/card";
import { PageSkeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type TypeFilter = "all" | ResourceType;

const TYPE_FILTERS: { value: TypeFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "program", label: "Programs" },
  { value: "scholarship", label: "Scholarships" },
  { value: "guide", label: "Guides" },
];

export function ResourcesView() {
  const { user, status } = useSession();
  const [resources, setResources] = useState<Resource[]>([]);
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [requests, setRequests] = useState<AdvisorRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [region, setRegion] = useState("all");

  const [requesting, setRequesting] = useState<Advisor | null>(null);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const [resourceList, advisorList, requestList] = await Promise.all([
          getClientResources(),
          getClientAdvisors(),
          user?.id
            ? getClientAdvisorRequests(user.id)
            : Promise.resolve([] as AdvisorRequest[]),
        ]);
        if (cancelled) return;
        setResources(resourceList);
        setAdvisors(advisorList);
        setRequests(requestList);
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
    const set = new Set(
      resources.map((r) => r.region).filter((r): r is string => Boolean(r))
    );
    return Array.from(set).sort();
  }, [resources]);

  const filteredResources = useMemo(() => {
    const q = search.trim().toLowerCase();
    return resources.filter((resource) => {
      if (typeFilter !== "all" && resource.type !== typeFilter) return false;
      if (region !== "all" && resource.region !== region) return false;
      if (!q) return true;
      const haystack = [
        resource.title,
        resource.description,
        resource.organization ?? "",
        resource.tags.join(" "),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [resources, search, typeFilter, region]);

  const filteredAdvisors = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return advisors;
    return advisors.filter((advisor) =>
      [advisor.name, advisor.title, advisor.bio, advisor.focus_areas.join(" ")]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [advisors, search]);

  const submitRequest = async () => {
    if (!user || !requesting) return;
    const next = await submitAdvisorRequest(user.id, requesting.id, message);
    setRequests(next);
    setSent(true);
  };

  if (status === "loading" || loading) return <PageSkeleton />;

  return (
    <div className="animate-fade-up space-y-10">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">
          Resources & Advisors
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-300">
          Programs, scholarships, guides, and humans — everything AccessPath points you
          at, in one search.
        </p>
      </div>

      <div className="space-y-3">
        <div className="glass relative rounded-2xl">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
            aria-hidden
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search programs, scholarships, guides, or advisors…"
            className="border-transparent bg-transparent pl-11 focus:border-transparent focus:ring-0 dark:bg-transparent"
            aria-label="Search resources and advisors"
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {TYPE_FILTERS.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setTypeFilter(filter.value)}
                aria-pressed={typeFilter === filter.value}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-sm font-medium transition-all",
                  typeFilter === filter.value
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                    : "bg-zinc-900/5 text-zinc-600 hover:bg-zinc-900/10 dark:bg-white/10 dark:text-zinc-300"
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            aria-label="Filter by region"
            className="rounded-xl border border-zinc-300 bg-white/70 px-3 py-1.5 text-sm text-zinc-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 dark:border-white/15 dark:bg-white/5 dark:text-zinc-200"
          >
            <option value="all">All regions</option>
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      <section aria-label="Resources">
        <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-bold">
          Programs, scholarships & guides
          <span className="rounded-full bg-zinc-900/5 px-2.5 py-0.5 text-xs font-bold text-zinc-500 dark:bg-white/10 dark:text-zinc-400">
            {filteredResources.length}
          </span>
        </h2>
        {filteredResources.length === 0 ? (
          <Card
            variant="glass"
            className="p-8 text-center text-sm text-zinc-500 dark:text-zinc-400"
          >
            No resources match that search.
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        )}
      </section>

      <section aria-label="Advisors">
        <h2 className="mb-1 flex items-center gap-2 font-display text-xl font-bold">
          <GraduationCap
            className="h-5 w-5 text-brand-600 dark:text-brand-300"
            aria-hidden
          />
          Advisor directory
        </h2>
        <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
          Request a free intro session — your note goes straight to the advisor&apos;s
          queue.
        </p>
        {filteredAdvisors.length === 0 ? (
          <Card
            variant="glass"
            className="p-8 text-center text-sm text-zinc-500 dark:text-zinc-400"
          >
            No advisors match that search.
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredAdvisors.map((advisor) => (
              <AdvisorCard
                key={advisor.id}
                advisor={advisor}
                request={requests.find((r) => r.advisor_id === advisor.id)}
                onRequest={setRequesting}
              />
            ))}
          </div>
        )}
      </section>

      <Modal
        open={Boolean(requesting)}
        onClose={() => {
          setRequesting(null);
          setSent(false);
          setMessage("");
        }}
        title={requesting ? `Request a session with ${requesting.name}` : undefined}
        description="Tell them what you're working on — the intro session is free."
      >
        <div className="mt-5 space-y-4">
          {sent ? (
            <div className="rounded-2xl border border-safety-500/30 bg-safety-500/10 p-5 text-center">
              <Send
                className="mx-auto h-6 w-6 text-safety-600 dark:text-safety-300"
                aria-hidden
              />
              <p className="mt-2 font-semibold text-zinc-800 dark:text-zinc-100">
                Request sent
              </p>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {requesting?.name} will see your note in their queue.
              </p>
              <Button
                className="mt-4"
                onClick={() => {
                  setRequesting(null);
                  setSent(false);
                  setMessage("");
                }}
              >
                Done
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-display font-bold text-white",
                    requesting?.avatarColor
                  )}
                  aria-hidden
                >
                  {requesting?.name
                    .replace(/^(Dr\.|Prof\.)\s+/i, "")
                    .split(/\s+/)
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()}
                </div>
                <div>
                  <p className="font-display font-bold text-zinc-900 dark:text-white">
                    {requesting?.title}
                  </p>
                  <p className="text-xs text-zinc-400">
                    <Users className="mr-1 inline h-3.5 w-3.5" aria-hidden />
                    {requesting?.focus_areas.join(" · ")}
                  </p>
                </div>
              </div>
              <Textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={`Hi ${requesting?.name.split(" ").pop()} — I'm working on…`}
              />
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setRequesting(null)}>
                  Cancel
                </Button>
                <Button onClick={() => void submitRequest()}>
                  <Send className="h-4 w-4" aria-hidden />
                  Send request
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}
