"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/lib/i18n";

export default function TeammatesPage() {
  const { t } = useLanguage();
  const { data: profiles = [], isLoading } = useQuery({
    queryKey: ["students-looking-for-team"],
    queryFn: api.studentsLookingForTeam,
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("page.teammates.title")}</h1>
        <p className="mt-1 max-w-2xl text-muted-foreground">
          Students who've opted in to being found by others looking to form a project group.
          Manage your own listing from{" "}
          <a href="/student" className="underline">
            My applications
          </a>
          .
        </p>
      </div>

      {isLoading && <p className="text-muted-foreground">Loading…</p>}
      {!isLoading && profiles.length === 0 && (
        <p className="text-muted-foreground">No one is currently listed as looking for a team.</p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        {profiles.map((profile) => (
          <Card key={profile.student.id}>
            <CardHeader>
              <CardTitle>{profile.student.name}</CardTitle>
              <CardDescription>{profile.research_interests || "No research interests listed"}</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{profile.team_message}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
