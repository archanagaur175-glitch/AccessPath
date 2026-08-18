import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { RosterView } from "@/components/advisor/roster-view";
import { getConnectedStudents } from "@/lib/data/profiles";

export const metadata: Metadata = {
  title: "Advisor Workspace",
};

export default async function AdvisorPage() {
  const students = await getConnectedStudents();

  return (
    <AppShell>
      <div className="animate-fade-up space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">
            Student Roster
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-300">
            A read-only overview of the students connected to you.
          </p>
        </div>
        <RosterView students={students} />
      </div>
    </AppShell>
  );
}
