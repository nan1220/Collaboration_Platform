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
import { DevShortcut } from "@/components/dev-shortcut";
import { useLanguage } from "@/lib/i18n";
import type { Role } from "@/lib/types";

export default function ShibbolethLoginPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { users, setCurrentUserId } = useCurrentUser();
  const { t } = useLanguage();
  const institutionalUsers = users.filter((u) => u.role !== "company");

  const ROLE_OPTIONS: { value: "student" | "professor" | "staff"; label: string }[] = [
    { value: "student", label: t("shibboleth.roleStudent") },
    { value: "professor", label: t("shibboleth.roleProfessor") },
    { value: "staff", label: t("shibboleth.roleStaff") },
  ];

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
            <CardTitle>{t("shibboleth.title")}</CardTitle>
          </div>
          <CardDescription>{t("shibboleth.description")}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium">{t("shibboleth.firstTime")}</p>
            <p className="text-xs text-muted-foreground">{t("shibboleth.firstTimeDesc")}</p>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">{t("shibboleth.fullName")}</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="role">{t("shibboleth.affiliation")}</Label>
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
                <Label htmlFor="department">{t("shibboleth.chairDepartment")}</Label>
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
                <Label htmlFor="program">{t("shibboleth.degreeProgram")}</Label>
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
              {t("shibboleth.signInAction")}
            </Button>
          </div>

          {institutionalUsers.length > 0 && (
            <>
              <Separator />
              <DevShortcut title={t("shibboleth.quickSignIn")}>
                <div className="flex flex-col gap-1.5">
                  {institutionalUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => quickSignIn(user.id)}
                      className="flex items-center justify-between rounded-md border border-amber-500/30 bg-background px-3 py-2 text-left text-sm transition-colors hover:bg-muted"
                    >
                      <span>{user.name}</span>
                      <span className="capitalize text-muted-foreground">{roleLabel(user.role, t)}</span>
                    </button>
                  ))}
                </div>
              </DevShortcut>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function roleLabel(role: Role, t: ReturnType<typeof useLanguage>["t"]) {
  if (role === "staff") return t("shibboleth.roleStaff");
  if (role === "professor") return t("shibboleth.roleProfessor");
  return t("shibboleth.roleStudent");
}
