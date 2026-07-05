import { store } from "./mock-store";
import type { Guide, ProjectStatus } from "./types";

export { ApiError } from "./api-error";

/**
 * This used to be a fetch()-based client for the Django mock backend. The
 * app now ships as a static export (GitHub Pages, no server), so every call
 * here is routed to mock-store.ts — an in-browser stand-in that keeps the
 * exact same shape/errors so no calling code had to change.
 */
async function run<T>(fn: () => T): Promise<T> {
  return fn();
}

export const api = {
  demoUsers: () => run(() => store.demoUsers()),
  users: (userId: number) => run(() => store.users(userId)),

  projects: (userId: number | null, params: Record<string, string | undefined> = {}) =>
    run(() => store.projects(userId, params)),
  project: (id: number) => run(() => store.project(id)),
  createProject: (
    userId: number,
    body: { title: string; description: string; required_department: string }
  ) => run(() => store.createProject(userId, body)),
  transitionStatus: (userId: number, id: number, status: string) =>
    run(() => store.transitionStatus(userId, id, status as ProjectStatus)),
  claimProject: (userId: number, id: number) => run(() => store.claimProject(userId, id)),

  submitCompanyProject: (body: {
    companyName: string;
    contactName: string;
    contactEmail: string;
    title: string;
    description: string;
  }) => run(() => store.submitCompanyProject(body)),
  publicStatus: (token: string) => run(() => store.publicStatus(token)),

  guides: () => run(() => store.guides()),
  guide: (slug: string) => run(() => store.guide(slug)),
  createGuide: (
    userId: number,
    body: { slug: string; title: string; category: string; audience: string; body: string }
  ) => run(() => store.createGuide(userId, { ...body, audience: body.audience as Guide["audience"] })),
  updateGuide: (userId: number, slug: string, body: Partial<Guide>) =>
    run(() => store.updateGuide(userId, slug, body)),
  deleteGuide: (userId: number, slug: string) => run(() => store.deleteGuide(userId, slug)),

  applications: (userId: number, projectId?: number) =>
    run(() => store.applications(userId, projectId)),
  applyToProject: (userId: number, projectId: number) =>
    run(() => store.applyToProject(userId, projectId)),

  studentsLookingForTeam: () => run(() => store.studentsLookingForTeam()),
  updateStudentProfile: (
    userId: number,
    body: { lookingForTeam: boolean; interests: string; bio: string }
  ) => run(() => store.updateStudentProfile(userId, userId, body)),

  auditLog: (userId: number, projectId?: number) => run(() => store.auditLog(userId, projectId)),
};
