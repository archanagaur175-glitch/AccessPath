import { GraduationCap, MapPin, Wallet, HeartHandshake } from "lucide-react";
import type { RosterStudent } from "@/lib/mock-data/students";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function RosterView({ students }: { students: RosterStudent[] }) {
  if (students.length === 0) {
    return (
      <Card variant="glass" className="p-10 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-300">
          <GraduationCap className="h-7 w-7" aria-hidden />
        </div>
        <h2 className="mt-5 font-display text-xl font-bold">No students yet</h2>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          Students who connect with you will appear here with their profile summaries.
        </p>
      </Card>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {students.map(({ user, profile, joined_at }) => (
        <Card key={user.id} variant="glass" hoverable className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-brand text-sm font-bold text-white">
              {initials(user.name)}
            </div>
            <div className="min-w-0">
              <p className="truncate font-display font-semibold text-zinc-900 dark:text-white">
                {user.name}
              </p>
              <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                {user.email}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="brand">GPA {profile.gpa.toFixed(2)}</Badge>
            {profile.test_scores.map((ts) => (
              <Badge key={ts.id} variant="outline">
                {ts.name} {ts.value}
              </Badge>
            ))}
          </div>

          <div className="mt-4 space-y-2 text-sm">
            <p className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
              <GraduationCap className="h-4 w-4 shrink-0 text-brand-500" aria-hidden />
              <span className="truncate">
                {profile.intended_majors.length > 0
                  ? profile.intended_majors.join(" · ")
                  : "Major undecided"}
              </span>
            </p>
            <p className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
              <HeartHandshake className="h-4 w-4 shrink-0 text-brand-500" aria-hidden />
              {profile.extracurriculars.length} activities
            </p>
            <p className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
              <Wallet className="h-4 w-4 shrink-0 text-brand-500" aria-hidden />$
              {(profile.budget_range.min / 1000).toFixed(0)}k–$
              {(profile.budget_range.max / 1000).toFixed(0)}k/yr
              {profile.needs_financial_aid ? " · needs aid" : ""}
            </p>
            <p className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
              <MapPin className="h-4 w-4 shrink-0 text-brand-500" aria-hidden />
              Joined {formatDate(joined_at)}
            </p>
          </div>

          <div className="mt-4 border-t border-zinc-200/60 pt-3 text-xs text-zinc-500 dark:border-white/10 dark:text-zinc-400">
            Last updated {formatDate(profile.updated_at)}
          </div>
        </Card>
      ))}
    </div>
  );
}
