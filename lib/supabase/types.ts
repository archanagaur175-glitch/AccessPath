/**
 * Central type definitions for AccessPath.
 *
 * Domain types mirror the Supabase schema in `supabase/migrations` (see README)
 * but are fully usable standalone: every data-access function in `lib/data/*`
 * falls back to mock data when Supabase credentials are absent, so the
 * application is fully demoable with zero configuration.
 */

export type UserRole = "student" | "advisor";

export interface User {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  created_at: string;
}

export interface Extracurricular {
  id: string;
  activity: string;
  role: string;
  years: number;
  hours_per_week: number;
  impact: string;
}

export interface TestScore {
  id: string;
  name: string;
  value: string;
  percentile?: number;
}

export interface CourseworkEntry {
  id: string;
  course: string;
  level: "standard" | "honors" | "ap" | "ib" | "dual";
  grade: string;
}

export interface StudentProfile {
  id: string;
  user_id: string;
  gpa: number;
  test_scores: TestScore[];
  coursework: CourseworkEntry[];
  extracurriculars: Extracurricular[];
  interests: string[];
  intended_majors: string[];
  budget_range: {
    min: number;
    max: number;
  };
  needs_financial_aid: boolean;
  class_rank?: string;
  created_at: string;
  updated_at: string;
}

export type CollegeCategory = "reach" | "target" | "safety";

export interface College {
  id: string;
  name: string;
  admit_rate: number;
  avg_gpa: number;
  avg_test_score: number;
  tags: string[];
  location: string;
  tuition_estimate: number;
  description?: string;
  programs?: string[];
  deadline?: string;
}

export interface Match {
  id: string;
  student_id: string;
  college_id: string;
  strength_index: number;
  category: CollegeCategory;
  rationale: string[];
}

export type ApplicationStatus =
  "todo" | "in_progress" | "essay_review" | "submitted" | "accepted";

export interface ChecklistItem {
  id: string;
  label: string;
  done: boolean;
}

export interface Application {
  id: string;
  student_id: string;
  college_id: string;
  status: ApplicationStatus;
  deadline: string;
  checklist: ChecklistItem[];
  notes?: string;
  updated_at: string;
}

export interface EssayVersion {
  id: string;
  version: number;
  draft_text: string;
  updated_at: string;
  summary?: string;
}

export interface RubricFeedback {
  dimensions: RubricDimension[];
  redFlags: string[];
  overall: string;
}

export interface RubricDimension {
  name: string;
  score: number;
  note: string;
}

export interface Essay {
  id: string;
  student_id: string;
  application_id?: string;
  title: string;
  prompt_text: string;
  draft_text: string;
  rubric_feedback?: RubricFeedback;
  versions: EssayVersion[];
  updated_at: string;
}

export type ResourceType = "program" | "scholarship" | "guide";

export interface Resource {
  id: string;
  title: string;
  type: ResourceType;
  tags: string[];
  description: string;
  url: string;
  organization?: string;
  region?: string;
}

export interface Advisor {
  id: string;
  name: string;
  title: string;
  bio: string;
  focus_areas: string[];
  experience_years: number;
  rating: number;
  review_count: number;
  avatarColor: string;
  available: boolean;
}

export interface AdvisorRequest {
  id: string;
  student_id: string;
  advisor_id: string;
  message?: string;
  status: "pending" | "accepted" | "declined";
  created_at: string;
}
