import { Briefcase, CalendarClock, CheckCircle2, Clock, Star } from "lucide-react";
import type { Advisor, AdvisorRequest } from "@/lib/supabase/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function initials(name: string): string {
  return name
    .replace(/^(Dr\.|Prof\.|Ms\.|Mr\.)\s+/i, "")
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

interface AdvisorCardProps {
  advisor: Advisor;
  request?: AdvisorRequest;
  onRequest: (advisor: Advisor) => void;
}

export function AdvisorCard({ advisor, request, onRequest }: AdvisorCardProps) {
  const accepted = request?.status === "accepted";

  return (
    <div className="glass flex flex-col gap-4 rounded-3xl p-5 transition-all duration-300 hover:border-brand-400/60 hover:shadow-glass">
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-display text-lg font-bold text-white shadow-md",
            advisor.avatarColor
          )}
          aria-hidden
        >
          {initials(advisor.name)}
        </div>
        <div className="min-w-0">
          <h3 className="flex items-center gap-2 font-display text-lg font-bold text-zinc-900 dark:text-white">
            {advisor.name}
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{advisor.title}</p>
          <p className="mt-1 flex items-center gap-3 text-xs text-zinc-400 dark:text-zinc-500">
            <span className="inline-flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden />
              <b className="font-semibold text-zinc-600 dark:text-zinc-300">
                {advisor.rating.toFixed(1)}
              </b>
              ({advisor.review_count})
            </span>
            <span className="inline-flex items-center gap-1">
              <Briefcase className="h-3.5 w-3.5" aria-hidden />
              {advisor.experience_years} yrs
            </span>
            <span
              className={cn(
                "inline-flex items-center gap-1 font-semibold",
                advisor.available
                  ? "text-safety-600 dark:text-safety-300"
                  : "text-zinc-400 dark:text-zinc-500"
              )}
            >
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  advisor.available ? "bg-safety-500" : "bg-zinc-300 dark:bg-zinc-600"
                )}
                aria-hidden
              />
              {advisor.available ? "Available" : "On leave"}
            </span>
          </p>
        </div>
      </div>

      <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
        {advisor.bio}
      </p>

      <div className="flex flex-wrap gap-1.5">
        {advisor.focus_areas.map((area) => (
          <span
            key={area}
            className="rounded-full bg-zinc-900/5 px-2.5 py-1 text-[11px] font-medium text-zinc-600 dark:bg-white/10 dark:text-zinc-300"
          >
            {area}
          </span>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-zinc-200/60 pt-4 dark:border-white/10">
        {request ? (
          <span
            className={cn(
              "inline-flex items-center gap-1.5 text-xs font-semibold",
              accepted
                ? "text-safety-600 dark:text-safety-300"
                : "text-reach-600 dark:text-reach-300"
            )}
          >
            {accepted ? (
              <>
                <CheckCircle2 className="h-4 w-4" aria-hidden /> Accepted
              </>
            ) : (
              <>
                <Clock className="h-4 w-4" aria-hidden /> Request {request.status}
              </>
            )}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs text-zinc-400 dark:text-zinc-500">
            <CalendarClock className="h-3.5 w-3.5" aria-hidden />
            Free 15-minute intro session
          </span>
        )}
        <Button
          variant={request ? "ghost" : "glass"}
          disabled={Boolean(request)}
          onClick={() => onRequest(advisor)}
        >
          {request ? "Requested" : "Request a session"}
        </Button>
      </div>
    </div>
  );
}
