"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, ApiError } from "@/lib/api";
import { useCurrentUser } from "@/lib/current-user";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function GuidesPage() {
  const { currentUser } = useCurrentUser();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", category: "General", body: "" });

  const { data: guides = [], isLoading } = useQuery({ queryKey: ["guides"], queryFn: api.guides });

  const visibleGuides = guides.filter(
    (g) => g.audience === "all" || !currentUser || g.audience === currentUser.role || currentUser.role === "organizer"
  );

  const createMutation = useMutation({
    mutationFn: () =>
      api.createGuide(currentUser!.id, {
        slug: form.title
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
        title: form.title,
        category: form.category,
        audience: "all",
        body: form.body,
      }),
    onSuccess: () => {
      toast.success("Guide created");
      setOpen(false);
      setForm({ title: "", category: "General", body: "" });
      queryClient.invalidateQueries({ queryKey: ["guides"] });
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Failed to create guide"),
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Guides</h1>
          <p className="mt-1 max-w-2xl text-muted-foreground">
            Practical, TUM-specific guidance — like how to find an eligible supervisor for a
            company-submitted topic — instead of figuring it out through word of mouth.
          </p>
        </div>
        {currentUser?.role === "organizer" && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button>New guide</Button>} />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New guide</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="body">Body</Label>
                  <Textarea
                    id="body"
                    rows={8}
                    value={form.body}
                    onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                  />
                </div>
                <Button
                  onClick={() => createMutation.mutate()}
                  disabled={!form.title || !form.body || createMutation.isPending}
                >
                  Publish guide
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {isLoading && <p className="text-muted-foreground">Loading…</p>}
      <div className="grid gap-4 sm:grid-cols-2">
        {visibleGuides.map((guide) => (
          <Link key={guide.slug} href={`/guides/${guide.slug}`}>
            <Card className="h-full transition-colors hover:border-primary/50">
              <CardHeader>
                <Badge variant="outline" className="w-fit capitalize">
                  {guide.category}
                </Badge>
                <CardTitle className="mt-1">{guide.title}</CardTitle>
                <CardDescription className="line-clamp-3">{guide.body}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
