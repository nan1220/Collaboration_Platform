"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { RotateCcw } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { useCurrentUser } from "@/lib/current-user";
import { ProjectCard } from "@/components/project-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SignInPrompt } from "@/components/sign-in-prompt";
import { useLanguage, roleLabel } from "@/lib/i18n";
import { isNotYetSupervised } from "@/lib/types";

const MONITOR_TABS = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "not_yet_supervised", label: "Not yet supervised" },
  { value: "ongoing", label: "Ongoing" },
  { value: "filled", label: "Filled" },
] as const;

export default function StaffPage() {
  const { currentUser } = useCurrentUser();
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const enabled = currentUser?.role === "staff";
  const [q, setQ] = useState("");
  const [resetOpen, setResetOpen] = useState(false);

  // FR-17: monitor all project studies by status.
  const { data: allProjects = [] } = useQuery({
    queryKey: ["projects", "staff-all", currentUser?.id, q],
    queryFn: () => api.projects(currentUser!.id, { q: q || undefined }),
    enabled,
  });
  const { data: users = [] } = useQuery({
    queryKey: ["users", currentUser?.id],
    queryFn: () => api.users(currentUser!.id),
    enabled,
  });
  const { data: companies = [] } = useQuery({
    queryKey: ["companies", currentUser?.id],
    queryFn: () => api.companies(currentUser!.id),
    enabled,
  });
  const { data: auditLog = [] } = useQuery({
    queryKey: ["audit-log", "all", currentUser?.id],
    queryFn: () => api.auditLog(currentUser!.id),
    enabled,
  });

  const verifyMutation = useMutation({
    mutationFn: (companyId: number) => api.verifyCompany(currentUser!.id, companyId),
    onSuccess: () => {
      toast.success("Company verified");
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Failed to verify company"),
  });

  const resetMutation = useMutation({
    mutationFn: () => api.resetDatabase(currentUser!.id),
    onSuccess: () => {
      toast.success("Database reset to seed data");
      setResetOpen(false);
      queryClient.invalidateQueries();
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Failed to reset database"),
  });

  const byBucket = useMemo(() => {
    const pending = allProjects.filter((p) => p.status === "pending");
    const approved = allProjects.filter((p) => p.status === "approved" && !isNotYetSupervised(p));
    const notYetSupervised = allProjects.filter(isNotYetSupervised);
    const ongoing = allProjects.filter((p) => p.status === "ongoing");
    const filled = allProjects.filter((p) => p.status === "filled");
    return { pending, approved, not_yet_supervised: notYetSupervised, ongoing, filled };
  }, [allProjects]);

  if (!currentUser || currentUser.role !== "staff") {
    return <SignInPrompt>{t("prompt.staff")}</SignInPrompt>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="border-l-4 border-l-role-staff pl-4">
          <h1 className="text-2xl font-semibold tracking-tight">{t("page.staff.title")}</h1>
          <p className="mt-1 text-muted-foreground">{t("page.staff.description")}</p>
        </div>

        <Dialog open={resetOpen} onOpenChange={setResetOpen}>
          <DialogTrigger
            render={
              <Button variant="destructive" size="sm" className="gap-1.5">
                <RotateCcw className="size-4" />
                Reset database
              </Button>
            }
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reset the database?</DialogTitle>
              <DialogDescription>
                This wipes every project, application, company, guide edit and audit log entry back to the seed
                demo data. Everyone using this browser loses their changes. This can&apos;t be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose render={<Button variant="outline">Cancel</Button>} />
              <Button variant="destructive" onClick={() => resetMutation.mutate()} disabled={resetMutation.isPending}>
                {resetMutation.isPending ? "Resetting…" : "Reset database"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="pending">
        <TabsList className="flex-wrap">
          {MONITOR_TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label} ({byBucket[tab.value].length})
            </TabsTrigger>
          ))}
          <TabsTrigger value="companies">Companies</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="audit">Audit log</TabsTrigger>
        </TabsList>

        <div className="mt-4 flex max-w-xs">
          <Input placeholder="Filter and search (FR-18)…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>

        {MONITOR_TABS.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="mt-4">
            {byBucket[tab.value].length === 0 && <p className="text-muted-foreground">Nothing here.</p>}
            <div className="grid gap-4 sm:grid-cols-2">
              {byBucket[tab.value].map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </TabsContent>
        ))}

        <TabsContent value="companies" className="mt-4">
          <Card>
            <CardContent className="flex flex-col gap-2 pt-6">
              {companies.map((company) => (
                <div key={company.id} className="flex items-center justify-between border-b py-2 text-sm last:border-0">
                  <span>
                    <Link href={`/profile/detail?id=${company.user_id}`} className="hover:underline">
                      {company.name}
                    </Link>{" "}
                    <span className="text-muted-foreground">
                      ({company.contact_name}, {company.contact_email})
                    </span>
                  </span>
                  <div className="flex items-center gap-2">
                    {company.verified ? (
                      <Badge variant="success">Verified</Badge>
                    ) : (
                      <>
                        <Badge variant="outline">Unverified</Badge>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => verifyMutation.mutate(company.id)}
                          disabled={verifyMutation.isPending}
                        >
                          Verify (NFR-1)
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="mt-4">
          <Card>
            <CardContent className="flex flex-col gap-2 pt-6">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between border-b py-2 text-sm last:border-0">
                  <span>
                    <Link href={`/profile/detail?id=${user.id}`} className="hover:underline">
                      {user.name}
                    </Link>{" "}
                    <span className="text-muted-foreground">({user.email})</span>
                  </span>
                  <div className="flex gap-2">
                    <Badge variant="secondary">{roleLabel(user.role, t)}</Badge>
                    {user.department && <Badge variant="outline">{user.department}</Badge>}
                    {user.expertise && <Badge variant="outline">{user.expertise}</Badge>}
                    {user.program && <Badge variant="outline">{user.program}</Badge>}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="mt-4">
          <Card>
            <CardContent className="flex flex-col gap-2 pt-6 text-sm">
              {auditLog.length === 0 && <p className="text-muted-foreground">No activity yet.</p>}
              {auditLog.map((entry) => (
                <div key={entry.id} className="flex flex-wrap justify-between gap-2 border-b pb-2 last:border-0">
                  <span>
                    <Badge variant="outline" className="mr-2 capitalize">
                      {entry.entity}
                    </Badge>
                    {entry.action}
                  </span>
                  <span className="text-muted-foreground">
                    {entry.actor?.name ?? "Company (public form)"} · {new Date(entry.timestamp).toLocaleString()}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
