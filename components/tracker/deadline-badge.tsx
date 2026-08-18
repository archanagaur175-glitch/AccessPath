import { CalendarClock } from "lucide-react";
import { cn } from "@/lib/utils";
import { daysUntil } from "@/lib/data/applications-client";

interface DeadlineBadgeProps {
  deadline: string;
  className?: string;
}

export function DeadlineBadge({ deadline, className }: DeadlineBadgeProps) {
  const days = daysUntil(deadline);

  const tone =
    days < 0
      ? "bg-red-500/15 text-red-700 dark:bg-red-500/25 dark:text-red-300"
      : days <= 7
        ? "bg-red-500/15 text-red-700 dark:bg-red-500/25 dark:text-red-300"
        : days <= 28
          ? "bg-reach-500/15 text-reach-700 dark:bg-reach-500/25 dark:text-reach-300"
          : "bg-safety-500/15 text-safety-700 dark:bg-safety-500/25 dark:text-safety-300";

  const label =
    days < 0
      ? `Past due by ${Math.abs(days)}d`
      : days === 0
        ? "Due today"
        : days === 1
          ? "Due tomorrow"
          : `${days}d left`;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold",
        tone,
        className
      )}
      title={`Deadline ${new Date(deadline).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}`}
    >
      <CalendarClock className="h-3 w-3" aria-hidden />
      {label}
    </span>
  );
}
