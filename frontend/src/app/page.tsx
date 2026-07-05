"use client";

import Link from "next/link";
import { useCurrentUser } from "@/lib/current-user";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ROLE_COPY: Record<string, { title: string; description: string; links: { href: string; label: string }[] }> = {
  organizer: {
    title: "Organizer dashboard",
    description: "Review company submissions, track every project's status, and manage guides.",
    links: [
      { href: "/organizer", label: "Open organizer dashboard" },
      { href: "/projects", label: "Browse all projects" },
    ],
  },
  professor: {
    title: "Supervision",
    description: "Claim approved topics in your department and manage projects you supervise.",
    links: [
      { href: "/professor", label: "Open my supervision" },
      { href: "/projects", label: "Browse projects" },
    ],
  },
  student: {
    title: "Student home",
    description: "Browse projects, read guides, track your applications and find teammates.",
    links: [
      { href: "/projects", label: "Browse projects" },
      { href: "/guides", label: "Read guides" },
      { href: "/student", label: "My applications" },
    ],
  },
};

export default function Home() {
  const { currentUser } = useCurrentUser();
  const copy = currentUser ? ROLE_COPY[currentUser.role] : null;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Collaboration Platform</h1>
        <p className="mt-1 max-w-2xl text-muted-foreground">
          One consistent database for company and internal project topics — shared by organizers,
          professors and students, instead of a spreadsheet nobody else can see.
        </p>
      </div>

      {!currentUser && (
        <Card>
          <CardHeader>
            <CardTitle>Pick a demo user to get started</CardTitle>
            <CardDescription>
              This is a mock: there is no real login yet. Use the selector in the top right to view
              the platform as an organizer, professor or student.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {copy && (
        <Card>
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

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Are you a company?</CardTitle>
            <CardDescription>
              Submit a project topic for approval — no account needed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/submit" className={cn(buttonVariants({ variant: "outline" }))}>
              Submit a project
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>New to company projects?</CardTitle>
            <CardDescription>
              Read the guides section, including how to find an eligible supervisor.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/guides" className={cn(buttonVariants({ variant: "outline" }))}>
              Browse guides
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
