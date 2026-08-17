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
import { useLanguage } from "@/lib/i18n";
import { STATUS_LABELS, type ProjectStatus } from "@/lib/types";

export default function ProjectsPage() {
  const { currentUser } = useCurrentUser();
  const { t } = useLanguage();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("");

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects", currentUser?.id, q, status],
    queryFn: () => api.projects(currentUser?.id ?? null, { q: q || undefined, status: status || undefined }),
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("page.projects.title")}</h1>
        <p className="mt-1 text-muted-foreground">
          Published project studies, open for student applications.
          {currentUser?.role === "professor" &&
            " As a professor you also see approved topics here, ready to take on."}
          {currentUser?.role === "staff" && " As staff you see every project regardless of status here."}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Search title or background…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-xs"
        />
        <Select
          items={[
            { value: "all", label: "All statuses" },
            ...(Object.keys(STATUS_LABELS) as ProjectStatus[]).map((s) => ({ value: s, label: STATUS_LABELS[s] })),
          ]}
          value={status || "all"}
          onValueChange={(v) => setStatus(!v || v === "all" ? "" : v)}
        >
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
