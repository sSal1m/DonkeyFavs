"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getModelBySlug, formatCapacity, formatValue } from "@/lib/helpers";
import { useCompare } from "@/context/CompareContext";
import { useVariant } from "@/context/VariantContext";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const model = getModelBySlug(slug);

  const { toggleCompare, isInCompare } = useCompare();
  const { getActiveVariant, setActiveVariant } = useVariant();

  if (!model) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <span className="mb-4 text-6xl">🔍</span>
        <h1 className="mb-2 text-2xl font-bold text-text-primary">Ürün Bulunamadı</h1>
        <p className="mb-6 text-text-secondary">Aradığınız ürün mevcut değil.</p>
        <Link href="/" className="btn-touch btn-accent">
          Ana Sayfaya Dön
        </Link>
      </div>
    );
  }

  const activeIdx = getActiveVariant(model.slug);
  const variant = model.variants[activeIdx] || model.variants[0];
  const inCompare = isInCompare(model.slug);

  const specs = [
    { label: "Kapasite", value: formatCapacity(variant.capacity) },
    { label: "Isı Koruması", value: formatValue(variant.heatRetention) },
    { label: "Kapak Tipi", value: formatValue(model.lidType) },
    { label: "Ağırlık", value: formatValue(variant.weight) },
    { label: "Sızdırmazlık", value: formatValue(model.leakProof) },
    { label: "Boyutlar (YxGxD)", value: formatValue(variant.dimensions) },
  ];

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-text-muted">
          <Link href="/" className="transition-colors hover:text-accent">
            Ana Sayfa
          </Link>
          <span>/</span>
          <span className="text-text-secondary">{model.name}</span>
        </nav>

        {/* Mobile-first: Image on top, then specs. Desktop: side by side */}
        <div className="grid gap-6 md:grid-cols-2 md:gap-10">
          {/* Image */}
          <div className="glass-card flex items-center justify-center overflow-hidden p-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://placehold.co/600x500/0d2137/00d4ff?text=${encodeURIComponent(model.name.split(" ").slice(0, 2).join(" "))}`}
              alt={model.name}
              className="h-auto w-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <h1 className="mb-2 text-2xl font-extrabold leading-tight text-text-primary sm:text-3xl">
              {model.name}
            </h1>

            {/* Variant Selector */}
            {model.variants.length > 1 && (
              <div className="relative z-50 mb-6">
                <p className="mb-2 text-sm font-medium text-text-muted">
                  Hacim Seçin
                </p>
                <div className="flex flex-wrap gap-2">
                  {model.variants.map((v, i) => (
                    <button
                      key={v.capacity}
                      type="button"
                      onClick={() => setActiveVariant(model.slug, i)}
                      className={`variant-pill ${activeIdx === i ? "active" : ""}`}
                    >
                      {formatCapacity(v.capacity)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {model.variants.length === 1 && (
              <div className="mb-6">
                <span className="inline-block rounded-full bg-accent/10 px-4 py-1.5 text-sm font-semibold text-accent">
                  {formatCapacity(variant.capacity)}
                </span>
              </div>
            )}

            {/* Specs Table */}
            <div className="glass-card mb-6 overflow-hidden p-0">
              <table className="w-full text-sm">
                <tbody>
                  {specs.map((spec, i) => (
                    <tr
                      key={spec.label}
                      className={
                        i % 2 === 0
                          ? "bg-navy-surface/50"
                          : "bg-navy-card/30"
                      }
                    >
                      <td className="px-4 py-3 font-medium text-text-muted whitespace-nowrap">
                        {spec.label}
                      </td>
                      <td className="px-4 py-3 text-text-primary">
                        {spec.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Actions */}
            <div className="relative z-50 flex gap-3">
              <button
                type="button"
                onClick={() => toggleCompare(model.slug)}
                className={`btn-touch flex-1 text-sm sm:flex-none ${
                  inCompare ? "btn-active" : "btn-accent"
                }`}
              >
                {inCompare ? "✓ Karşılaştırmada" : "Karşılaştırmaya Ekle"}
              </button>
              <Link
                href="/compare"
                className="btn-touch btn-outline flex-1 text-center text-sm sm:flex-none"
              >
                Karşılaştırma Sayfası
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
