export type Role = "staff" | "professor" | "student" | "company";

export interface UserSummary {
  id: number;
  role: Role;
  name: string;
  department: string; // professor: chair; company/student/staff: unused
  program: string; // student: degree program (FR-9); unused otherwise
}

export interface User extends UserSummary {
  email: string;
}

export interface Company {
  id: number;
  user_id: number; // links to the User (role: "company") this org logs in as
  name: string;
  contact_name: string;
  contact_email: string;
  verified: boolean; // NFR-1: self-verified by email domain, confirmed by staff
}

// FR-7: professor-submitted projects skip the company portal entirely.
export type ProjectSource = "company" | "professor_direct";

// Design decision: the SRS's staff dashboard (FR-17) lists five buckets —
// pending, approved, not yet supervised, ongoing, filled — but "not yet
// supervised" and "approved" describe the same underlying record from two
// angles (approved, with vs. without a professor attached yet). Rather than
// invent a redundant stored state, "not yet supervised" is computed as
// `status === "approved" && !assigned_professor`, and the four real stages
// below map onto the use-case diagrams: pending (FR-3 queue) -> approved
// (visible to professors, FR-5) -> ongoing (professor took it on and
// published it, FR-6 — open for applications) -> filled (a student has been
// confirmed, FR-16).
export type ProjectStatus = "pending" | "approved" | "ongoing" | "filled" | "rejected";

export interface Project {
  id: number;
  title: string;
  required_expertise: string; // FR-2 "Required Area of Expertise" — also used for FR-5 matching
  background_objective: string; // FR-2 "Project Background and Objective"
  deliverable: string; // FR-2 "Project Deliverable"
  company_resources: string; // FR-2 "Available Company Resources"
  required_skills: string; // FR-2 "Required Student Skills"
  group_size: number; // FR-2 "Group Size"
  status: ProjectStatus;
  source: ProjectSource;
  company: Company | null;
  assigned_professor: UserSummary | null;
  chair_contact_info: string; // filled by professor on take-on (FR-6)
  application_deadline: string; // filled by professor on take-on (FR-6)
  required_documents: string; // filled by professor on take-on (FR-6)
  created_at: string;
  updated_at: string;
}

export type ApplicationDecision = "pending" | "accepted" | "rejected";

export interface Application {
  id: number;
  student: UserSummary;
  project: Project;
  // FR-15: professor and company each decide independently.
  professor_decision: ApplicationDecision;
  company_decision: ApplicationDecision;
  // FR-16: once both accept, the student confirms exactly one offer.
  confirmed: boolean;
  withdrawn: boolean;
  documents_note: string; // FR-11: simulated submitted documents (filenames)
  created_at: string;
}

export type GuideAudience = Role | "all";

export interface Guide {
  slug: string;
  title: string;
  category: string;
  audience: GuideAudience;
  body: string;
  updated_by: number | null;
  updated_at: string;
}

// FR-8/FR-9/FR-10: a student's submitted "topic" and profile, browsable by
// professors and companies (FR-4/FR-9) and optionally flagged for teammate
// matching (FR-10).
export interface StudentProfile {
  student: UserSummary;
  areas_of_expertise: string;
  research_interests: string;
  skills: string;
  previous_projects: string;
  availability: string;
  looking_for_team: boolean;
  team_message: string;
}

// FR-14: a lightweight, informal check-in between student and supervisor.
export interface CheckIn {
  id: number;
  project_id: number;
  author: UserSummary;
  note: string;
  created_at: string;
}

export interface AuditLogEntry {
  id: number;
  actor: UserSummary | null;
  entity: "project" | "guide" | "application" | "company";
  entity_id: string;
  action: string;
  timestamp: string;
}

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  ongoing: "Ongoing",
  filled: "Filled",
  rejected: "Rejected",
};

export const ALLOWED_TRANSITIONS: Record<ProjectStatus, ProjectStatus[]> = {
  pending: ["approved", "rejected"],
  approved: ["rejected"], // approved -> ongoing happens only via the take-on flow (FR-6)
  ongoing: [],
  filled: [],
  rejected: [],
};

export function isNotYetSupervised(project: Pick<Project, "status" | "assigned_professor">) {
  return project.status === "approved" && !project.assigned_professor;
}

export type ApplicationOverallStatus = "pending" | "accepted" | "rejected" | "confirmed" | "withdrawn";

// FR-15 dual decision + FR-16 confirmation, collapsed into one status for display.
// A professor_direct project has no company, so the company side is treated as
// automatically satisfied — the professor's decision is the only one that counts.
export function applicationStatus(
  app: Pick<Application, "professor_decision" | "company_decision" | "confirmed" | "withdrawn">,
  hasCompany: boolean
): ApplicationOverallStatus {
  if (app.withdrawn) return "withdrawn";
  if (app.professor_decision === "rejected" || (hasCompany && app.company_decision === "rejected")) {
    return "rejected";
  }
  if (app.confirmed) return "confirmed";
  const companyOk = !hasCompany || app.company_decision === "accepted";
  if (app.professor_decision === "accepted" && companyOk) return "accepted";
  return "pending";
}

export const APPLICATION_STATUS_LABELS: Record<ApplicationOverallStatus, string> = {
  pending: "Pending decision",
  accepted: "Offer made — awaiting confirmation",
  rejected: "Rejected",
  confirmed: "Confirmed",
  withdrawn: "Withdrawn",
};
