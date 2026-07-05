"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useCurrentUser } from "@/lib/current-user";
import { ProjectCard } from "@/components/project-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function OrganizerPage() {
  const { currentUser } = useCurrentUser();
  const enabled = currentUser?.role === "organizer";

  const { data: submitted = [] } = useQuery({
    queryKey: ["projects", "submitted", currentUser?.id],
    queryFn: () => api.projects(currentUser!.id, { status: "submitted" }),
    enabled,
  });
  const { data: underReview = [] } = useQuery({
    queryKey: ["projects", "under_review", currentUser?.id],
    queryFn: () => api.projects(currentUser!.id, { status: "under_review" }),
    enabled,
  });
  const { data: users = [] } = useQuery({
    queryKey: ["users", currentUser?.id],
    queryFn: () => api.users(currentUser!.id),
    enabled,
  });
  const { data: auditLog = [] } = useQuery({
    queryKey: ["audit-log", "all", currentUser?.id],
    queryFn: () => api.auditLog(currentUser!.id),
    enabled,
  });

  if (!currentUser || currentUser.role !== "organizer") {
    return (
      <p className="text-muted-foreground">
        Select the organizer demo user (top right) to see this dashboard.
      </p>
    );
  }

  const queue = [...submitted, ...underReview];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Organizer dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Approve incoming submissions and see what's actually happening across every project —
          the visibility the shared Excel sheet never had.
        </p>
      </div>

      <Tabs defaultValue="queue">
        <TabsList>
          <TabsTrigger value="queue">Approval queue ({queue.length})</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="audit">Audit log</TabsTrigger>
        </TabsList>

        <TabsContent value="queue" className="mt-4">
          {queue.length === 0 && <p className="text-muted-foreground">Nothing waiting on review.</p>}
          <div className="grid gap-4 sm:grid-cols-2">
            {queue.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="users" className="mt-4">
          <Card>
            <CardContent className="flex flex-col gap-2 pt-6">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between border-b py-2 text-sm last:border-0">
                  <span>
                    {user.name} <span className="text-muted-foreground">({user.email})</span>
                  </span>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="capitalize">
                      {user.role}
                    </Badge>
                    {user.department && <Badge variant="outline">{user.department}</Badge>}
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
                    {entry.actor?.name ?? "Company (public form)"} ·{" "}
                    {new Date(entry.timestamp).toLocaleString()}
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
