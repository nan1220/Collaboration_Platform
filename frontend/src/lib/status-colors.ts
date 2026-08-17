import type { ProjectStatus } from "./types";

// Single source of truth for status coloring, shared by StatusBadge,
// StatusProgress and ProjectCard's accent border.
//
// Five distinct hue families for the pipeline stages - taupe, indigo,
// mustard, plum, wine - kept in a muted/dusty saturation range so the set
// reads as one cohesive palette without any two stages sharing a hue. Each
// stays clear of every hue the logo already owns (TUM blue #0065BD/#9ABCE4,
// orange #F7811E, teal #2AA9A0, green #9FBA36) and clear of red, which
// "rejected" keeps for itself as the universal stop/error convention.
//
// Tailwind's scanner needs these as literal strings (not built from a shared
// hex constant) - it matches source text statically and never evaluates JS.

export const STATUS_BAR_CLASS: Record<ProjectStatus, string> = {
  pending: "bg-[#97927F]",
  approved: "bg-[#6C63A6]",
  open: "bg-[#C99A2E]",
  ongoing: "bg-[#A6437E]",
  complete: "bg-[#7A2E52]",
  rejected: "bg-destructive",
};

// Not-yet-reached stages on the progress bar: the same color, grayed down via
// opacity, rather than a flat neutral gray that would be indistinguishable
// from any other unreached stage.
export const STATUS_BAR_MUTED_CLASS: Record<Exclude<ProjectStatus, "rejected">, string> = {
  pending: "bg-[#97927F]/25",
  approved: "bg-[#6C63A6]/25",
  open: "bg-[#C99A2E]/25",
  ongoing: "bg-[#A6437E]/25",
  complete: "bg-[#7A2E52]/25",
};

export const STATUS_BADGE_CLASS: Record<ProjectStatus, string> = {
  pending: "bg-[#97927F]/15 text-[#6b6658] dark:bg-[#97927F]/25 dark:text-[#c9c4b0]",
  approved: "bg-[#6C63A6]/12 text-[#6C63A6] dark:bg-[#6C63A6]/25 dark:text-[#b0a8e0]",
  open: "bg-[#C99A2E]/15 text-[#8a6c1f] dark:bg-[#C99A2E]/25 dark:text-[#e8c766]",
  ongoing: "bg-[#A6437E]/12 text-[#A6437E] dark:bg-[#A6437E]/25 dark:text-[#e0a0c8]",
  complete: "bg-[#7A2E52]/12 text-[#7A2E52] dark:bg-[#7A2E52]/25 dark:text-[#d68cb0]",
  rejected: "bg-destructive/10 text-destructive dark:bg-destructive/20",
};

export const STATUS_BORDER_CLASS: Record<ProjectStatus, string> = {
  pending: "border-l-[#97927F]",
  approved: "border-l-[#6C63A6]",
  open: "border-l-[#C99A2E]",
  ongoing: "border-l-[#A6437E]",
  complete: "border-l-[#7A2E52]",
  rejected: "border-l-destructive",
};
