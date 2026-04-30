export const THUMBNAIL_COLORS = [
  "bg-gradient-to-br from-amber-400 to-amber-700",
  "bg-gradient-to-br from-blue-400 to-blue-700",
  "bg-gradient-to-br from-emerald-400 to-emerald-700",
  "bg-gradient-to-br from-rose-400 to-rose-600",
  "bg-gradient-to-br from-violet-400 to-violet-700",
  "bg-gradient-to-br from-cyan-400 to-cyan-700",
  "bg-gradient-to-br from-orange-400 to-orange-600",
  "bg-gradient-to-br from-teal-400 to-teal-700",
] as const;

export function thumbnailColor(name: string): string {
  if (!name) return THUMBNAIL_COLORS[0];
  return THUMBNAIL_COLORS[name.charCodeAt(0) % THUMBNAIL_COLORS.length];
}
