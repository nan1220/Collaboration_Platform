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

export default function CompanyAccessPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { users, setCurrentUserId } = useCurrentUser();
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
    onSuccess: onSignedIn("Signed in"),
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Sign-in failed"),
  });

  const registerMutation = useMutation({
    mutationFn: () => api.registerCompany(form),
    onSuccess: onSignedIn("Company registered — pending staff verification"),
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Registration failed"),
  });

  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader>
        <CardTitle>Company access</CardTitle>
        <CardDescription>
          No TUM account needed. Already registered? Sign in below. New here? Register your company
          — staff confirm new companies before they can submit a project (NFR-1).
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            loginMutation.mutate();
          }}
        >
          <p className="text-sm font-medium">Already registered</p>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="login_email">Work email</Label>
            <Input
              id="login_email"
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
            />
          </div>
          <Button type="submit" variant="secondary" disabled={loginMutation.isPending}>
            Log in
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
          <p className="text-sm font-medium">New company</p>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Company name</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="contact_name">Contact person</Label>
            <Input
              id="contact_name"
              value={form.contact_name}
              onChange={(e) => setForm((f) => ({ ...f, contact_name: e.target.value }))}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="contact_email">Work email</Label>
            <Input
              id="contact_email"
              type="email"
              value={form.contact_email}
              onChange={(e) => setForm((f) => ({ ...f, contact_email: e.target.value }))}
              required
            />
          </div>
          <Button type="submit" disabled={registerMutation.isPending}>
            Register
          </Button>
        </form>

        {existingCompanies.length > 0 && (
          <DevShortcut title="Mock sign-in for testing">
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
