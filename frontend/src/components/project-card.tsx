import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/status-badge";
import { cn } from "@/lib/utils";
import { stripMarkdown } from "@/components/markdown";
import { isNotYetSupervised, type Project } from "@/lib/types";
import { STATUS_BORDER_CLASS } from "@/lib/status-colors";

const SOURCE_LABELS: Record<Project["source"], string> = {
  company: "Company",
  professor_direct: "Professor/Supervisor-submitted",
};

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/projects/detail?id=${project.id}`} className="block h-full">
      <Card
        className={cn(
          "h-full border-l-4 transition-all hover:-translate-y-0.5 hover:shadow-md",
          STATUS_BORDER_CLASS[project.status]
        )}
      >
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={project.status} />
            {isNotYetSupervised(project) && <Badge variant="outline">Not yet supervised</Badge>}
            <Badge variant="outline">{SOURCE_LABELS[project.source]}</Badge>
            {project.required_expertise && <Badge variant="outline">{project.required_expertise}</Badge>}
          </div>
          <CardTitle className="mt-1">{project.title}</CardTitle>
          <CardDescription className="line-clamp-2">{stripMarkdown(project.background_objective)}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
          {project.company && <span>{project.company.name}</span>}
          {project.assigned_professor && <span>Supervisor: {project.assigned_professor.name}</span>}
        </CardContent>
      </Card>
    </Link>
  );
}
