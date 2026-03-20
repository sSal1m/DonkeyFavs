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
  imageUrl?: string;
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

export function parseHeatRetention(text: string) {
  const parse = (label: string) => {
    const regex = new RegExp(`${label}:?[~\\s]*([\\d.]+)`, "i");
    const match = text.match(regex);
    return match ? parseFloat(match[1]) : 0;
  };
  return {
    hot: parse("Sıcak"),
    cold: parse("Soğuk"),
    iced: parse("Buz"),
  };
}

export function parseWeight(text: string): number {
  if (!text || text === "-" || text === "veri yok") return 0;
  const match = text.match(/([\d.]+)/);
  return match ? parseFloat(match[1]) : 0;
}

export function getRadarDataProps(models: Model[], activeVariants: number[]) {
  const allModels = getAllModels();
  let maxCap = 0, maxHot = 0, maxCold = 0, maxIced = 0, maxWeight = 0, minWeight = Infinity;
  let minCap = Infinity;

  allModels.forEach(m => {
    m.variants.forEach(v => {
      if (v.capacity > maxCap) maxCap = v.capacity;
      if (v.capacity < minCap) minCap = v.capacity;

      const hr = parseHeatRetention(v.heatRetention);
      if (hr.hot > maxHot) maxHot = hr.hot;
      if (hr.cold > maxCold) maxCold = hr.cold;
      if (hr.iced > maxIced) maxIced = hr.iced;

      const w = parseWeight(v.weight);
      if (w > maxWeight) maxWeight = w;
      if (w > 0 && w < minWeight) minWeight = w;
    });
  });

  if (minWeight === Infinity) minWeight = 0;

  const normalize = (val: number, min: number, max: number) => {
    if (max === min) return 50;
    if (val < min) val = min;
    if (val > max) val = max;
    return ((val - min) / (max - min)) * 100;
  };

  const getVariant = (model: Model, idx: number) => model.variants[idx] || model.variants[0];

  const result = [
    { subject: "Kapasite" } as Record<string, any>,
    { subject: "Sıcak" } as Record<string, any>,
    { subject: "Soğuk" } as Record<string, any>,
    { subject: "Buzlu" } as Record<string, any>,
    { subject: "Hafiflik" } as Record<string, any>,
  ];

  const maxLight = maxWeight - minWeight;

  models.forEach((m, i) => {
    const v = getVariant(m, activeVariants[i] || 0);
    const hr = parseHeatRetention(v.heatRetention);
    const w = parseWeight(v.weight);
    const light = w > 0 ? maxWeight - w : 0;

    result[0][i] = normalize(v.capacity, 0, maxCap);
    result[0][`real_${i}`] = formatCapacity(v.capacity);

    result[1][i] = normalize(hr.hot, 0, maxHot);
    result[1][`real_${i}`] = hr.hot > 0 ? `${hr.hot}s` : "-";

    result[2][i] = normalize(hr.cold, 0, maxCold);
    result[2][`real_${i}`] = hr.cold > 0 ? `${hr.cold}s` : "-";

    result[3][i] = normalize(hr.iced, 0, maxIced);
    result[3][`real_${i}`] = hr.iced > 0 ? `${hr.iced}s` : "-";

    result[4][i] = normalize(light, 0, maxLight);
    result[4][`real_${i}`] = w > 0 ? `${w}g` : "-";
  });

  return result;
}
