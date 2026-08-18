import { ArrowUpRight, BadgeCheck, MapPin } from "lucide-react";
import type { Resource, ResourceType } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

const TYPE_TONES: Record<ResourceType, string> = {
  program: "bg-target-500/15 text-target-700 dark:text-target-300",
  scholarship: "bg-safety-500/15 text-safety-700 dark:text-safety-300",
  guide: "bg-violet-500/15 text-violet-700 dark:text-violet-300",
};

const TYPE_LABEL: Record<ResourceType, string> = {
  program: "Program",
  scholarship: "Scholarship",
  guide: "Guide",
};

export function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="glass group flex flex-col gap-3 rounded-3xl p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-400/60 hover:shadow-glass"
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-[10px] font-semibold",
            TYPE_TONES[resource.type]
          )}
        >
          {TYPE_LABEL[resource.type]}
        </span>
        <ArrowUpRight
          className="h-4 w-4 shrink-0 text-zinc-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand-500 dark:text-zinc-600"
          aria-hidden
        />
      </div>

      <h2 className="font-display text-lg font-bold leading-snug text-zinc-900 group-hover:text-brand-700 dark:text-white dark:group-hover:text-brand-300">
        {resource.title}
      </h2>

      <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
        {resource.description}
      </p>

      <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
        {resource.organization ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-zinc-900/5 px-2.5 py-1 text-[11px] font-medium text-zinc-600 dark:bg-white/10 dark:text-zinc-300">
            <BadgeCheck className="h-3 w-3" aria-hidden />
            {resource.organization}
          </span>
        ) : null}
        {resource.region ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-zinc-900/5 px-2.5 py-1 text-[11px] font-medium text-zinc-600 dark:bg-white/10 dark:text-zinc-300">
            <MapPin className="h-3 w-3" aria-hidden />
            {resource.region}
          </span>
        ) : null}
      </div>

      {resource.tags.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {resource.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-zinc-900/[0.03] px-1.5 py-0.5 text-[10px] text-zinc-400 dark:bg-white/5 dark:text-zinc-500"
            >
              {tag.replace(/-/g, " ")}
            </span>
          ))}
        </div>
      ) : null}
    </a>
  );
}
