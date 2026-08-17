"use client";

import { FlaskConical } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

/**
 * Wraps a demo/testing-only shortcut (e.g. instant account switching that
 * bypasses the "real" mocked login flow) so it reads as clearly separate
 * from the interface a real deployment would have - not just another
 * feature of the product.
 */
export function DevShortcut({ title, children }: { title: string; children: React.ReactNode }) {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-dashed border-amber-500/50 bg-amber-500/[0.06] p-3">
      <div className="flex items-center gap-1.5 text-xs font-medium text-amber-700 dark:text-amber-400">
        <FlaskConical className="size-3.5" />
        {title}
      </div>
      <p className="text-xs text-muted-foreground">{t("shibboleth.quickSignInDesc")}</p>
      {children}
    </div>
  );
}
