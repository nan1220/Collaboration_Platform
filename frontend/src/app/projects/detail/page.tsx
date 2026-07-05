"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, ApiError } from "@/lib/api";
import { useCurrentUser } from "@/lib/current-user";
import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ALLOWED_TRANSITIONS, STATUS_LABELS, type ProjectStatus } from "@/lib/types";

export default function ProjectDetailPage() {
  return (
    <Suspense fallback={<p className="text-muted-foreground">Loading…</p>}>
      <ProjectDetail />
    </Suspense>
  );
}

function ProjectDetail() {
  const searchParams = useSearchParams();
  const projectId = Number(searchParams.get("id"));
  const { currentUser } = useCurrentUser();
  const queryClient = useQueryClient();

  const { data: project, isLoading } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => api.project(projectId),
  });

  const { data: applications = [] } = useQuery({
    queryKey: ["applications", "project", projectId, currentUser?.id],
    queryFn: () => api.applications(currentUser!.id, projectId),
    enabled: !!currentUser && (currentUser.role === "organizer" || currentUser.role === "professor"),
  });

  const { data: myApplications = [] } = useQuery({
    queryKey: ["applications", "mine", currentUser?.id],
    queryFn: () => api.applications(currentUser!.id),
    enabled: !!currentUser && currentUser.role === "student",
  });

  const { data: auditLog = [] } = useQuery({
    queryKey: ["audit-log", projectId, currentUser?.id],
    queryFn: () => api.auditLog(currentUser!.id, projectId),
    enabled: !!currentUser && currentUser.role === "organizer",
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["project", projectId] });
    queryClient.invalidateQueries({ queryKey: ["projects"] });
    queryClient.invalidateQueries({ queryKey: ["audit-log", projectId] });
  };

  const transitionMutation = useMutation({
    mutationFn: (status: ProjectStatus) => api.transitionStatus(currentUser!.id, projectId, status),
    onSuccess: () => {
      toast.success("Status updated");
      invalidate();
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Failed to update status"),
  });

  const claimMutation = useMutation({
    mutationFn: () => api.claimProject(currentUser!.id, projectId),
    onSuccess: () => {
      toast.success("Project claimed — you are now the supervisor");
      invalidate();
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Failed to claim project"),
  });

  const applyMutation = useMutation({
    mutationFn: () => api.applyToProject(currentUser!.id, projectId),
    onSuccess: () => {
      toast.success("Interest submitted");
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Failed to apply"),
  });

  if (isLoading || !project) return <p className="text-muted-foreground">Loading…</p>;

  const isOrganizer = currentUser?.role === "organizer";
  const isAssignedProfessor =
    currentUser?.role === "professor" && project.assigned_professor?.id === currentUser.id;
  const canTransition = isOrganizer || isAssignedProfessor;
  const transitions = ALLOWED_TRANSITIONS[project.status];

  const canClaim =
    currentUser?.role === "professor" &&
    project.status === "approved" &&
    !project.assigned_professor;

  const alreadyApplied = myApplications.some((a) => a.project.id === projectId);
  const canApply = currentUser?.role === "student" && !alreadyApplied && !["submitted", "under_review", "rejected", "completed"].includes(project.status);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={project.status} />
            <Badge variant="outline" className="capitalize">
              {project.source}
            </Badge>
            {project.required_department && <Badge variant="outline">{project.required_department}</Badge>}
          </div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">{project.title}</h1>
        </div>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-3 pt-6">
          <p>{project.description}</p>
          <Separator />
          <div className="grid gap-1 text-sm text-muted-foreground sm:grid-cols-2">
            {project.company && (
              <div>
                <span className="font-medium text-foreground">Company: </span>
                {project.company.name} ({project.company.contact_name})
              </div>
            )}
            {project.assigned_professor && (
              <div>
                <span className="font-medium text-foreground">Supervisor: </span>
                {project.assigned_professor.name}
              </div>
            )}
            <div>
              <span className="font-medium text-foreground">Created: </span>
              {new Date(project.created_at).toLocaleDateString()}
            </div>
            <div>
              <span className="font-medium text-foreground">Last updated: </span>
              {new Date(project.updated_at).toLocaleDateString()}
            </div>
          </div>
        </CardContent>
      </Card>

      {!currentUser && (
        <p className="text-sm text-muted-foreground">
          Select a demo user in the top right to apply, claim or manage this project.
        </p>
      )}

      {canApply && (
        <Button onClick={() => applyMutation.mutate()} disabled={applyMutation.isPending}>
          Express interest in this project
        </Button>
      )}
      {alreadyApplied && currentUser?.role === "student" && (
        <p className="text-sm text-muted-foreground">You have already expressed interest in this project.</p>
      )}

      {canClaim && (
        <Button onClick={() => claimMutation.mutate()} disabled={claimMutation.isPending}>
          Claim as supervisor
        </Button>
      )}

      {canTransition && transitions.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Change status:</span>
          {transitions.map((status) => (
            <Button
              key={status}
              size="sm"
              variant={status === "rejected" ? "destructive" : "secondary"}
              onClick={() => transitionMutation.mutate(status)}
              disabled={transitionMutation.isPending}
            >
              {STATUS_LABELS[status]}
            </Button>
          ))}
        </div>
      )}

      {(isOrganizer || isAssignedProfessor) && applications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Interested students</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {applications.map((a) => (
              <div key={a.id} className="flex items-center justify-between text-sm">
                <span>{a.student.name}</span>
                <Badge variant="outline">{a.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {isOrganizer && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">History</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm">
            {auditLog.length === 0 && <p className="text-muted-foreground">No history yet.</p>}
            {auditLog.map((entry) => (
              <div key={entry.id} className="flex justify-between gap-4 border-b pb-2 last:border-0">
                <span>{entry.action}</span>
                <span className="text-muted-foreground">
                  {entry.actor?.name ?? "Company (public form)"} ·{" "}
                  {new Date(entry.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
