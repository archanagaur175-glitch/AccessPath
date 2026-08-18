import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { ResourcesView } from "@/components/resources/resources-view";

export const metadata: Metadata = {
  title: "Resources & Advisors",
};

export default function ResourcesPage() {
  return (
    <AppShell>
      <ResourcesView />
    </AppShell>
  );
}
