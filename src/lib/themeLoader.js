import { hasSupabase, supabase } from './supabase'

export const DEFAULT_THEME = {
  "--clr-navbar-bg": "#ffffff",
  "--clr-navbar-border": "#f5f5f5",
  "--clr-navbar-text": "#B4A17A",
  "--clr-navbar-link": "#404040",
  "--clr-navbar-link-active-bg": "#B4A17A",
  "--clr-navbar-link-active-text": "#ffffff",
  "--clr-announcement-bg": "#FBF9F5",
  "--clr-announcement-text": "#1f1f1f",
  "--clr-announcement-border": "#B4A17A",
  "--clr-hero-bg-from": "#FBF9F5",
  "--clr-hero-bg-to": "#ffffff",
  "--clr-hero-title": "#111111",
  "--clr-hero-tagline": "#B4A17A",
  "--clr-hero-body": "#525252",
  "--clr-hero-btn-primary-bg": "#B4A17A",
  "--clr-hero-btn-primary-text": "#ffffff",
  "--clr-hero-btn-secondary-bg": "#ffffff",
  "--clr-hero-btn-secondary-text": "#111111",
  "--clr-hero-btn-secondary-border": "#e5e5e5",
  "--clr-category-card-bg": "#ffffff",
  "--clr-category-card-border": "#f5f5f5",
  "--clr-category-card-title": "#B4A17A",
  "--clr-category-card-count": "#737373",
  "--clr-section-bg": "#ffffff",
  "--clr-section-title": "#111111",
  "--clr-section-subtitle": "#737373",
  "--clr-product-card-bg": "#ffffff",
  "--clr-product-card-border": "#f5f5f5",
  "--clr-product-card-title": "#111111",
  "--clr-product-card-meta": "#737373",
  "--clr-product-card-img-bg": "#FBF9F5",
  "--clr-product-badge-new-bg": "#B4A17A",
  "--clr-product-badge-new-text": "#ffffff",
  "--clr-whatsapp-btn-bg": "#B4A17A",
  "--clr-whatsapp-btn-text": "#ffffff",
  "--clr-wishlist-btn-bg": "#ffffff",
  "--clr-wishlist-btn-border": "#e5e5e5",
  "--clr-wishlist-btn-text": "#111111",
  "--clr-footer-bg": "#f9f9f9",
  "--clr-footer-text": "#525252",
  "--clr-footer-heading": "#111111",
  "--clr-footer-link": "#525252",
  "--clr-footer-icon": "#B4A17A",
  "--clr-footer-border": "#f5f5f5",
  "--clr-page-bg": "#ffffff",
  "--clr-input-border": "#e5e5e5",
  "--clr-input-bg": "#ffffff",
  "--clr-input-focus": "#B4A17A",
  "--clr-admin-sidebar-bg": "#ffffff",
  "--clr-admin-sidebar-border": "#f5f5f5",
  "--clr-admin-sidebar-text": "#404040",
  "--clr-admin-sidebar-active-bg": "#B4A17A",
  "--clr-admin-sidebar-active-text": "#ffffff",
  "--clr-floating-wa-bg": "#22c55e",
  "--clr-floating-wa-text": "#ffffff",
  "--font-body": "'Inter', sans-serif",
  "--font-display": "'Cormorant Garamond', serif",
  "--font-nav": "'Inter', sans-serif",
  "--font-hero-title": "'Cormorant Garamond', serif",
  "--font-hero-body": "'Inter', sans-serif",
  "--font-category-card": "'Cormorant Garamond', serif",
  "--font-product-card-title": "'Cormorant Garamond', serif",
  "--font-product-card-body": "'Inter', sans-serif",
  "--font-section-title": "'Cormorant Garamond', serif",
  "--font-footer": "'Inter', sans-serif",
  "--font-announcement": "'Inter', sans-serif",
  "--font-lang-hi": "'Hind', sans-serif",
  "--font-lang-mr": "'Hind', sans-serif",
}

export const DEFAULT_COLORS = DEFAULT_THEME

const LS_KEY = 'jk_theme_colors'
const GENERIC_FAMILIES = new Set(['sans-serif', 'serif', 'monospace', 'cursive', 'fantasy', 'system-ui'])

function stripQuotes(v) {
  return String(v || '').trim().replace(/^['\"]+|['\"]+$/g, '')
}

function extractFamilies(theme) {
  return [...new Set(
    Object.entries(theme)
      .filter(([k]) => k.startsWith('--font-'))
      .flatMap(([, v]) =>
        String(v || '').split(',').map(stripQuotes).filter((p) => p && !GENERIC_FAMILIES.has(p))
      )
  )]
}

export function loadGoogleFonts(theme = DEFAULT_THEME) {
  if (typeof document === 'undefined') return
  const families = extractFamilies(theme)
  if (!families.length) return
  const href = `https://fonts.googleapis.com/css2?${families
    .map((f) => `family=${encodeURIComponent(f)}:wght@300;400;500;600;700`)
    .join('&')}&display=swap`
  let link = document.getElementById('jk-google-fonts')
  if (!link) {
    link = document.createElement('link')
    link.id = 'jk-google-fonts'
    link.rel = 'stylesheet'
    document.head.appendChild(link)
  }
  link.href = href
}

export function applyTheme(theme = DEFAULT_THEME) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  Object.entries(theme).forEach(([k, v]) => root.style.setProperty(k, v))
  loadGoogleFonts(theme)
}

export const applyColors = applyTheme

// ─── localStorage ─────────────────────────────────────────────────────────────
function lsGet() {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(LS_KEY) : null
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}
function lsSet(colors) {
  try { if (typeof localStorage !== 'undefined') localStorage.setItem(LS_KEY, JSON.stringify(colors)) }
  catch { /* ignore */ }
}
function lsClear() {
  try { if (typeof localStorage !== 'undefined') localStorage.removeItem(LS_KEY) }
  catch { /* ignore */ }
}

// ─── Supabase ─────────────────────────────────────────────────────────────────
// Fetch theme_json from the settings table
async function dbLoadTheme() {
  if (!hasSupabase || !supabase) return null
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('theme_json')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) {
      // Column might not exist yet (migration not run)
      if (error.code === '42703') {
        console.warn('theme_json column missing — run supabase_migration.sql')
      } else {
        console.error('dbLoadTheme error:', error)
      }
      return null
    }
    if (data?.theme_json) return JSON.parse(data.theme_json)
  } catch (err) {
    console.error('dbLoadTheme exception:', err)
  }
  return null
}

// Save theme_json to the most recent settings row
async function dbSaveTheme(colors) {
  if (!hasSupabase || !supabase) return false
  try {
    // Always find the actual row first (don't assume a fixed ID)
    const { data: row, error: findError } = await supabase
      .from('settings')
      .select('id')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (findError || !row?.id) {
      console.error('dbSaveTheme: could not find settings row', findError)
      return false
    }

    const { error: updateError } = await supabase
      .from('settings')
      .update({ theme_json: JSON.stringify(colors) })
      .eq('id', row.id)

    if (updateError) {
      // Column probably missing — run the migration SQL
      if (updateError.code === '42703') {
        console.error(
          'theme_json column does not exist.\n' +
          'Run supabase_migration.sql in Supabase SQL Editor to add it.'
        )
      } else {
        console.error('dbSaveTheme update error:', updateError)
      }
      return false
    }

    return true
  } catch (err) {
    console.error('dbSaveTheme exception:', err)
    return false
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Called in main.jsx BEFORE React renders.
 * 1. Applies localStorage theme instantly (zero flash on revisit).
 * 2. Fetches Supabase theme in background and re-applies if different
 *    (so visitors on fresh devices see the saved theme within ~1 second).
 */
export function loadThemeColors() {
  // Step 1: apply whatever we have locally right now
  const local = lsGet()
  const merged = local ? { ...DEFAULT_THEME, ...local } : { ...DEFAULT_THEME }
  applyTheme(merged)

  // Step 2: background fetch from DB
  dbLoadTheme().then((remote) => {
    if (!remote) return
    const remoteTheme = { ...DEFAULT_THEME, ...remote }
    lsSet(remote)
    applyTheme(remoteTheme)
  })
}

/**
 * Save colors to localStorage (instant) AND Supabase (all visitors).
 * Called from ThemePage "Save & Apply" button.
 */
export async function saveThemeColors(colors) {
  lsSet(colors)
  applyTheme(colors)
  const saved = await dbSaveTheme(colors)
  if (!saved) {
    // DB save failed — throw so ThemePage can show the right warning toast
    throw new Error('DB save failed — only saved locally. Run supabase_migration.sql.')
  }
}

/**
 * Called by SettingsContext after it loads settings from Supabase.
 * Applies the theme stored in the settings row so every visitor
 * gets the right colors, even on a fresh browser with empty localStorage.
 */
export async function applyThemeFromSettings(settingsRow) {
  if (!settingsRow?.theme_json) return
  try {
    const theme = JSON.parse(settingsRow.theme_json)
    if (!theme || typeof theme !== 'object') return
    const merged = { ...DEFAULT_THEME, ...theme }
    lsSet(theme)   // cache for next visit
    applyTheme(merged)
  } catch (err) {
    console.error('applyThemeFromSettings error:', err)
  }
}

export function resetThemeColors() {
  lsClear()
  applyTheme(DEFAULT_THEME)
  dbSaveTheme(DEFAULT_THEME)
}

export function getCurrentColors() {
  const local = lsGet()
  return local ? { ...DEFAULT_THEME, ...local } : { ...DEFAULT_THEME }
}

export const getCurrentTheme = getCurrentColors
