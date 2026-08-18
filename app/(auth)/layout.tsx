import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute left-1/2 top-0 h-96 w-[600px] -translate-x-1/2 rounded-full bg-brand-500/15 blur-3xl dark:bg-brand-500/10" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl dark:bg-violet-500/5" />
      </div>
      <div className="relative flex items-center justify-between px-4 py-5 sm:px-6">
        <Logo />
        <ThemeToggle />
      </div>
      <main className="relative flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
