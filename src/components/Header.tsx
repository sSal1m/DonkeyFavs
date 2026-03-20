"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCompare } from "@/context/CompareContext";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { compareList } = useCompare();

  return (
    <header className="sticky top-0 z-50 border-b border-navy-border bg-navy-darkest/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight text-text-primary" onClick={() => setMenuOpen(false)}>
          <span className="text-2xl">🫏</span>
          <span className="gradient-text text-xl">DonkeyFavs</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/" className="text-sm font-medium text-text-secondary transition-colors hover:text-accent">
            Ana Sayfa
          </Link>
          <Link
            href="/compare"
            className="btn-touch btn-outline relative text-sm"
          >
            Karşılaştır
            {compareList.length > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-navy-darkest">
                {compareList.length}
              </span>
            )}
          </Link>
        </nav>

        {/* Mobile: Compare badge + Hamburger */}
        <div className="flex items-center gap-3 md:hidden">
          <Link
            href="/compare"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-navy-border text-text-secondary transition-colors hover:border-accent hover:text-accent"
            onClick={() => setMenuOpen(false)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 20V10" /><path d="M12 20V4" /><path d="M6 20v-6" />
            </svg>
            {compareList.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-navy-darkest">
                {compareList.length}
              </span>
            )}
          </Link>

          <button
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-navy-border text-text-secondary transition-colors hover:border-accent hover:text-accent"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menü"
          >
            {menuOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18" /><path d="m6 6 12 12" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="border-t border-navy-border bg-navy-darkest/95 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col gap-1 px-4 py-3">
            <Link
              href="/"
              className="rounded-xl px-4 py-3 text-sm font-medium text-text-secondary transition-colors hover:bg-navy-card hover:text-accent"
              onClick={() => setMenuOpen(false)}
            >
              Ana Sayfa
            </Link>
            <Link
              href="/compare"
              className="rounded-xl px-4 py-3 text-sm font-medium text-text-secondary transition-colors hover:bg-navy-card hover:text-accent"
              onClick={() => setMenuOpen(false)}
            >
              Karşılaştır {compareList.length > 0 && `(${compareList.length})`}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
