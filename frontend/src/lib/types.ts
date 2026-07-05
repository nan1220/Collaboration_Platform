export type Role = "organizer" | "professor" | "student";

export interface UserSummary {
  id: number;
  role: Role;
  name: string;
  department: string;
}

export interface User extends UserSummary {
  email: string;
}

export interface Company {
  id: number;
  name: string;
  contact_name: string;
  contact_email: string;
}

export type ProjectSource = "company" | "internal";

export type ProjectStatus =
  | "submitted"
  | "under_review"
  | "approved"
  | "assigned"
  | "in_progress"
  | "completed"
  | "rejected";

export interface Project {
  id: number;
  title: string;
  description: string;
  source: ProjectSource;
  status: ProjectStatus;
  company: Company | null;
  assigned_professor: UserSummary | null;
  required_department: string;
  status_token: string;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: number;
  student: UserSummary;
  project: Project;
  status: "interested" | "accepted" | "declined";
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

export interface StudentProfile {
  student: UserSummary;
  looking_for_team: boolean;
  interests: string;
  bio: string;
}

export interface AuditLogEntry {
  id: number;
  actor: UserSummary | null;
  entity: "project" | "guide" | "application";
  entity_id: string;
  action: string;
  timestamp: string;
}

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  submitted: "Submitted",
  under_review: "Under review",
  approved: "Approved",
  assigned: "Assigned",
  in_progress: "In progress",
  completed: "Completed",
  rejected: "Rejected",
};

export const ALLOWED_TRANSITIONS: Record<ProjectStatus, ProjectStatus[]> = {
  submitted: ["under_review", "rejected"],
  under_review: ["approved", "rejected"],
  approved: ["assigned", "rejected"],
  assigned: ["in_progress", "approved"],
  in_progress: ["completed"],
  completed: [],
  rejected: [],
};
