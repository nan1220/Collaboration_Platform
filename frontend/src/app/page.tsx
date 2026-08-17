"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Database, BookOpenCheck, Users, Building2, type LucideIcon } from "lucide-react";
import { api } from "@/lib/api";
import { useCurrentUser } from "@/lib/current-user";
import { useLanguage } from "@/lib/i18n";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { withBasePath } from "@/lib/base-path";
import { cn } from "@/lib/utils";

type TKey = Parameters<ReturnType<typeof useLanguage>["t"]>[0];

// Signed-in users don't need the pitch for the platform they're already
// using - drop them straight into what they'd actually do next. Students go
// to their active (confirmed) project if they have one, since that's the
// single most relevant thing to see; everyone else goes to their dashboard.
const ROLE_HOME: Record<"staff" | "professor" | "company", string> = {
  staff: "/staff",
  professor: "/professor",
  company: "/company",
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
  const router = useRouter();
  const isStudent = currentUser?.role === "student";

  const { data: applications, isLoading: applicationsLoading } = useQuery({
    queryKey: ["applications", "mine", currentUser?.id],
    queryFn: () => api.applications(currentUser!.id),
    enabled: isStudent,
  });

  useEffect(() => {
    if (!currentUser) return;
    if (currentUser.role !== "student") {
      router.replace(ROLE_HOME[currentUser.role]);
      return;
    }
    if (applicationsLoading) return;
    const active = applications?.find((a) => a.confirmed);
    router.replace(active ? `/projects/detail?id=${active.project.id}` : "/student");
  }, [currentUser, applicationsLoading, applications, router]);

  if (currentUser) {
    return <p className="text-muted-foreground">{t("common.loading")}</p>;
  }

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
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element -- static SVG, no next/image benefit */}
            <img src={withBasePath("/logo-mark.svg")} alt="" aria-hidden="true" className="size-10 sm:size-12" />
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Collaboration Platform</h1>
          </div>
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
