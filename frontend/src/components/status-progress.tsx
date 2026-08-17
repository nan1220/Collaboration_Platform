import { cn } from "@/lib/utils";
import { STATUS_LABELS, type ProjectStatus } from "@/lib/types";
import { STATUS_BAR_CLASS, STATUS_BAR_MUTED_CLASS } from "@/lib/status-colors";

const STAGES = ["pending", "approved", "open", "ongoing", "complete"] as const satisfies readonly Exclude<
  ProjectStatus,
  "rejected"
>[];

export function StatusProgress({ status }: { status: ProjectStatus }) {
  if (status === "rejected") {
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className={cn("size-2 shrink-0 rounded-full", STATUS_BAR_CLASS.rejected)} />
        <span className="font-medium text-destructive">{STATUS_LABELS.rejected}</span>
      </div>
    );
  }

  const currentIndex = STAGES.indexOf(status);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1">
        {STAGES.map((stage, i) => (
          <span
            key={stage}
            className={cn("h-2 flex-1 rounded-full", i <= currentIndex ? STATUS_BAR_CLASS[stage] : STATUS_BAR_MUTED_CLASS[stage])}
          />
        ))}
      </div>
      <div className="flex text-xs text-muted-foreground">
        {STAGES.map((stage, i) => (
          <span
            key={stage}
            className={cn("flex-1 text-center", i === currentIndex && "font-medium text-foreground")}
          >
            {STATUS_LABELS[stage]}
          </span>
        ))}
      </div>
    </div>
  );
}
