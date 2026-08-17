export type Role = "staff" | "professor" | "student" | "company";

export interface UserSummary {
  id: number;
  role: Role;
  name: string;
  department: string; // professor: chair; company/student/staff: unused
  program: string; // student: degree program (FR-9); unused otherwise
  expertise: string; // FR-5: professor/supervisor profile "chair/expertise", sourced at login
  bio: string; // every role has a profile; sourced at login for professors, editable by anyone on /profile
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
// FR-8: student-suggested topics name an existing company and a requested
// supervisor, but still go through the normal staff review queue.
export type ProjectSource = "company" | "professor_direct" | "student_suggested";

export const SOURCE_LABELS: Record<ProjectSource, string> = {
  company: "Company",
  professor_direct: "Professor/Supervisor-submitted",
  student_suggested: "Student-suggested",
};

// FR-17 (per the 2026 management update) lists five buckets - Pending,
// Approved, Open, Ongoing, Complete - plus Rejected, which the dashboard
// doesn't surface as a monitored bucket but staff can still reach via
// review. "not yet supervised" isn't a stored state; it's computed as
// `status === "approved" && !assigned_professor`. The stages map onto the
// use-case diagrams: pending (FR-3 queue) -> approved (visible to
// professors, FR-5) -> open (professor took it on and published it, FR-6 -
// open for applications) -> ongoing (a student has confirmed and is
// currently working, FR-16) -> complete (final deliverable submitted).
export type ProjectStatus = "pending" | "approved" | "open" | "ongoing" | "complete" | "rejected";

export interface Project {
  id: number;
  title: string;
  required_expertise: string; // FR-2 "Required Area of Expertise" - also used for FR-5 matching
  background_objective: string; // FR-2 "Project Background and Objective"
  deliverable: string; // FR-2 "Project Deliverable"
  company_resources: string; // FR-2 "Available Company Resources"
  required_skills: string; // FR-2 "Required Student Skills"
  group_size: number; // FR-2 "Group Size"
  status: ProjectStatus;
  source: ProjectSource;
  company: Company | null;
  assigned_professor: UserSummary | null;
  requested_professor: UserSummary | null; // FR-8: supervisor requested by the student who suggested this topic
  suggested_by: UserSummary | null; // FR-8: the student who suggested this topic, if any
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
  entity: "project" | "guide" | "application" | "company" | "database";
  entity_id: string;
  action: string;
  timestamp: string;
}

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  open: "Open",
  ongoing: "Ongoing",
  complete: "Complete",
  rejected: "Rejected",
};

export const ALLOWED_TRANSITIONS: Record<ProjectStatus, ProjectStatus[]> = {
  pending: ["approved", "rejected"],
  approved: ["rejected"], // approved -> open happens only via the take-on flow (FR-6)
  open: [], // open -> ongoing happens only via the offer-confirmation flow (FR-16)
  ongoing: [], // ongoing -> complete happens only via the mark-complete flow
  complete: [],
  rejected: [],
};

export function isNotYetSupervised(project: Pick<Project, "status" | "assigned_professor">) {
  return project.status === "approved" && !project.assigned_professor;
}

export type ApplicationOverallStatus = "pending" | "accepted" | "rejected" | "confirmed" | "withdrawn";

// FR-15 dual decision + FR-16 confirmation, collapsed into one status for display.
// A professor_direct project has no company, so the company side is treated as
// automatically satisfied - the professor's decision is the only one that counts.
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
  accepted: "Offer made - awaiting confirmation",
  rejected: "Rejected",
  confirmed: "Confirmed",
  withdrawn: "Withdrawn",
};
