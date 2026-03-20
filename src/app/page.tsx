"use client";

import React from "react";
import ProductCard from "@/components/ProductCard";
import { getAllModels } from "@/lib/helpers";

export default function HomePage() {
  const models = getAllModels();

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

      {/* Product Grid */}
      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-xl font-bold text-text-primary sm:text-2xl">
              Tüm Modeller
              <span className="ml-2 text-sm font-normal text-text-muted">
                ({models.length} ürün)
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {models.map((model) => (
              <ProductCard key={model.slug} model={model} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
