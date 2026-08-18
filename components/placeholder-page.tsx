import { Construction } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";

interface PlaceholderPageProps {
  title: string;
  description: string;
  phase: string;
}

export function PlaceholderPage({ title, description, phase }: PlaceholderPageProps) {
  return (
    <AppShell>
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card variant="glass" className="max-w-md p-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-600 dark:bg-brand-500/20 dark:text-brand-300">
            <Construction className="h-7 w-7" aria-hidden />
          </div>
          <h1 className="mt-5 font-display text-2xl font-bold">{title}</h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">{description}</p>
          <span className="mt-5 inline-flex items-center rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-300">
            {phase}
          </span>
        </Card>
      </div>
    </AppShell>
  );
}
