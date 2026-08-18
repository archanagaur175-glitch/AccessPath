"use client";

import type { Application, ApplicationStatus } from "@/lib/supabase/types";
import { MilestoneCard } from "@/components/tracker/milestone-card";
import { cn } from "@/lib/utils";

interface KanbanColumnProps {
  status: ApplicationStatus;
  label: string;
  accent: string;
  dotClass: string;
  count: number;
  apps: (Application & {
    collegeName: string;
    category: "reach" | "target" | "safety";
  })[];
  isDropTarget: boolean;
  onDropOnColumn: (status: ApplicationStatus) => void;
  onOpen: (app: Application) => void;
  onMove: (app: Application, direction: "left" | "right") => void;
  onDragStart: (app: Application) => void;
  onDragEnd: () => void;
}

export function KanbanColumn({
  status,
  label,
  accent,
  dotClass,
  count,
  apps,
  isDropTarget,
  onDropOnColumn,
  onOpen,
  onMove,
  onDragStart,
  onDragEnd,
}: KanbanColumnProps) {
  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
      }}
      onDrop={(event) => {
        event.preventDefault();
        onDropOnColumn(status);
      }}
      aria-label={`${label} column`}
      className={cn(
        "flex min-h-[260px] flex-col rounded-3xl border p-3 transition-all duration-300",
        "border-zinc-200/70 bg-zinc-50/60 dark:border-white/10 dark:bg-white/[0.03]",
        isDropTarget && "border-brand-400 bg-brand-500/5 dark:bg-brand-500/10"
      )}
    >
      <div className="mb-3 flex items-center justify-between px-1">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-200">
          <span className={cn("h-2 w-2 rounded-full", dotClass)} aria-hidden />
          {label}
          <span className="rounded-full bg-zinc-900/5 px-2 py-0.5 text-xs font-bold text-zinc-500 dark:bg-white/10 dark:text-zinc-400">
            {count}
          </span>
        </h3>
        {isDropTarget ? (
          <span className="rounded-full bg-brand-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-300">
            Drop here
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-2.5">
        {apps.length === 0 ? (
          <div
            className={cn(
              "flex flex-1 items-center justify-center rounded-2xl border border-dashed px-4 py-8 text-center text-xs text-zinc-400",
              "dark:text-zinc-500"
            )}
          >
            {label === "Accepted" ? "No acceptances yet" : "Drop a card here"}
          </div>
        ) : (
          apps.map((item) => (
            <MilestoneCard
              key={item.id}
              application={item}
              collegeName={item.collegeName}
              category={item.category}
              onOpen={onOpen}
              onMove={onMove}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
            />
          ))
        )}
      </div>

      <span className={cn("mt-2 h-0.5 w-full rounded-full", accent)} aria-hidden />
    </div>
  );
}
