import { nanoid } from "nanoid";
import type {
  Application,
  AuditLogEntry,
  Company,
  Guide,
  Project,
  StudentProfile,
  User,
} from "./types.js";

const now = () => new Date().toISOString();

export const users: User[] = [
  { id: "u-organizer-1", role: "organizer", name: "Petra Huber", email: "petra.huber@tum.de" },
  { id: "u-organizer-2", role: "organizer", name: "Sabine Wolf", email: "sabine.wolf@tum.de" },
  {
    id: "u-prof-1",
    role: "professor",
    name: "Prof. Dr. Antz",
    email: "antz@tum.de",
    department: "Informatics",
  },
  {
    id: "u-prof-2",
    role: "professor",
    name: "Prof. Dr. Reichert",
    email: "reichert@tum.de",
    department: "School of Management",
  },
  {
    id: "u-student-1",
    role: "student",
    name: "Lea Fischer",
    email: "lea.fischer@tum.de",
  },
  {
    id: "u-student-2",
    role: "student",
    name: "Jonas Becker",
    email: "jonas.becker@tum.de",
  },
  {
    id: "u-student-3",
    role: "student",
    name: "Mia Schneider",
    email: "mia.schneider@tum.de",
  },
];

export const companies: Company[] = [
  {
    id: "c-1",
    name: "Nordlicht Analytics GmbH",
    contactName: "Tim Reuter",
    contactEmail: "tim.reuter@nordlicht-analytics.example",
  },
  {
    id: "c-2",
    name: "Bergpanorama Retail AG",
    contactName: "Julia Adler",
    contactEmail: "julia.adler@bergpanorama.example",
  },
];

export const projects: Project[] = [
  {
    id: "p-1",
    title: "Demand forecasting for regional retail chain",
    description:
      "Bergpanorama wants a forecasting model for weekly demand across 40 stores, using two years of POS data.",
    source: "company",
    status: "in_progress",
    companyId: "c-2",
    assignedProfessorId: "u-prof-2",
    requiredDepartment: "School of Management",
    statusToken: nanoid(12),
    createdAt: "2026-03-01T09:00:00.000Z",
    updatedAt: "2026-03-10T09:00:00.000Z",
  },
  {
    id: "p-2",
    title: "Customer churn analysis for SaaS product",
    description:
      "Nordlicht Analytics is losing customers after the trial period and wants a data-driven root cause analysis.",
    source: "company",
    status: "approved",
    companyId: "c-1",
    requiredDepartment: "School of Management",
    statusToken: nanoid(12),
    createdAt: "2026-04-02T09:00:00.000Z",
    updatedAt: "2026-04-05T09:00:00.000Z",
  },
  {
    id: "p-3",
    title: "Open-source contribution tracking dashboard",
    description:
      "Internal research topic: build a dashboard summarizing contribution patterns across a set of OSS repos.",
    source: "internal",
    status: "submitted",
    requiredDepartment: "Informatics",
    statusToken: nanoid(12),
    createdAt: "2026-05-10T09:00:00.000Z",
    updatedAt: "2026-05-10T09:00:00.000Z",
  },
  {
    id: "p-4",
    title: "Market entry strategy for EV charging network",
    description:
      "A new mobility startup wants an analysis of which German regions to prioritize for charger rollout.",
    source: "company",
    status: "submitted",
    companyId: "c-1",
    requiredDepartment: "School of Management",
    statusToken: nanoid(12),
    createdAt: "2026-06-20T09:00:00.000Z",
    updatedAt: "2026-06-20T09:00:00.000Z",
  },
];

export const applications: Application[] = [
  {
    id: "a-1",
    studentId: "u-student-1",
    projectId: "p-1",
    status: "accepted",
    createdAt: "2026-03-05T09:00:00.000Z",
  },
  {
    id: "a-2",
    studentId: "u-student-2",
    projectId: "p-2",
    status: "interested",
    createdAt: "2026-04-06T09:00:00.000Z",
  },
];

export const guides: Guide[] = [
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
    updatedBy: "u-organizer-1",
    updatedAt: "2026-05-01T09:00:00.000Z",
  },
  {
    slug: "how-project-status-works",
    title: "What the project status labels mean",
    category: "General",
    audience: "all",
    body: `Projects move through a fixed set of stages: submitted, under review, approved, assigned,
in progress, completed (or rejected). Every change is logged, so organizers and students can see
the real state of a project instead of relying on a spreadsheet or word of mouth.`,
    updatedBy: "u-organizer-1",
    updatedAt: "2026-02-15T09:00:00.000Z",
  },
];

export const studentProfiles: StudentProfile[] = [
  {
    studentId: "u-student-2",
    lookingForTeam: true,
    interests: "Data analysis, market research",
    bio: "Second-year student looking for a teammate for a company analytics project.",
  },
  {
    studentId: "u-student-3",
    lookingForTeam: true,
    interests: "Strategy, market entry topics",
    bio: "Happy to join an existing team or start a new project together.",
  },
];

export const auditLog: AuditLogEntry[] = [
  {
    id: "log-1",
    actorId: "u-organizer-1",
    entity: "project",
    entityId: "p-1",
    action: "approved",
    timestamp: "2026-03-03T09:00:00.000Z",
  },
  {
    id: "log-2",
    actorId: "u-prof-2",
    entity: "project",
    entityId: "p-1",
    action: "claimed (assigned professor)",
    timestamp: "2026-03-05T09:00:00.000Z",
  },
  {
    id: "log-3",
    actorId: "u-organizer-2",
    entity: "project",
    entityId: "p-2",
    action: "approved",
    timestamp: "2026-04-05T09:00:00.000Z",
  },
];

export function recordAudit(entry: Omit<AuditLogEntry, "id" | "timestamp">) {
  auditLog.push({ ...entry, id: `log-${nanoid(8)}`, timestamp: now() });
}

export { now };
