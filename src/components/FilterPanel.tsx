"use client";

import React, { useState } from "react";
import { formatCapacity } from "@/lib/helpers";

export interface FilterState {
  priceMin: number;
  priceMax: number;
  capacities: number[];
  minHot: number;
  minCold: number;
  minIced: number;
  lidTypes: string[];
}

export const defaultFilters: FilterState = {
  priceMin: 0,
  priceMax: 10000,
  capacities: [],
  minHot: 0,
  minCold: 0,
  minIced: 0,
  lidTypes: [],
};

interface FilterPanelProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  availableCapacities: number[];
  availableLidTypes: string[];
  maxPossiblePrice: number;
}

export default function FilterPanel({
  filters,
  setFilters,
  availableCapacities,
  availableLidTypes,
  maxPossiblePrice,
}: FilterPanelProps) {
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  const toggleCapacity = (cap: number) => {
    setFilters((prev) => ({
      ...prev,
      capacities: prev.capacities.includes(cap)
        ? prev.capacities.filter((c) => c !== cap)
        : [...prev.capacities, cap],
    }));
  };

  const toggleLidType = (lt: string) => {
    setFilters((prev) => ({
      ...prev,
      lidTypes: prev.lidTypes.includes(lt)
        ? prev.lidTypes.filter((l) => l !== lt)
        : [...prev.lidTypes, lt],
    }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
    setIsOpenMobile(false);
  };

  const currentMaxPrice = maxPossiblePrice || 5000;

  const FilterContent = () => (
    <div className="flex flex-col gap-6">
      {/* Price Range */}
      <div>
        <h3 className="mb-3 text-sm font-bold text-text-primary">Fiyat Aralığı (TL)</h3>
        <div className="flex flex-row items-center gap-4">
          <input
            type="number"
            min={0}
            max={currentMaxPrice}
            value={filters.priceMin || ""}
            onChange={(e) =>
              setFilters((p) => ({ ...p, priceMin: Number(e.target.value) || 0 }))
            }
            className="w-full rounded-md border border-accent/30 bg-navy-dark px-3 py-2 text-sm text-white focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="Min"
          />
          <span className="text-text-muted">-</span>
          <input
            type="number"
            min={0}
            max={currentMaxPrice}
            value={filters.priceMax || ""}
            onChange={(e) =>
              setFilters((p) => ({ ...p, priceMax: Number(e.target.value) || 0 }))
            }
            className="w-full rounded-md border border-accent/30 bg-navy-dark px-3 py-2 text-sm text-white focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="Max"
          />
        </div>
      </div>

      {/* Capacities */}
      <div>
        <h3 className="mb-3 text-sm font-bold text-text-primary">Hacim (Kapasite)</h3>
        <div className="flex flex-wrap gap-2">
          {availableCapacities.map((cap) => {
            const isActive = filters.capacities.includes(cap);
            return (
              <button
                key={cap}
                type="button"
                onClick={() => toggleCapacity(cap)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  isActive
                    ? "border-accent bg-accent text-navy-darkest shadow-[0_0_10px_rgba(0,212,255,0.3)]"
                    : "border-navy-border bg-transparent text-text-secondary hover:border-accent/50 hover:text-text-primary"
                }`}
              >
                {formatCapacity(cap)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Performance */}
      <div>
        <h3 className="mb-3 text-sm font-bold text-text-primary">Minimum Performans (Saat)</h3>
        <div className="space-y-4">
          <div>
            <div className="mb-1 flex justify-between text-xs text-text-secondary">
              <span>Sıcak</span>
              <span className="font-bold text-accent">{filters.minHot} sa</span>
            </div>
            <input
              type="range"
              min="0"
              max="24"
              value={filters.minHot}
              onChange={(e) =>
                setFilters((p) => ({ ...p, minHot: Number(e.target.value) }))
              }
              className="w-full accent-accent"
            />
          </div>
          <div>
            <div className="mb-1 flex justify-between text-xs text-text-secondary">
              <span>Soğuk</span>
              <span className="font-bold text-accent">{filters.minCold} sa</span>
            </div>
            <input
              type="range"
              min="0"
              max="36"
              value={filters.minCold}
              onChange={(e) =>
                setFilters((p) => ({ ...p, minCold: Number(e.target.value) }))
              }
              className="w-full accent-accent"
            />
          </div>
          <div>
            <div className="mb-1 flex justify-between text-xs text-text-secondary">
              <span>Buzlu</span>
              <span className="font-bold text-accent">{filters.minIced} sa</span>
            </div>
            <input
              type="range"
              min="0"
              max="48"
              value={filters.minIced}
              onChange={(e) =>
                setFilters((p) => ({ ...p, minIced: Number(e.target.value) }))
              }
              className="w-full accent-accent"
            />
          </div>
        </div>
      </div>

      {/* Lid Types */}
      {availableLidTypes.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-bold text-text-primary">Kapak Türü</h3>
          <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {availableLidTypes.map((lt) => {
              const isActive = filters.lidTypes.includes(lt);
              return (
                <label
                  key={lt}
                  className="flex cursor-pointer items-start gap-3 text-sm text-text-secondary hover:text-cyan-200 transition-colors"
                >
                  <div
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                      isActive
                        ? "border-accent bg-accent"
                        : "border-cyan-500/30 bg-navy-dark/50"
                    }`}
                  >
                    {isActive && (
                      <svg
                        className="h-3.5 w-3.5 text-navy-darkest transition-transform scale-100"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="3"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={() => toggleLidType(lt)}
                    className="hidden"
                  />
                  <span className={`leading-snug ${isActive ? "text-accent font-medium leading-tight drop-shadow-sm" : ""}`}>
                    {lt}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Reset Button */}
      <button
        type="button"
        onClick={resetFilters}
        className="mt-4 w-full rounded-lg border border-red-500/30 bg-red-500/10 py-2.5 text-sm font-bold text-red-400 transition-colors hover:bg-red-500/20"
      >
        Filtreleri Temizle
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 shrink-0">
        <div className="sticky top-24 rounded-2xl border border-navy-border/50 bg-navy-dark/40 p-6 backdrop-blur-md">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Filtreler
            </h2>
            <svg
              className="h-5 w-5 text-accent"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
          </div>
          <FilterContent />
        </div>
      </aside>

      {/* Mobile Sticky Button */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 lg:hidden">
        <button
          onClick={() => setIsOpenMobile(true)}
          className="flex items-center gap-2 rounded-full border border-cyan-400/40 bg-navy-dark/90 px-6 py-3 font-bold text-cyan-400 shadow-[0_0_20px_rgba(0,212,255,0.3)] backdrop-blur-md transition-transform active:scale-95"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          Filtrele 🔍
        </button>
      </div>

      {/* Mobile Full-Screen Modal */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 flex flex-col bg-navy-darkest/95 backdrop-blur-xl lg:hidden">
          <div className="flex items-center justify-between border-b border-navy-border p-5">
            <h2 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Filtreler
            </h2>
            <button
              onClick={() => setIsOpenMobile(false)}
              className="rounded-full bg-navy-card p-2 text-text-secondary hover:text-white"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-5 pb-32">
            <FilterContent />
          </div>
          <div className="absolute bottom-0 left-0 right-0 border-t border-navy-border bg-navy-dark/90 p-5 backdrop-blur-md">
            <button
              onClick={() => setIsOpenMobile(false)}
              className="w-full rounded-lg bg-accent py-3.5 text-base font-bold text-navy-darkest shadow-lg shadow-accent/20"
            >
              Sonuçları Göster
            </button>
          </div>
        </div>
      )}
    </>
  );
}
