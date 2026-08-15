"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FolderKanban,
  BookOpen,
  Users,
  LayoutDashboard,
  GraduationCap,
  ClipboardList,
  Building2,
  UserRound,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { useCurrentUser } from "@/lib/current-user";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { withBasePath } from "@/lib/base-path";
import { cn } from "@/lib/utils";

const NAV_LINKS: { href: string; label: string; icon: LucideIcon; roles?: string[] }[] = [
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/students", label: "Student directory", icon: Users, roles: ["professor", "company", "staff"] },
  { href: "/teammates", label: "Find teammates", icon: Users, roles: ["student"] },
  { href: "/guides", label: "Guides", icon: BookOpen },
  { href: "/staff", label: "Staff dashboard", icon: LayoutDashboard, roles: ["staff"] },
  { href: "/professor", label: "My supervision", icon: GraduationCap, roles: ["professor"] },
  { href: "/company", label: "My company", icon: Building2, roles: ["company"] },
  { href: "/student", label: "My applications", icon: ClipboardList, roles: ["student"] },
];

// trailingSlash is enabled (next.config.ts), so usePathname() returns paths
// like "/projects/" — normalize before comparing against hrefs, and treat a
// nested route (e.g. "/projects/detail") as still under its parent tab.
function normalize(path: string) {
  return path.length > 1 ? path.replace(/\/$/, "") : path;
}

export function NavBar() {
  const { currentUser, setCurrentUserId } = useCurrentUser();
  const pathname = usePathname();
  const router = useRouter();
  const currentPath = normalize(pathname);
  const [menuOpen, setMenuOpen] = useState(false);

  const links = NAV_LINKS.filter(
    (link) => !link.roles || (currentUser && link.roles.includes(currentUser.role))
  );

  return (
    <header className="sticky top-0 z-40 bg-primary text-primary-foreground shadow-md shadow-black/10">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <span className="flex items-center rounded-[2px] bg-white px-2 py-1.5 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element -- static SVG, no next/image benefit */}
            <img src={withBasePath("/tum-logo.svg")} alt="Technical University of Munich" className="h-5 w-auto" />
          </span>
          <span className="text-sm font-semibold tracking-tight">Collaboration Platform</span>
        </Link>

        <nav className="flex flex-1 flex-wrap items-center gap-0.5">
          {links.map((link) => {
            const Icon = link.icon;
            const active = currentPath === link.href || currentPath.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary-foreground/15 text-primary-foreground shadow-inner"
                    : "text-primary-foreground/75 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                )}
              >
                <Icon className="size-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {currentUser ? (
          <Popover open={menuOpen} onOpenChange={setMenuOpen}>
            <PopoverTrigger
              render={
                <Button
                  variant="secondary"
                  size="sm"
                  className="gap-1.5 border border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground shadow-none hover:bg-primary-foreground/20"
                >
                  <UserRound className="size-4" />
                  {currentUser.name}
                </Button>
              }
            />
            <PopoverContent align="end">
              <PopoverTitle>{currentUser.name}</PopoverTitle>
              <PopoverDescription>Signed in for this demo session.</PopoverDescription>
              <Badge variant="secondary" className="w-fit capitalize">
                {currentUser.role}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                className="justify-start gap-1.5"
                onClick={() => {
                  setCurrentUserId(null);
                  setMenuOpen(false);
                  router.push("/");
                }}
              >
                <LogOut className="size-4" />
                Sign out
              </Button>
            </PopoverContent>
          </Popover>
        ) : (
          <Link href="/login" className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "gap-1.5")}>
            <UserRound className="size-4" />
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
}
