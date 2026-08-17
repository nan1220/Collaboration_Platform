"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useCurrentUser } from "@/lib/current-user";
import { UserAvatar } from "@/components/user-avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Markdown } from "@/components/markdown";
import { useLanguage, roleLabel } from "@/lib/i18n";
import { ROLE_ACCENT_BORDER_L, ROLE_ACCENT_BG } from "@/lib/role-accent";
import { cn } from "@/lib/utils";

export default function ProfileDetailPage() {
  return (
    <Suspense fallback={<p className="text-muted-foreground">Loading…</p>}>
      <ProfileDetail />
    </Suspense>
  );
}

function ProfileDetail() {
  const searchParams = useSearchParams();
  const id = Number(searchParams.get("id"));
  const { users, currentUser } = useCurrentUser();
  const { t } = useLanguage();

  const user = users.find((u) => u.id === id);
  const isSelf = !!currentUser && currentUser.id === id;
  const isStudent = user?.role === "student";
  const isCompany = user?.role === "company";
  const isProfessor = user?.role === "professor";

  const { data: directory = [] } = useQuery({
    queryKey: ["student-directory"],
    queryFn: () => api.studentDirectory(),
    enabled: isStudent,
  });
  const studentProfile = directory.find((p) => p.student.id === id);

  const { data: company } = useQuery({
    queryKey: ["company-by-user", id],
    queryFn: () => api.companyByUserId(id),
    enabled: isCompany,
  });

  if (!user) {
    return <p className="text-muted-foreground">{t("page.profileDetail.notFound")}</p>;
  }

  return (
    <div className="flex flex-col gap-8">
      <Card
        className={cn("border-l-8", ROLE_ACCENT_BORDER_L[user.role], ROLE_ACCENT_BG[user.role])}
      >
        <CardContent className="flex flex-col gap-5 pt-6 sm:flex-row sm:items-start">
          <UserAvatar name={user.name} size="lg" className="mt-0.5 shrink-0" />
          <div className="flex flex-1 flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <h1 className="text-xl font-semibold tracking-tight">{user.name}</h1>
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="secondary">{roleLabel(user.role, t)}</Badge>
                {isProfessor && user.department && <Badge variant="outline">{user.department}</Badge>}
                {isProfessor && user.expertise && <Badge variant="outline">{user.expertise}</Badge>}
                {isStudent && user.program && <Badge variant="outline">{user.program}</Badge>}
                {isStudent && studentProfile?.looking_for_team && (
                  <Badge variant="success">Looking for a team</Badge>
                )}
                {isCompany && company && (
                  <>
                    <Badge variant="outline">{company.name}</Badge>
                    <Badge variant={company.verified ? "success" : "outline"}>
                      {company.verified ? t("page.company.verified") : t("page.company.awaitingVerification")}
                    </Badge>
                  </>
                )}
              </div>
              {isCompany && company && (
                <p className="text-sm text-muted-foreground">
                  {t("page.profile.contact")}: {company.contact_name} ({company.contact_email})
                </p>
              )}
            </div>

            {isSelf && (
              <p className="text-sm text-muted-foreground">
                {t("page.profileDetail.isYou")}{" "}
                <Link href="/profile" className="underline">
                  {t("page.profileDetail.editLink")}
                </Link>
                .
              </p>
            )}

            {user.bio ? (
              <Markdown content={user.bio} className="max-w-prose text-sm text-muted-foreground" />
            ) : (
              <p className="text-sm text-muted-foreground italic">{t("page.profileDetail.noBio")}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {isStudent && studentProfile && (
        <Card>
          <CardContent className="flex flex-col gap-2 pt-6 text-sm text-muted-foreground">
            {studentProfile.areas_of_expertise && (
              <p>
                <span className="font-medium text-foreground">Areas of expertise: </span>
                {studentProfile.areas_of_expertise}
              </p>
            )}
            {studentProfile.research_interests && (
              <p>
                <span className="font-medium text-foreground">Research interests: </span>
                {studentProfile.research_interests}
              </p>
            )}
            {studentProfile.skills && (
              <p>
                <span className="font-medium text-foreground">Skills: </span>
                {studentProfile.skills}
              </p>
            )}
            {studentProfile.previous_projects && (
              <p>
                <span className="font-medium text-foreground">Previous projects: </span>
                {studentProfile.previous_projects}
              </p>
            )}
            {studentProfile.availability && (
              <p>
                <span className="font-medium text-foreground">Availability: </span>
                {studentProfile.availability}
              </p>
            )}
            {studentProfile.looking_for_team && studentProfile.team_message && (
              <p>
                <span className="font-medium text-foreground">Message for teammates: </span>
                {studentProfile.team_message}
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
