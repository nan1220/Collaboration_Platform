"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FolderKanban,
  BookOpen,
  Users,
  LayoutDashboard,
  GraduationCap,
  ClipboardList,
  Building2,
  type LucideIcon,
} from "lucide-react";
import { useCurrentUser } from "@/lib/current-user";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
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
  const { users, currentUser, setCurrentUserId } = useCurrentUser();
  const pathname = usePathname();
  const currentPath = normalize(pathname);

  const links = NAV_LINKS.filter(
    (link) => !link.roles || (currentUser && link.roles.includes(currentUser.role))
  );

  return (
    <header className="sticky top-0 z-40 bg-primary text-primary-foreground shadow-md shadow-black/10">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <span className="flex flex-col items-start rounded-[2px] bg-white px-2 py-1 leading-none shadow-sm">
            <span className="text-base font-extrabold tracking-tight text-primary">TUM</span>
            <span className="mt-0.5 text-[8px] font-medium tracking-wide text-[#20252a]/70 uppercase">
              Technical University of Munich
            </span>
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

        <div className="flex items-center gap-2">
          {currentUser && (
            <Badge variant="secondary" className="capitalize shadow-xs">
              {currentUser.role}
            </Badge>
          )}
          <Select
            items={users.map((user) => ({ value: String(user.id), label: `${user.name} (${user.role})` }))}
            value={currentUser ? String(currentUser.id) : ""}
            onValueChange={(value) => setCurrentUserId(value ? Number(value) : null)}
          >
            <SelectTrigger
              size="sm"
              className="min-w-40 border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground data-placeholder:text-primary-foreground/70 [&_svg]:text-primary-foreground/80"
            >
              <SelectValue placeholder="Select demo user" />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={String(user.id)}>
                  {user.name} ({user.role})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </header>
  );
}
