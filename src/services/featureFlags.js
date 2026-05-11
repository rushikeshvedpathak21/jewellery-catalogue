import { hasSupabase, supabase } from '../lib/supabase'
import { ls } from '../lib/localStore'
import { DEMO_KEYS } from '../lib/demoSeed'
import { FEATURE_FLAGS_SEED, FEATURE_DEFS } from '../data/defaults'

const featureMap = Object.fromEntries(FEATURE_DEFS.map((f) => [f.feature_key, f]))

function normalizeFeatureRow(row = {}) {
  const meta = featureMap[row.feature_key] || {}
  // Support both `enabled` (original schema) and `is_enabled` (after migration)
  const isEnabled = row.is_enabled ?? row.enabled ?? true
  return {
    id: row.id,
    feature_key: row.feature_key,
    feature_name_en: row.feature_name_en || meta.feature_name_en || '',
    feature_name_hi: row.feature_name_hi || meta.feature_name_hi || '',
    feature_name_mr: row.feature_name_mr || meta.feature_name_mr || '',
    is_enabled: isEnabled,
    enabled: isEnabled,   // keep for backward compat
    disabled_message_en: row.disabled_message_en || meta.disabled_message_en || '',
    disabled_message_hi: row.disabled_message_hi || meta.disabled_message_hi || '',
    disabled_message_mr: row.disabled_message_mr || meta.disabled_message_mr || '',
    updated_at: row.updated_at || new Date().toISOString(),
  }
}

export async function loadFeatureFlags() {
  if (hasSupabase) {
    const { data, error } = await supabase
      .from('feature_flags')
      .select('*')
      .order('feature_key', { ascending: true })

    if (!error && data) return data.map(normalizeFeatureRow)
    console.error('loadFeatureFlags error:', error)
  }

  return ls.get(DEMO_KEYS.featureFlags, FEATURE_FLAGS_SEED).map(normalizeFeatureRow)
}

export async function saveFeatureFlag(next) {
  const normalized = normalizeFeatureRow(next)

  const payload = {
    ...(normalized.id ? { id: normalized.id } : {}),
    feature_key: normalized.feature_key,
    // Write both column names to support pre- and post-migration schemas
    enabled: normalized.is_enabled,
    is_enabled: normalized.is_enabled,
    feature_name_en: normalized.feature_name_en,
    feature_name_hi: normalized.feature_name_hi,
    feature_name_mr: normalized.feature_name_mr,
    disabled_message_en: normalized.disabled_message_en,
    disabled_message_hi: normalized.disabled_message_hi,
    disabled_message_mr: normalized.disabled_message_mr,
    updated_at: normalized.updated_at,
  }

  if (hasSupabase) {
    const { data, error } = await supabase
      .from('feature_flags')
      .upsert(payload, { onConflict: 'feature_key' })
      .select()
      .single()

    if (!error && data) return normalizeFeatureRow(data)

    // If extended columns don't exist yet (migration not run), fall back to simple update
    const simplePayload = {
      feature_key: normalized.feature_key,
      enabled: normalized.is_enabled,
    }
    const { data: d2, error: e2 } = await supabase
      .from('feature_flags')
      .upsert(simplePayload, { onConflict: 'feature_key' })
      .select()
      .single()
    if (!e2 && d2) return normalizeFeatureRow(d2)
    console.error('saveFeatureFlag error:', error || e2)
  }

  const list = await loadFeatureFlags()
  const updated = list.map((f) => f.feature_key === normalized.feature_key ? normalized : f)
  ls.set(DEMO_KEYS.featureFlags, updated)
  return normalized
}

export async function resetFeatureFlagsToDefaults() {
  if (hasSupabase) {
    for (const flag of FEATURE_FLAGS_SEED) {
      await saveFeatureFlag(flag)
    }
  }
  const defaults = FEATURE_FLAGS_SEED.map(normalizeFeatureRow)
  ls.set(DEMO_KEYS.featureFlags, defaults)
  return defaults
}
