/** Сколько экранных страниц в колонках: зазор между колонками входит в шаг, но не в последнюю страницу. */
export function pageCountFromWidths(scrollWidth: number, stride: number, gap: number): number {
  if (stride <= 0) return 1
  const raw = (scrollWidth + gap) / stride
  if (!Number.isFinite(raw) || raw <= 1) return 1
  return Math.max(1, Math.round(raw))
}

export function pageIndexFromRatio(ratio: number, count: number): number {
  if (count <= 1) return 0
  const clamped = Number.isFinite(ratio) ? Math.min(1, Math.max(0, ratio)) : 0
  return Math.round(clamped * (count - 1))
}

export function ratioFromPage(index: number, count: number): number {
  if (count <= 1) return 1
  const clamped = Math.min(count - 1, Math.max(0, index))
  return Math.round((clamped / (count - 1)) * 100) / 100
}
