"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, ApiError } from "@/lib/api";
import { useCurrentUser } from "@/lib/current-user";
import { StatusBadge } from "@/components/status-badge";
import { ProjectCard } from "@/components/project-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { applicationStatus, APPLICATION_STATUS_LABELS } from "@/lib/types";

const EMPTY_TOPIC_FORM = {
  title: "",
  required_expertise: "",
  background_objective: "",
  deliverable: "",
  company_resources: "",
  required_skills: "",
  group_size: 1,
  company_id: "",
  requested_professor_id: "",
};

const EMPTY_PROFILE = {
  areas_of_expertise: "",
  research_interests: "",
  skills: "",
  previous_projects: "",
  availability: "",
  looking_for_team: false,
  team_message: "",
};

export default function StudentPage() {
  const { currentUser } = useCurrentUser();
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const enabled = currentUser?.role === "student";

  const { data: applications = [] } = useQuery({
    queryKey: ["applications", "mine", currentUser?.id],
    queryFn: () => api.applications(currentUser!.id),
    enabled,
  });

  const { data: directory = [] } = useQuery({
    queryKey: ["student-directory", currentUser?.id],
    queryFn: () => api.studentDirectory(),
    enabled,
  });
  const myProfile = directory.find((p) => p.student.id === currentUser?.id);

  const [profile, setProfile] = useState(EMPTY_PROFILE);

  useEffect(() => {
    if (myProfile) setProfile(myProfile);
  }, [myProfile]);

  const saveProfileMutation = useMutation({
    mutationFn: (values: typeof profile) => api.updateStudentProfile(currentUser!.id, values),
    onSuccess: () => {
      toast.success("Profile saved");
      queryClient.invalidateQueries({ queryKey: ["student-directory"] });
      queryClient.invalidateQueries({ queryKey: ["students-looking-for-team"] });
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Failed to save profile"),
  });

  const [topicOpen, setTopicOpen] = useState(false);
  const [topicForm, setTopicForm] = useState(EMPTY_TOPIC_FORM);

  const { data: companies = [] } = useQuery({
    queryKey: ["company-directory"],
    queryFn: () => api.companyDirectory(),
    enabled,
  });
  const { data: allUsers = [] } = useQuery({
    queryKey: ["demo-users"],
    queryFn: () => api.demoUsers(),
    enabled,
  });
  const professors = allUsers.filter((u) => u.role === "professor");

  const { data: myTopics = [] } = useQuery({
    queryKey: ["projects", "suggested-by-me", currentUser?.id],
    queryFn: () => api.projects(currentUser!.id, { suggestedBy: String(currentUser!.id) }),
    enabled,
  });

  const submitTopicMutation = useMutation({
    mutationFn: () =>
      api.submitStudentProject(currentUser!.id, {
        ...topicForm,
        company_id: Number(topicForm.company_id),
        requested_professor_id: Number(topicForm.requested_professor_id),
      }),
    onSuccess: () => {
      toast.success("Topic suggested - submitted for staff review");
      setTopicOpen(false);
      setTopicForm(EMPTY_TOPIC_FORM);
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Failed to suggest topic"),
  });

  const confirmMutation = useMutation({
    mutationFn: (applicationId: number) => api.confirmOffer(currentUser!.id, applicationId),
    onSuccess: () => {
      toast.success("Offer confirmed - your other pending offers were withdrawn");
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Failed to confirm offer"),
  });

  if (!currentUser || currentUser.role !== "student") {
    return <SignInPrompt>{t("prompt.student")}</SignInPrompt>;
  }

  const acceptedOffers = applications.filter(
    (a) => applicationStatus(a, !!a.project.company) === "accepted"
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t("page.student.title")}</h1>
          <p className="mt-1 text-muted-foreground">{t("page.student.description")}</p>
        </div>
        <Dialog open={topicOpen} onOpenChange={setTopicOpen}>
          <DialogTrigger render={<Button>Suggest a project topic (FR-8)</Button>} />
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Suggest a project topic</DialogTitle>
              <DialogDescription>
                Name an existing company and the professor/supervisor you'd like to run it. Staff review
                this the same way as a company submission before it becomes visible to professors/supervisors.
              </DialogDescription>
            </DialogHeader>
            <div className="flex max-h-[70vh] flex-col gap-5 overflow-y-auto px-0.5">
              <div className="flex flex-col gap-3">
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Project details</p>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="s-title">Project title</Label>
                  <Input
                    id="s-title"
                    value={topicForm.title}
                    onChange={(e) => setTopicForm((f) => ({ ...f, title: e.target.value }))}
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="s-expertise">Required area of expertise</Label>
                    <Input
                      id="s-expertise"
                      placeholder="e.g. School of Management, Informatics"
                      value={topicForm.required_expertise}
                      onChange={(e) => setTopicForm((f) => ({ ...f, required_expertise: e.target.value }))}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="s-size">Group size</Label>
                    <Input
                      id="s-size"
                      type="number"
                      min={1}
                      className="w-24"
                      value={topicForm.group_size}
                      onChange={(e) => setTopicForm((f) => ({ ...f, group_size: Number(e.target.value) }))}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex flex-col gap-3">
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Description</p>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="s-bg">Project background and objective</Label>
                  <MarkdownEditor
                    id="s-bg"
                    rows={5}
                    value={topicForm.background_objective}
                    onChange={(v) => setTopicForm((f) => ({ ...f, background_objective: v }))}
                    placeholder="What's the topic, and why does it matter?"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="s-deliverable">Project deliverable</Label>
                  <MarkdownEditor
                    id="s-deliverable"
                    rows={3}
                    value={topicForm.deliverable}
                    onChange={(v) => setTopicForm((f) => ({ ...f, deliverable: v }))}
                    placeholder="What should the team hand over at the end?"
                  />
                </div>
              </div>

              <Separator />

              <div className="flex flex-col gap-3">
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Company &amp; supervisor
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="s-company">Company</Label>
                    <Select
                      items={companies.map((c) => ({ value: String(c.id), label: c.name }))}
                      value={topicForm.company_id}
                      onValueChange={(v) => setTopicForm((f) => ({ ...f, company_id: v ?? "" }))}
                    >
                      <SelectTrigger id="s-company" className="w-full">
                        <SelectValue placeholder="Select a company" />
                      </SelectTrigger>
                      <SelectContent>
                        {companies.map((c) => (
                          <SelectItem key={c.id} value={String(c.id)}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="s-professor">Requested supervisor</Label>
                    <Select
                      items={professors.map((p) => ({ value: String(p.id), label: p.name }))}
                      value={topicForm.requested_professor_id}
                      onValueChange={(v) => setTopicForm((f) => ({ ...f, requested_professor_id: v ?? "" }))}
                    >
                      <SelectTrigger id="s-professor" className="w-full">
                        <SelectValue placeholder="Select a professor/supervisor" />
                      </SelectTrigger>
                      <SelectContent>
                        {professors.map((p) => (
                          <SelectItem key={p.id} value={String(p.id)}>
                            {p.name}
                            {p.expertise ? ` (${p.expertise})` : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="s-resources">Available company resources</Label>
                  <Input
                    id="s-resources"
                    value={topicForm.company_resources}
                    onChange={(e) => setTopicForm((f) => ({ ...f, company_resources: e.target.value }))}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="s-skills">Required student skills</Label>
                  <Input
                    id="s-skills"
                    value={topicForm.required_skills}
                    onChange={(e) => setTopicForm((f) => ({ ...f, required_skills: e.target.value }))}
                  />
                </div>
              </div>

              <Button
                onClick={() => submitTopicMutation.mutate()}
                disabled={
                  submitTopicMutation.isPending ||
                  !topicForm.title ||
                  !topicForm.background_objective ||
                  !topicForm.company_id ||
                  !topicForm.requested_professor_id
                }
              >
                Submit for staff review
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {acceptedOffers.length > 1 && (
        <Card className="border-l-4 border-l-accent">
          <CardHeader>
            <CardTitle className="text-base">You have {acceptedOffers.length} offers (FR-16)</CardTitle>
            <CardDescription>
              Confirm exactly one - the others will be automatically withdrawn.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {acceptedOffers.map((a) => (
              <div key={a.id} className="flex items-center justify-between gap-2 text-sm">
                <span>{a.project.title}</span>
                <Button size="sm" onClick={() => confirmMutation.mutate(a.id)} disabled={confirmMutation.isPending}>
                  Confirm this one
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col gap-3">
        {applications.length === 0 && (
          <p className="text-sm text-muted-foreground">
            You haven&apos;t applied to any projects yet. <Link href="/projects" className="underline">Browse projects</Link>.
          </p>
        )}
        {applications.map((a) => {
          const overall = applicationStatus(a, !!a.project.company);
          return (
            <Link key={a.id} href={`/projects/detail?id=${a.project.id}`} className="block">
              <Card className="border-l-4 border-l-primary transition-all hover:-translate-y-0.5 hover:shadow-md">
                <CardHeader>
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={a.project.status} />
                    <Badge variant="outline">{APPLICATION_STATUS_LABELS[overall]}</Badge>
                  </div>
                  <CardTitle className="mt-1">{a.project.title}</CardTitle>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="font-medium">My suggested topics (FR-8)</h2>
        {myTopics.length === 0 && (
          <p className="text-sm text-muted-foreground">You haven&apos;t suggested any topics yet.</p>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          {myTopics.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>My profile (FR-9/FR-10)</CardTitle>
          <CardDescription>
            Visible to professors/supervisors and companies browsing the student directory. Optionally
            flag yourself as looking for a team so other students can find you.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="expertise">Areas of expertise</Label>
            <Input
              id="expertise"
              value={profile.areas_of_expertise}
              onChange={(e) => setProfile((p) => ({ ...p, areas_of_expertise: e.target.value }))}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="research">Research interests</Label>
            <Input
              id="research"
              value={profile.research_interests}
              onChange={(e) => setProfile((p) => ({ ...p, research_interests: e.target.value }))}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="skills">Skills</Label>
            <Input id="skills" value={profile.skills} onChange={(e) => setProfile((p) => ({ ...p, skills: e.target.value }))} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="previous">Previous projects</Label>
            <Textarea
              id="previous"
              rows={2}
              value={profile.previous_projects}
              onChange={(e) => setProfile((p) => ({ ...p, previous_projects: e.target.value }))}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="availability">Availability</Label>
            <Input
              id="availability"
              value={profile.availability}
              onChange={(e) => setProfile((p) => ({ ...p, availability: e.target.value }))}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="team-message">Message for teammates (shown only if flagged below)</Label>
            <Textarea
              id="team-message"
              rows={2}
              value={profile.team_message}
              onChange={(e) => setProfile((p) => ({ ...p, team_message: e.target.value }))}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => saveProfileMutation.mutate(profile)} disabled={saveProfileMutation.isPending}>
              Save profile
            </Button>
            <Button
              variant={profile.looking_for_team ? "destructive" : "secondary"}
              onClick={() => {
                const next = { ...profile, looking_for_team: !profile.looking_for_team };
                setProfile(next);
                saveProfileMutation.mutate(next);
              }}
              disabled={saveProfileMutation.isPending}
            >
              {profile.looking_for_team ? "Remove me from the teammate list" : "List me as looking for a team"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
