export function chapterCountLabel(count: number): string {
  const mod10 = count % 10
  const mod100 = count % 100
  if (mod10 === 1 && mod100 !== 11) return `${count} глава`
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${count} главы`
  return `${count} глав`
}

export function chapterHeading(
  number: number,
  title: string,
): { kicker: string | null; title: string } {
  const numbered = `Глава ${number}`
  if (title.trim() === numbered) return { kicker: null, title }
  return { kicker: numbered, title }
}
