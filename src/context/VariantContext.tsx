"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

interface VariantContextType {
  activeVariants: Record<string, number>;
  setActiveVariant: (slug: string, index: number) => void;
  getActiveVariant: (slug: string) => number;
}

const VariantContext = createContext<VariantContextType | undefined>(undefined);

const STORAGE_KEY = "donkeyfavs-active-variants";

export function VariantProvider({ children }: { children: React.ReactNode }) {
  const [activeVariants, setActiveVariants] = useState<Record<string, number>>({});

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === "object") {
          setActiveVariants(parsed);
        }
      }
    } catch (err) {
      console.error("[DonkeyFavs] localStorage read error (variants):", err);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(activeVariants));
    } catch (err) {
      console.error("[DonkeyFavs] localStorage write error (variants):", err);
    }
  }, [activeVariants]);

  const setActiveVariant = useCallback((slug: string, index: number) => {
    setActiveVariants((prev) => ({ ...prev, [slug]: index }));
  }, []);

  const getActiveVariant = useCallback(
    (slug: string) => activeVariants[slug] ?? 0,
    [activeVariants]
  );

  return (
    <VariantContext.Provider value={{ activeVariants, setActiveVariant, getActiveVariant }}>
      {children}
    </VariantContext.Provider>
  );
}

export function useVariant() {
  const ctx = useContext(VariantContext);
  if (!ctx) throw new Error("useVariant must be used within VariantProvider");
  return ctx;
}
