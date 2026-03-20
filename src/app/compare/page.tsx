"use client";

import React from "react";
import Link from "next/link";
import { useCompare } from "@/context/CompareContext";
import { useVariant } from "@/context/VariantContext";
import { getModelBySlug, formatCapacity, formatValue } from "@/lib/helpers";
import type { Model } from "@/lib/helpers";
import TermosRadarChart from "@/components/TermosRadarChart";
import FateFlip from "@/components/FateFlip";

const SPEC_ROWS = [
  { key: "capacity", label: "Kapasite" },
  { key: "heatRetention", label: "Isı Koruması" },
  { key: "lidType", label: "Kapak Tipi" },
  { key: "weight", label: "Ağırlık" },
  { key: "leakProof", label: "Sızdırmazlık" },
  { key: "dimensions", label: "Boyutlar" },
] as const;

function getSpecValue(model: Model, variantIdx: number, key: string): string {
  const variant = model.variants[variantIdx] || model.variants[0];
  switch (key) {
    case "capacity":
      return formatCapacity(variant.capacity);
    case "heatRetention":
      return formatValue(variant.heatRetention);
    case "lidType":
      return formatValue(model.lidType);
    case "weight":
      return formatValue(variant.weight);
    case "leakProof":
      return formatValue(model.leakProof);
    case "dimensions":
      return formatValue(variant.dimensions);
    default:
      return "-";
  }
}

export default function ComparePage() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const { getActiveVariant, setActiveVariant } = useVariant();
  const [highlightedIndex, setHighlightedIndex] = React.useState<number | null>(null);

  const models = compareList
    .map((slug) => getModelBySlug(slug))
    .filter(Boolean) as Model[];

  if (models.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <span className="mb-4 text-6xl">📊</span>
        <h1 className="mb-2 text-2xl font-bold text-text-primary">
          Karşılaştırma Listesi Boş
        </h1>
        <p className="mb-6 max-w-md text-text-secondary">
          Ürün kartlarındaki &quot;Karşılaştır&quot; butonuna tıklayarak buraya ürün ekleyebilirsiniz.
        </p>
        <Link href="/" className="btn-touch btn-accent">
          Ürünleri Keşfet
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-text-primary sm:text-2xl">
              Ürün Karşılaştırma
            </h1>
            <p className="text-sm text-text-muted">
              {models.length} ürün karşılaştırılıyor
            </p>
          </div>
          <div className="relative z-50 flex gap-2">
            <Link href="/" className="btn-touch btn-primary text-sm">
              + Ürün Ekle
            </Link>
            <button
              type="button"
              onClick={() => clearCompare()}
              className="btn-touch btn-outline text-sm !text-danger !border-danger hover:!bg-danger/10"
            >
              Temizle
            </button>
          </div>
        </div>

        {/* Radar Chart (For 2 or more items) */}
        {models.length >= 2 && (
          <TermosRadarChart
            models={models}
            activeVariants={models.map((m) => getActiveVariant(m.slug))}
          />
        )}

        <FateFlip
          modelsCount={models.length}
          onDecision={setHighlightedIndex}
        />

        {/* Comparison Table */}
        <div className="glass-card overflow-hidden p-0">
          <div className="compare-table-wrapper">
            <table className="w-full min-w-max text-sm">
              <thead>
                <tr className="border-b border-navy-border">
                  <th className="min-w-[120px] max-w-[140px] border-r border-navy-border bg-navy-surface px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-text-muted sm:min-w-[160px]">
                    Özellik
                  </th>
                  {models.map((model, idx) => (
                    <th
                      key={model.slug}
                      className={`min-w-[200px] px-4 py-4 text-left sm:min-w-[240px] transition-all duration-700 ${
                        highlightedIndex === idx
                          ? "glow-winner relative z-10 rounded-t-xl"
                          : ""
                      }`}
                    >
                      <div className="flex flex-col gap-2">
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            href={`/product/${model.slug}`}
                            className="text-sm font-bold leading-tight text-text-primary transition-colors hover:text-accent"
                          >
                            {model.name}
                          </Link>
                          <button
                            type="button"
                            onClick={() => removeFromCompare(model.slug)}
                            className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-danger/20 hover:text-danger"
                            aria-label={`${model.name} ürününü kaldır`}
                          >
                            ✕
                          </button>
                        </div>
                        {model.variants.length > 1 && (
                          <div className="relative z-50 flex flex-wrap gap-1">
                            {model.variants.map((v, i) => {
                              const active = getActiveVariant(model.slug) === i;
                              return (
                                <button
                                  key={v.capacity}
                                  type="button"
                                  onClick={() => setActiveVariant(model.slug, i)}
                                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all ${
                                    active
                                      ? "bg-accent text-navy-darkest shadow-sm"
                                      : "bg-navy-card text-text-muted hover:text-accent border border-navy-border"
                                  }`}
                                >
                                  {formatCapacity(v.capacity)}
                                </button>
                              );
                            })}
                          </div>
                        )}
                        {model.variants.length === 1 && (
                          <span className="inline-block rounded-full bg-accent/10 px-2.5 py-1 text-[11px] font-semibold text-accent">
                            {formatCapacity(model.variants[0].capacity)}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SPEC_ROWS.map((spec, rowIdx) => (
                  <tr
                    key={spec.key}
                    className={`border-b border-navy-border/50 ${
                      rowIdx % 2 === 0 ? "bg-navy-surface/30" : ""
                    }`}
                  >
                    <td className="min-w-[120px] max-w-[140px] border-r border-navy-border px-4 py-3 font-medium text-text-muted whitespace-nowrap sm:min-w-[160px]">
                      {spec.label}
                    </td>
                    {models.map((model, mIdx) => {
                      const activeIdx = getActiveVariant(model.slug);
                      return (
                        <td
                          key={model.slug}
                          className={`min-w-[200px] px-4 py-3 text-text-primary sm:min-w-[240px] transition-all duration-700 ${
                            highlightedIndex === mIdx
                              ? "glow-winner relative z-10 border-l border-r border-accent " +
                                (rowIdx === SPEC_ROWS.length - 1
                                  ? "rounded-b-xl border-b"
                                  : "")
                              : ""
                          }`}
                        >
                          {getSpecValue(model, activeIdx, spec.key)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
