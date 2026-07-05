"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useCurrentUser } from "@/lib/current-user";
import { ProjectCard } from "@/components/project-card";

export default function ProfessorPage() {
  const { currentUser } = useCurrentUser();
  const enabled = currentUser?.role === "professor";

  const { data: claimable = [] } = useQuery({
    queryKey: ["projects", "unassigned", currentUser?.id],
    queryFn: () => api.projects(currentUser!.id, { unassigned: "true" }),
    enabled,
  });

  const { data: allProjects = [] } = useQuery({
    queryKey: ["projects", "all-for-professor", currentUser?.id],
    queryFn: () => api.projects(currentUser!.id),
    enabled,
  });

  if (!currentUser || currentUser.role !== "professor") {
    return (
      <p className="text-muted-foreground">
        Select a professor demo user (top right) to see this dashboard.
      </p>
    );
  }

  const myProjects = allProjects.filter((p) => p.assigned_professor?.id === currentUser.id);
  const eligibleClaimable = claimable.filter(
    (p) => !p.required_department || p.required_department === currentUser.department
  );

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">My supervision</h1>
        <p className="mt-1 text-muted-foreground">
          Claim approved topics matching your department ({currentUser.department || "none set"}) and
          manage the projects you already supervise.
        </p>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="font-medium">Available to claim</h2>
        {eligibleClaimable.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No approved, unassigned topics in your department right now.
          </p>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          {eligibleClaimable.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-medium">My projects</h2>
        {myProjects.length === 0 && (
          <p className="text-sm text-muted-foreground">You are not supervising any projects yet.</p>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          {myProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>
    </div>
  );
}
