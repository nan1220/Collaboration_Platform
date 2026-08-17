"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, ApiError } from "@/lib/api";
import { useCurrentUser } from "@/lib/current-user";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DevShortcut } from "@/components/dev-shortcut";
import { useLanguage } from "@/lib/i18n";

export default function CompanyAccessPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { users, setCurrentUserId } = useCurrentUser();
  const { t } = useLanguage();
  const existingCompanies = users.filter((u) => u.role === "company");

  const [loginEmail, setLoginEmail] = useState("");
  const [form, setForm] = useState({ name: "", contact_name: "", contact_email: "" });

  const onSignedIn = (label: string) => ({ user }: { user: { id: number } }) => {
    toast.success(label);
    queryClient.invalidateQueries({ queryKey: ["demo-users"] });
    setCurrentUserId(user.id);
    router.push("/company");
  };

  const quickSignIn = (id: number) => {
    setCurrentUserId(id);
    router.push("/company");
  };

  const loginMutation = useMutation({
    mutationFn: () => api.signInCompany(loginEmail),
    onSuccess: onSignedIn(t("toast.signedIn")),
    onError: (err) => toast.error(err instanceof ApiError ? err.message : t("toast.signInFailed")),
  });

  const registerMutation = useMutation({
    mutationFn: () => api.registerCompany(form),
    onSuccess: onSignedIn(t("toast.companyRegistered")),
    onError: (err) => toast.error(err instanceof ApiError ? err.message : t("toast.registrationFailed")),
  });

  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader>
        <CardTitle>{t("register.title")}</CardTitle>
        <CardDescription>{t("register.description")}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            loginMutation.mutate();
          }}
        >
          <p className="text-sm font-medium">{t("register.alreadyRegistered")}</p>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="login_email">{t("register.workEmail")}</Label>
            <Input
              id="login_email"
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
            />
          </div>
          <Button type="submit" variant="secondary" disabled={loginMutation.isPending}>
            {t("register.logIn")}
          </Button>
        </form>

        <Separator />

        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            registerMutation.mutate();
          }}
        >
          <p className="text-sm font-medium">{t("register.newCompany")}</p>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">{t("register.companyName")}</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="contact_name">{t("register.contactPerson")}</Label>
            <Input
              id="contact_name"
              value={form.contact_name}
              onChange={(e) => setForm((f) => ({ ...f, contact_name: e.target.value }))}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="contact_email">{t("register.workEmail")}</Label>
            <Input
              id="contact_email"
              type="email"
              value={form.contact_email}
              onChange={(e) => setForm((f) => ({ ...f, contact_email: e.target.value }))}
              required
            />
          </div>
          <Button type="submit" disabled={registerMutation.isPending}>
            {t("register.registerAction")}
          </Button>
        </form>

        {existingCompanies.length > 0 && (
          <DevShortcut title={t("shibboleth.quickSignIn")}>
            <div className="flex flex-col gap-1.5">
              {existingCompanies.map((company) => (
                <button
                  key={company.id}
                  onClick={() => quickSignIn(company.id)}
                  className="flex items-center justify-between rounded-md border border-amber-500/30 bg-background px-3 py-2 text-left text-sm transition-colors hover:bg-muted"
                >
                  {company.name}
                </button>
              ))}
            </div>
          </DevShortcut>
        )}
      </CardContent>
    </Card>
  );
}
