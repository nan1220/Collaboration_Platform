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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SignInPrompt } from "@/components/sign-in-prompt";
import { useLanguage } from "@/lib/i18n";

const EMPTY_FORM = {
  title: "",
  required_expertise: "",
  background_objective: "",
  deliverable: "",
  company_resources: "",
  required_skills: "",
  group_size: 1,
};

export default function CompanyPage() {
  const { currentUser } = useCurrentUser();
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const enabled = currentUser?.role === "company";
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const { data: myCompany } = useQuery({
    queryKey: ["my-company", currentUser?.id],
    queryFn: () => api.myCompany(currentUser!.id),
    enabled,
  });

  const { data: myProjects = [] } = useQuery({
    queryKey: ["projects", "my-company", currentUser?.id, myCompany?.id],
    queryFn: () => api.projects(currentUser!.id, { companyId: String(myCompany!.id) }),
    enabled: enabled && !!myCompany,
  });

  const submitMutation = useMutation({
    mutationFn: () => api.submitCompanyProject(currentUser!.id, form),
    onSuccess: () => {
      toast.success("Project submitted for staff review");
      setOpen(false);
      setForm(EMPTY_FORM);
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Failed to submit project"),
  });

  if (!currentUser || currentUser.role !== "company") {
    return <SignInPrompt>{t("prompt.company")}</SignInPrompt>;
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">{myCompany?.name}</h1>
            {myCompany && (
              <Badge variant={myCompany.verified ? "success" : "outline"}>
                {myCompany.verified ? t("page.company.verified") : t("page.company.awaitingVerification")}
              </Badge>
            )}
          </div>
          <p className="mt-1 text-muted-foreground">{t("page.company.description")}</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button>Submit a project proposal</Button>} />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Submit a project proposal</DialogTitle>
            </DialogHeader>
            <div className="flex max-h-[70vh] flex-col gap-3 overflow-y-auto">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="c-title">Project title</Label>
                <Input id="c-title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="c-expertise">Required area of expertise</Label>
                <Input
                  id="c-expertise"
                  placeholder="e.g. School of Management, Informatics"
                  value={form.required_expertise}
                  onChange={(e) => setForm((f) => ({ ...f, required_expertise: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="c-bg">Project background and objective</Label>
                <Textarea
                  id="c-bg"
                  rows={3}
                  value={form.background_objective}
                  onChange={(e) => setForm((f) => ({ ...f, background_objective: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="c-deliverable">Project deliverable</Label>
                <Input
                  id="c-deliverable"
                  value={form.deliverable}
                  onChange={(e) => setForm((f) => ({ ...f, deliverable: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="c-resources">Available company resources</Label>
                <Input
                  id="c-resources"
                  value={form.company_resources}
                  onChange={(e) => setForm((f) => ({ ...f, company_resources: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="c-skills">Required student skills</Label>
                <Input
                  id="c-skills"
                  value={form.required_skills}
                  onChange={(e) => setForm((f) => ({ ...f, required_skills: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="c-size">Group size</Label>
                <Input
                  id="c-size"
                  type="number"
                  min={1}
                  value={form.group_size}
                  onChange={(e) => setForm((f) => ({ ...f, group_size: Number(e.target.value) }))}
                />
              </div>
              <Button
                onClick={() => submitMutation.mutate()}
                disabled={submitMutation.isPending || !form.title || !form.background_objective}
              >
                Submit for staff review
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="font-medium">My submissions</h2>
        {myProjects.length === 0 && <p className="text-sm text-muted-foreground">No projects submitted yet.</p>}
        <div className="grid gap-4 sm:grid-cols-2">
          {myProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>
    </div>
  );
}
