export interface PaginationRange {
  from: number;
  to: number;
}

export function calculateRange(page: number, limit: number): PaginationRange {
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  return { from, to };
}
