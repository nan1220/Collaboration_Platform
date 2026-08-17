"use client";

import Link from "next/link";
import { Database, BookOpenCheck, Users, Building2, type LucideIcon } from "lucide-react";
import { useCurrentUser } from "@/lib/current-user";
import { useLanguage } from "@/lib/i18n";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TKey = Parameters<ReturnType<typeof useLanguage>["t"]>[0];

const ROLE_COPY: Record<string, { titleKey: TKey; descriptionKey: TKey; links: { href: string; labelKey: TKey }[] }> = {
  staff: {
    titleKey: "home.role.staff.title",
    descriptionKey: "home.role.staff.description",
    links: [
      { href: "/staff", labelKey: "home.role.staff.link1" },
      { href: "/projects", labelKey: "home.role.staff.link2" },
    ],
  },
  professor: {
    titleKey: "home.role.professor.title",
    descriptionKey: "home.role.professor.description",
    links: [
      { href: "/professor", labelKey: "home.role.professor.link1" },
      { href: "/students", labelKey: "home.role.professor.link2" },
    ],
  },
  company: {
    titleKey: "home.role.company.title",
    descriptionKey: "home.role.company.description",
    links: [
      { href: "/company", labelKey: "home.role.company.link1" },
      { href: "/students", labelKey: "home.role.company.link2" },
    ],
  },
  student: {
    titleKey: "home.role.student.title",
    descriptionKey: "home.role.student.description",
    links: [
      { href: "/projects", labelKey: "home.role.student.link1" },
      { href: "/student", labelKey: "home.role.student.link2" },
      { href: "/guides", labelKey: "home.role.student.link3" },
    ],
  },
};

const FEATURES: { icon: LucideIcon; titleKey: TKey; descriptionKey: TKey; href: string }[] = [
  {
    icon: Database,
    titleKey: "home.feature.database.title",
    descriptionKey: "home.feature.database.description",
    href: "/projects",
  },
  {
    icon: Building2,
    titleKey: "home.feature.companySubmissions.title",
    descriptionKey: "home.feature.companySubmissions.description",
    href: "/company",
  },
  {
    icon: Users,
    titleKey: "home.feature.studentTopics.title",
    descriptionKey: "home.feature.studentTopics.description",
    href: "/students",
  },
  {
    icon: BookOpenCheck,
    titleKey: "home.feature.guides.title",
    descriptionKey: "home.feature.guides.description",
    href: "/guides",
  },
];

export default function Home() {
  const { currentUser } = useCurrentUser();
  const { t } = useLanguage();
  const copy = currentUser ? ROLE_COPY[currentUser.role] : null;

  return (
    <div className="flex flex-col gap-10">
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-[#00335e] px-6 py-12 text-primary-foreground shadow-lg sm:px-10 sm:py-16">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-16 -right-16 size-64 rounded-full bg-white/10 blur-2xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-20 left-1/4 size-72 rounded-full bg-white/5 blur-3xl"
        />
        <div className="relative flex max-w-2xl flex-col gap-4">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Collaboration Platform</h1>
          <p className="text-primary-foreground/85 sm:text-lg">{t("home.heroSubtitle")}</p>
          <div className="mt-2 flex flex-wrap gap-3">
            <Link href="/projects" className={cn(buttonVariants({ variant: "secondary", size: "lg" }))}>
              {t("home.browseProjects")}
            </Link>
            <Link
              href="/company"
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-primary-foreground/40 px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-foreground/10"
            >
              {t("home.submitProjectCompany")}
            </Link>
          </div>
        </div>
      </section>

      {!currentUser && (
        <Card className="border-l-4 border-l-accent">
          <CardHeader>
            <CardTitle>{t("home.notSignedInTitle")}</CardTitle>
            <CardDescription>{t("home.notSignedInDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/login" className={cn(buttonVariants({ variant: "default" }))}>
              {t("nav.signIn")}
            </Link>
          </CardContent>
        </Card>
      )}

      {copy && (
        <Card className="border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle>{t(copy.titleKey)}</CardTitle>
            <CardDescription>{t(copy.descriptionKey)}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {copy.links.map((link) => (
              <Link key={link.href} href={link.href} className={cn(buttonVariants({ variant: "default" }))}>
                {t(link.labelKey)}
              </Link>
            ))}
          </CardContent>
        </Card>
      )}

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold tracking-tight">{t("home.whatThisReplaces")}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <Link key={feature.href} href={feature.href} className="block h-full">
              <Card className="h-full transition-all hover:-translate-y-0.5 hover:shadow-md">
                <CardHeader>
                  <div className="flex size-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                    <feature.icon className="size-5" />
                  </div>
                  <CardTitle className="mt-2">{t(feature.titleKey)}</CardTitle>
                  <CardDescription>{t(feature.descriptionKey)}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
