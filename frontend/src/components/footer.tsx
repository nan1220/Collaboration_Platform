"use client";

import Link from "next/link";
import { withBasePath } from "@/lib/base-path";
import { useLanguage } from "@/lib/i18n";

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="border-t bg-card">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="flex items-center rounded-[2px] bg-white px-1.5 py-1 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element -- static SVG, no next/image benefit */}
            <img src={withBasePath("/tum-logo.svg")} alt="Technical University of Munich" className="h-4 w-auto" />
          </span>
          <span>{t("footer.tagline")}</span>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link href="/projects" className="hover:text-foreground">
            {t("nav.projects")}
          </Link>
          <Link href="/guides" className="hover:text-foreground">
            {t("nav.guides")}
          </Link>
          <Link href="/company" className="hover:text-foreground">
            {t("footer.submitProject")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
