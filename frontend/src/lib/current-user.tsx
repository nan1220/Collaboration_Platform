"use client";

import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from "react";
import { api } from "./api";
import type { UserSummary } from "./types";

const STORAGE_KEY = "collab-platform-demo-user-id";

interface CurrentUserContextValue {
  users: UserSummary[];
  currentUser: UserSummary | null;
  setCurrentUserId: (id: number | null) => void;
  isLoading: boolean;
}

const CurrentUserContext = createContext<CurrentUserContextValue | null>(null);

export function CurrentUserProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<number | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) setUserId(Number(stored));
    setHydrated(true);
  }, []);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["demo-users"],
    queryFn: api.demoUsers,
  });

  const setCurrentUserId = (id: number | null) => {
    setUserId(id);
    if (id) window.localStorage.setItem(STORAGE_KEY, String(id));
    else window.localStorage.removeItem(STORAGE_KEY);
  };

  const currentUser = hydrated ? users.find((u) => u.id === userId) ?? null : null;

  return (
    <CurrentUserContext.Provider value={{ users, currentUser, setCurrentUserId, isLoading }}>
      {children}
    </CurrentUserContext.Provider>
  );
}

export function useCurrentUser() {
  const ctx = useContext(CurrentUserContext);
  if (!ctx) throw new Error("useCurrentUser must be used within CurrentUserProvider");
  return ctx;
}
