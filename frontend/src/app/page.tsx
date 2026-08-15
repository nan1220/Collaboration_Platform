"use client";

import Link from "next/link";
import { Database, BookOpenCheck, Users, Building2, type LucideIcon } from "lucide-react";
import { useCurrentUser } from "@/lib/current-user";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ROLE_COPY: Record<string, { title: string; description: string; links: { href: string; label: string }[] }> = {
  staff: {
    title: "Staff dashboard",
    description: "Review company submissions, monitor every project by status, and verify companies.",
    links: [
      { href: "/staff", label: "Open staff dashboard" },
      { href: "/projects", label: "Browse all projects" },
    ],
  },
  professor: {
    title: "Supervision",
    description: "Take on topics matched to your expertise, or submit a project agreed directly with a company.",
    links: [
      { href: "/professor", label: "Open my supervision" },
      { href: "/students", label: "Browse the student directory" },
    ],
  },
  company: {
    title: "Company dashboard",
    description: "Submit project proposals and browse student topics and profiles.",
    links: [
      { href: "/company", label: "Open my company dashboard" },
      { href: "/students", label: "Browse the student directory" },
    ],
  },
  student: {
    title: "Student home",
    description: "Browse published projects, submit your topic and profile, and track your applications.",
    links: [
      { href: "/projects", label: "Browse projects" },
      { href: "/student", label: "My applications and profile" },
      { href: "/guides", label: "Read guides" },
    ],
  },
};

const FEATURES: { icon: LucideIcon; title: string; description: string; href: string }[] = [
  {
    icon: Database,
    title: "One shared database",
    description:
      "Staff, professors, students and companies all see the same project data and status history — not a spreadsheet only two people can read.",
    href: "/projects",
  },
  {
    icon: Building2,
    title: "Company submissions",
    description:
      "Companies submit a topic through a portal (FR-2). Staff approve it, a matching professor takes it on and publishes it (FR-6).",
    href: "/company",
  },
  {
    icon: Users,
    title: "Student topics & teammates",
    description:
      "Students submit a topic and profile that professors and companies can browse (FR-4/FR-8/FR-9), and can flag themselves as looking for a team (FR-10).",
    href: "/students",
  },
  {
    icon: BookOpenCheck,
    title: "Guides that actually help",
    description:
      "Concrete, TUM-specific guidance — like finding a professor whose expertise matches a topic — instead of word of mouth.",
    href: "/guides",
  },
];

export default function Home() {
  const { currentUser } = useCurrentUser();
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
          <p className="text-primary-foreground/85 sm:text-lg">
            One consistent database for company and professor-submitted project topics — shared by
            staff, professors, students and companies, instead of a spreadsheet nobody else can see.
          </p>
          <div className="mt-2 flex flex-wrap gap-3">
            <Link href="/projects" className={cn(buttonVariants({ variant: "secondary", size: "lg" }))}>
              Browse projects
            </Link>
            <Link
              href="/company"
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-primary-foreground/40 px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-foreground/10"
            >
              Submit a project (company)
            </Link>
          </div>
        </div>
      </section>

      {!currentUser && (
        <Card className="border-l-4 border-l-accent">
          <CardHeader>
            <CardTitle>You&apos;re not signed in</CardTitle>
            <CardDescription>
              TUM members sign in with Shibboleth; companies register with a work email (FR-1/NFR-1).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/login" className={cn(buttonVariants({ variant: "default" }))}>
              Sign in
            </Link>
          </CardContent>
        </Card>
      )}

      {copy && (
        <Card className="border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle>{copy.title}</CardTitle>
            <CardDescription>{copy.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {copy.links.map((link) => (
              <Link key={link.href} href={link.href} className={cn(buttonVariants({ variant: "default" }))}>
                {link.label}
              </Link>
            ))}
          </CardContent>
        </Card>
      )}

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold tracking-tight">What this replaces</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <Link key={feature.href} href={feature.href} className="block h-full">
              <Card className="h-full transition-all hover:-translate-y-0.5 hover:shadow-md">
                <CardHeader>
                  <div className="flex size-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                    <feature.icon className="size-5" />
                  </div>
                  <CardTitle className="mt-2">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
