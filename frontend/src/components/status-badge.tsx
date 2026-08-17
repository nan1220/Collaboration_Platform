import { Badge } from "@/components/ui/badge";
import { STATUS_LABELS, type ProjectStatus } from "@/lib/types";
import { STATUS_BADGE_CLASS } from "@/lib/status-colors";

export function StatusBadge({ status }: { status: ProjectStatus }) {
  return <Badge className={STATUS_BADGE_CLASS[status]}>{STATUS_LABELS[status]}</Badge>;
}
