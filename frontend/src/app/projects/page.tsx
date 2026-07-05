"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useCurrentUser } from "@/lib/current-user";
import { ProjectCard } from "@/components/project-card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STATUS_LABELS, type ProjectStatus } from "@/lib/types";

export default function ProjectsPage() {
  const { currentUser } = useCurrentUser();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("");
  const [source, setSource] = useState<string>("");

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects", currentUser?.id, q, status, source],
    queryFn: () =>
      api.projects(currentUser?.id ?? null, { q: q || undefined, status: status || undefined, source: source || undefined }),
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
        <p className="mt-1 text-muted-foreground">
          Browse company and internal project topics.
          {currentUser?.role === "organizer" &&
            " As an organizer you also see the incoming approval queue here — filter by status to find it."}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Search title or description…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-xs"
        />
        <Select value={status || "all"} onValueChange={(v) => setStatus(!v || v === "all" ? "" : v)}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {(Object.keys(STATUS_LABELS) as ProjectStatus[]).map((s) => (
              <SelectItem key={s} value={s}>
                {STATUS_LABELS[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={source || "all"} onValueChange={(v) => setSource(!v || v === "all" ? "" : v)}>
          <SelectTrigger>
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Company + internal</SelectItem>
            <SelectItem value="company">Company</SelectItem>
            <SelectItem value="internal">Internal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading && <p className="text-muted-foreground">Loading…</p>}
      {!isLoading && projects.length === 0 && (
        <p className="text-muted-foreground">No projects match these filters.</p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
