"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LogIn, FlaskConical } from "lucide-react";
import { useSession } from "@/lib/auth/session-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const router = useRouter();
  const { signIn } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await signIn(email, password);
      if (result.ok) {
        router.push("/dashboard");
      } else {
        setError(result.error ?? "Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("demo1234");
    setError(null);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.edu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {error ? (
        <p
          role="alert"
          className="rounded-xl bg-red-500/10 px-3.5 py-2.5 text-sm text-red-700 dark:text-red-300"
        >
          {error}
        </p>
      ) : null}

      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        ) : (
          <LogIn className="h-4 w-4" aria-hidden />
        )}
        Sign in
      </Button>

      <div className="rounded-2xl border border-dashed border-brand-500/40 bg-brand-500/5 p-4">
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-300">
          <FlaskConical className="h-3.5 w-3.5" aria-hidden />
          Demo mode
        </p>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
          No credentials are configured, so AccessPath runs on mock data. Try a demo
          account with any password:
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => fillDemo("demo@accesspath.app")}
            className="rounded-full bg-brand-500/15 px-3 py-1.5 text-xs font-medium text-brand-700 transition-colors hover:bg-brand-500/25 dark:text-brand-300"
          >
            demo@accesspath.app · Student
          </button>
          <button
            type="button"
            onClick={() => fillDemo("advisor@accesspath.app")}
            className="rounded-full bg-brand-500/15 px-3 py-1.5 text-xs font-medium text-brand-700 transition-colors hover:bg-brand-500/25 dark:text-brand-300"
          >
            advisor@accesspath.app · Advisor
          </button>
        </div>
      </div>
    </form>
  );
}
