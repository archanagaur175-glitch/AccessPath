import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showWordmark?: boolean;
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-brand shadow-glow-brand",
        className
      )}
      aria-hidden
    >
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5 text-white"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 20 10 6l4 8 2-4 4 10" />
      </svg>
    </span>
  );
}

export function Logo({ className, showWordmark = true }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      {showWordmark ? (
        <span className="font-display text-lg font-bold tracking-tight text-zinc-900 dark:text-white">
          Access<span className="text-gradient">Path</span>
        </span>
      ) : null}
    </span>
  );
}
