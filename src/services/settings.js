import { hasSupabase, supabase } from '../lib/supabase'
import { ls } from '../lib/localStore'
import { DEMO_KEYS } from '../lib/demoSeed'
import { SETTINGS_SEED } from '../data/defaults'

// Cache the actual DB row ID so we always update the correct row
let _settingsRowId = null

const firstDefined = (...values) => values.find((v) => v !== undefined && v !== null && v !== '')

function normalizeSettingsRow(row = {}) {
  const announcementText = firstDefined(
    row.announcement_text_en,
    row.announcement_text_hi,
    row.announcement_text_mr,
    row.announcement
  ) || ''

  const normalized = {
    id: row.id || '',
    shop_name: firstDefined(row.shop_name, row.shopName, SETTINGS_SEED.shop_name) || '',
    whatsapp_number: firstDefined(row.whatsapp_number, row.whatsapp, row.phone, SETTINGS_SEED.whatsapp_number) || '',
    address: firstDefined(row.address, row.shop_address, SETTINGS_SEED.address) || '',
    google_maps_link: firstDefined(row.google_maps_link, SETTINGS_SEED.google_maps_link) || '',
    open_hours: firstDefined(row.open_hours, SETTINGS_SEED.open_hours) || '',
    banner_image_url: firstDefined(row.banner_image_url, row.logo_url, SETTINGS_SEED.banner_image_url) || '',
    instagram_link: firstDefined(row.instagram_link, SETTINGS_SEED.instagram_link) || '',
    announcement_text_en: firstDefined(row.announcement_text_en, row.announcement, SETTINGS_SEED.announcement_text_en) || '',
    announcement_text_hi: firstDefined(row.announcement_text_hi, row.announcement, SETTINGS_SEED.announcement_text_hi) || '',
    announcement_text_mr: firstDefined(row.announcement_text_mr, row.announcement, SETTINGS_SEED.announcement_text_mr) || '',
    announcement_visible: row.announcement_visible ?? SETTINGS_SEED.announcement_visible,
    // Compatibility aliases
    shop_address: firstDefined(row.shop_address, row.address, SETTINGS_SEED.address) || '',
    phone: firstDefined(row.phone, row.whatsapp_number, row.whatsapp, SETTINGS_SEED.whatsapp_number) || '',
    whatsapp: firstDefined(row.whatsapp, row.whatsapp_number, row.phone, SETTINGS_SEED.whatsapp_number) || '',
    logo_url: firstDefined(row.logo_url, row.banner_image_url, SETTINGS_SEED.banner_image_url) || '',
    announcement: announcementText,
  }

  return { ...SETTINGS_SEED, ...normalized }
}

function buildPayload(next = {}, id) {
  return {
    ...(id ? { id } : {}),
    shop_name: firstDefined(next.shop_name, next.shopName, SETTINGS_SEED.shop_name) || '',
    whatsapp_number: firstDefined(next.whatsapp_number, next.whatsapp, next.phone, SETTINGS_SEED.whatsapp_number) || '',
    address: firstDefined(next.address, next.shop_address, next.shopAddress, SETTINGS_SEED.address) || '',
    google_maps_link: firstDefined(next.google_maps_link, next.googleMapsLink, SETTINGS_SEED.google_maps_link) || '',
    open_hours: firstDefined(next.open_hours, next.openHours, SETTINGS_SEED.open_hours) || '',
    banner_image_url: firstDefined(next.banner_image_url, next.logo_url, next.logoUrl, next.bannerUrl, SETTINGS_SEED.banner_image_url) || '',
    instagram_link: firstDefined(next.instagram_link, next.instagramLink, SETTINGS_SEED.instagram_link) || '',
    announcement_text_en: firstDefined(next.announcement_text_en, next.announcement, SETTINGS_SEED.announcement_text_en) || '',
    announcement_text_hi: firstDefined(next.announcement_text_hi, next.announcement, SETTINGS_SEED.announcement_text_hi) || '',
    announcement_text_mr: firstDefined(next.announcement_text_mr, next.announcement, SETTINGS_SEED.announcement_text_mr) || '',
    announcement_visible: next.announcement_visible ?? next.announcementVisible ?? SETTINGS_SEED.announcement_visible,
  }
}

export async function loadSettings() {
  if (hasSupabase) {
    // Fetch the most recent settings row (works regardless of which UUID was used)
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (!error && data) {
      _settingsRowId = data.id   // Cache the real ID for subsequent saves
      return normalizeSettingsRow(data)
    }
    console.error('loadSettings error:', error)
  }

  return normalizeSettingsRow(ls.get(DEMO_KEYS.settings, SETTINGS_SEED))
}

export async function saveSettings(next) {
  if (hasSupabase) {
    // If we haven't loaded yet, try to fetch the ID first
    if (!_settingsRowId) {
      const { data } = await supabase
        .from('settings')
        .select('id')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (data?.id) _settingsRowId = data.id
    }

    const payload = buildPayload(next, _settingsRowId)

    const { data, error } = await supabase
      .from('settings')
      .upsert(payload, { onConflict: 'id' })
      .select()
      .single()

    if (!error && data) {
      _settingsRowId = data.id
      return normalizeSettingsRow(data)
    }
    console.error('saveSettings error:', error)
  }

  const fallback = normalizeSettingsRow({ ...SETTINGS_SEED, ...next })
  ls.set(DEMO_KEYS.settings, fallback)
  return fallback
}
