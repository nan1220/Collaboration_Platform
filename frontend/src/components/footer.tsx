import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="flex flex-col items-start rounded-[2px] bg-primary px-1.5 py-0.5 leading-none">
            <span className="text-[10px] font-extrabold tracking-tight text-primary-foreground">TUM</span>
          </span>
          <span>Collaboration Platform — a project topic database prototype.</span>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link href="/projects" className="hover:text-foreground">
            Projects
          </Link>
          <Link href="/guides" className="hover:text-foreground">
            Guides
          </Link>
          <Link href="/submit" className="hover:text-foreground">
            Submit a project
          </Link>
        </div>
      </div>
    </footer>
  );
}
