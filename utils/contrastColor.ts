/**
 * Returns "text-white" or "text-black" based on the perceived luminance of a
 * hex, rgb(), or named-color string, so text remains readable on any background.
 *
 * Falls back to "text-foreground" when the color can't be parsed.
 */
export function contrastColor(background: string): "text-white" | "text-black" | "text-foreground" {
  const rgb = parseColor(background);
  if (!rgb) return "text-foreground";

  // Relative luminance per WCAG 2.1
  const [r, g, b] = rgb.map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  const L = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  // Contrast against white (L=1) vs black (L=0); pick whichever wins
  const onWhite = (1 + 0.05) / (L + 0.05);
  const onBlack = (L + 0.05) / (0 + 0.05);
  return onWhite >= onBlack ? "text-white" : "text-black";
}

/** Parse a color string into [r, g, b] (0-255). Returns null on failure. */
function parseColor(color: string): [number, number, number] | null {
  const s = color.trim();

  // #rgb / #rrggbb
  const hex = s.match(/^#([0-9a-f]{3,8})$/i)?.[1];
  if (hex) {
    const expanded =
      hex.length === 3 || hex.length === 4
        ? hex
            .slice(0, 3)
            .split("")
            .map((c) => c + c)
            .join("")
        : hex.slice(0, 6);
    const n = parseInt(expanded, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  // rgb() / rgba()
  const rgbMatch = s.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (rgbMatch) {
    return [Number(rgbMatch[1]), Number(rgbMatch[2]), Number(rgbMatch[3])];
  }

  // Named colors via a temporary canvas element (browser only)
  if (typeof document !== "undefined") {
    const ctx = document.createElement("canvas").getContext("2d");
    if (ctx) {
      ctx.fillStyle = s;
      const computed = ctx.fillStyle; // resolves to #rrggbb or rgba(...)
      if (computed !== s) return parseColor(computed);
    }
  }

  return null;
}
