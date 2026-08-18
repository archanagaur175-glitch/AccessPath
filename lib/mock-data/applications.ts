import type { Application, ApplicationStatus, ChecklistItem } from "@/lib/supabase/types";

/**
 * Seeded applications for the demo student (Avery Chen). Deadlines are set
 * relative to August 2026 so the urgency coloring is visible out of the box.
 */

const baseChecklist = (): ChecklistItem[] => [
  { id: "ck-essay", label: "Personal essay", done: false },
  { id: "ck-rec", label: "Recommendations", done: false },
  { id: "ck-tests", label: "Test scores sent", done: false },
  { id: "ck-forms", label: "Application forms", done: false },
];

export const demoApplications: Application[] = [
  {
    id: "app-01",
    student_id: "user-demo-student",
    college_id: "c-stanford",
    status: "todo",
    deadline: "2026-12-02",
    checklist: baseChecklist(),
    notes: "Long-shot dream school — EA only if the essay is polished.",
    updated_at: "2026-08-10T10:00:00Z",
  },
  {
    id: "app-02",
    student_id: "user-demo-student",
    college_id: "c-harvard",
    status: "todo",
    deadline: "2027-01-01",
    checklist: baseChecklist(),
    notes: "",
    updated_at: "2026-08-12T14:00:00Z",
  },
  {
    id: "app-03",
    student_id: "user-demo-student",
    college_id: "c-mit",
    status: "todo",
    deadline: "2027-01-01",
    checklist: [
      { id: "ck-essay", label: "Personal essay", done: false },
      { id: "ck-rec", label: "Recommendations", done: true },
      { id: "ck-tests", label: "Test scores sent", done: false },
      { id: "ck-forms", label: "Application forms", done: false },
    ],
    notes: "",
    updated_at: "2026-08-14T09:30:00Z",
  },
  {
    id: "app-04",
    student_id: "user-demo-student",
    college_id: "c-michigan",
    status: "in_progress",
    deadline: "2027-01-15",
    checklist: [
      { id: "ck-essay", label: "Personal essay", done: false },
      { id: "ck-rec", label: "Recommendations", done: false },
      { id: "ck-tests", label: "Test scores sent", done: true },
      { id: "ck-forms", label: "Application forms", done: false },
    ],
    notes: "Strong CS program and in-state tuition vibes.",
    updated_at: "2026-08-15T11:00:00Z",
  },
  {
    id: "app-05",
    student_id: "user-demo-student",
    college_id: "c-ut-austin",
    status: "essay_review",
    deadline: "2026-12-01",
    checklist: [
      { id: "ck-essay", label: "Personal essay", done: true },
      { id: "ck-rec", label: "Recommendations", done: false },
      { id: "ck-tests", label: "Test scores sent", done: true },
      { id: "ck-forms", label: "Application forms", done: true },
    ],
    notes: "Essay draft with the Essay Coach in review.",
    updated_at: "2026-08-16T16:00:00Z",
  },
  {
    id: "app-06",
    student_id: "user-demo-student",
    college_id: "c-uiuc",
    status: "essay_review",
    deadline: "2027-01-05",
    checklist: [
      { id: "ck-essay", label: "Personal essay", done: true },
      { id: "ck-rec", label: "Recommendations", done: true },
      { id: "ck-tests", label: "Test scores sent", done: true },
      { id: "ck-forms", label: "Application forms", done: false },
    ],
    notes: "",
    updated_at: "2026-08-17T09:00:00Z",
  },
  {
    id: "app-07",
    student_id: "user-demo-student",
    college_id: "c-gatech",
    status: "submitted",
    deadline: "2027-01-04",
    checklist: [
      { id: "ck-essay", label: "Personal essay", done: true },
      { id: "ck-rec", label: "Recommendations", done: true },
      { id: "ck-tests", label: "Test scores sent", done: true },
      { id: "ck-forms", label: "Application forms", done: true },
    ],
    notes: "EA deadline met. Awaiting decision.",
    updated_at: "2026-07-20T12:00:00Z",
  },
  {
    id: "app-08",
    student_id: "user-demo-student",
    college_id: "c-wisconsin",
    status: "submitted",
    deadline: "2027-01-15",
    checklist: [
      { id: "ck-essay", label: "Personal essay", done: true },
      { id: "ck-rec", label: "Recommendations", done: true },
      { id: "ck-tests", label: "Test scores sent", done: true },
      { id: "ck-forms", label: "Application forms", done: true },
    ],
    notes: "",
    updated_at: "2026-07-25T15:00:00Z",
  },
  {
    id: "app-09",
    student_id: "user-demo-student",
    college_id: "c-purdue",
    status: "submitted",
    deadline: "2027-01-15",
    checklist: baseChecklist().map((item) => ({ ...item, done: true })),
    notes: "",
    updated_at: "2026-08-01T10:00:00Z",
  },
  {
    id: "app-10",
    student_id: "user-demo-student",
    college_id: "c-asu",
    status: "accepted",
    deadline: "2026-08-01",
    checklist: baseChecklist().map((item) => ({ ...item, done: true })),
    notes: "Accepted with merit scholarship! Deciding by May 1.",
    updated_at: "2026-08-05T13:00:00Z",
  },
  {
    id: "app-11",
    student_id: "user-demo-student",
    college_id: "c-calpoly",
    status: "in_progress",
    deadline: "2026-11-30",
    checklist: [
      { id: "ck-essay", label: "Personal essay", done: false },
      { id: "ck-rec", label: "Recommendations", done: false },
      { id: "ck-tests", label: "Test scores sent", done: false },
      { id: "ck-forms", label: "Application forms", done: true },
    ],
    notes: "",
    updated_at: "2026-08-18T08:00:00Z",
  },
];

export function getDemoApplications(): Application[] {
  return demoApplications;
}

export const STATUS_ORDER: ApplicationStatus[] = [
  "todo",
  "in_progress",
  "essay_review",
  "submitted",
  "accepted",
];

export const STATUS_META: Record<ApplicationStatus, { label: string; color: string }> = {
  todo: { label: "To Do", color: "zinc" },
  in_progress: { label: "In Progress", color: "blue" },
  essay_review: { label: "Essay Review", color: "violet" },
  submitted: { label: "Submitted", color: "amber" },
  accepted: { label: "Accepted", color: "green" },
};
