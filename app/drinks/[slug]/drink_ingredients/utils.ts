export const VOLUME_UNITS = ["tsp", "tbsp", "oz", "ml"] as const;
export type VolumeUnit = (typeof VOLUME_UNITS)[number];

export function toTsp(qty: number, unit: VolumeUnit): number {
  switch (unit) {
    case "tsp":  return qty;
    case "tbsp": return qty * 3;
    case "oz":   return qty * 6;
    case "ml":   return (qty / 29.574) * 6;
  }
}

export function fromTsp(tsp: number, unit: VolumeUnit): number {
  switch (unit) {
    case "tsp":  return tsp;
    case "tbsp": return tsp / 3;
    case "oz":   return tsp / 6;
    case "ml":   return (tsp / 6) * 29.574;
  }
}

export function smartUnit(tspTotal: number): VolumeUnit {
  if (tspTotal >= 192) return "ml";
  if (tspTotal >= 6)   return "oz";
  if (tspTotal >= 3)   return "tbsp";
  return "tsp";
}

export function formatQty(val: number): string {
  const fracs: [number, string][] = [
    [0.125, "⅛"], [0.25, "¼"], [0.33, "⅓"],
    [0.5, "½"], [0.67, "⅔"], [0.75, "¾"],
  ];
  const whole = Math.floor(val);
  const rem = val - whole;
  for (const [dec, sym] of fracs) {
    if (Math.abs(rem - dec) < 0.04) {
      return (whole ? `${whole} ` : "") + sym;
    }
  }
  return parseFloat(val.toFixed(2)).toString();
}

export const getStepForUnit = (unit: string): number => {
  switch (unit) {
    case "oz":
    case "tsp":
    case "tbsp":
    case "cup":
    case "part":
      return 0.25;
    case "ml":
      return 1;
    case "dash":
    case "slice":
    case "wedge":
    case "piece":
    case "pinch":
    case "drop":
    case "splash":
      return 1;
    case "shot":
    case "glass":
      return 0.5;
    default:
      return 1;
  }
};
