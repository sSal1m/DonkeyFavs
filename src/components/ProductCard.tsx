"use client";

import React from "react";
import Link from "next/link";
import { useCompare } from "@/context/CompareContext";
import { useVariant } from "@/context/VariantContext";
import { formatCapacity, formatValue } from "@/lib/helpers";
import type { Model } from "@/lib/helpers";

interface ProductCardProps {
  model: Model;
}

export default function ProductCard({ model }: ProductCardProps) {
  const { toggleCompare, isInCompare } = useCompare();
  const { getActiveVariant, setActiveVariant } = useVariant();

  const activeIdx = getActiveVariant(model.slug);
  const variant = model.variants[activeIdx] || model.variants[0];
  const inCompare = isInCompare(model.slug);

  return (
    <div className="glass-card flex flex-col overflow-hidden">
      {/* Image placeholder */}
      <div className="relative flex h-48 items-center justify-center bg-navy-card">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://placehold.co/600x400/0d2137/00d4ff?text=${encodeURIComponent(model.name.split(" ").slice(0, 2).join(" "))}`}
          alt={model.name}
          className="h-full w-full object-cover opacity-80 transition-opacity hover:opacity-100"
          loading="lazy"
        />
        {inCompare && (
          <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-accent text-navy-darkest">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {/* Name */}
        <h3 className="mb-2 text-base font-bold leading-tight text-text-primary sm:text-lg">
          {model.name}
        </h3>

        {/* Variant pills */}
        {model.variants.length > 1 && (
          <div className="relative z-50 mb-3 flex flex-wrap gap-2">
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
        )}

        {model.variants.length === 1 && (
          <div className="mb-3">
            <span className="inline-block rounded-full bg-navy-card px-3 py-1 text-xs font-semibold text-accent">
              {formatCapacity(variant.capacity)}
            </span>
          </div>
        )}

        {/* Quick specs */}
        <div className="mb-4 space-y-1 text-sm text-text-secondary">
          <p>
            <span className="text-text-muted">Kapak: </span>
            {formatValue(model.lidType)}
          </p>
          <p>
            <span className="text-text-muted">Ağırlık: </span>
            {formatValue(variant.weight)}
          </p>
        </div>

        {/* Actions */}
        <div className="relative z-50 mt-auto flex gap-2">
          <Link
            href={`/product/${model.slug}`}
            className="btn-touch btn-primary flex-1 text-center text-sm"
          >
            Detaylar
          </Link>
          <button
            type="button"
            onClick={() => toggleCompare(model.slug)}
            className={`btn-touch flex-1 text-sm ${
              inCompare ? "btn-active" : "btn-outline"
            }`}
          >
            {inCompare ? "✓ Eklendi" : "Karşılaştır"}
          </button>
        </div>
      </div>
    </div>
  );
}
