"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, ApiError } from "@/lib/api";
import { useCurrentUser } from "@/lib/current-user";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { applicationStatus, APPLICATION_STATUS_LABELS } from "@/lib/types";

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

  const confirmMutation = useMutation({
    mutationFn: (applicationId: number) => api.confirmOffer(currentUser!.id, applicationId),
    onSuccess: () => {
      toast.success("Offer confirmed — your other pending offers were withdrawn");
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Failed to confirm offer"),
  });

  if (!currentUser || currentUser.role !== "student") {
    return <p className="text-muted-foreground">Select a student demo user (top right) to see this page.</p>;
  }

  const acceptedOffers = applications.filter(
    (a) => applicationStatus(a, !!a.project.company) === "accepted"
  );

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">My applications</h1>
        <p className="mt-1 text-muted-foreground">Projects you've applied to and their decision status.</p>
      </div>

      {acceptedOffers.length > 1 && (
        <Card className="border-l-4 border-l-accent">
          <CardHeader>
            <CardTitle className="text-base">You have {acceptedOffers.length} offers (FR-16)</CardTitle>
            <CardDescription>
              Confirm exactly one — the others will be automatically withdrawn.
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

      <Card>
        <CardHeader>
          <CardTitle>My topic and profile (FR-8/FR-9/FR-10)</CardTitle>
          <CardDescription>
            Visible to professors and companies browsing the student directory. Optionally flag
            yourself as looking for a team so other students can find you.
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
