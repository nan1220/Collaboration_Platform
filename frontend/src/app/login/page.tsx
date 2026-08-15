import Link from "next/link";
import { GraduationCap, Building2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
        <p className="mt-1 text-muted-foreground">
          How you get in depends on who you are (FR-1/NFR-1).
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-l-4 border-l-primary">
          <CardHeader>
            <div className="flex size-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
              <GraduationCap className="size-5" />
            </div>
            <CardTitle className="mt-2">TUM members</CardTitle>
            <CardDescription>
              Students, professors and staff sign in with their TUM institutional account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/login/shibboleth" className={cn(buttonVariants({ variant: "default" }))}>
              Continue with Shibboleth
            </Link>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent">
          <CardHeader>
            <div className="flex size-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
              <Building2 className="size-5" />
            </div>
            <CardTitle className="mt-2">Companies</CardTitle>
            <CardDescription>
              No TUM account needed — log in with your work email, or register a new company. Staff
              verify new companies before they can submit a project (NFR-1).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/register" className={cn(buttonVariants({ variant: "outline" }))}>
              Log in or register
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
