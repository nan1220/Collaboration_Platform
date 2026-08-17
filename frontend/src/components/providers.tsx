"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { CurrentUserProvider } from "@/lib/current-user";
import { LanguageProvider } from "@/lib/i18n";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <CurrentUserProvider>
          {children}
          <Toaster />
        </CurrentUserProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}
