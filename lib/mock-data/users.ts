import type { User } from "@/lib/supabase/types";

export const mockUsers: User[] = [
  {
    id: "user-demo-student",
    role: "student",
    name: "Avery Chen",
    email: "demo@accesspath.app",
    created_at: "2026-01-10T09:00:00Z",
  },
  {
    id: "user-demo-advisor",
    role: "advisor",
    name: "Dana Whitfield",
    email: "advisor@accesspath.app",
    created_at: "2026-01-10T09:00:00Z",
  },
  {
    id: "user-r-01",
    role: "student",
    name: "Priya Nair",
    email: "priya@example.edu",
    created_at: "2026-02-02T14:30:00Z",
  },
  {
    id: "user-r-02",
    role: "student",
    name: "Marcus Reid",
    email: "marcus@example.edu",
    created_at: "2026-02-14T11:00:00Z",
  },
  {
    id: "user-r-03",
    role: "student",
    name: "Sofia Alvarez",
    email: "sofia@example.edu",
    created_at: "2026-03-01T16:45:00Z",
  },
  {
    id: "user-r-04",
    role: "student",
    name: "Jamal Brooks",
    email: "jamal@example.edu",
    created_at: "2026-03-20T10:15:00Z",
  },
  {
    id: "user-r-05",
    role: "student",
    name: "Elena Rodriguez",
    email: "elena@example.edu",
    created_at: "2026-04-05T08:30:00Z",
  },
  {
    id: "user-r-06",
    role: "student",
    name: "Noah Kim",
    email: "noah@example.edu",
    created_at: "2026-04-18T13:20:00Z",
  },
];

export const MOCK_USER_STORAGE_KEY = "accesspath:mock-user";

export function findMockUserByEmail(email: string): User | undefined {
  return mockUsers.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
}
