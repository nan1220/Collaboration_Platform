import { ApiError } from "./api-error";
import {
  SEED_APPLICATIONS,
  SEED_AUDIT_LOG,
  SEED_COMPANIES,
  SEED_GUIDES,
  SEED_PROJECTS,
  SEED_STUDENT_PROFILES,
  SEED_USERS,
  type RawApplication,
  type RawAuditLogEntry,
  type RawProject,
  type RawStudentProfile,
} from "./mock-data";
import {
  ALLOWED_TRANSITIONS,
  type Application,
  type AuditLogEntry,
  type Company,
  type Guide,
  type GuideAudience,
  type Project,
  type ProjectStatus,
  type Role,
  type StudentProfile,
  type User,
  type UserSummary,
} from "./types";

/**
 * Fully client-side stand-in for the Django mock backend, so the frontend can
 * be built as a static export (GitHub Pages) with no server at all. State is
 * seeded from mock-data.ts and persisted to localStorage so it survives
 * reloads in the same browser — there is no cross-device/user sync, which
 * matches what's actually possible without a real backend.
 */

interface DbState {
  users: User[];
  companies: Company[];
  projects: RawProject[];
  applications: RawApplication[];
  studentProfiles: RawStudentProfile[];
  guides: Guide[];
  auditLog: RawAuditLogEntry[];
  nextProjectId: number;
  nextApplicationId: number;
  nextCompanyId: number;
  nextAuditId: number;
}

const STORAGE_KEY = "collab-platform-mock-db-v1";

function freshState(): DbState {
  return {
    users: structuredClone(SEED_USERS),
    companies: structuredClone(SEED_COMPANIES),
    projects: structuredClone(SEED_PROJECTS),
    applications: structuredClone(SEED_APPLICATIONS),
    studentProfiles: structuredClone(SEED_STUDENT_PROFILES),
    guides: structuredClone(SEED_GUIDES),
    auditLog: structuredClone(SEED_AUDIT_LOG),
    nextProjectId: Math.max(...SEED_PROJECTS.map((p) => p.id)) + 1,
    nextApplicationId: Math.max(...SEED_APPLICATIONS.map((a) => a.id)) + 1,
    nextCompanyId: Math.max(...SEED_COMPANIES.map((c) => c.id)) + 1,
    nextAuditId: Math.max(...SEED_AUDIT_LOG.map((a) => a.id)) + 1,
  };
}

let state: DbState | null = null;

function getState(): DbState {
  if (state) return state;
  if (typeof window === "undefined") {
    // Build-time prerender: no localStorage available, use throwaway seed state.
    state = freshState();
    return state;
  }
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      state = JSON.parse(stored) as DbState;
      return state;
    } catch {
      // fall through to fresh seed on corrupt data
    }
  }
  state = freshState();
  return state;
}

function persist() {
  if (typeof window === "undefined" || !state) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

const now = () => new Date().toISOString();

function findUser(id: number): User | undefined {
  return getState().users.find((u) => u.id === id);
}

function toUserSummary(user: User): UserSummary {
  return { id: user.id, role: user.role, name: user.name, department: user.department };
}

function requireUser(userId: number | null | undefined): User {
  const user = userId ? findUser(userId) : undefined;
  if (!user) throw new ApiError(401, "Select a demo user to do this.");
  return user;
}

function requireRole(userId: number | null | undefined, ...roles: Role[]): User {
  const user = requireUser(userId);
  if (!roles.includes(user.role)) throw new ApiError(403, "Forbidden for this role");
  return user;
}

function toProject(raw: RawProject): Project {
  const db = getState();
  return {
    id: raw.id,
    title: raw.title,
    description: raw.description,
    source: raw.source,
    status: raw.status,
    company: raw.company_id ? db.companies.find((c) => c.id === raw.company_id) ?? null : null,
    assigned_professor: raw.assigned_professor_id
      ? (() => {
          const u = findUser(raw.assigned_professor_id!);
          return u ? toUserSummary(u) : null;
        })()
      : null,
    required_department: raw.required_department,
    status_token: raw.status_token,
    created_at: raw.created_at,
    updated_at: raw.updated_at,
  };
}

function requireRawProject(id: number): RawProject {
  const project = getState().projects.find((p) => p.id === id);
  if (!project) throw new ApiError(404, "Project not found");
  return project;
}

function toApplication(raw: RawApplication): Application {
  const student = findUser(raw.student_id);
  const project = getState().projects.find((p) => p.id === raw.project_id);
  return {
    id: raw.id,
    student: student ? toUserSummary(student) : { id: raw.student_id, role: "student", name: "Unknown", department: "" },
    project: project ? toProject(project) : (undefined as never),
    status: raw.status,
    created_at: raw.created_at,
  };
}

function toStudentProfile(raw: RawStudentProfile): StudentProfile {
  const student = findUser(raw.student_id);
  return {
    student: student ? toUserSummary(student) : { id: raw.student_id, role: "student", name: "Unknown", department: "" },
    looking_for_team: raw.looking_for_team,
    interests: raw.interests,
    bio: raw.bio,
  };
}

function toAuditLogEntry(raw: RawAuditLogEntry): AuditLogEntry {
  const actor = raw.actor_id ? findUser(raw.actor_id) : undefined;
  return {
    id: raw.id,
    actor: actor ? toUserSummary(actor) : null,
    entity: raw.entity,
    entity_id: raw.entity_id,
    action: raw.action,
    timestamp: raw.timestamp,
  };
}

function recordAudit(actorId: number | null, entity: RawAuditLogEntry["entity"], entityId: string, action: string) {
  const db = getState();
  db.auditLog.push({ id: db.nextAuditId++, actor_id: actorId, entity, entity_id: entityId, action, timestamp: now() });
}

const INTAKE_STATUSES: ProjectStatus[] = ["submitted", "under_review"];

export const store = {
  demoUsers(): UserSummary[] {
    return getState().users.map(toUserSummary);
  },

  users(userId: number | null): User[] {
    requireRole(userId, "organizer");
    return getState().users.slice();
  },

  projects(
    userId: number | null,
    params: { status?: string; source?: string; q?: string; unassigned?: string } = {}
  ): Project[] {
    let list = getState().projects.slice();

    if (params.status) list = list.filter((p) => p.status === params.status);
    if (params.source) list = list.filter((p) => p.source === params.source);
    if (params.unassigned === "true") {
      list = list.filter((p) => p.status === "approved" && !p.assigned_professor_id);
    }
    if (params.q) {
      const needle = params.q.toLowerCase();
      list = list.filter(
        (p) => p.title.toLowerCase().includes(needle) || p.description.toLowerCase().includes(needle)
      );
    }

    const user = userId ? findUser(userId) : undefined;
    if (!user || user.role === "student") {
      list = list.filter((p) => !INTAKE_STATUSES.includes(p.status));
    } else if (user.role === "professor") {
      list = list.filter(
        (p) => !(INTAKE_STATUSES.includes(p.status) && p.assigned_professor_id !== user.id)
      );
    }

    return list.map(toProject);
  },

  project(id: number): Project {
    return toProject(requireRawProject(id));
  },

  createProject(
    userId: number | null,
    body: { title: string; description: string; required_department: string }
  ): Project {
    const user = requireRole(userId, "organizer");
    const db = getState();
    const project: RawProject = {
      id: db.nextProjectId++,
      title: body.title,
      description: body.description,
      source: "internal",
      status: "submitted",
      company_id: null,
      assigned_professor_id: null,
      required_department: body.required_department ?? "",
      status_token: crypto.randomUUID(),
      created_at: now(),
      updated_at: now(),
    };
    db.projects.push(project);
    recordAudit(user.id, "project", String(project.id), "created (internal)");
    persist();
    return toProject(project);
  },

  transitionStatus(userId: number | null, id: number, status: ProjectStatus): Project {
    const user = requireRole(userId, "organizer", "professor");
    const project = requireRawProject(id);
    const allowed = ALLOWED_TRANSITIONS[project.status];
    if (!status || !allowed.includes(status)) {
      throw new ApiError(400, `Cannot transition from ${project.status} to ${status}`);
    }
    project.status = status;
    project.updated_at = now();
    recordAudit(user.id, "project", String(project.id), `status -> ${status}`);
    persist();
    return toProject(project);
  },

  claimProject(userId: number | null, id: number): Project {
    const user = requireRole(userId, "professor");
    const project = requireRawProject(id);
    if (project.status !== "approved") {
      throw new ApiError(400, "Only approved, unassigned projects can be claimed");
    }
    if (project.required_department && project.required_department !== user.department) {
      throw new ApiError(403, `This topic requires a supervisor from ${project.required_department}`);
    }
    project.assigned_professor_id = user.id;
    project.status = "assigned";
    project.updated_at = now();
    recordAudit(user.id, "project", String(project.id), "claimed (assigned professor)");
    persist();
    return toProject(project);
  },

  submitCompanyProject(body: {
    companyName: string;
    contactName: string;
    contactEmail: string;
    title: string;
    description: string;
  }): { statusToken: string; projectId: number } {
    const { companyName, contactName, contactEmail, title, description } = body;
    if (!companyName || !contactName || !contactEmail || !title || !description) {
      throw new ApiError(400, "All fields are required");
    }
    const db = getState();
    let company = db.companies.find((c) => c.name.toLowerCase() === companyName.toLowerCase());
    if (!company) {
      company = { id: db.nextCompanyId++, name: companyName, contact_name: contactName, contact_email: contactEmail };
      db.companies.push(company);
    }
    const project: RawProject = {
      id: db.nextProjectId++,
      title,
      description,
      source: "company",
      status: "submitted",
      company_id: company.id,
      assigned_professor_id: null,
      required_department: "School of Management",
      status_token: crypto.randomUUID(),
      created_at: now(),
      updated_at: now(),
    };
    db.projects.push(project);
    recordAudit(null, "project", String(project.id), "submitted by company");
    persist();
    return { statusToken: project.status_token, projectId: project.id };
  },

  publicStatus(token: string): { title: string; status: ProjectStatus; updatedAt: string } {
    const project = getState().projects.find((p) => p.status_token === token);
    if (!project) throw new ApiError(404, "No submission found for this link");
    return { title: project.title, status: project.status, updatedAt: project.updated_at };
  },

  guides(): Guide[] {
    return getState().guides.slice();
  },

  guide(slug: string): Guide {
    const guide = getState().guides.find((g) => g.slug === slug);
    if (!guide) throw new ApiError(404, "Guide not found");
    return guide;
  },

  createGuide(
    userId: number | null,
    body: { slug: string; title: string; category: string; audience: GuideAudience; body: string }
  ): Guide {
    const user = requireRole(userId, "organizer");
    const db = getState();
    if (db.guides.some((g) => g.slug === body.slug)) {
      throw new ApiError(409, "A guide with this slug already exists");
    }
    const guide: Guide = {
      slug: body.slug,
      title: body.title,
      category: body.category || "General",
      audience: body.audience || "all",
      body: body.body,
      updated_by: user.id,
      updated_at: now(),
    };
    db.guides.push(guide);
    recordAudit(user.id, "guide", guide.slug, "created");
    persist();
    return guide;
  },

  updateGuide(userId: number | null, slug: string, body: Partial<Guide>): Guide {
    const user = requireRole(userId, "organizer");
    const guide = getState().guides.find((g) => g.slug === slug);
    if (!guide) throw new ApiError(404, "Guide not found");
    if (body.title) guide.title = body.title;
    if (body.category) guide.category = body.category;
    if (body.audience) guide.audience = body.audience;
    if (body.body) guide.body = body.body;
    guide.updated_by = user.id;
    guide.updated_at = now();
    recordAudit(user.id, "guide", guide.slug, "updated");
    persist();
    return guide;
  },

  deleteGuide(userId: number | null, slug: string): void {
    const user = requireRole(userId, "organizer");
    const db = getState();
    const index = db.guides.findIndex((g) => g.slug === slug);
    if (index === -1) throw new ApiError(404, "Guide not found");
    db.guides.splice(index, 1);
    recordAudit(user.id, "guide", slug, "deleted");
    persist();
  },

  applications(userId: number | null, projectId?: number): Application[] {
    const user = requireRole(userId, "organizer", "professor", "student");
    let list = getState().applications.slice();
    if (user.role === "student") list = list.filter((a) => a.student_id === user.id);
    if (projectId) list = list.filter((a) => a.project_id === projectId);
    return list.map(toApplication);
  },

  applyToProject(userId: number | null, projectId: number): Application {
    const user = requireRole(userId, "student");
    requireRawProject(projectId);
    const db = getState();
    if (db.applications.some((a) => a.student_id === user.id && a.project_id === projectId)) {
      throw new ApiError(409, "Already applied to this project");
    }
    const application: RawApplication = {
      id: db.nextApplicationId++,
      student_id: user.id,
      project_id: projectId,
      status: "interested",
      created_at: now(),
    };
    db.applications.push(application);
    recordAudit(user.id, "application", String(application.id), "created (interested)");
    persist();
    return toApplication(application);
  },

  studentsLookingForTeam(): StudentProfile[] {
    return getState()
      .studentProfiles.filter((p) => p.looking_for_team)
      .map(toStudentProfile);
  },

  updateStudentProfile(
    userId: number | null,
    targetId: number,
    body: { lookingForTeam: boolean; interests: string; bio: string }
  ): StudentProfile {
    const user = requireRole(userId, "student");
    if (user.id !== targetId) throw new ApiError(403, "Cannot edit another student's profile");
    const db = getState();
    let profile = db.studentProfiles.find((p) => p.student_id === user.id);
    if (!profile) {
      profile = { student_id: user.id, looking_for_team: false, interests: "", bio: "" };
      db.studentProfiles.push(profile);
    }
    profile.looking_for_team = Boolean(body.lookingForTeam);
    profile.interests = body.interests ?? profile.interests;
    profile.bio = body.bio ?? profile.bio;
    persist();
    return toStudentProfile(profile);
  },

  auditLog(userId: number | null, projectId?: number): AuditLogEntry[] {
    requireRole(userId, "organizer");
    let list = getState().auditLog.slice();
    if (projectId) list = list.filter((e) => e.entity_id === String(projectId));
    return list.reverse().map(toAuditLogEntry);
  },
};
