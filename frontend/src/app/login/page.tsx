"use client";

import Link from "next/link";
import { GraduationCap, Building2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const { t } = useLanguage();
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("signIn.title")}</h1>
        <p className="mt-1 text-muted-foreground">{t("signIn.subtitle")}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-l-4 border-l-primary">
          <CardHeader>
            <div className="flex size-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
              <GraduationCap className="size-5" />
            </div>
            <CardTitle className="mt-2">{t("signIn.tumMembers.title")}</CardTitle>
            <CardDescription>{t("signIn.tumMembers.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/login/shibboleth" className={cn(buttonVariants({ variant: "default" }))}>
              {t("signIn.tumMembers.action")}
            </Link>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent">
          <CardHeader>
            <div className="flex size-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
              <Building2 className="size-5" />
            </div>
            <CardTitle className="mt-2">{t("signIn.companies.title")}</CardTitle>
            <CardDescription>{t("signIn.companies.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/register" className={cn(buttonVariants({ variant: "outline" }))}>
              {t("signIn.companies.action")}
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
