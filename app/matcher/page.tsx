import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { MatcherView } from "@/components/matcher/matcher-view";

export const metadata: Metadata = {
  title: "College Matcher",
};

export default function MatcherPage() {
  return (
    <AppShell>
      <MatcherView />
    </AppShell>
  );
}
