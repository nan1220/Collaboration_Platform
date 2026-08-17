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
import { useLanguage, roleLabel, type Locale } from "@/lib/i18n";
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

const NAV_LINKS: { href: string; labelKey: Parameters<ReturnType<typeof useLanguage>["t"]>[0]; icon: LucideIcon; roles?: string[] }[] = [
  { href: "/projects", labelKey: "nav.projects", icon: FolderKanban },
  { href: "/students", labelKey: "nav.studentDirectory", icon: Users, roles: ["professor", "company", "staff"] },
  { href: "/teammates", labelKey: "nav.findTeammates", icon: Users, roles: ["student"] },
  { href: "/guides", labelKey: "nav.guides", icon: BookOpen },
  { href: "/staff", labelKey: "nav.staffDashboard", icon: LayoutDashboard, roles: ["staff"] },
  { href: "/professor", labelKey: "nav.mySupervision", icon: GraduationCap, roles: ["professor"] },
  { href: "/company", labelKey: "nav.myCompany", icon: Building2, roles: ["company"] },
  { href: "/student", labelKey: "nav.myApplications", icon: ClipboardList, roles: ["student"] },
];

// trailingSlash is enabled (next.config.ts), so usePathname() returns paths
// like "/projects/" — normalize before comparing against hrefs, and treat a
// nested route (e.g. "/projects/detail") as still under its parent tab.
function normalize(path: string) {
  return path.length > 1 ? path.replace(/\/$/, "") : path;
}

export function NavBar() {
  const { currentUser, setCurrentUserId } = useCurrentUser();
  const { locale, setLocale, t } = useLanguage();
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
          {/* eslint-disable-next-line @next/next/no-img-element -- static SVG, no next/image benefit */}
          <img src={withBasePath("/logo-mark-white.svg")} alt="" aria-hidden="true" className="h-6 w-6" />
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
                {t(link.labelKey)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center overflow-hidden rounded-md border border-primary-foreground/30 text-xs font-medium">
          {(["en", "de"] as Locale[]).map((l) => (
            <button
              key={l}
              onClick={() => setLocale(l)}
              aria-label={`${t("nav.language")}: ${l.toUpperCase()}`}
              aria-pressed={locale === l}
              className={cn(
                "px-2 py-1.5 uppercase transition-colors",
                locale === l
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "text-primary-foreground/60 hover:bg-primary-foreground/10 hover:text-primary-foreground/90"
              )}
            >
              {l}
            </button>
          ))}
        </div>

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
              <PopoverDescription>{t("nav.signedInSession")}</PopoverDescription>
              <Badge variant="secondary" className="w-fit">
                {roleLabel(currentUser.role, t)}
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
                {t("nav.signOut")}
              </Button>
            </PopoverContent>
          </Popover>
        ) : (
          <Link href="/login" className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "gap-1.5")}>
            <UserRound className="size-4" />
            {t("nav.signIn")}
          </Link>
        )}
      </div>
    </header>
  );
}
