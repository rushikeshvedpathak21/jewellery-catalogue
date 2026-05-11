import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { FEATURE_DEFS } from '../data/defaults'
import { loadFeatureFlags, resetFeatureFlagsToDefaults, saveFeatureFlag } from '../services/featureFlags'
import { hasSupabase, supabase } from '../lib/supabase'

const FeatureFlagContext = createContext(null)

export function FeatureFlagProvider({ children }) {
  const [flags, setFlags] = useState([])
  const [loading, setLoading] = useState(true)
  const channelRef = useRef(null)

  const refresh = async () => {
    const data = await loadFeatureFlags()
    setFlags(data || [])
    setLoading(false)
  }

  useEffect(() => {
    refresh()

    if (!hasSupabase || !supabase) return

    channelRef.current = supabase
      .channel('feature-flags-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'feature_flags' }, () => {
        loadFeatureFlags().then((data) => setFlags(data || []))
      })
      .subscribe()

    return () => {
      if (channelRef.current) { supabase.removeChannel(channelRef.current); channelRef.current = null }
    }
  }, [])

  const getFlag = (key) =>
    flags.find((f) => f.feature_key === key) ||
    FEATURE_DEFS.find((f) => f.feature_key === key) ||
    null

  const toggleFlag = async (key) => {
    const current = getFlag(key)
    if (!current) return null
    await saveFeatureFlag({ ...current, is_enabled: !(current.is_enabled ?? current.enabled ?? true) })
    await refresh()
  }

  const updateFlagMessages = async (key, patch) => {
    const current = getFlag(key)
    if (!current) return null
    await saveFeatureFlag({ ...current, ...patch })
    await refresh()
  }

  const value = useMemo(() => ({
    flags,
    loading,
    refresh,
    getFlag,
    isEnabled: (key) => {
      const flag = getFlag(key)
      if (!flag) return true
      return Boolean(flag.is_enabled ?? flag.enabled ?? true)
    },
    disabledMessage: (key, lang = 'en') => {
      const flag = getFlag(key)
      return flag?.[`disabled_message_${lang}`] || flag?.disabled_message_en || ''
    },
    toggleFlag,
    updateFlagMessages,
    resetDefaults: async () => { await resetFeatureFlagsToDefaults(); await refresh() }
  }), [flags, loading])

  return <FeatureFlagContext.Provider value={value}>{children}</FeatureFlagContext.Provider>
}

export const useFeatureFlags = () => {
  const ctx = useContext(FeatureFlagContext)
  if (!ctx) throw new Error('useFeatureFlags must be used inside FeatureFlagProvider')
  return ctx
}
