import type { Role } from "./types";

// Tailwind needs these class names to appear literally in source to generate
// them, so per-role lookup maps instead of template strings like
// `border-l-role-${role}`.
export const ROLE_ACCENT_BORDER_L: Record<Role, string> = {
  staff: "border-l-role-staff",
  professor: "border-l-role-professor",
  company: "border-l-role-company",
  student: "border-l-role-student",
};

export const ROLE_ACCENT_BORDER_B: Record<Role, string> = {
  staff: "border-b-role-staff",
  professor: "border-b-role-professor",
  company: "border-b-role-company",
  student: "border-b-role-student",
};

export const ROLE_ACCENT_BG: Record<Role, string> = {
  staff: "bg-role-staff/8",
  professor: "bg-role-professor/8",
  company: "bg-role-company/8",
  student: "bg-role-student/8",
};

export const ROLE_ACCENT_TEXT: Record<Role, string> = {
  staff: "text-role-staff",
  professor: "text-role-professor",
  company: "text-role-company",
  student: "text-role-student",
};
