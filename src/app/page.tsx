"use client";

import React, { useState, useMemo, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import FilterPanel, { FilterState, defaultFilters } from "@/components/FilterPanel";
import { getAllModels, parseHeatRetention, parsePriceNumber } from "@/lib/helpers";

export default function HomePage() {
  const models = getAllModels();
  
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  // Derive filter constraints
  const { availableCapacities, availableLidTypes, maxPossiblePrice } = useMemo(() => {
    const caps = new Set<number>();
    const lids = new Set<string>();
    let maxPrice = 5000;

    models.forEach(m => {
      if (m.lidType && m.lidType !== "-" && m.lidType !== "veri yok") {
        lids.add(m.lidType);
      }
      m.variants.forEach(v => {
        caps.add(v.capacity);
        const p = parsePriceNumber(v.price);
        if (p > maxPrice) maxPrice = p;
      });
    });

    return {
      availableCapacities: Array.from(caps).sort((a, b) => a - b),
      availableLidTypes: Array.from(lids).sort(),
      maxPossiblePrice: maxPrice,
    };
  }, [models]);

  useEffect(() => {
    setFilters(p => ({ ...p, priceMax: maxPossiblePrice }));
  }, [maxPossiblePrice]);

  const filteredModels = useMemo(() => {
    return models.filter(m => {
      // 1. Model Level Check: Lid Type
      if (filters.lidTypes.length > 0) {
        if (!filters.lidTypes.includes(m.lidType)) return false;
      }

      // 2. Variant Level Checks
      // Model passes if AT LEAST ONE variant matches all variant-specific criteria
      return m.variants.some(v => {
        // capacity check
        if (filters.capacities.length > 0 && !filters.capacities.includes(v.capacity)) {
          return false;
        }
        
        // price check
        const p = parsePriceNumber(v.price);
        if (p > 0) {
           if (p < filters.priceMin || p > filters.priceMax) return false;
        } else {
           // If 'Stokta Yok' (0), hide if user actively filters price
           if (filters.priceMin > 0 || filters.priceMax < maxPossiblePrice) {
               return false;
           }
        }

        // performance check
        const hr = parseHeatRetention(v.heatRetention);
        if (hr.hot < filters.minHot) return false;
        if (hr.cold < filters.minCold) return false;
        if (hr.iced < filters.minIced) return false;

        return true;
      });
    });
  }, [models, filters, maxPossiblePrice]);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-navy-dark via-navy-darkest to-navy-surface" />
          <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-navy/30 blur-[120px]" />
          <div className="absolute bottom-0 right-0 h-[400px] w-[400px] translate-x-1/4 translate-y-1/4 rounded-full bg-accent/5 blur-[100px]" />
        </div>

        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-block rounded-full border border-navy-border bg-navy-card/50 px-4 py-1.5 text-xs font-medium text-accent">
            🫏 Eşşeklere Özel Termos Karşılaştırma Platformu
          </div>
          <h1 className="mb-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            <span className="gradient-text">DonkeyFavs</span>
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-text-secondary sm:text-lg">
            Sana en uygun termosu bul.
          </p>
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-xl font-bold text-text-primary sm:text-2xl">
              Tüm Modeller
              <span className="ml-2 text-sm font-normal text-text-muted">
                ({filteredModels.length} ürün bulundu)
              </span>
            </h2>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start relative">
            
            {/* Filter Panel (Desktop aside + Mobile Modal) */}
            <FilterPanel 
              filters={filters} 
              setFilters={setFilters} 
              availableCapacities={availableCapacities}
              availableLidTypes={availableLidTypes}
              maxPossiblePrice={maxPossiblePrice}
            />

            {/* Product Grid */}
            <div className="flex-1 w-full">
              {filteredModels.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 sm:gap-6">
                  {filteredModels.map((model) => (
                    <ProductCard key={model.slug} model={model} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-navy-border bg-navy-card/50 py-20 text-center">
                  <span className="mb-4 text-4xl">🫥</span>
                  <p className="text-lg font-bold text-text-primary">Eşleşen ürün bulunamadı.</p>
                  <p className="mt-2 text-text-muted">Lütfen filtreleri esnetmeyi deneyin.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
