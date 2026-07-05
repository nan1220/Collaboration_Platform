"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProjectStatus } from "@/lib/types";

export default function PublicStatusPage() {
  const { token } = useParams<{ token: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["public-status", token],
    queryFn: () => api.publicStatus(token),
  });

  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader>
        <CardTitle>Submission status</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && <p className="text-muted-foreground">Loading…</p>}
        {isError && <p className="text-muted-foreground">No submission found for this link.</p>}
        {data && (
          <div className="flex flex-col gap-2">
            <p className="font-medium">{data.title}</p>
            <StatusBadge status={data.status as ProjectStatus} />
            <p className="text-xs text-muted-foreground">
              Last updated {new Date(data.updatedAt).toLocaleString()}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
