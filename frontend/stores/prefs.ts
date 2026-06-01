import type { Locale } from '@/locales'

export type BrowserLayout = 'list' | 'gallery' | 'book'

export type GallerySortBy = 'key' | 'size' | 'uploaded'
export type SortOrder = 'ascend' | 'descend'

export function isBrowserLayout(value: unknown): value is BrowserLayout {
  return value === 'list' || value === 'gallery' || value === 'book'
}

export function isGallerySortBy(value: unknown): value is GallerySortBy {
  return value === 'key' || value === 'size' || value === 'uploaded'
}

export function isSortOrder(value: unknown): value is SortOrder {
  return value === 'ascend' || value === 'descend'
}

export function isLocale(value: unknown): value is Locale {
  return value === 'en' || value === 'zh'
}

export type UserPrefsV1 = {
  version: 1
  /**
   * Set to true once we have attempted to import old scattered localStorage keys
   * into the centralized prefs object.
   */
  didMigrateLegacy: boolean

  /**
   * Default object browser layout under /bucket/:bucket/...
   */
  browserLayout: BrowserLayout

  /**
   * Default sorting for the gallery view.
   */
  gallerySortBy: GallerySortBy
  gallerySortOrder: SortOrder

  /**
   * Show the top sticky rail in the bucket browser.
   */
  showTopStickyRail: boolean

  /**
   * UI locale
   */
  locale: Locale
}

const STORAGE_KEY = 'flaredrive:prefs'

function defaultPrefs(): UserPrefsV1 {
  return {
    version: 1,
    didMigrateLegacy: false,
    browserLayout: 'list',
    gallerySortBy: 'key',
    gallerySortOrder: 'ascend',
    showTopStickyRail: true,
    locale: 'en',
  }
}

function readLegacyValue<T = unknown>(key: string): T | undefined {
  if (!('localStorage' in globalThis)) return undefined

  const raw = globalThis.localStorage.getItem(key)
  if (raw == null) return undefined

  try {
    return JSON.parse(raw) as T
  } catch {
    return raw as unknown as T
  }
}

export const usePrefsStore = defineStore('prefs', () => {
  const prefs = useLocalStorage<UserPrefsV1>(STORAGE_KEY, defaultPrefs())

  function migrateLegacyIfNeeded() {
    if (prefs.value.didMigrateLegacy) return

    const migrated: Partial<UserPrefsV1> = {}

    const legacyLayout = readLegacyValue<unknown>('flaredrive:current-layout')
    if (isBrowserLayout(legacyLayout)) {
      migrated.browserLayout = legacyLayout
    }

    const legacySticky = readLegacyValue<boolean>('flaredrive:top-sticky-rail/show')
    if (typeof legacySticky === 'boolean') {
      migrated.showTopStickyRail = legacySticky
    }

    const legacyGallerySortBy = readLegacyValue<unknown>('flaredrive:gallery/sort-by')
    if (isGallerySortBy(legacyGallerySortBy)) {
      migrated.gallerySortBy = legacyGallerySortBy
    }

    const legacyGallerySortOrder = readLegacyValue<unknown>('flaredrive:gallery/sort-order')
    if (isSortOrder(legacyGallerySortOrder)) {
      migrated.gallerySortOrder = legacyGallerySortOrder
    }

    const legacyLocale = readLegacyValue<unknown>('flaredrive:locale')
    if (isLocale(legacyLocale)) {
      migrated.locale = legacyLocale
    }

    prefs.value = {
      ...defaultPrefs(),
      ...prefs.value,
      ...migrated,
      version: 1,
      didMigrateLegacy: true,
    }
  }

  migrateLegacyIfNeeded()

  const browserLayout = computed<BrowserLayout>({
    get: () => prefs.value.browserLayout,
    set: (value) => {
      prefs.value.browserLayout = value
    },
  })

  const gallerySortBy = computed<GallerySortBy>({
    get: () => prefs.value.gallerySortBy,
    set: (value) => {
      prefs.value.gallerySortBy = value
    },
  })

  const gallerySortOrder = computed<SortOrder>({
    get: () => prefs.value.gallerySortOrder,
    set: (value) => {
      prefs.value.gallerySortOrder = value
    },
  })

  const showTopStickyRail = computed<boolean>({
    get: () => prefs.value.showTopStickyRail,
    set: (value) => {
      prefs.value.showTopStickyRail = value
    },
  })

  const locale = computed<Locale>({
    get: () => prefs.value.locale,
    set: (value) => {
      prefs.value.locale = value
    },
  })

  function reset() {
    const next = defaultPrefs()
    next.didMigrateLegacy = true
    prefs.value = next
  }

  return {
    prefs,
    browserLayout,
    gallerySortBy,
    gallerySortOrder,
    showTopStickyRail,
    locale,
    migrateLegacyIfNeeded,
    reset,
  }
})
