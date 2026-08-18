import type { StudentProfile, User } from "@/lib/supabase/types";

/**
 * Seeded student profiles. The demo student (Avery Chen) has a rich profile so
 * the matcher, tracker, and essay coach have real data to work with. The roster
 * students power the advisor's read-only view.
 */
export const demoStudentProfile: StudentProfile = {
  id: "profile-demo",
  user_id: "user-demo-student",
  gpa: 3.72,
  test_scores: [
    { id: "ts-1", name: "SAT", value: "1420", percentile: 95 },
    { id: "ts-2", name: "ACT", value: "31", percentile: 93 },
  ],
  coursework: [
    { id: "cw-1", course: "AP Computer Science A", level: "ap", grade: "A" },
    { id: "cw-2", course: "Honors English IV", level: "honors", grade: "A-" },
    { id: "cw-3", course: "AP Psychology", level: "ap", grade: "B+" },
    { id: "cw-4", course: "Pre-Calculus", level: "standard", grade: "A" },
    { id: "cw-5", course: "IB Biology SL", level: "ib", grade: "A" },
  ],
  extracurriculars: [
    {
      id: "ec-1",
      activity: "Robotics Club",
      role: "Team Captain",
      years: 3,
      hours_per_week: 8,
      impact:
        "Led a 12-person team to the state finals; mentored first-year members and ran weekly build sessions.",
    },
    {
      id: "ec-2",
      activity: "Student Newspaper",
      role: "Tech Editor",
      years: 2,
      hours_per_week: 5,
      impact:
        "Built the paper's first digital edition and grew online readership by 40%.",
    },
    {
      id: "ec-3",
      activity: "Library Volunteer Program",
      role: "Volunteer",
      years: 2,
      hours_per_week: 3,
      impact: "Ran a weekly homework-help desk serving ~25 students per semester.",
    },
    {
      id: "ec-4",
      activity: "Tutoring (Math)",
      role: "Tutor",
      years: 3,
      hours_per_week: 4,
      impact:
        "Tutored algebra and geometry to underclassmen; improved pass rates in tutee group.",
    },
  ],
  interests: ["technology", "psychology", "public policy"],
  intended_majors: ["Computer Science", "Cognitive Science"],
  budget_range: { min: 20000, max: 45000 },
  needs_financial_aid: true,
  class_rank: "Top 15%",
  created_at: "2026-01-10T09:00:00Z",
  updated_at: "2026-07-01T12:00:00Z",
};

export interface RosterStudent {
  user: User;
  profile: StudentProfile;
  joined_at: string;
}

export const rosterStudents: RosterStudent[] = [
  {
    user: {
      id: "user-r-01",
      role: "student",
      name: "Priya Nair",
      email: "priya@example.edu",
      created_at: "2026-02-02T14:30:00Z",
    },
    joined_at: "2026-02-02T14:30:00Z",
    profile: {
      id: "profile-r-01",
      user_id: "user-r-01",
      gpa: 3.9,
      test_scores: [{ id: "ts-r01", name: "SAT", value: "1510", percentile: 98 }],
      coursework: [
        { id: "cw-r01-1", course: "AP Calculus BC", level: "ap", grade: "A" },
        { id: "cw-r01-2", course: "AP Physics C", level: "ap", grade: "A" },
      ],
      extracurriculars: [
        {
          id: "ec-r01",
          activity: "Science Olympiad",
          role: "Captain",
          years: 4,
          hours_per_week: 10,
          impact: "Led team to two state championships.",
        },
      ],
      interests: ["engineering", "robotics"],
      intended_majors: ["Mechanical Engineering"],
      budget_range: { min: 15000, max: 35000 },
      needs_financial_aid: true,
      created_at: "2026-02-02T14:30:00Z",
      updated_at: "2026-07-02T09:00:00Z",
    },
  },
  {
    user: {
      id: "user-r-02",
      role: "student",
      name: "Marcus Reid",
      email: "marcus@example.edu",
      created_at: "2026-02-14T11:00:00Z",
    },
    joined_at: "2026-02-14T11:00:00Z",
    profile: {
      id: "profile-r-02",
      user_id: "user-r-02",
      gpa: 3.4,
      test_scores: [{ id: "ts-r02", name: "ACT", value: "27", percentile: 82 }],
      coursework: [
        { id: "cw-r02-1", course: "Honors Chemistry", level: "honors", grade: "B" },
        { id: "cw-r02-2", course: "AP US History", level: "ap", grade: "B+" },
      ],
      extracurriculars: [
        {
          id: "ec-r02",
          activity: "Varsity Basketball",
          role: "Point Guard",
          years: 3,
          hours_per_week: 12,
          impact: "Team captain; organized community youth clinics.",
        },
      ],
      interests: ["sports management", "business"],
      intended_majors: ["Business Administration"],
      budget_range: { min: 10000, max: 25000 },
      needs_financial_aid: true,
      created_at: "2026-02-14T11:00:00Z",
      updated_at: "2026-06-20T16:00:00Z",
    },
  },
  {
    user: {
      id: "user-r-03",
      role: "student",
      name: "Sofia Alvarez",
      email: "sofia@example.edu",
      created_at: "2026-03-01T16:45:00Z",
    },
    joined_at: "2026-03-01T16:45:00Z",
    profile: {
      id: "profile-r-03",
      user_id: "user-r-03",
      gpa: 3.6,
      test_scores: [{ id: "ts-r03", name: "SAT", value: "1330", percentile: 88 }],
      coursework: [
        { id: "cw-r03-1", course: "AP Spanish", level: "ap", grade: "A" },
        {
          id: "cw-r03-2",
          course: "Honors World Literature",
          level: "honors",
          grade: "A-",
        },
      ],
      extracurriculars: [
        {
          id: "ec-r03",
          activity: "Debate Team",
          role: "Vice President",
          years: 4,
          hours_per_week: 7,
          impact: "Coached novices and organized the regional qualifier.",
        },
      ],
      interests: ["political science", "journalism"],
      intended_majors: ["Political Science", "Journalism"],
      budget_range: { min: 18000, max: 30000 },
      needs_financial_aid: true,
      created_at: "2026-03-01T16:45:00Z",
      updated_at: "2026-07-05T10:30:00Z",
    },
  },
  {
    user: {
      id: "user-r-04",
      role: "student",
      name: "Jamal Brooks",
      email: "jamal@example.edu",
      created_at: "2026-03-20T10:15:00Z",
    },
    joined_at: "2026-03-20T10:15:00Z",
    profile: {
      id: "profile-r-04",
      user_id: "user-r-04",
      gpa: 3.25,
      test_scores: [{ id: "ts-r04", name: "ACT", value: "24", percentile: 68 }],
      coursework: [
        { id: "cw-r04-1", course: "Standard Biology", level: "standard", grade: "B+" },
        { id: "cw-r04-2", course: "Honors English III", level: "honors", grade: "B" },
      ],
      extracurriculars: [
        {
          id: "ec-r04",
          activity: "Auto Shop / Maker Club",
          role: "Founder",
          years: 2,
          hours_per_week: 9,
          impact: "Founded a repair-and-build club serving 20 members.",
        },
      ],
      interests: ["automotive", "design"],
      intended_majors: ["Industrial Design"],
      budget_range: { min: 8000, max: 20000 },
      needs_financial_aid: true,
      created_at: "2026-03-20T10:15:00Z",
      updated_at: "2026-06-01T08:00:00Z",
    },
  },
  {
    user: {
      id: "user-r-05",
      role: "student",
      name: "Elena Rodriguez",
      email: "elena@example.edu",
      created_at: "2026-04-05T08:30:00Z",
    },
    joined_at: "2026-04-05T08:30:00Z",
    profile: {
      id: "profile-r-05",
      user_id: "user-r-05",
      gpa: 3.85,
      test_scores: [{ id: "ts-r05", name: "SAT", value: "1480", percentile: 97 }],
      coursework: [
        { id: "cw-r05-1", course: "AP Biology", level: "ap", grade: "A" },
        { id: "cw-r05-2", course: "AP Statistics", level: "ap", grade: "A-" },
      ],
      extracurriculars: [
        {
          id: "ec-r05",
          activity: "Environmental Club",
          role: "President",
          years: 3,
          hours_per_week: 6,
          impact: "Organized a campus composting program adopted district-wide.",
        },
      ],
      interests: ["environmental science", "public health"],
      intended_majors: ["Environmental Science"],
      budget_range: { min: 20000, max: 40000 },
      needs_financial_aid: true,
      created_at: "2026-04-05T08:30:00Z",
      updated_at: "2026-07-08T14:20:00Z",
    },
  },
  {
    user: {
      id: "user-r-06",
      role: "student",
      name: "Noah Kim",
      email: "noah@example.edu",
      created_at: "2026-04-18T13:20:00Z",
    },
    joined_at: "2026-04-18T13:20:00Z",
    profile: {
      id: "profile-r-06",
      user_id: "user-r-06",
      gpa: 3.52,
      test_scores: [{ id: "ts-r06", name: "ACT", value: "29", percentile: 90 }],
      coursework: [
        { id: "cw-r06-1", course: "AP Economics", level: "ap", grade: "B+" },
        { id: "cw-r06-2", course: "Honors Algebra II", level: "honors", grade: "A" },
      ],
      extracurriculars: [
        {
          id: "ec-r06",
          activity: "Investment Club",
          role: "Treasurer",
          years: 2,
          hours_per_week: 4,
          impact: "Managed the club budget and ran a paper-trading competition.",
        },
      ],
      interests: ["finance", "economics"],
      intended_majors: ["Finance", "Economics"],
      budget_range: { min: 12000, max: 30000 },
      needs_financial_aid: true,
      created_at: "2026-04-18T13:20:00Z",
      updated_at: "2026-06-28T11:45:00Z",
    },
  },
];

export function getRosterStudents(): RosterStudent[] {
  return rosterStudents;
}

export function getRosterStudentByUserId(userId: string): RosterStudent | undefined {
  return rosterStudents.find((r) => r.user.id === userId);
}
