import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { EssayListView } from "@/components/essays/essay-list-view";

export const metadata: Metadata = {
  title: "Essay Coach",
};

export default function EssaysPage() {
  return (
    <AppShell>
      <EssayListView />
    </AppShell>
  );
}
