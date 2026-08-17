import type { Role } from "./types";

// Tailwind needs these class names to appear literally in source to generate
// them, so a per-role lookup map instead of a template string like
// `border-l-role-${role}`.
export const ROLE_ACCENT_BORDER: Record<Role, string> = {
  staff: "border-l-role-staff",
  professor: "border-l-role-professor",
  company: "border-l-role-company",
  student: "border-l-role-student",
};
