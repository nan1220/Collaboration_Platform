import type {
  ApplicationDecision,
  Company,
  Guide,
  ProjectSource,
  ProjectStatus,
  User,
} from "./types";

// Hardcoded seed data for the fully client-side mock backend (see mock-store.ts).
// Reflects the SRS (Platform_SRS_file/Report.typ) and its four use-case
// diagrams: Access, Project Intake, Application & Selection, Profiles & Topics.
//
// Demo accounts are anonymized (S = student, P = professor, C = company,
// U = university staff), mirroring the anonymized interview IDs already used
// in the SRS traceability table — no real names, to protect the privacy of
// the people who actually gave interviews.

export interface RawProject {
  id: number;
  title: string;
  required_expertise: string;
  background_objective: string;
  deliverable: string;
  company_resources: string;
  required_skills: string;
  group_size: number;
  status: ProjectStatus;
  source: ProjectSource;
  company_id: number | null;
  assigned_professor_id: number | null;
  chair_contact_info: string;
  application_deadline: string;
  required_documents: string;
  created_at: string;
  updated_at: string;
}

export interface RawApplication {
  id: number;
  student_id: number;
  project_id: number;
  professor_decision: ApplicationDecision;
  company_decision: ApplicationDecision;
  confirmed: boolean;
  withdrawn: boolean;
  documents_note: string;
  created_at: string;
}

export interface RawStudentProfile {
  student_id: number;
  areas_of_expertise: string;
  research_interests: string;
  skills: string;
  previous_projects: string;
  availability: string;
  looking_for_team: boolean;
  team_message: string;
}

export interface RawCheckIn {
  id: number;
  project_id: number;
  author_id: number;
  note: string;
  created_at: string;
}

export interface RawAuditLogEntry {
  id: number;
  actor_id: number | null;
  entity: "project" | "guide" | "application" | "company";
  entity_id: string;
  action: string;
  timestamp: string;
}

export const SEED_USERS: User[] = [
  { id: 1, role: "staff", name: "Staff U1", email: "u1@tum.de", department: "", program: "" },
  {
    id: 2,
    role: "professor",
    name: "Professor P1",
    email: "p1@tum.de",
    department: "School of Management",
    program: "",
  },
  {
    id: 3,
    role: "professor",
    name: "Professor P2",
    email: "p2@tum.de",
    department: "Informatics",
    program: "",
  },
  {
    id: 4,
    role: "student",
    name: "Student S1",
    email: "s1@tum.de",
    department: "",
    program: "B.Sc. Management and Data Science",
  },
  {
    id: 5,
    role: "student",
    name: "Student S2",
    email: "s2@tum.de",
    department: "",
    program: "B.Sc. Informatics",
  },
  {
    id: 6,
    role: "company",
    name: "Company C1",
    email: "contact@companyc1.example",
    department: "",
    program: "",
  },
  {
    id: 7,
    role: "company",
    name: "Company C2",
    email: "contact@companyc2.example",
    department: "",
    program: "",
  },
];

export const SEED_COMPANIES: Company[] = [
  {
    id: 1,
    user_id: 6,
    name: "Company C1",
    contact_name: "Contact Person C1",
    contact_email: "contact@companyc1.example",
    verified: true,
  },
  {
    id: 2,
    user_id: 7,
    name: "Company C2",
    contact_name: "Contact Person C2",
    contact_email: "contact@companyc2.example",
    verified: false,
  },
];

export const SEED_PROJECTS: RawProject[] = [
  {
    id: 1,
    title: "Demand forecasting for regional retail chain",
    required_expertise: "School of Management",
    background_objective:
      "**Company C1** wants a forecasting model for weekly demand across 40 stores, using two years of POS data.\n\n" +
      "Key questions:\n" +
      "- Which store/product combinations are hardest to forecast, and why?\n" +
      "- How much would a better model actually reduce overstock and stockouts?\n\n" +
      "See the [POS data dictionary](https://example.com) shared with the assigned team.",
    deliverable:
      "A working forecasting model, plus a short report covering:\n" +
      "1. Accuracy vs. the current baseline\n" +
      "2. Rollout recommendations\n" +
      "3. Known limitations",
    company_resources: "Access to two years of anonymized POS data, a technical contact for questions.",
    required_skills: "Python or R, basic time-series/statistics",
    group_size: 2,
    status: "filled",
    source: "company",
    company_id: 1,
    assigned_professor_id: 2,
    chair_contact_info: "Chair contact: p1@tum.de",
    application_deadline: "2026-09-15",
    required_documents: "CV, transcript of records",
    created_at: "2026-03-01T09:00:00.000Z",
    updated_at: "2026-04-01T09:00:00.000Z",
  },
  {
    id: 2,
    title: "Customer churn analysis for SaaS product",
    required_expertise: "School of Management",
    background_objective:
      "**Company C2** is losing customers after the trial period and wants a data-driven root cause analysis.\n\n" +
      "Known context:\n" +
      "- Trial-to-paid conversion has dropped ~15% year over year\n" +
      "- Support tickets mention *onboarding confusion* most often\n\n" +
      "> The team will get read access to anonymized usage and billing data on day one.",
    deliverable: "A churn driver analysis with **prioritized, actionable** recommendations.",
    company_resources: "Anonymized usage and billing data, a product manager as point of contact.",
    required_skills: "SQL, basic statistics, comfort presenting to non-technical stakeholders",
    group_size: 1,
    status: "approved",
    source: "company",
    company_id: 2,
    assigned_professor_id: null,
    chair_contact_info: "",
    application_deadline: "",
    required_documents: "",
    created_at: "2026-04-02T09:00:00.000Z",
    updated_at: "2026-04-05T09:00:00.000Z",
  },
  {
    id: 3,
    title: "Open-source contribution tracking dashboard",
    required_expertise: "Informatics",
    background_objective:
      "Research topic proposed directly by **Professor P2**: build a dashboard summarizing contribution " +
      "patterns across a set of OSS repositories.\n\n" +
      "Metrics of interest:\n" +
      "- Commit and PR frequency over time\n" +
      "- Reviewer response latency\n" +
      "- Contributor retention after a first merged PR",
    deliverable: "A working dashboard and a short writeup of the methodology (`README.md` in the repo is enough).",
    company_resources: "",
    required_skills: "TypeScript or Python, git/GitHub API familiarity",
    group_size: 2,
    status: "ongoing",
    source: "professor_direct",
    company_id: null,
    assigned_professor_id: 3,
    chair_contact_info: "Chair contact: p2@tum.de",
    application_deadline: "2026-10-01",
    required_documents: "CV",
    created_at: "2026-05-10T09:00:00.000Z",
    updated_at: "2026-05-10T09:00:00.000Z",
  },
  {
    id: 4,
    title: "Predictive maintenance dashboard for manufacturing partner",
    required_expertise: "Informatics",
    background_objective:
      "Direct agreement between **Professor P2** and a manufacturing partner: a dashboard flagging " +
      "machines likely to need maintenance soon.\n\n" +
      "Scope for the semester:\n" +
      "- Explore the provided sensor sample data\n" +
      "- Prototype a simple risk score per machine\n" +
      "- Build a minimal dashboard (table + chart is enough)",
    deliverable: "A prototype dashboard with a **documented model and evaluation**.",
    company_resources: "Sample sensor data, one technical point of contact.",
    required_skills: "Python, basic ML, dashboarding (e.g. Streamlit/Dash)",
    group_size: 2,
    status: "ongoing",
    source: "professor_direct",
    company_id: null,
    assigned_professor_id: 3,
    chair_contact_info: "Chair contact: p2@tum.de",
    application_deadline: "2026-10-15",
    required_documents: "CV, brief motivation paragraph",
    created_at: "2026-05-20T09:00:00.000Z",
    updated_at: "2026-05-20T09:00:00.000Z",
  },
  {
    id: 5,
    title: "Market entry strategy for EV charging network",
    required_expertise: "School of Management",
    background_objective:
      "A mobility startup wants an analysis of which German regions to **prioritize for charger rollout**.\n\n" +
      "Factors to weigh:\n" +
      "- EV registration growth by region\n" +
      "- Existing charger density\n" +
      "- Grid connection cost estimates",
    deliverable: "A market entry report **ranking candidate regions** with supporting rationale.",
    company_resources: "Market research budget for data purchases, biweekly check-in calls.",
    required_skills: "Market research, basic GIS/data analysis a plus",
    group_size: 3,
    status: "pending",
    source: "company",
    company_id: 2,
    assigned_professor_id: null,
    chair_contact_info: "",
    application_deadline: "",
    required_documents: "",
    created_at: "2026-06-20T09:00:00.000Z",
    updated_at: "2026-06-20T09:00:00.000Z",
  },
];

export const SEED_APPLICATIONS: RawApplication[] = [
  {
    id: 1,
    student_id: 4,
    project_id: 1,
    professor_decision: "accepted",
    company_decision: "accepted",
    confirmed: true,
    withdrawn: false,
    documents_note: "cv_s1.pdf, transcript_s1.pdf",
    created_at: "2026-03-05T09:00:00.000Z",
  },
  {
    id: 2,
    student_id: 5,
    project_id: 3,
    professor_decision: "accepted",
    company_decision: "accepted",
    confirmed: false,
    withdrawn: false,
    documents_note: "cv_s2.pdf",
    created_at: "2026-05-15T09:00:00.000Z",
  },
  {
    id: 3,
    student_id: 5,
    project_id: 4,
    professor_decision: "accepted",
    company_decision: "accepted",
    confirmed: false,
    withdrawn: false,
    documents_note: "cv_s2.pdf, motivation_s2.pdf",
    created_at: "2026-05-25T09:00:00.000Z",
  },
];

export const SEED_STUDENT_PROFILES: RawStudentProfile[] = [
  {
    student_id: 4,
    areas_of_expertise: "Data analysis, market research",
    research_interests: "Consumer behavior, demand forecasting",
    skills: "Python, SQL, Excel",
    previous_projects: "Retail demand forecasting project study",
    availability: "~10h/week, Winter semester 2026",
    looking_for_team: false,
    team_message: "",
  },
  {
    student_id: 5,
    areas_of_expertise: "Software engineering, dashboards",
    research_interests: "Open-source ecosystems, developer tooling",
    skills: "TypeScript, React, Git/GitHub API",
    previous_projects: "OSS contribution tracking dashboard",
    availability: "~15h/week",
    looking_for_team: true,
    team_message: "Looking for a teammate for a company analytics project.",
  },
];

export const SEED_CHECKINS: RawCheckIn[] = [
  {
    id: 1,
    project_id: 1,
    author_id: 2,
    note: "Kickoff call done, Student S1 has data access and a first modeling approach in mind.",
    created_at: "2026-04-10T09:00:00.000Z",
  },
];

export const SEED_GUIDES: Guide[] = [
  {
    slug: "finding-a-supervisor-for-company-topics",
    title: "Finding a supervisor for a company-submitted topic",
    category: "Company projects",
    audience: "student",
    body: `Company-submitted topics still need a professor to take on supervision before you can apply.

Not every professor can supervise every topic: professors see submissions matched to their own area of
expertise (the **required expertise** tag on the project), and only take on projects that fit their chair.
A professor who has taught you in an unrelated area — even a familiar name — may not be a match for a
School of Management topic.

## Steps

1. Check the *required expertise* tag on the project page. A project only becomes visible to students
   once a matching professor has taken it on and published the listing.
2. If you know a professor whose chair fits, feel free to mention the topic to them directly — professors
   can also submit a project they've agreed on directly with a company (no company portal step needed).
3. If you're unsure who to contact, ask staff directly rather than guessing.

## Quick reference

| Situation | What to do |
| --- | --- |
| Topic approved, no professor yet | Wait, or mention it to a matching professor yourself |
| Topic still "pending" | Nothing to do yet — staff hasn't reviewed it |
| Not sure who supervises your area | Ask staff, don't guess |

> A professor who taught you in an unrelated department may **not** be eligible to supervise — expertise
> match matters more than familiarity.`,
    updated_by: 1,
    updated_at: "2026-05-01T09:00:00.000Z",
  },
  {
    slug: "how-project-status-works",
    title: "What the project status labels mean",
    category: "General",
    audience: "all",
    body: `Projects move through a fixed set of stages:

- **Pending** — submitted, awaiting staff review
- **Approved** — staff-approved, visible to professors whose expertise matches
- **Ongoing** — a professor has taken on supervision and published the listing, now open for student applications
- **Filled** — a student has confirmed the offer

Every change is logged, so staff, professors and students can see the real state of a project instead of
relying on a spreadsheet or word of mouth.`,
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
    action: "took on supervision and published listing",
    timestamp: "2026-03-05T09:00:00.000Z",
  },
  { id: 3, actor_id: 1, entity: "project", entity_id: "2", action: "approved", timestamp: "2026-04-05T09:00:00.000Z" },
];
