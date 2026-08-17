"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, ApiError } from "@/lib/api";
import { useCurrentUser } from "@/lib/current-user";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Markdown } from "@/components/markdown";

export default function GuideDetailPage() {
  return (
    <Suspense fallback={<p className="text-muted-foreground">Loading…</p>}>
      <GuideDetail />
    </Suspense>
  );
}

function GuideDetail() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") ?? "";
  const { currentUser } = useCurrentUser();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [body, setBody] = useState("");

  const { data: guide, isLoading } = useQuery({
    queryKey: ["guide", slug],
    queryFn: () => api.guide(slug),
  });

  useEffect(() => {
    if (guide) setBody(guide.body);
  }, [guide]);

  const updateMutation = useMutation({
    mutationFn: () => api.updateGuide(currentUser!.id, slug, { body }),
    onSuccess: () => {
      toast.success("Guide updated");
      setEditing(false);
      queryClient.invalidateQueries({ queryKey: ["guide", slug] });
      queryClient.invalidateQueries({ queryKey: ["guides"] });
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Failed to update guide"),
  });

  const deleteMutation = useMutation({
    mutationFn: () => api.deleteGuide(currentUser!.id, slug),
    onSuccess: () => {
      toast.success("Guide deleted");
      queryClient.invalidateQueries({ queryKey: ["guides"] });
      router.push("/guides");
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Failed to delete guide"),
  });

  if (isLoading || !guide) return <p className="text-muted-foreground">Loading…</p>;

  return (
    <div className="flex flex-col gap-4">
      <Badge variant="outline" className="w-fit">
        {guide.category}
      </Badge>
      <h1 className="text-2xl font-semibold tracking-tight">{guide.title}</h1>

      <Card>
        <CardContent className="pt-6">
          {editing ? (
            <div className="flex flex-col gap-1.5">
              <Textarea rows={12} value={body} onChange={(e) => setBody(e.target.value)} className="font-mono text-sm" />
              <p className="text-xs text-muted-foreground">Markdown supported (headings, lists, bold, links, tables).</p>
            </div>
          ) : (
            <Markdown content={guide.body} />
          )}
        </CardContent>
      </Card>

      {currentUser?.role === "staff" && (
        <div className="flex gap-2">
          {editing ? (
            <>
              <Button onClick={() => updateMutation.mutate()} disabled={updateMutation.isPending}>
                Save
              </Button>
              <Button variant="outline" onClick={() => setEditing(false)}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setEditing(true)}>
                Edit
              </Button>
              <Button variant="destructive" onClick={() => deleteMutation.mutate()} disabled={deleteMutation.isPending}>
                Delete
              </Button>
            </>
          )}
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Last updated {new Date(guide.updated_at).toLocaleString()}
      </p>
    </div>
  );
}
