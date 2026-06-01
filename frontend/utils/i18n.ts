import { ref, type Ref } from 'vue'
import { en } from '@/locales/en'
import { zh } from '@/locales/zh'
import type { Locale } from '@/locales'

const LOCALE_STORAGE_KEY = 'flaredrive:locale'
const DEFAULT_LOCALE: Locale = 'en'

const allMessages: Record<Locale, typeof en> = {
  en,
  zh,
}

function readStoredLocale(): Locale {
  if (typeof globalThis === 'undefined' || !('localStorage' in globalThis)) {
    return DEFAULT_LOCALE
  }
  try {
    const raw = globalThis.localStorage.getItem(LOCALE_STORAGE_KEY)
    if (raw === 'en' || raw === 'zh') {
      return raw
    }
  } catch {
    // ignore
  }
  if (typeof navigator !== 'undefined' && navigator?.language) {
    const lang = navigator.language.toLowerCase()
    if (lang.startsWith('zh')) return 'zh'
  }
  return DEFAULT_LOCALE
}

const _locale = ref<Locale>(readStoredLocale()) as Ref<Locale>

export const locale = _locale

export function setLocale(next: Locale) {
  _locale.value = next
  if (typeof globalThis !== 'undefined' && 'localStorage' in globalThis) {
    try {
      globalThis.localStorage.setItem(LOCALE_STORAGE_KEY, next)
    } catch {
      // ignore quota / private mode errors
    }
  }
  if (typeof document !== 'undefined') {
    document.documentElement.lang = next === 'zh' ? 'zh-CN' : 'en'
  }
}

if (typeof document !== 'undefined') {
  document.documentElement.lang = _locale.value === 'zh' ? 'zh-CN' : 'en'
}

function getByPath(obj: any, path: string): any {
  if (obj == null) return undefined
  const segments = path.split('.')
  let cursor: any = obj
  for (const seg of segments) {
    if (cursor == null) return undefined
    cursor = cursor[seg]
  }
  return cursor
}

function interpolate(template: string, params?: Record<string, unknown>): string {
  if (!params) return template
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      const v = (params as any)[key]
      return v == null ? match : String(v)
    }
    return match
  })
}

function choosePlural(template: string, count: number): string {
  if (typeof template !== 'string') return template
  return template.replace(/\{count\}/g, String(count))
}

function translateRecursive(value: unknown, params?: Record<string, unknown>): unknown {
  if (typeof value === 'string') {
    if (params && typeof (params as any).count === 'number') {
      return choosePlural(interpolate(value, params), (params as any).count)
    }
    return interpolate(value, params)
  }
  if (Array.isArray(value)) {
    return value.map((v) => translateRecursive(v, params))
  }
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value)) {
      out[k] = translateRecursive(v, params)
    }
    return out
  }
  return value
}

/**
 * Translate a dot-path key with optional interpolation.
 * Falls back to English, then the key itself.
 */
export function t(key: string, params?: Record<string, unknown>): any {
  const current = _locale.value
  const bag = allMessages[current] || allMessages[DEFAULT_LOCALE]
  let value = getByPath(bag, key)
  if (value === undefined) {
    value = getByPath(allMessages[DEFAULT_LOCALE], key)
  }
  if (value === undefined) {
    return key
  }
  return translateRecursive(value, params)
}

/**
 * Reactive t that tracks locale changes automatically.
 * Returns a function equivalent to t() but is safe to use in render functions.
 */
export function useI18n() {
  return {
    t,
    locale: _locale,
    setLocale,
  }
}
