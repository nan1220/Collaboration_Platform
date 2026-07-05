import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/status-badge";
import type { Project } from "@/lib/types";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/projects/${project.id}`}>
      <Card className="transition-colors hover:border-primary/50">
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={project.status} />
            <Badge variant="outline" className="capitalize">
              {project.source}
            </Badge>
            {project.required_department && (
              <Badge variant="outline">{project.required_department}</Badge>
            )}
          </div>
          <CardTitle className="mt-1">{project.title}</CardTitle>
          <CardDescription className="line-clamp-2">{project.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
          {project.company && <span>{project.company.name}</span>}
          {project.assigned_professor && <span>Supervisor: {project.assigned_professor.name}</span>}
        </CardContent>
      </Card>
    </Link>
  );
}
