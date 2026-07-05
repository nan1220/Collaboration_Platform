"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCurrentUser } from "@/lib/current-user";
import { buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const NAV_LINKS: { href: string; label: string; roles?: string[] }[] = [
  { href: "/projects", label: "Projects" },
  { href: "/guides", label: "Guides" },
  { href: "/teammates", label: "Find teammates", roles: ["student"] },
  { href: "/organizer", label: "Organizer", roles: ["organizer"] },
  { href: "/professor", label: "My supervision", roles: ["professor"] },
  { href: "/student", label: "My applications", roles: ["student"] },
];

export function NavBar() {
  const { users, currentUser, setCurrentUserId } = useCurrentUser();
  const pathname = usePathname();

  const links = NAV_LINKS.filter(
    (link) => !link.roles || (currentUser && link.roles.includes(currentUser.role))
  );

  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-3">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          Collaboration Platform
        </Link>

        <nav className="flex flex-1 flex-wrap items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                buttonVariants({ variant: pathname === link.href ? "secondary" : "ghost", size: "sm" })
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link href="/submit" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
          Submit a project (company)
        </Link>

        <div className="flex items-center gap-2">
          {currentUser && (
            <Badge variant="secondary" className="capitalize">
              {currentUser.role}
            </Badge>
          )}
          <Select
            value={currentUser ? String(currentUser.id) : undefined}
            onValueChange={(value) => setCurrentUserId(value ? Number(value) : null)}
          >
            <SelectTrigger size="sm" className="min-w-40">
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
