"use client";

import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, ApiError } from "@/lib/api";
import { useCurrentUser } from "@/lib/current-user";
import { ProjectCard } from "@/components/project-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SignInPrompt } from "@/components/sign-in-prompt";
import { MarkdownEditor } from "@/components/markdown-editor";
import { useLanguage } from "@/lib/i18n";

const EMPTY_DIRECT_FORM = {
  title: "",
  required_expertise: "",
  background_objective: "",
  deliverable: "",
  required_skills: "",
  group_size: 1,
  chair_contact_info: "",
  application_deadline: "",
  required_documents: "",
};

export default function ProfessorPage() {
  const { currentUser } = useCurrentUser();
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const enabled = currentUser?.role === "professor";
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_DIRECT_FORM);

  // FR-5: submissions matched to own expertise, ready to take on.
  const { data: matched = [] } = useQuery({
    queryKey: ["projects", "approved-matched", currentUser?.id],
    queryFn: () => api.projects(currentUser!.id, { status: "approved", expertise: currentUser!.expertise }),
    enabled,
  });

  const { data: allProjects = [] } = useQuery({
    queryKey: ["projects", "all-for-professor", currentUser?.id],
    queryFn: () => api.projects(currentUser!.id),
    enabled,
  });

  const directMutation = useMutation({
    mutationFn: () =>
      api.submitDirectProject(currentUser!.id, {
        ...form,
        required_expertise: form.required_expertise || currentUser!.expertise,
      }),
    onSuccess: () => {
      toast.success("Project submitted and published");
      setOpen(false);
      setForm(EMPTY_DIRECT_FORM);
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Failed to submit project"),
  });

  if (!currentUser || currentUser.role !== "professor") {
    return <SignInPrompt>{t("prompt.professor")}</SignInPrompt>;
  }

  const myProjects = allProjects.filter((p) => p.assigned_professor?.id === currentUser.id);
  const supervisingCount = myProjects.filter((p) => p.status === "open" || p.status === "ongoing").length;
  const completedCount = myProjects.filter((p) => p.status === "complete").length;

  return (
    <div className="flex flex-col gap-8" data-role="professor">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="rounded-lg border-l-8 border-l-accent bg-accent/8 py-3 pr-4 pl-4">
          <h1 className="text-2xl font-semibold tracking-tight">{t("page.professor.title")}</h1>
          <p className="mt-1 max-w-2xl text-muted-foreground">
            {t("page.professor.description").replace(
              "{expertise}",
              currentUser.expertise || t("page.professor.noneSet")
            )}
          </p>
        </div>

        <div className="flex shrink-0 items-start gap-4">
          <div className="flex gap-4">
            <div>
              <div className="text-xl font-semibold tracking-tight text-accent">{supervisingCount}</div>
              <div className="text-xs text-muted-foreground">{t("page.professor.statSupervising")}</div>
            </div>
            <div>
              <div className="text-xl font-semibold tracking-tight text-accent">{completedCount}</div>
              <div className="text-xs text-muted-foreground">{t("page.professor.statCompleted")}</div>
            </div>
            <div>
              <div className="text-xl font-semibold tracking-tight text-accent">{matched.length}</div>
              <div className="text-xs text-muted-foreground">{t("page.professor.statMatched")}</div>
            </div>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button>Submit a directly agreed project (FR-7)</Button>} />
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Submit a directly agreed project</DialogTitle>
                  <DialogDescription>
                    For a project you've already agreed with a company directly - this skips the company
                    portal and staff review, and publishes immediately.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex max-h-[70vh] flex-col gap-5 overflow-y-auto px-0.5">
                  <div className="flex flex-col gap-3">
                    <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Project details</p>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="d-title">Title</Label>
                      <Input id="d-title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
                    </div>
                    <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                      <div className="flex flex-col gap-1.5">
                        <Label htmlFor="d-expertise">Required expertise for supervision</Label>
                        <Input
                          id="d-expertise"
                          placeholder={currentUser.expertise}
                          value={form.required_expertise}
                          onChange={(e) => setForm((f) => ({ ...f, required_expertise: e.target.value }))}
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label htmlFor="d-size">Group size</Label>
                        <Input
                          id="d-size"
                          type="number"
                          min={1}
                          className="w-24"
                          value={form.group_size}
                          onChange={(e) => setForm((f) => ({ ...f, group_size: Number(e.target.value) }))}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex flex-col gap-3">
                    <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Description</p>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="d-bg">Background and objective</Label>
                      <MarkdownEditor
                        id="d-bg"
                        rows={5}
                        value={form.background_objective}
                        onChange={(v) => setForm((f) => ({ ...f, background_objective: v }))}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="d-deliverable">Deliverable</Label>
                      <MarkdownEditor
                        id="d-deliverable"
                        rows={3}
                        value={form.deliverable}
                        onChange={(v) => setForm((f) => ({ ...f, deliverable: v }))}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="d-skills">Required student skills</Label>
                      <Input
                        id="d-skills"
                        value={form.required_skills}
                        onChange={(e) => setForm((f) => ({ ...f, required_skills: e.target.value }))}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="flex flex-col gap-3">
                    <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Supervision</p>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="d-chair">Chair contact information</Label>
                      <Input
                        id="d-chair"
                        value={form.chair_contact_info}
                        onChange={(e) => setForm((f) => ({ ...f, chair_contact_info: e.target.value }))}
                      />
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="flex flex-col gap-1.5">
                        <Label htmlFor="d-deadline">Application deadline</Label>
                        <Input
                          id="d-deadline"
                          type="date"
                          value={form.application_deadline}
                          onChange={(e) => setForm((f) => ({ ...f, application_deadline: e.target.value }))}
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label htmlFor="d-docs">Required documents</Label>
                        <Input
                          id="d-docs"
                          value={form.required_documents}
                          onChange={(e) => setForm((f) => ({ ...f, required_documents: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => directMutation.mutate()}
                    disabled={
                      directMutation.isPending || !form.title || !form.background_objective || !form.application_deadline
                    }
                  >
                    Submit and publish
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

      <section className="flex flex-col gap-3">
        <h2 className="font-medium">Matched to your expertise - ready to take on (FR-5/FR-6)</h2>
        {matched.length === 0 && (
          <p className="text-sm text-muted-foreground">No approved, unsupervised topics match your expertise right now.</p>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          {matched.map((project) => (
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
