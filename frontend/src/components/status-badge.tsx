import { Badge } from "@/components/ui/badge";
import { STATUS_LABELS, type ProjectStatus } from "@/lib/types";

const VARIANTS: Record<ProjectStatus, "default" | "secondary" | "success" | "destructive" | "outline"> = {
  submitted: "outline",
  under_review: "outline",
  approved: "secondary",
  assigned: "secondary",
  in_progress: "default",
  completed: "success",
  rejected: "destructive",
};

export function StatusBadge({ status }: { status: ProjectStatus }) {
  return <Badge variant={VARIANTS[status]}>{STATUS_LABELS[status]}</Badge>;
}
