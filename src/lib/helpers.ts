import modelsData from "@/data/models.json";

export interface Variant {
  capacity: number;
  heatRetention: string;
  weight: string;
  dimensions: string;
}

export interface Model {
  name: string;
  slug: string;
  lidType: string;
  leakProof: string;
  variants: Variant[];
}

export function slugify(name: string): string {
  const turkishMap: Record<string, string> = {
    ş: "s", Ş: "S", ç: "c", Ç: "C", ğ: "g", Ğ: "G",
    ü: "u", Ü: "U", ö: "o", Ö: "O", ı: "i", İ: "I",
  };

  return name
    .replace(/[®™©]/g, "")
    .replace(/[şŞçÇğĞüÜöÖıİ]/g, (ch) => turkishMap[ch] || ch)
    .toLowerCase()
    .replace(/[^a-z0-9\s.-]/g, "")
    .replace(/[\s.]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getAllModels(): Model[] {
  return modelsData as Model[];
}

export function getModelBySlug(slug: string): Model | undefined {
  return (modelsData as Model[]).find((m) => m.slug === slug);
}

export function formatValue(val: string | number | null | undefined): string {
  if (val === null || val === undefined || val === "" || val === "veri yok") {
    return "-";
  }
  return String(val);
}

export function formatCapacity(capacity: number): string {
  if (capacity >= 1) {
    return `${capacity.toFixed(2).replace(/\.?0+$/, "")} L`;
  }
  return `${(capacity * 1000).toFixed(0)} ml`;
}
