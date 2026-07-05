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

export default function StudentPage() {
  const { currentUser } = useCurrentUser();
  const queryClient = useQueryClient();
  const enabled = currentUser?.role === "student";

  const { data: applications = [] } = useQuery({
    queryKey: ["applications", "mine", currentUser?.id],
    queryFn: () => api.applications(currentUser!.id),
    enabled,
  });

  const { data: profiles = [] } = useQuery({
    queryKey: ["students-looking-for-team"],
    queryFn: api.studentsLookingForTeam,
    enabled,
  });
  const myProfile = profiles.find((p) => p.student.id === currentUser?.id);

  const [lookingForTeam, setLookingForTeam] = useState(false);
  const [interests, setInterests] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    if (myProfile) {
      setLookingForTeam(myProfile.looking_for_team);
      setInterests(myProfile.interests);
      setBio(myProfile.bio);
    }
  }, [myProfile]);

  const saveProfileMutation = useMutation({
    mutationFn: () =>
      api.updateStudentProfile(currentUser!.id, { lookingForTeam: !lookingForTeam, interests, bio }),
    onSuccess: () => {
      toast.success(!lookingForTeam ? "You're now visible to other students" : "Removed from the teammate list");
      setLookingForTeam((v) => !v);
      queryClient.invalidateQueries({ queryKey: ["students-looking-for-team"] });
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Failed to update profile"),
  });

  const saveDetailsMutation = useMutation({
    mutationFn: () => api.updateStudentProfile(currentUser!.id, { lookingForTeam, interests, bio }),
    onSuccess: () => {
      toast.success("Profile saved");
      queryClient.invalidateQueries({ queryKey: ["students-looking-for-team"] });
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Failed to save profile"),
  });

  if (!currentUser || currentUser.role !== "student") {
    return <p className="text-muted-foreground">Select a student demo user (top right) to see this page.</p>;
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">My applications</h1>
        <p className="mt-1 text-muted-foreground">Projects you've expressed interest in.</p>
      </div>

      <div className="flex flex-col gap-3">
        {applications.length === 0 && (
          <p className="text-sm text-muted-foreground">
            You haven&apos;t applied to any projects yet. <Link href="/projects" className="underline">Browse projects</Link>.
          </p>
        )}
        {applications.map((a) => (
          <Link key={a.id} href={`/projects/detail?id=${a.project.id}`}>
            <Card className="transition-colors hover:border-primary/50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <StatusBadge status={a.project.status} />
                  <Badge variant="outline">{a.status}</Badge>
                </div>
                <CardTitle className="mt-1">{a.project.title}</CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Teammate finder</CardTitle>
          <CardDescription>
            Optional: let other students see you're looking for a team, so they don't have to search
            for motivated teammates independently.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="interests">Interests</Label>
            <Input id="interests" value={interests} onChange={(e) => setInterests(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="bio">Short bio</Label>
            <Textarea id="bio" rows={3} value={bio} onChange={(e) => setBio(e.target.value)} />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => saveDetailsMutation.mutate()} disabled={saveDetailsMutation.isPending}>
              Save details
            </Button>
            <Button
              variant={lookingForTeam ? "destructive" : "secondary"}
              onClick={() => saveProfileMutation.mutate()}
              disabled={saveProfileMutation.isPending}
            >
              {lookingForTeam ? "Remove me from the teammate list" : "List me as looking for a team"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
