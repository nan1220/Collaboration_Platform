import { Badge } from "@/components/ui/badge";
import { STATUS_LABELS, type ProjectStatus } from "@/lib/types";

const VARIANTS: Record<ProjectStatus, "default" | "secondary" | "success" | "destructive" | "outline"> = {
  pending: "outline",
  approved: "secondary",
  open: "secondary",
  ongoing: "default",
  complete: "success",
  rejected: "destructive",
};

export function StatusBadge({ status }: { status: ProjectStatus }) {
  return <Badge variant={VARIANTS[status]}>{STATUS_LABELS[status]}</Badge>;
}
