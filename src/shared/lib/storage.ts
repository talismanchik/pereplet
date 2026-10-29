export const storageKeys = {
  settings: 'pereplet.settings',
  position: 'pereplet.position',
} as const

export function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key)
    if (raw === null) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function writeStorage(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Приватный режим, переполненная квота или запрет на storage — читалка просто не запоминает.
  }
}
