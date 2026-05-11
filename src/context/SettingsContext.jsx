import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { loadSettings, saveSettings } from '../services/settings'
import { SETTINGS_SEED } from '../data/defaults'
import { hasSupabase, supabase } from '../lib/supabase'
import { applyThemeFromSettings } from '../lib/themeLoader'

const SettingsContext = createContext(null)

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const channelRef = useRef(null)

  const applyAndSet = async (data) => {
    // Apply the saved theme from DB before any component renders with settings
    if (data) await applyThemeFromSettings(data)
    setSettings(data || SETTINGS_SEED)
  }

  const refresh = async () => {
    const data = await loadSettings()
    await applyAndSet(data)
    setLoading(false)
  }

  useEffect(() => {
    refresh()

    if (!hasSupabase || !supabase) return

    channelRef.current = supabase
      .channel('settings-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, async (payload) => {
        // Realtime update — re-fetch full row and re-apply theme
        const data = await loadSettings()
        await applyAndSet(data)
      })
      .subscribe()

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
    }
  }, [])

  const updateSettings = async (patch) => {
    const next = await saveSettings({ ...(settings || SETTINGS_SEED), ...patch })
    await applyAndSet(next)
    return next
  }

  const value = useMemo(
    () => ({ settings: settings || SETTINGS_SEED, setSettings, updateSettings, refresh, loading }),
    [settings, loading]
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export const useSettings = () => {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used inside SettingsProvider')
  return ctx
}
