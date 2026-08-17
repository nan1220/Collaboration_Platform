"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, ApiError } from "@/lib/api";
import { useCurrentUser } from "@/lib/current-user";
import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Markdown } from "@/components/markdown";
import {
  ALLOWED_TRANSITIONS,
  applicationStatus,
  APPLICATION_STATUS_LABELS,
  isNotYetSupervised,
} from "@/lib/types";

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

  const [takeOnForm, setTakeOnForm] = useState({ chair_contact_info: "", application_deadline: "", required_documents: "" });
  const [documentsNote, setDocumentsNote] = useState("");
  const [checkInNote, setCheckInNote] = useState("");

  const { data: project, isLoading } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => api.project(projectId),
  });

  const { data: applications = [] } = useQuery({
    queryKey: ["applications", "project", projectId, currentUser?.id],
    queryFn: () => api.applications(currentUser!.id, projectId),
    enabled: !!currentUser && currentUser.role !== "student",
  });

  const { data: myApplications = [] } = useQuery({
    queryKey: ["applications", "mine", currentUser?.id],
    queryFn: () => api.applications(currentUser!.id),
    enabled: !!currentUser && currentUser.role === "student",
  });

  const { data: auditLog = [] } = useQuery({
    queryKey: ["audit-log", projectId, currentUser?.id],
    queryFn: () => api.auditLog(currentUser!.id, projectId),
    enabled: !!currentUser && currentUser.role === "staff",
  });

  const { data: checkIns = [] } = useQuery({
    queryKey: ["check-ins", projectId],
    queryFn: () => api.checkIns(projectId),
    enabled: !!project && (project.status === "filled" || project.status === "ongoing"),
  });

  const invalidateProject = () => {
    queryClient.invalidateQueries({ queryKey: ["project", projectId] });
    queryClient.invalidateQueries({ queryKey: ["projects"] });
    queryClient.invalidateQueries({ queryKey: ["audit-log", projectId] });
  };
  const invalidateApplications = () => {
    queryClient.invalidateQueries({ queryKey: ["applications"] });
    invalidateProject();
  };

  const transitionMutation = useMutation({
    mutationFn: (status: "approved" | "rejected") => api.transitionStatus(currentUser!.id, projectId, status),
    onSuccess: () => {
      toast.success("Status updated");
      invalidateProject();
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Failed to update status"),
  });

  const takeOnMutation = useMutation({
    mutationFn: () => api.takeOnSupervision(currentUser!.id, projectId, takeOnForm),
    onSuccess: () => {
      toast.success("Supervision taken on — listing published to students");
      invalidateProject();
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Failed to take on supervision"),
  });

  const applyMutation = useMutation({
    mutationFn: () => api.applyToProject(currentUser!.id, projectId, documentsNote),
    onSuccess: () => {
      toast.success("Application submitted");
      invalidateApplications();
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Failed to apply"),
  });

  const decideMutation = useMutation({
    mutationFn: ({ applicationId, decision }: { applicationId: number; decision: "accepted" | "rejected" }) =>
      api.decideApplication(currentUser!.id, applicationId, decision),
    onSuccess: () => {
      toast.success("Decision recorded");
      invalidateApplications();
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Failed to record decision"),
  });

  const confirmMutation = useMutation({
    mutationFn: (applicationId: number) => api.confirmOffer(currentUser!.id, applicationId),
    onSuccess: () => {
      toast.success("Offer confirmed — project marked filled");
      invalidateApplications();
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Failed to confirm offer"),
  });

  const checkInMutation = useMutation({
    mutationFn: () => api.addCheckIn(currentUser!.id, projectId, checkInNote),
    onSuccess: () => {
      toast.success("Check-in recorded");
      setCheckInNote("");
      queryClient.invalidateQueries({ queryKey: ["check-ins", projectId] });
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Failed to record check-in"),
  });

  if (isLoading || !project) return <p className="text-muted-foreground">Loading…</p>;

  const isStaff = currentUser?.role === "staff";
  const isAssignedProfessor = currentUser?.role === "professor" && project.assigned_professor?.id === currentUser.id;
  // Real ownership is enforced by the store (a non-owning company gets an empty
  // applications list back); this just gates which UI a company account sees.
  const isOwningCompany = currentUser?.role === "company" && !!project.company;
  const transitions = ALLOWED_TRANSITIONS[project.status];

  const canTakeOn =
    currentUser?.role === "professor" &&
    project.status === "approved" &&
    (!project.required_expertise || project.required_expertise === currentUser.department);

  const myApplicationHere = myApplications.find((a) => a.project.id === projectId);
  const canApply = currentUser?.role === "student" && project.status === "ongoing" && !myApplicationHere;

  const canCheckIn =
    (isAssignedProfessor && project.status === "filled") ||
    (currentUser?.role === "student" && myApplicationHere?.confirmed);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={project.status} />
            {isNotYetSupervised(project) && <Badge variant="outline">Not yet supervised</Badge>}
            <Badge variant="outline">{project.source === "company" ? "Company" : "Professor-submitted"}</Badge>
            {project.required_expertise && <Badge variant="outline">{project.required_expertise}</Badge>}
          </div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">{project.title}</h1>
        </div>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-3 pt-6">
          <div>
            <span className="font-medium">Background and objective</span>
            <Markdown content={project.background_objective} className="mt-1" />
          </div>
          <div>
            <span className="font-medium">Deliverable</span>
            {project.deliverable ? (
              <Markdown content={project.deliverable} className="mt-1" />
            ) : (
              <p className="mt-1 text-muted-foreground">Not specified</p>
            )}
          </div>
          <div className="grid gap-1 text-sm text-muted-foreground sm:grid-cols-2">
            <div>
              <span className="font-medium text-foreground">Required skills: </span>
              {project.required_skills || "Not specified"}
            </div>
            <div>
              <span className="font-medium text-foreground">Group size: </span>
              {project.group_size}
            </div>
            {project.company_resources && (
              <div className="sm:col-span-2">
                <span className="font-medium text-foreground">Company resources: </span>
                {project.company_resources}
              </div>
            )}
          </div>
          <Separator />
          <div className="grid gap-1 text-sm text-muted-foreground sm:grid-cols-2">
            {project.company && (
              <div>
                <span className="font-medium text-foreground">Company: </span>
                {project.company.name} ({project.company.contact_name})
                {!project.company.verified && (
                  <Badge variant="outline" className="ml-2">
                    Unverified
                  </Badge>
                )}
              </div>
            )}
            {project.assigned_professor && (
              <div>
                <span className="font-medium text-foreground">Supervisor: </span>
                {project.assigned_professor.name}
              </div>
            )}
            {project.application_deadline && (
              <div>
                <span className="font-medium text-foreground">Application deadline: </span>
                {project.application_deadline}
              </div>
            )}
            {project.required_documents && (
              <div>
                <span className="font-medium text-foreground">Required documents: </span>
                {project.required_documents}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {!currentUser && (
        <p className="text-sm text-muted-foreground">
          <Link href="/login" className="underline">
            Sign in
          </Link>{" "}
          to apply, take on supervision or manage this project.
        </p>
      )}

      {isStaff && transitions.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Staff review:</span>
          {transitions.map((status) => (
            <Button
              key={status}
              size="sm"
              variant={status === "rejected" ? "destructive" : "secondary"}
              onClick={() => transitionMutation.mutate(status as "approved" | "rejected")}
              disabled={transitionMutation.isPending}
            >
              {status === "approved" ? "Approve" : "Reject"}
            </Button>
          ))}
        </div>
      )}

      {canTakeOn && (
        <Card className="border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle className="text-base">Take on supervision (FR-6)</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="chair">Chair contact information</Label>
              <Input
                id="chair"
                value={takeOnForm.chair_contact_info}
                onChange={(e) => setTakeOnForm((f) => ({ ...f, chair_contact_info: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="deadline">Application deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={takeOnForm.application_deadline}
                onChange={(e) => setTakeOnForm((f) => ({ ...f, application_deadline: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="docs">Required documents</Label>
              <Input
                id="docs"
                placeholder="e.g. CV, transcript of records"
                value={takeOnForm.required_documents}
                onChange={(e) => setTakeOnForm((f) => ({ ...f, required_documents: e.target.value }))}
              />
            </div>
            <Button
              onClick={() => takeOnMutation.mutate()}
              disabled={takeOnMutation.isPending || !takeOnForm.chair_contact_info || !takeOnForm.application_deadline}
            >
              Take on supervision and publish
            </Button>
          </CardContent>
        </Card>
      )}

      {canApply && (
        <Card className="border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle className="text-base">Apply to this project (FR-11)</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="docsNote">Documents (simulated upload — list filenames)</Label>
              <Input
                id="docsNote"
                placeholder="cv.pdf, transcript.pdf"
                value={documentsNote}
                onChange={(e) => setDocumentsNote(e.target.value)}
              />
            </div>
            <Button onClick={() => applyMutation.mutate()} disabled={applyMutation.isPending}>
              Submit application
            </Button>
          </CardContent>
        </Card>
      )}

      {myApplicationHere && (
        <Card className="border-l-4 border-l-accent">
          <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-6">
            <div>
              <span className="font-medium">Your application: </span>
              {APPLICATION_STATUS_LABELS[applicationStatus(myApplicationHere, !!project.company)]}
            </div>
            {applicationStatus(myApplicationHere, !!project.company) === "accepted" && (
              <Button size="sm" onClick={() => confirmMutation.mutate(myApplicationHere.id)} disabled={confirmMutation.isPending}>
                Confirm this offer
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {(isStaff || isAssignedProfessor || isOwningCompany) && applications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Applicants</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {applications.map((a) => {
              const overall = applicationStatus(a, !!project.company);
              return (
                <div key={a.id} className="flex flex-col gap-2 border-b pb-3 last:border-0 last:pb-0">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                    <span className="font-medium">{a.student.name}</span>
                    <Badge variant="outline">{APPLICATION_STATUS_LABELS[overall]}</Badge>
                  </div>
                  {(isAssignedProfessor || isOwningCompany || isStaff) && (
                    <p className="text-xs text-muted-foreground">Documents: {a.documents_note || "none listed"}</p>
                  )}
                  {isAssignedProfessor && !a.withdrawn && (
                    <div className="flex gap-2 text-xs">
                      <span className="text-muted-foreground">Professor decision: {a.professor_decision}</span>
                      {a.professor_decision === "pending" && (
                        <>
                          <button
                            className="text-primary underline"
                            onClick={() => decideMutation.mutate({ applicationId: a.id, decision: "accepted" })}
                          >
                            Accept
                          </button>
                          <button
                            className="text-destructive underline"
                            onClick={() => decideMutation.mutate({ applicationId: a.id, decision: "rejected" })}
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  )}
                  {isOwningCompany && !a.withdrawn && (
                    <div className="flex gap-2 text-xs">
                      <span className="text-muted-foreground">Company decision: {a.company_decision}</span>
                      {a.company_decision === "pending" && (
                        <>
                          <button
                            className="text-primary underline"
                            onClick={() => decideMutation.mutate({ applicationId: a.id, decision: "accepted" })}
                          >
                            Accept
                          </button>
                          <button
                            className="text-destructive underline"
                            onClick={() => decideMutation.mutate({ applicationId: a.id, decision: "rejected" })}
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {(project.status === "filled" || project.status === "ongoing") && (isAssignedProfessor || myApplicationHere?.confirmed) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Progress check-ins (FR-14)</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {checkIns.length === 0 && <p className="text-sm text-muted-foreground">No check-ins yet.</p>}
            {checkIns.map((c) => (
              <div key={c.id} className="border-b pb-2 text-sm last:border-0">
                <p>{c.note}</p>
                <p className="text-xs text-muted-foreground">
                  {c.author.name} · {new Date(c.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
            {canCheckIn && (
              <div className="flex flex-col gap-2">
                <Textarea
                  rows={2}
                  placeholder="Short update…"
                  value={checkInNote}
                  onChange={(e) => setCheckInNote(e.target.value)}
                />
                <Button
                  size="sm"
                  className="w-fit"
                  onClick={() => checkInMutation.mutate()}
                  disabled={checkInMutation.isPending || !checkInNote}
                >
                  Add check-in
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {isStaff && (
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
                  {entry.actor?.name ?? "Company (public form)"} · {new Date(entry.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
