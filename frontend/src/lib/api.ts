import type {
  Application,
  AuditLogEntry,
  Guide,
  Project,
  StudentProfile,
  User,
  UserSummary,
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(
  path: string,
  options: { method?: string; body?: unknown; userId?: number | null } = {}
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (options.userId) headers["X-User-Id"] = String(options.userId);

  const res = await fetch(`${API_BASE}${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  if (res.status === 204) return undefined as T;

  const data = await res.json().catch(() => undefined);
  if (!res.ok) {
    throw new ApiError(res.status, data?.error ?? res.statusText);
  }
  return data as T;
}

export const api = {
  demoUsers: () => request<UserSummary[]>("/demo-users"),
  users: (userId: number) => request<User[]>("/users", { userId }),

  projects: (
    userId: number | null,
    params: Record<string, string | undefined> = {}
  ) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v) as [string, string][]
    ).toString();
    return request<Project[]>(`/projects${qs ? `?${qs}` : ""}`, { userId });
  },
  project: (id: number) => request<Project>(`/projects/${id}`),
  createProject: (
    userId: number,
    body: { title: string; description: string; required_department: string }
  ) => request<Project>("/projects", { method: "POST", body, userId }),
  transitionStatus: (userId: number, id: number, status: string) =>
    request<Project>(`/projects/${id}/status`, { method: "PATCH", body: { status }, userId }),
  claimProject: (userId: number, id: number) =>
    request<Project>(`/projects/${id}/claim`, { method: "POST", userId }),

  submitCompanyProject: (body: {
    companyName: string;
    contactName: string;
    contactEmail: string;
    title: string;
    description: string;
  }) =>
    request<{ statusToken: string; projectId: number }>("/companies/submit", {
      method: "POST",
      body,
    }),
  publicStatus: (token: string) =>
    request<{ title: string; status: string; updatedAt: string }>(`/public/status/${token}`),

  guides: () => request<Guide[]>("/guides"),
  guide: (slug: string) => request<Guide>(`/guides/${slug}`),
  createGuide: (
    userId: number,
    body: { slug: string; title: string; category: string; audience: string; body: string }
  ) => request<Guide>("/guides", { method: "POST", body, userId }),
  updateGuide: (userId: number, slug: string, body: Partial<Guide>) =>
    request<Guide>(`/guides/${slug}`, { method: "PATCH", body, userId }),
  deleteGuide: (userId: number, slug: string) =>
    request<void>(`/guides/${slug}`, { method: "DELETE", userId }),

  applications: (userId: number, projectId?: number) =>
    request<Application[]>(
      `/applications${projectId ? `?projectId=${projectId}` : ""}`,
      { userId }
    ),
  applyToProject: (userId: number, projectId: number) =>
    request<Application>("/applications", { method: "POST", body: { projectId }, userId }),

  studentsLookingForTeam: () =>
    request<StudentProfile[]>("/students?lookingForTeam=true"),
  updateStudentProfile: (
    userId: number,
    body: { lookingForTeam: boolean; interests: string; bio: string }
  ) => request<StudentProfile>(`/students/${userId}/profile`, { method: "PUT", body, userId }),

  auditLog: (userId: number, projectId?: number) =>
    request<AuditLogEntry[]>(
      `/audit-log${projectId ? `?projectId=${projectId}` : ""}`,
      { userId }
    ),
};
