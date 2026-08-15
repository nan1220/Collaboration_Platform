"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { useCurrentUser } from "@/lib/current-user";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Role } from "@/lib/types";

const ROLE_OPTIONS: { value: "student" | "professor" | "staff"; label: string }[] = [
  { value: "student", label: "Student" },
  { value: "professor", label: "Professor" },
  { value: "staff", label: "University staff" },
];

export default function ShibbolethLoginPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { users, setCurrentUserId } = useCurrentUser();
  const institutionalUsers = users.filter((u) => u.role !== "company");

  const [name, setName] = useState("");
  const [role, setRole] = useState<"student" | "professor" | "staff">("student");
  const [department, setDepartment] = useState("");
  const [program, setProgram] = useState("");

  const signInMutation = useMutation({
    mutationFn: () => api.signInInstitutional({ name, role, department, program }),
    onSuccess: (user) => {
      toast.success(`Account created and signed in as ${user.name}`);
      queryClient.invalidateQueries({ queryKey: ["demo-users"] });
      setCurrentUserId(user.id);
      router.push("/");
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Sign-in failed"),
  });

  const quickSignIn = (id: number) => {
    setCurrentUserId(id);
    router.push("/");
  };

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6">
      <Card className="border-2 border-dashed">
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-5 text-muted-foreground" />
            <CardTitle>TUM Shibboleth Login (simulated)</CardTitle>
          </div>
          <CardDescription>
            In production this would redirect to TUM&apos;s real Shibboleth identity provider
            (NFR-1). This prototype has no institutional backend to redirect to, so it simulates
            the round trip here instead.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {institutionalUsers.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium">Already have an account</p>
              <div className="flex flex-col gap-1.5">
                {institutionalUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => quickSignIn(user.id)}
                    className="flex items-center justify-between rounded-md border px-3 py-2 text-left text-sm transition-colors hover:bg-muted"
                  >
                    <span>{user.name}</span>
                    <span className="capitalize text-muted-foreground">{roleLabel(user.role)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <Separator />

          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium">First time signing in</p>
            <p className="text-xs text-muted-foreground">
              A real Shibboleth login releases your identity attributes (name, affiliation) to the
              platform, which creates your account automatically the first time it sees them —
              simulated here by just asking for that information directly.
            </p>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="role">Affiliation</Label>
              <Select
                items={ROLE_OPTIONS}
                value={role}
                onValueChange={(v) => v && setRole(v as typeof role)}
              >
                <SelectTrigger id="role" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {role === "professor" && (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="department">Chair / department</Label>
                <Input
                  id="department"
                  placeholder="e.g. School of Management"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                />
              </div>
            )}
            {role === "student" && (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="program">Degree program</Label>
                <Input
                  id="program"
                  placeholder="e.g. B.Sc. Management and Data Science"
                  value={program}
                  onChange={(e) => setProgram(e.target.value)}
                />
              </div>
            )}
            <Button
              onClick={() => signInMutation.mutate()}
              disabled={signInMutation.isPending || !name.trim()}
            >
              Sign in via Shibboleth
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function roleLabel(role: Role) {
  if (role === "staff") return "University staff";
  return role;
}
