import { store } from "./mock-store";
import type { ApplicationDecision, Guide, ProjectStatus } from "./types";

export { ApiError } from "./api-error";

/**
 * This is a fully in-browser mock (see mock-store.ts) so the app can ship as
 * a static export (GitHub Pages, no server). Kept as a thin async wrapper so
 * call sites read the same as a real fetch-based client would.
 */
async function run<T>(fn: () => T): Promise<T> {
  return fn();
}

export const api = {
  demoUsers: () => run(() => store.demoUsers()),
  users: (userId: number) => run(() => store.users(userId)),

  signInInstitutional: (body: {
    name: string;
    role: "student" | "professor" | "staff";
    department: string;
    program: string;
    expertise: string;
    bio: string;
  }) => run(() => store.signInInstitutional(body)),
  registerCompany: (body: { name: string; contact_name: string; contact_email: string }) =>
    run(() => store.registerCompany(body)),
  signInCompany: (contactEmail: string) => run(() => store.signInCompany(contactEmail)),

  projects: (userId: number | null, params: Record<string, string | undefined> = {}) =>
    run(() => store.projects(userId, params)),
  project: (id: number) => run(() => store.project(id)),

  submitCompanyProject: (
    userId: number,
    body: {
      title: string;
      required_expertise: string;
      background_objective: string;
      deliverable: string;
      company_resources: string;
      required_skills: string;
      group_size: number;
    }
  ) => run(() => store.submitCompanyProject(userId, body)),

  submitDirectProject: (
    userId: number,
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
  ) => run(() => store.submitDirectProject(userId, body)),

  transitionStatus: (userId: number, id: number, status: string) =>
    run(() => store.transitionStatus(userId, id, status as ProjectStatus)),

  takeOnSupervision: (
    userId: number,
    id: number,
    body: { chair_contact_info: string; application_deadline: string; required_documents: string }
  ) => run(() => store.takeOnSupervision(userId, id, body)),

  guides: () => run(() => store.guides()),
  guide: (slug: string) => run(() => store.guide(slug)),
  createGuide: (
    userId: number,
    body: { slug: string; title: string; category: string; audience: string; body: string }
  ) => run(() => store.createGuide(userId, { ...body, audience: body.audience as Guide["audience"] })),
  updateGuide: (userId: number, slug: string, body: Partial<Guide>) =>
    run(() => store.updateGuide(userId, slug, body)),
  deleteGuide: (userId: number, slug: string) => run(() => store.deleteGuide(userId, slug)),

  applications: (userId: number, projectId?: number) => run(() => store.applications(userId, projectId)),
  applyToProject: (userId: number, projectId: number, documentsNote: string) =>
    run(() => store.applyToProject(userId, projectId, documentsNote)),
  decideApplication: (userId: number, applicationId: number, decision: ApplicationDecision) =>
    run(() => store.decideApplication(userId, applicationId, decision)),
  confirmOffer: (userId: number, applicationId: number) => run(() => store.confirmOffer(userId, applicationId)),

  studentDirectory: (params: { program?: string; q?: string } = {}) => run(() => store.studentDirectory(params)),
  studentsLookingForTeam: () => run(() => store.studentsLookingForTeam()),
  updateStudentProfile: (
    userId: number,
    body: {
      areas_of_expertise: string;
      research_interests: string;
      skills: string;
      previous_projects: string;
      availability: string;
      looking_for_team: boolean;
      team_message: string;
    }
  ) => run(() => store.updateStudentProfile(userId, userId, body)),

  checkIns: (projectId: number) => run(() => store.checkIns(projectId)),
  addCheckIn: (userId: number, projectId: number, note: string) =>
    run(() => store.addCheckIn(userId, projectId, note)),

  companies: (userId: number) => run(() => store.companies(userId)),
  myCompany: (userId: number) => run(() => store.myCompany(userId)),
  verifyCompany: (userId: number, companyId: number) => run(() => store.verifyCompany(userId, companyId)),

  auditLog: (userId: number, projectId?: number) => run(() => store.auditLog(userId, projectId)),

  resetDatabase: (userId: number) => run(() => store.resetDatabase(userId)),
};
