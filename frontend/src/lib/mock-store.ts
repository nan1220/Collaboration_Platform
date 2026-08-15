import { ApiError } from "./api-error";
import {
  SEED_APPLICATIONS,
  SEED_AUDIT_LOG,
  SEED_CHECKINS,
  SEED_COMPANIES,
  SEED_GUIDES,
  SEED_PROJECTS,
  SEED_STUDENT_PROFILES,
  SEED_USERS,
  type RawApplication,
  type RawAuditLogEntry,
  type RawCheckIn,
  type RawProject,
  type RawStudentProfile,
} from "./mock-data";
import {
  ALLOWED_TRANSITIONS,
  type Application,
  type ApplicationDecision,
  type AuditLogEntry,
  type CheckIn,
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
 * Fully client-side stand-in for a real backend, so the frontend can be built
 * as a static export (GitHub Pages) with no server at all. State is seeded
 * from mock-data.ts and persisted to localStorage so it survives reloads —
 * there is no cross-device/user sync, which matches what's actually possible
 * without a real backend.
 */

interface DbState {
  users: User[];
  companies: Company[];
  projects: RawProject[];
  applications: RawApplication[];
  studentProfiles: RawStudentProfile[];
  checkIns: RawCheckIn[];
  guides: Guide[];
  auditLog: RawAuditLogEntry[];
  nextProjectId: number;
  nextApplicationId: number;
  nextCompanyId: number;
  nextCheckInId: number;
  nextAuditId: number;
}

// Bumped whenever seed data shape or content changes meaningfully, so
// anyone with older cached demo data (e.g. pre-anonymization names) gets a
// fresh reseed instead of a stale localStorage copy.
const STORAGE_KEY = "collab-platform-mock-db-v3";

function freshState(): DbState {
  return {
    users: structuredClone(SEED_USERS),
    companies: structuredClone(SEED_COMPANIES),
    projects: structuredClone(SEED_PROJECTS),
    applications: structuredClone(SEED_APPLICATIONS),
    studentProfiles: structuredClone(SEED_STUDENT_PROFILES),
    checkIns: structuredClone(SEED_CHECKINS),
    guides: structuredClone(SEED_GUIDES),
    auditLog: structuredClone(SEED_AUDIT_LOG),
    nextProjectId: Math.max(...SEED_PROJECTS.map((p) => p.id)) + 1,
    nextApplicationId: Math.max(...SEED_APPLICATIONS.map((a) => a.id)) + 1,
    nextCompanyId: Math.max(...SEED_COMPANIES.map((c) => c.id)) + 1,
    nextCheckInId: Math.max(...SEED_CHECKINS.map((c) => c.id)) + 1,
    nextAuditId: Math.max(...SEED_AUDIT_LOG.map((a) => a.id)) + 1,
  };
}

let state: DbState | null = null;

function getState(): DbState {
  if (state) return state;
  if (typeof window === "undefined") {
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
  return { id: user.id, role: user.role, name: user.name, department: user.department, program: user.program };
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

function companyForUser(userId: number): Company {
  const company = getState().companies.find((c) => c.user_id === userId);
  if (!company) throw new ApiError(404, "No company profile found for this account");
  return company;
}

function toProject(raw: RawProject): Project {
  const db = getState();
  return {
    id: raw.id,
    title: raw.title,
    required_expertise: raw.required_expertise,
    background_objective: raw.background_objective,
    deliverable: raw.deliverable,
    company_resources: raw.company_resources,
    required_skills: raw.required_skills,
    group_size: raw.group_size,
    status: raw.status,
    source: raw.source,
    company: raw.company_id ? db.companies.find((c) => c.id === raw.company_id) ?? null : null,
    assigned_professor: raw.assigned_professor_id
      ? (() => {
          const u = findUser(raw.assigned_professor_id!);
          return u ? toUserSummary(u) : null;
        })()
      : null,
    chair_contact_info: raw.chair_contact_info,
    application_deadline: raw.application_deadline,
    required_documents: raw.required_documents,
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
    student: student ? toUserSummary(student) : { id: raw.student_id, role: "student", name: "Unknown", department: "", program: "" },
    project: project ? toProject(project) : (undefined as never),
    professor_decision: raw.professor_decision,
    company_decision: raw.company_decision,
    confirmed: raw.confirmed,
    withdrawn: raw.withdrawn,
    documents_note: raw.documents_note,
    created_at: raw.created_at,
  };
}

function toStudentProfile(raw: RawStudentProfile): StudentProfile {
  const student = findUser(raw.student_id);
  return {
    student: student ? toUserSummary(student) : { id: raw.student_id, role: "student", name: "Unknown", department: "", program: "" },
    areas_of_expertise: raw.areas_of_expertise,
    research_interests: raw.research_interests,
    skills: raw.skills,
    previous_projects: raw.previous_projects,
    availability: raw.availability,
    looking_for_team: raw.looking_for_team,
    team_message: raw.team_message,
  };
}

function toCheckIn(raw: RawCheckIn): CheckIn {
  const author = findUser(raw.author_id);
  return {
    id: raw.id,
    project_id: raw.project_id,
    author: author ? toUserSummary(author) : { id: raw.author_id, role: "student", name: "Unknown", department: "", program: "" },
    note: raw.note,
    created_at: raw.created_at,
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

export const store = {
  demoUsers(): UserSummary[] {
    return getState().users.map(toUserSummary);
  },

  users(userId: number | null): User[] {
    requireRole(userId, "staff");
    return getState().users.slice();
  },

  // FR-11/FR-17: role-based visibility. Students/companies only ever see
  // published listings (ongoing/filled); staff sees everything; professors
  // see published listings plus approved-but-unclaimed ones to consider
  // taking on (FR-5).
  projects(
    userId: number | null,
    params: { status?: string; expertise?: string; q?: string; companyId?: string } = {}
  ): Project[] {
    let list = getState().projects.slice();

    if (params.status) list = list.filter((p) => p.status === params.status);
    if (params.expertise) list = list.filter((p) => p.required_expertise === params.expertise);
    if (params.companyId) list = list.filter((p) => p.company_id === Number(params.companyId));
    if (params.q) {
      const needle = params.q.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(needle) || p.background_objective.toLowerCase().includes(needle)
      );
    }

    const user = userId ? findUser(userId) : undefined;
    const PUBLISHED: ProjectStatus[] = ["ongoing", "filled"];
    if (!user || user.role === "student" || user.role === "company") {
      // companies additionally get their own projects at any status via companyId param above
      if (!params.companyId) list = list.filter((p) => PUBLISHED.includes(p.status));
    } else if (user.role === "professor") {
      list = list.filter((p) => PUBLISHED.includes(p.status) || p.status === "approved");
    }
    // staff: unrestricted

    return list.map(toProject);
  },

  project(id: number): Project {
    return toProject(requireRawProject(id));
  },

  // FR-2: company submission portal.
  submitCompanyProject(
    userId: number | null,
    body: {
      title: string;
      required_expertise: string;
      background_objective: string;
      deliverable: string;
      company_resources: string;
      required_skills: string;
      group_size: number;
    }
  ): Project {
    const user = requireRole(userId, "company");
    const company = companyForUser(user.id);
    const db = getState();
    const project: RawProject = {
      id: db.nextProjectId++,
      title: body.title,
      required_expertise: body.required_expertise,
      background_objective: body.background_objective,
      deliverable: body.deliverable,
      company_resources: body.company_resources,
      required_skills: body.required_skills,
      group_size: body.group_size || 1,
      status: "pending",
      source: "company",
      company_id: company.id,
      assigned_professor_id: null,
      chair_contact_info: "",
      application_deadline: "",
      required_documents: "",
      created_at: now(),
      updated_at: now(),
    };
    db.projects.push(project);
    recordAudit(user.id, "project", String(project.id), "submitted by company");
    persist();
    return toProject(project);
  },

  // FR-7: professor submits a directly agreed project, skipping the company
  // portal and staff review — they're already both the supervisor and the
  // approver of this arrangement.
  submitDirectProject(
    userId: number | null,
    body: {
      title: string;
      required_expertise: string;
      background_objective: string;
      deliverable: string;
      required_skills: string;
      group_size: number;
      chair_contact_info: string;
      application_deadline: string;
      required_documents: string;
    }
  ): Project {
    const user = requireRole(userId, "professor");
    const db = getState();
    const project: RawProject = {
      id: db.nextProjectId++,
      title: body.title,
      required_expertise: body.required_expertise,
      background_objective: body.background_objective,
      deliverable: body.deliverable,
      company_resources: "",
      required_skills: body.required_skills,
      group_size: body.group_size || 1,
      status: "ongoing",
      source: "professor_direct",
      company_id: null,
      assigned_professor_id: user.id,
      chair_contact_info: body.chair_contact_info,
      application_deadline: body.application_deadline,
      required_documents: body.required_documents,
      created_at: now(),
      updated_at: now(),
    };
    db.projects.push(project);
    recordAudit(user.id, "project", String(project.id), "submitted directly and published");
    persist();
    return toProject(project);
  },

  // FR-3: staff review/approve (or reject) a pending submission.
  transitionStatus(userId: number | null, id: number, status: ProjectStatus): Project {
    const user = requireRole(userId, "staff");
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

  // FR-6: professor takes on supervision and publishes the listing.
  takeOnSupervision(
    userId: number | null,
    id: number,
    body: { chair_contact_info: string; application_deadline: string; required_documents: string }
  ): Project {
    const user = requireRole(userId, "professor");
    const project = requireRawProject(id);
    if (project.status !== "approved") {
      throw new ApiError(400, "Only approved, unsupervised projects can be taken on");
    }
    if (project.required_expertise && project.required_expertise !== user.department) {
      throw new ApiError(403, `This topic requires expertise from ${project.required_expertise}`);
    }
    if (!body.chair_contact_info || !body.application_deadline) {
      throw new ApiError(400, "Chair contact info and an application deadline are required");
    }
    project.assigned_professor_id = user.id;
    project.status = "ongoing";
    project.chair_contact_info = body.chair_contact_info;
    project.application_deadline = body.application_deadline;
    project.required_documents = body.required_documents;
    project.updated_at = now();
    recordAudit(user.id, "project", String(project.id), "took on supervision and published listing");
    persist();
    return toProject(project);
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
    const user = requireRole(userId, "staff");
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
    const user = requireRole(userId, "staff");
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
    const user = requireRole(userId, "staff");
    const db = getState();
    const index = db.guides.findIndex((g) => g.slug === slug);
    if (index === -1) throw new ApiError(404, "Guide not found");
    db.guides.splice(index, 1);
    recordAudit(user.id, "guide", slug, "deleted");
    persist();
  },

  // FR-11/FR-12/FR-15: visibility depends on how the caller relates to the application.
  applications(userId: number | null, projectId?: number): Application[] {
    const user = requireRole(userId, "staff", "professor", "student", "company");
    const db = getState();
    let list = db.applications.slice();
    if (user.role === "student") {
      list = list.filter((a) => a.student_id === user.id);
    } else if (user.role === "professor") {
      list = list.filter((a) => {
        const project = db.projects.find((p) => p.id === a.project_id);
        return project?.assigned_professor_id === user.id;
      });
    } else if (user.role === "company") {
      const company = companyForUser(user.id);
      list = list.filter((a) => {
        const project = db.projects.find((p) => p.id === a.project_id);
        return project?.company_id === company.id;
      });
    }
    if (projectId) list = list.filter((a) => a.project_id === projectId);
    return list.map(toApplication);
  },

  // FR-11: student applies with simulated submitted documents.
  applyToProject(userId: number | null, projectId: number, documentsNote: string): Application {
    const user = requireRole(userId, "student");
    const project = requireRawProject(projectId);
    if (project.status !== "ongoing") {
      throw new ApiError(400, "This project is not currently open for applications");
    }
    const db = getState();
    if (db.applications.some((a) => a.student_id === user.id && a.project_id === projectId)) {
      throw new ApiError(409, "Already applied to this project");
    }
    const application: RawApplication = {
      id: db.nextApplicationId++,
      student_id: user.id,
      project_id: projectId,
      professor_decision: "pending",
      company_decision: "pending",
      confirmed: false,
      withdrawn: false,
      documents_note: documentsNote,
      created_at: now(),
    };
    db.applications.push(application);
    recordAudit(user.id, "application", String(application.id), "applied");
    persist();
    return toApplication(application);
  },

  // FR-15: professor and company each decide independently on an application.
  decideApplication(userId: number | null, applicationId: number, decision: ApplicationDecision): Application {
    const user = requireRole(userId, "professor", "company");
    const db = getState();
    const application = db.applications.find((a) => a.id === applicationId);
    if (!application) throw new ApiError(404, "Application not found");
    const project = db.projects.find((p) => p.id === application.project_id);
    if (!project) throw new ApiError(404, "Project not found");

    if (user.role === "professor") {
      if (project.assigned_professor_id !== user.id) {
        throw new ApiError(403, "You do not supervise this project");
      }
      application.professor_decision = decision;
      recordAudit(user.id, "application", String(application.id), `professor decision -> ${decision}`);
    } else {
      const company = companyForUser(user.id);
      if (project.company_id !== company.id) {
        throw new ApiError(403, "This is not your company's project");
      }
      application.company_decision = decision;
      recordAudit(user.id, "application", String(application.id), `company decision -> ${decision}`);
    }
    persist();
    return toApplication(application);
  },

  // FR-16: student confirms exactly one offer among possibly several accepted
  // ones; the others are automatically withdrawn.
  confirmOffer(userId: number | null, applicationId: number): Application {
    const user = requireRole(userId, "student");
    const db = getState();
    const application = db.applications.find((a) => a.id === applicationId);
    if (!application || application.student_id !== user.id) {
      throw new ApiError(404, "Application not found");
    }
    const project = db.projects.find((p) => p.id === application.project_id);
    if (!project) throw new ApiError(404, "Project not found");
    const hasCompany = project.company_id !== null;
    const companyOk = !hasCompany || application.company_decision === "accepted";
    if (application.professor_decision !== "accepted" || !companyOk) {
      throw new ApiError(400, "This offer has not been accepted by both sides yet");
    }

    application.confirmed = true;
    project.status = "filled";
    project.updated_at = now();

    // withdraw the student's other pending/accepted applications
    for (const other of db.applications) {
      if (other.id !== application.id && other.student_id === user.id && !other.withdrawn && !other.confirmed) {
        other.withdrawn = true;
      }
    }

    recordAudit(user.id, "application", String(application.id), "confirmed offer");
    persist();
    return toApplication(application);
  },

  // FR-4/FR-8/FR-9: student topic/profile directory, browsable by professors,
  // companies and staff, filterable by program.
  studentDirectory(params: { program?: string; q?: string } = {}): StudentProfile[] {
    let list = getState().studentProfiles.slice();
    if (params.program) {
      list = list.filter((p) => findUser(p.student_id)?.program === params.program);
    }
    if (params.q) {
      const needle = params.q.toLowerCase();
      list = list.filter(
        (p) =>
          p.areas_of_expertise.toLowerCase().includes(needle) ||
          p.research_interests.toLowerCase().includes(needle) ||
          p.skills.toLowerCase().includes(needle)
      );
    }
    return list.map(toStudentProfile);
  },

  studentsLookingForTeam(): StudentProfile[] {
    return getState()
      .studentProfiles.filter((p) => p.looking_for_team)
      .map(toStudentProfile);
  },

  // FR-8/FR-10: a student maintains their own topic/profile data.
  updateStudentProfile(
    userId: number | null,
    targetId: number,
    body: Omit<RawStudentProfile, "student_id">
  ): StudentProfile {
    const user = requireRole(userId, "student");
    if (user.id !== targetId) throw new ApiError(403, "Cannot edit another student's profile");
    const db = getState();
    let profile = db.studentProfiles.find((p) => p.student_id === user.id);
    if (!profile) {
      profile = { student_id: user.id, areas_of_expertise: "", research_interests: "", skills: "", previous_projects: "", availability: "", looking_for_team: false, team_message: "" };
      db.studentProfiles.push(profile);
    }
    Object.assign(profile, body);
    persist();
    return toStudentProfile(profile);
  },

  // FR-14: lightweight check-ins, visible/addable by the student on a
  // confirmed application or the professor supervising that project.
  checkIns(projectId: number): CheckIn[] {
    return getState()
      .checkIns.filter((c) => c.project_id === projectId)
      .slice()
      .reverse()
      .map(toCheckIn);
  },

  addCheckIn(userId: number | null, projectId: number, note: string): CheckIn {
    const user = requireRole(userId, "student", "professor");
    const project = requireRawProject(projectId);
    const db = getState();
    if (user.role === "professor" && project.assigned_professor_id !== user.id) {
      throw new ApiError(403, "You do not supervise this project");
    }
    if (user.role === "student") {
      const application = db.applications.find(
        (a) => a.student_id === user.id && a.project_id === projectId && a.confirmed
      );
      if (!application) throw new ApiError(403, "Only the confirmed student on this project can check in");
    }
    const checkIn: RawCheckIn = { id: db.nextCheckInId++, project_id: projectId, author_id: user.id, note, created_at: now() };
    db.checkIns.push(checkIn);
    persist();
    return toCheckIn(checkIn);
  },

  // NFR-1: companies self-verify by email domain at signup (mocked as
  // already true/false in seed data); staff performs the deeper check.
  verifyCompany(userId: number | null, companyId: number): Company {
    const user = requireRole(userId, "staff");
    const db = getState();
    const company = db.companies.find((c) => c.id === companyId);
    if (!company) throw new ApiError(404, "Company not found");
    company.verified = true;
    recordAudit(user.id, "company", String(company.id), "verified");
    persist();
    return company;
  },

  companies(userId: number | null): Company[] {
    requireRole(userId, "staff");
    return getState().companies.slice();
  },

  myCompany(userId: number | null): Company {
    const user = requireRole(userId, "company");
    return companyForUser(user.id);
  },

  auditLog(userId: number | null, projectId?: number): AuditLogEntry[] {
    requireRole(userId, "staff");
    let list = getState().auditLog.slice();
    if (projectId) list = list.filter((e) => e.entity_id === String(projectId));
    return list.reverse().map(toAuditLogEntry);
  },
};
