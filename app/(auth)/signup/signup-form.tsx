"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, UserPlus, GraduationCap, User } from "lucide-react";
import { useSession } from "@/lib/auth/session-context";
import type { UserRole } from "@/lib/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const roles: {
  value: UserRole;
  label: string;
  description: string;
  icon: typeof User;
}[] = [
  {
    value: "student",
    label: "Student",
    description: "I'm applying to college",
    icon: User,
  },
  {
    value: "advisor",
    label: "Advisor",
    description: "I counsel students",
    icon: GraduationCap,
  },
];

export function SignupForm() {
  const router = useRouter();
  const { signUp } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await signUp(email, password, name, role);
      if (result.ok) {
        router.push(role === "advisor" ? "/dashboard" : "/profile");
      } else {
        setError(result.error ?? "Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          I am a…
        </legend>
        <div className="grid grid-cols-2 gap-3">
          {roles.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setRole(option.value)}
              aria-pressed={role === option.value}
              className={cn(
                "flex flex-col items-start gap-1.5 rounded-2xl border p-4 text-left transition-all duration-200",
                role === option.value
                  ? "border-brand-500 bg-brand-500/10 shadow-glow-brand"
                  : "border-zinc-300 bg-white/50 hover:border-brand-400 dark:border-white/15 dark:bg-white/5"
              )}
            >
              <option.icon
                className={cn(
                  "h-5 w-5",
                  role === option.value
                    ? "text-brand-600 dark:text-brand-300"
                    : "text-zinc-400"
                )}
                aria-hidden
              />
              <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                {option.label}
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {option.description}
              </span>
            </button>
          ))}
        </div>
      </fieldset>

      <div className="space-y-1.5">
        <Label htmlFor="name">Full name</Label>
        <Input
          id="name"
          autoComplete="name"
          required
          placeholder="Alex Johnson"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
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
          autoComplete="new-password"
          required
          minLength={6}
          placeholder="At least 6 characters"
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
          <UserPlus className="h-4 w-4" aria-hidden />
        )}
        Create account
      </Button>

      <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
        Free forever. No credit card. No paywalls. Your data stays yours.
      </p>
    </form>
  );
}
