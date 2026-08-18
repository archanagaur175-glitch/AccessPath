import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { KanbanBoard } from "@/components/tracker/kanban-board";

export const metadata: Metadata = {
  title: "Application Tracker",
};

export default function TrackerPage() {
  return (
    <AppShell>
      <KanbanBoard />
    </AppShell>
  );
}
