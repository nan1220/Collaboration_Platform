"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useCurrentUser } from "@/lib/current-user";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SignInPrompt } from "@/components/sign-in-prompt";

export default function StudentDirectoryPage() {
  const { currentUser } = useCurrentUser();
  const [program, setProgram] = useState("");
  const [q, setQ] = useState("");

  const { data: profiles = [], isLoading } = useQuery({
    queryKey: ["student-directory", program, q],
    queryFn: () => api.studentDirectory({ program: program || undefined, q: q || undefined }),
  });

  const allowed = currentUser && ["professor", "company", "staff"].includes(currentUser.role);

  if (!allowed) {
    return (
      <SignInPrompt>
        Sign in as a professor, company or staff account to browse student topics and profiles.
      </SignInPrompt>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Student directory</h1>
        <p className="mt-1 max-w-2xl text-muted-foreground">
          Topics and profile data submitted by students (FR-4/FR-8), filterable by program (FR-9) —
          so companies and professors can scout ahead instead of waiting for applications.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Filter by degree program…"
          value={program}
          onChange={(e) => setProgram(e.target.value)}
          className="max-w-xs"
        />
        <Input
          placeholder="Search expertise, interests, skills…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-xs"
        />
      </div>

      {isLoading && <p className="text-muted-foreground">Loading…</p>}
      {!isLoading && profiles.length === 0 && (
        <p className="text-muted-foreground">No students match these filters.</p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        {profiles.map((profile) => (
          <Card key={profile.student.id}>
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2">
                {profile.student.program && <Badge variant="outline">{profile.student.program}</Badge>}
                {profile.looking_for_team && <Badge variant="secondary">Seeking teammates</Badge>}
              </div>
              <CardTitle className="mt-1">{profile.student.name}</CardTitle>
              <CardDescription>{profile.areas_of_expertise || "No areas of expertise listed"}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-1 text-sm text-muted-foreground">
              {profile.research_interests && (
                <p>
                  <span className="font-medium text-foreground">Research interests: </span>
                  {profile.research_interests}
                </p>
              )}
              {profile.skills && (
                <p>
                  <span className="font-medium text-foreground">Skills: </span>
                  {profile.skills}
                </p>
              )}
              {profile.previous_projects && (
                <p>
                  <span className="font-medium text-foreground">Previous projects: </span>
                  {profile.previous_projects}
                </p>
              )}
              {profile.availability && (
                <p>
                  <span className="font-medium text-foreground">Availability: </span>
                  {profile.availability}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
