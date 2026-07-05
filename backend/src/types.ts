export type Role = "organizer" | "professor" | "student";

export interface User {
  id: string;
  role: Role;
  name: string;
  email: string;
  department?: string; // used for professor eligibility checks
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

export interface Company {
  id: string;
  name: string;
  contactName: string;
  contactEmail: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  source: ProjectSource;
  status: ProjectStatus;
  companyId?: string;
  assignedProfessorId?: string;
  requiredDepartment?: string; // eligibility rule: professor must match this department
  statusToken: string; // used for public company status lookup
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  id: string;
  studentId: string;
  projectId: string;
  status: "interested" | "accepted" | "declined";
  createdAt: string;
}

export interface Guide {
  slug: string;
  title: string;
  category: string;
  audience: Role | "all";
  body: string;
  updatedBy: string;
  updatedAt: string;
}

export interface StudentProfile {
  studentId: string;
  lookingForTeam: boolean;
  interests: string;
  bio: string;
}

export interface AuditLogEntry {
  id: string;
  actorId: string;
  entity: "project" | "guide" | "application";
  entityId: string;
  action: string;
  timestamp: string;
}
