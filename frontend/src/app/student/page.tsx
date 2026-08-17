"use client";

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { toast } from "sonner";
import { api, ApiError } from "@/lib/api";
import { useCurrentUser } from "@/lib/current-user";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SignInPrompt } from "@/components/sign-in-prompt";
import { useLanguage } from "@/lib/i18n";
import { applicationStatus, APPLICATION_STATUS_LABELS } from "@/lib/types";

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
      <div className="rounded-lg border-l-8 border-l-role-student bg-role-student/8 py-3 pr-4 pl-4">
        <h1 className="text-2xl font-semibold tracking-tight">{t("page.student.title")}</h1>
        <p className="mt-1 text-muted-foreground">{t("page.student.description")}</p>
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

      <p className="text-sm text-muted-foreground">
        Manage your topic, skills and teammate visibility on{" "}
        <Link href="/profile" className="underline">
          your profile
        </Link>
        .
      </p>
    </div>
  );
}
