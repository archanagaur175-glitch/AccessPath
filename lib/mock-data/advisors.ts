import type { Advisor, AdvisorRequest } from "@/lib/supabase/types";

/**
 * Seeded advisor directory for the demo. Advisors are illustrative profiles.
 * The "request" flow creates AdvisorRequest rows that persist per student.
 */

export const demoAdvisors: Advisor[] = [
  {
    id: "adv-01",
    name: "Dr. Helena Marsh",
    title: "College Admissions Counselor",
    bio: "Former regional admissions director with 18 years across selective liberal arts and research universities. Coaches narrative essays and fit-based choice.",
    focus_areas: ["Personal essays", "College list", "Interviews"],
    experience_years: 18,
    rating: 4.9,
    review_count: 312,
    avatarColor: "bg-indigo-500",
    available: true,
  },
  {
    id: "adv-02",
    name: "Marcus Webb",
    title: "Financial Aid Specialist",
    bio: "Helped families navigate FAFSA, CSS Profile, and merit negotiation at public and private institutions. Focus: making the money work.",
    focus_areas: ["Financial aid", "Scholarships", "FAFSA"],
    experience_years: 11,
    rating: 4.8,
    review_count: 187,
    avatarColor: "bg-emerald-500",
    available: true,
  },
  {
    id: "adv-03",
    name: "Priya Sharma",
    title: "STEM Admissions Mentor",
    bio: "MIT graduate and mentor for first-generation applicants targeting engineering and CS programs, from campus research to activity impact stories.",
    focus_areas: ["STEM programs", "Research", "Activity impact"],
    experience_years: 7,
    rating: 4.9,
    review_count: 96,
    avatarColor: "bg-violet-500",
    available: true,
  },
  {
    id: "adv-04",
    name: "Tomás Rivera",
    title: "Transfer & Community College Guide",
    bio: "Specializes in community-college-to-university transfer pathways, articulation agreements, and supplemental essays for transfer applicants.",
    focus_areas: ["Transfer", "Supplemental essays", "Two-year paths"],
    experience_years: 9,
    rating: 4.7,
    review_count: 141,
    avatarColor: "bg-amber-500",
    available: false,
  },
  {
    id: "adv-05",
    name: "Dr. Amara Okafor",
    title: "Test-Optional & Whole-File Reviewer",
    bio: "Reads files the way committees do — coaching applicants to make every section of the application earn its place, test scores or none.",
    focus_areas: ["Test-optional", "Application strategy", "Letters of rec"],
    experience_years: 13,
    rating: 4.8,
    review_count: 204,
    avatarColor: "bg-rose-500",
    available: true,
  },
  {
    id: "adv-06",
    name: "Jordan Lee",
    title: "International & Aid-Aware Coach",
    bio: "Former international applicant and current graduate researcher; coaches on campus-fit research, financial documentation, and the why-us essay.",
    focus_areas: ["International", "Why-this-college", "Aid strategies"],
    experience_years: 6,
    rating: 4.6,
    review_count: 73,
    avatarColor: "bg-sky-500",
    available: true,
  },
];

export function getDemoAdvisors(): Advisor[] {
  return demoAdvisors;
}

export function getDemoAdvisorRequests(studentId: string): AdvisorRequest[] {
  if (studentId !== "user-demo-student") return [];
  return [
    {
      id: "req-01",
      student_id: "user-demo-student",
      advisor_id: "adv-01",
      message:
        "Hi Dr. Marsh — I'd love a review of my personal-essay outline before I rebuild it for UT. I have the draft for 'The Switchboard'.",
      status: "pending",
      created_at: "2026-08-12T15:00:00Z",
    },
    {
      id: "req-02",
      student_id: "user-demo-student",
      advisor_id: "adv-05",
      message:
        "I'm applying test-optional and want to know if my activity list reads as well as my stats. Can we do a whole-file pass?",
      status: "accepted",
      created_at: "2026-08-05T10:00:00Z",
    },
  ];
}
