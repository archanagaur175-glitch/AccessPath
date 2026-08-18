"use client";

import { CheckSquare, Square, StickyNote } from "lucide-react";
import type { Application, ChecklistItem } from "@/lib/supabase/types";
import { Modal } from "@/components/ui/modal";
import { Badge, categoryLabel } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface ChecklistModalProps {
  app: Application | null;
  collegeName: string;
  category: "reach" | "target" | "safety";
  onClose: () => void;
  onSave: (updated: Application) => void;
}

export function ChecklistModal({
  app,
  collegeName,
  category,
  onClose,
  onSave,
}: ChecklistModalProps) {
  if (!app) return null;

  const toggleItem = (id: string) => {
    const checklist = app.checklist.map((item) =>
      item.id === id ? { ...item, done: !item.done } : item
    );
    onSave({ ...app, checklist });
  };

  const done = app.checklist.filter((c) => c.done).length;
  const total = app.checklist.length;

  return (
    <Modal
      open={Boolean(app)}
      onClose={onClose}
      title={collegeName}
      description={`Application checklist — ${done} of ${total} complete.`}
    >
      <div className="mt-5 space-y-4">
        <div>
          <Badge variant="category" category={category} className="mb-4">
            {categoryLabel(category)}
          </Badge>
          <ul className="space-y-2">
            {app.checklist.map((item: ChecklistItem) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-2xl border px-3.5 py-2.5 text-left text-sm transition-all duration-200",
                    item.done
                      ? "border-safety-500/40 bg-safety-500/10 text-zinc-500 line-through dark:text-zinc-400"
                      : "border-zinc-200 bg-white/60 hover:border-brand-400/60 dark:border-white/10 dark:bg-white/5"
                  )}
                  aria-pressed={item.done}
                >
                  {item.done ? (
                    <CheckSquare
                      className="h-4 w-4 shrink-0 text-safety-500"
                      aria-hidden
                    />
                  ) : (
                    <Square className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden />
                  )}
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            <StickyNote className="h-4 w-4" aria-hidden />
            Notes
          </label>
          <Textarea
            rows={3}
            value={app.notes ?? ""}
            placeholder="Deadlines to remember, contact emails, portal notes…"
            onChange={(e) => onSave({ ...app, notes: e.target.value })}
          />
        </div>

        <div className="flex justify-end">
          <Button variant="glass" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
}
