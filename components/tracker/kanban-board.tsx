"use client";

import { useCallback, useEffect, useState } from "react";
import { Grip } from "lucide-react";
import type {
  Application,
  ApplicationStatus,
  CollegeCategory,
} from "@/lib/supabase/types";
import { useSession } from "@/lib/auth/session-context";
import {
  getClientApplications,
  updateClientApplication,
} from "@/lib/data/applications-client";
import { mockColleges } from "@/lib/mock-data/colleges";
import { getMatchCategory } from "@/lib/matching/scoring-engine";
import { STATUS_META, STATUS_ORDER } from "@/lib/mock-data/applications";
import { KanbanColumn } from "@/components/tracker/kanban-column";
import { ChecklistModal } from "@/components/tracker/checklist-modal";
import { Card } from "@/components/ui/card";
import { PageSkeleton } from "@/components/ui/skeleton";

type Enriched = Application & {
  collegeName: string;
  category: CollegeCategory;
};

const ACCENTS: Record<ApplicationStatus, string> = {
  todo: "bg-zinc-400",
  in_progress: "bg-target-400",
  essay_review: "bg-violet-400",
  submitted: "bg-reach-400",
  accepted: "bg-safety-400",
};

const DOTS: Record<ApplicationStatus, string> = {
  todo: "bg-zinc-400",
  in_progress: "bg-target-500",
  essay_review: "bg-violet-500",
  submitted: "bg-reach-500",
  accepted: "bg-safety-500",
};

export function KanbanBoard() {
  const { user, status } = useSession();
  const [apps, setApps] = useState<Enriched[]>([]);
  const [loading, setLoading] = useState(true);
  const [popover, setPopover] = useState<Enriched | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropColumn, setDropColumn] = useState<ApplicationStatus | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!user?.id) return;
      setLoading(true);
      try {
        const list = await getClientApplications(user.id);
        if (!cancelled) setApps(enrich(list));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const update = useCallback(
    async (app: Application) => {
      if (!user) return;
      try {
        const next = await updateClientApplication(user.id, app);
        setApps(enrich(next));
      } catch {
        // keep local state; persistence failure is non-fatal
        setApps((prev) =>
          enrich(prev.map((a) => (a.id === app.id ? { ...enrichOne(app) } : a)))
        );
      }
    },
    [user]
  );

  const moveStatus = useCallback(
    async (app: Application, to: ApplicationStatus) => {
      await update({ ...app, status: to });
    },
    [update]
  );

  const moveDirection = useCallback(
    (app: Application, direction: "left" | "right") => {
      const idx = STATUS_ORDER.indexOf(app.status);
      const next =
        direction === "left"
          ? STATUS_ORDER[Math.max(idx - 1, 0)]
          : STATUS_ORDER[Math.min(idx + 1, STATUS_ORDER.length - 1)];
      void moveStatus(app, next);
    },
    [moveStatus]
  );

  if (status === "loading" || loading) {
    return <PageSkeleton />;
  }

  if (status === "unauthenticated" || !user) {
    return (
      <Card variant="glass" className="p-10 text-center">
        <h2 className="font-display text-xl font-bold">
          Sign in to track your applications
        </h2>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          Your tracker lives with your account.
        </p>
      </Card>
    );
  }

  if (user.role === "advisor") {
    return (
      <Card variant="glass" className="p-10 text-center">
        <h2 className="font-display text-xl font-bold">
          The tracker is a student workspace
        </h2>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          Explore it with the demo student&apos;s seeded applications, or sign in as a
          student.
        </p>
      </Card>
    );
  }

  return (
    <div className="animate-fade-up space-y-5">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">
          Application Tracker
        </h1>
        <p className="mt-2 flex flex-wrap items-center gap-2 text-zinc-600 dark:text-zinc-300">
          <Grip className="h-4 w-4 text-zinc-400" aria-hidden />
          Drag cards between columns, or use the arrows on each card. Click a card to edit
          its checklist.
        </p>
      </div>

      <div className="grid gap-3 lg:grid-cols-5">
        {STATUS_ORDER.map((columnStatus) => {
          const columnApps = apps.filter((a) => a.status === columnStatus);
          return (
            <KanbanColumn
              key={columnStatus}
              status={columnStatus}
              label={STATUS_META[columnStatus].label}
              accent={ACCENTS[columnStatus]}
              dotClass={DOTS[columnStatus]}
              count={columnApps.length}
              apps={columnApps}
              isDropTarget={dropColumn === columnStatus && draggingId !== null}
              onDropOnColumn={(to) => {
                setDropColumn(null);
                if (!draggingId) return;
                const dragged = apps.find((a) => a.id === draggingId);
                if (dragged) {
                  setDraggingId(null);
                  void moveStatus(dragged, to);
                }
              }}
              onHover={setDropColumn}
              onOpen={(app) => {
                const enriched = apps.find((a) => a.id === app.id);
                if (enriched) setPopover(enriched);
              }}
              onMove={moveDirection}
              onDragStart={(app) => setDraggingId(app.id)}
              onDragEnd={() => setDraggingId(null)}
            />
          );
        })}
      </div>

      {popover ? (
        <ChecklistModal
          app={popover}
          collegeName={popover.collegeName}
          category={popover.category}
          onClose={() => setPopover(null)}
          onSave={(updated) => void update(updated)}
        />
      ) : null}
    </div>
  );
}

function enrichOne(app: Application): Enriched {
  const college = mockColleges.find((c) => c.id === app.college_id);
  return {
    ...app,
    collegeName: college?.name ?? "Unknown college",
    category: getMatchCategory(college?.admit_rate ?? 0.5),
  };
}

function enrich(list: Application[]): Enriched[] {
  return list.map(enrichOne);
}
