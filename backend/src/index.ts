import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";
import { nanoid } from "nanoid";
import {
  applications,
  auditLog,
  companies,
  guides,
  now,
  projects,
  recordAudit,
  studentProfiles,
  users,
} from "./data.js";
import type { Project, ProjectStatus, Role, User } from "./types.js";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

// --- demo "auth": the frontend sends the id of the currently selected demo
// user in the x-user-id header. There is no password/session — this mock
// exists to unblock frontend development, not to demonstrate real auth. ---
function currentUser(req: Request): User | undefined {
  const id = req.header("x-user-id");
  return id ? users.find((u) => u.id === id) : undefined;
}

function requireRole(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = currentUser(req);
    if (!user || !roles.includes(user.role)) {
      res.status(403).json({ error: "Forbidden for this role" });
      return;
    }
    next();
  };
}

const ALLOWED_TRANSITIONS: Record<ProjectStatus, ProjectStatus[]> = {
  submitted: ["under_review", "rejected"],
  under_review: ["approved", "rejected"],
  approved: ["assigned", "rejected"],
  assigned: ["in_progress", "approved"],
  in_progress: ["completed"],
  completed: [],
  rejected: [],
};

function projectView(p: Project) {
  return {
    ...p,
    company: p.companyId ? companies.find((c) => c.id === p.companyId) : undefined,
    assignedProfessor: p.assignedProfessorId
      ? users.find((u) => u.id === p.assignedProfessorId)
      : undefined,
  };
}

// ---- demo users (public, powers the role switcher in the frontend) ----
app.get("/api/demo-users", (_req, res) => {
  res.json(users.map((u) => ({ id: u.id, role: u.role, name: u.name, department: u.department })));
});

app.get("/api/me", (req, res) => {
  const user = currentUser(req);
  if (!user) {
    res.status(401).json({ error: "No demo user selected" });
    return;
  }
  res.json(user);
});

// ---- users (organizer only) ----
app.get("/api/users", requireRole("organizer"), (_req, res) => {
  res.json(users);
});

// ---- projects ----
app.get("/api/projects", (req, res) => {
  const user = currentUser(req);
  let result = projects.slice();

  const { status, source, q, unassigned } = req.query;
  if (status && typeof status === "string") {
    result = result.filter((p) => p.status === status);
  }
  if (source && typeof source === "string") {
    result = result.filter((p) => p.source === source);
  }
  if (unassigned === "true") {
    result = result.filter((p) => p.status === "approved" && !p.assignedProfessorId);
  }
  if (q && typeof q === "string") {
    const needle = q.toLowerCase();
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(needle) || p.description.toLowerCase().includes(needle)
    );
  }

  // students/professors never see submitted/under_review company intake —
  // that queue is organizer-only until approved.
  if (!user || user.role === "student") {
    result = result.filter((p) => !["submitted", "under_review"].includes(p.status));
  }
  if (user?.role === "professor") {
    result = result.filter(
      (p) => !["submitted", "under_review"].includes(p.status) || p.assignedProfessorId === user.id
    );
  }

  res.json(result.map(projectView));
});

app.get("/api/projects/:id", (req, res) => {
  const project = projects.find((p) => p.id === req.params.id);
  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }
  res.json(projectView(project));
});

app.post("/api/projects", requireRole("organizer"), (req, res) => {
  const { title, description, requiredDepartment } = req.body ?? {};
  if (!title || !description) {
    res.status(400).json({ error: "title and description are required" });
    return;
  }
  const project: Project = {
    id: `p-${nanoid(8)}`,
    title,
    description,
    source: "internal",
    status: "submitted",
    requiredDepartment,
    statusToken: nanoid(12),
    createdAt: now(),
    updatedAt: now(),
  };
  projects.push(project);
  recordAudit({ actorId: currentUser(req)!.id, entity: "project", entityId: project.id, action: "created (internal)" });
  res.status(201).json(projectView(project));
});

app.patch("/api/projects/:id/status", requireRole("organizer", "professor"), (req, res) => {
  const project = projects.find((p) => p.id === req.params.id);
  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }
  const { status } = req.body ?? {};
  const allowed = ALLOWED_TRANSITIONS[project.status];
  if (!status || !allowed.includes(status)) {
    res.status(400).json({ error: `Cannot transition from ${project.status} to ${status}`, allowed });
    return;
  }
  project.status = status;
  project.updatedAt = now();
  recordAudit({
    actorId: currentUser(req)!.id,
    entity: "project",
    entityId: project.id,
    action: `status -> ${status}`,
  });
  res.json(projectView(project));
});

app.post("/api/projects/:id/claim", requireRole("professor"), (req, res) => {
  const project = projects.find((p) => p.id === req.params.id);
  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }
  const user = currentUser(req)!;
  if (project.status !== "approved") {
    res.status(400).json({ error: "Only approved, unassigned projects can be claimed" });
    return;
  }
  if (project.requiredDepartment && project.requiredDepartment !== user.department) {
    res.status(403).json({
      error: `This topic requires a supervisor from ${project.requiredDepartment}`,
    });
    return;
  }
  project.assignedProfessorId = user.id;
  project.status = "assigned";
  project.updatedAt = now();
  recordAudit({
    actorId: user.id,
    entity: "project",
    entityId: project.id,
    action: "claimed (assigned professor)",
  });
  res.json(projectView(project));
});

// ---- company submissions (public, no auth) ----
app.post("/api/companies/submit", (req, res) => {
  const { companyName, contactName, contactEmail, title, description } = req.body ?? {};
  if (!companyName || !contactName || !contactEmail || !title || !description) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }
  let company = companies.find(
    (c) => c.name.toLowerCase() === String(companyName).toLowerCase()
  );
  if (!company) {
    company = { id: `c-${nanoid(8)}`, name: companyName, contactName, contactEmail };
    companies.push(company);
  }
  const project: Project = {
    id: `p-${nanoid(8)}`,
    title,
    description,
    source: "company",
    status: "submitted",
    companyId: company.id,
    requiredDepartment: "School of Management",
    statusToken: nanoid(12),
    createdAt: now(),
    updatedAt: now(),
  };
  projects.push(project);
  recordAudit({
    actorId: "company-submission",
    entity: "project",
    entityId: project.id,
    action: "submitted by company",
  });
  res.status(201).json({ statusToken: project.statusToken, projectId: project.id });
});

app.get("/api/public/status/:token", (req, res) => {
  const project = projects.find((p) => p.statusToken === req.params.token);
  if (!project) {
    res.status(404).json({ error: "No submission found for this link" });
    return;
  }
  res.json({
    title: project.title,
    status: project.status,
    updatedAt: project.updatedAt,
  });
});

// ---- guides ----
app.get("/api/guides", (_req, res) => {
  res.json(guides);
});

app.get("/api/guides/:slug", (req, res) => {
  const guide = guides.find((g) => g.slug === req.params.slug);
  if (!guide) {
    res.status(404).json({ error: "Guide not found" });
    return;
  }
  res.json(guide);
});

app.post("/api/guides", requireRole("organizer"), (req, res) => {
  const { slug, title, category, audience, body } = req.body ?? {};
  if (!slug || !title || !body) {
    res.status(400).json({ error: "slug, title and body are required" });
    return;
  }
  if (guides.some((g) => g.slug === slug)) {
    res.status(409).json({ error: "A guide with this slug already exists" });
    return;
  }
  const guide = {
    slug,
    title,
    category: category || "General",
    audience: audience || "all",
    body,
    updatedBy: currentUser(req)!.id,
    updatedAt: now(),
  };
  guides.push(guide);
  recordAudit({ actorId: currentUser(req)!.id, entity: "guide", entityId: slug, action: "created" });
  res.status(201).json(guide);
});

app.patch("/api/guides/:slug", requireRole("organizer"), (req, res) => {
  const guide = guides.find((g) => g.slug === req.params.slug);
  if (!guide) {
    res.status(404).json({ error: "Guide not found" });
    return;
  }
  const { title, category, audience, body } = req.body ?? {};
  if (title) guide.title = title;
  if (category) guide.category = category;
  if (audience) guide.audience = audience;
  if (body) guide.body = body;
  guide.updatedBy = currentUser(req)!.id;
  guide.updatedAt = now();
  recordAudit({ actorId: currentUser(req)!.id, entity: "guide", entityId: guide.slug, action: "updated" });
  res.json(guide);
});

app.delete("/api/guides/:slug", requireRole("organizer"), (req, res) => {
  const index = guides.findIndex((g) => g.slug === req.params.slug);
  if (index === -1) {
    res.status(404).json({ error: "Guide not found" });
    return;
  }
  guides.splice(index, 1);
  recordAudit({ actorId: currentUser(req)!.id, entity: "guide", entityId: req.params.slug, action: "deleted" });
  res.status(204).send();
});

// ---- applications (student interest in a project) ----
app.get("/api/applications", requireRole("organizer", "professor", "student"), (req, res) => {
  const user = currentUser(req)!;
  let result = applications.slice();
  if (user.role === "student") {
    result = result.filter((a) => a.studentId === user.id);
  }
  const { projectId } = req.query;
  if (projectId && typeof projectId === "string") {
    result = result.filter((a) => a.projectId === projectId);
  }
  res.json(
    result.map((a) => ({
      ...a,
      student: users.find((u) => u.id === a.studentId),
      project: projects.find((p) => p.id === a.projectId),
    }))
  );
});

app.post("/api/applications", requireRole("student"), (req, res) => {
  const user = currentUser(req)!;
  const { projectId } = req.body ?? {};
  const project = projects.find((p) => p.id === projectId);
  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }
  if (applications.some((a) => a.studentId === user.id && a.projectId === projectId)) {
    res.status(409).json({ error: "Already applied to this project" });
    return;
  }
  const application = {
    id: `a-${nanoid(8)}`,
    studentId: user.id,
    projectId,
    status: "interested" as const,
    createdAt: now(),
  };
  applications.push(application);
  recordAudit({ actorId: user.id, entity: "application", entityId: application.id, action: "created (interested)" });
  res.status(201).json(application);
});

// ---- student profiles (optional teammate finder, req #3) ----
app.get("/api/students", (req, res) => {
  const lookingForTeam = req.query.lookingForTeam === "true";
  let profiles = studentProfiles.slice();
  if (lookingForTeam) {
    profiles = profiles.filter((p) => p.lookingForTeam);
  }
  res.json(profiles.map((p) => ({ ...p, student: users.find((u) => u.id === p.studentId) })));
});

app.put("/api/students/:id/profile", requireRole("student"), (req, res) => {
  const user = currentUser(req)!;
  if (user.id !== req.params.id) {
    res.status(403).json({ error: "Cannot edit another student's profile" });
    return;
  }
  const { lookingForTeam, interests, bio } = req.body ?? {};
  let profile = studentProfiles.find((p) => p.studentId === user.id);
  if (!profile) {
    profile = { studentId: user.id, lookingForTeam: false, interests: "", bio: "" };
    studentProfiles.push(profile);
  }
  profile.lookingForTeam = Boolean(lookingForTeam);
  profile.interests = interests ?? profile.interests;
  profile.bio = bio ?? profile.bio;
  res.json(profile);
});

// ---- audit log (organizer only) ----
app.get("/api/audit-log", requireRole("organizer"), (req, res) => {
  let result = auditLog.slice().reverse();
  const { projectId } = req.query;
  if (projectId && typeof projectId === "string") {
    result = result.filter((e) => e.entityId === projectId);
  }
  res.json(
    result.map((e) => ({
      ...e,
      actor: users.find((u) => u.id === e.actorId),
    }))
  );
});

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Mock backend listening on http://localhost:${PORT}`);
});
