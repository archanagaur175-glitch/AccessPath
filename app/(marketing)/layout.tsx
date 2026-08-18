import { MarketingHeader } from "@/components/layout/marketing-header";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingHeader />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-zinc-200/60 py-10 dark:border-white/10">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6">
          <Logo />
          <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
            AccessPath is a free, open-access college admissions &amp; counseling
            platform.
          </p>
          <ThemeToggle />
        </div>
      </footer>
    </div>
  );
}
