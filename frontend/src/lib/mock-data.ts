import type { Application, AuditLogEntry, Company, Guide, ProjectSource, ProjectStatus, StudentProfile, User } from "./types";

// Hardcoded seed data for the fully client-side mock backend (see mock-store.ts).
// Mirrors the demo dataset the Django backend used to seed for local dev.

export interface RawProject {
  id: number;
  title: string;
  description: string;
  source: ProjectSource;
  status: ProjectStatus;
  company_id: number | null;
  assigned_professor_id: number | null;
  required_department: string;
  status_token: string;
  created_at: string;
  updated_at: string;
}

export type RawApplication = Omit<Application, "student" | "project"> & {
  student_id: number;
  project_id: number;
};

export type RawStudentProfile = Omit<StudentProfile, "student"> & { student_id: number };

export type RawAuditLogEntry = Omit<AuditLogEntry, "actor"> & { actor_id: number | null };

export const SEED_USERS: User[] = [
  { id: 1, role: "organizer", name: "Petra Huber", email: "petra.huber@tum.de", department: "" },
  {
    id: 2,
    role: "professor",
    name: "Prof. Dr. Reichert",
    email: "reichert@tum.de",
    department: "School of Management",
  },
  { id: 3, role: "professor", name: "Prof. Dr. Antz", email: "antz@tum.de", department: "Informatics" },
  { id: 4, role: "student", name: "Lea Fischer", email: "lea.fischer@tum.de", department: "" },
  { id: 5, role: "student", name: "Jonas Becker", email: "jonas.becker@tum.de", department: "" },
];

export const SEED_COMPANIES: Company[] = [
  {
    id: 1,
    name: "Bergpanorama Retail AG",
    contact_name: "Julia Adler",
    contact_email: "julia.adler@bergpanorama.example",
  },
  {
    id: 2,
    name: "Nordlicht Analytics GmbH",
    contact_name: "Tim Reuter",
    contact_email: "tim.reuter@nordlicht-analytics.example",
  },
];

export const SEED_PROJECTS: RawProject[] = [
  {
    id: 1,
    title: "Demand forecasting for regional retail chain",
    description:
      "Forecasting model for weekly demand across 40 stores using two years of POS data.",
    source: "company",
    status: "in_progress",
    company_id: 1,
    assigned_professor_id: 2,
    required_department: "School of Management",
    status_token: "seed-status-token-1",
    created_at: "2026-03-01T09:00:00.000Z",
    updated_at: "2026-03-10T09:00:00.000Z",
  },
  {
    id: 2,
    title: "Customer churn analysis for SaaS product",
    description:
      "Root cause analysis of trial-to-paid churn for a B2B SaaS company.",
    source: "company",
    status: "approved",
    company_id: 2,
    assigned_professor_id: null,
    required_department: "School of Management",
    status_token: "seed-status-token-2",
    created_at: "2026-04-02T09:00:00.000Z",
    updated_at: "2026-04-05T09:00:00.000Z",
  },
  {
    id: 3,
    title: "Open-source contribution tracking dashboard",
    description:
      "Internal research topic: dashboard summarizing contribution patterns across a set of OSS repos.",
    source: "internal",
    status: "submitted",
    company_id: null,
    assigned_professor_id: null,
    required_department: "Informatics",
    status_token: "seed-status-token-3",
    created_at: "2026-05-10T09:00:00.000Z",
    updated_at: "2026-05-10T09:00:00.000Z",
  },
];

export const SEED_APPLICATIONS: RawApplication[] = [
  { id: 1, student_id: 4, project_id: 1, status: "accepted", created_at: "2026-03-05T09:00:00.000Z" },
];

export const SEED_STUDENT_PROFILES: RawStudentProfile[] = [
  {
    student_id: 5,
    looking_for_team: true,
    interests: "Data analysis, market research",
    bio: "Looking for a teammate for an analytics project.",
  },
];

export const SEED_GUIDES: Guide[] = [
  {
    slug: "finding-a-supervisor-for-company-topics",
    title: "Finding a supervisor for a company-submitted topic",
    category: "Company projects",
    audience: "student",
    body: `Company-submitted topics still need a supervising professor before work can start.

Not every professor can supervise every topic: supervision must come from a professor affiliated
with the department the topic is tagged with on the platform (usually the School of Management for
company/business topics). A professor who has taught you in an unrelated department — even a
familiar name — may not be eligible to supervise a School of Management topic.

Steps:
1. Check the "required department" tag on the project page.
2. Browse professors in that department who have supervision capacity.
3. Reach out with a short note on why you're interested before the organizers assign it.

If you're unsure who to contact, ask the organizers directly rather than guessing — they maintain
the up-to-date list of who can supervise what.`,
    updated_by: 1,
    updated_at: "2026-05-01T09:00:00.000Z",
  },
  {
    slug: "how-project-status-works",
    title: "What the project status labels mean",
    category: "General",
    audience: "all",
    body: `Projects move through a fixed set of stages: submitted, under review, approved, assigned,
in progress, completed (or rejected). Every change is logged, so organizers and students can see
the real state of a project instead of relying on a spreadsheet or word of mouth.`,
    updated_by: 1,
    updated_at: "2026-02-15T09:00:00.000Z",
  },
];

export const SEED_AUDIT_LOG: RawAuditLogEntry[] = [
  { id: 1, actor_id: 1, entity: "project", entity_id: "1", action: "approved", timestamp: "2026-03-03T09:00:00.000Z" },
  {
    id: 2,
    actor_id: 2,
    entity: "project",
    entity_id: "1",
    action: "claimed (assigned professor)",
    timestamp: "2026-03-05T09:00:00.000Z",
  },
  { id: 3, actor_id: 1, entity: "project", entity_id: "2", action: "approved", timestamp: "2026-04-05T09:00:00.000Z" },
];
