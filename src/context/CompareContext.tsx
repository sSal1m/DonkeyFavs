"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

interface CompareContextType {
  compareList: string[];
  addToCompare: (slug: string) => void;
  removeFromCompare: (slug: string) => void;
  toggleCompare: (slug: string) => void;
  clearCompare: () => void;
  isInCompare: (slug: string) => boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

const STORAGE_KEY = "donkeyfavs-compare-list";
const MAX_COMPARE = 4;

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [compareList, setCompareList] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setCompareList(parsed);
        }
      }
    } catch (err) {
      console.error("[DonkeyFavs] localStorage read error (compare):", err);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(compareList));
    } catch (err) {
      console.error("[DonkeyFavs] localStorage write error (compare):", err);
    }
  }, [compareList]);

  const addToCompare = useCallback((slug: string) => {
    setCompareList((prev) => {
      if (prev.includes(slug) || prev.length >= MAX_COMPARE) return prev;
      return [...prev, slug];
    });
  }, []);

  const removeFromCompare = useCallback((slug: string) => {
    setCompareList((prev) => prev.filter((s) => s !== slug));
  }, []);

  const toggleCompare = useCallback((slug: string) => {
    setCompareList((prev) => {
      if (prev.includes(slug)) return prev.filter((s) => s !== slug);
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, slug];
    });
  }, []);

  const clearCompare = useCallback(() => {
    setCompareList([]);
  }, []);

  const isInCompare = useCallback(
    (slug: string) => compareList.includes(slug),
    [compareList]
  );

  return (
    <CompareContext.Provider
      value={{ compareList, addToCompare, removeFromCompare, toggleCompare, clearCompare, isInCompare }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within CompareProvider");
  return ctx;
}
