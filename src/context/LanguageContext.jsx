import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ls } from '../lib/localStore'
import { DEMO_KEYS } from '../lib/demoSeed'
import { normalizeLang } from '../lib/utils'
import { getCurrentColors } from '../lib/themeLoader'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const { i18n } = useTranslation()
  const [lang, setLangState] = useState(normalizeLang(ls.get(DEMO_KEYS.language, 'en')))

  useEffect(() => {
    i18n.changeLanguage(lang)
    ls.set(DEMO_KEYS.language, lang)

    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang
      const theme = getCurrentColors()
      const root = document.documentElement

      const bodyFont = lang === 'hi'
        ? theme['--font-lang-hi']
        : lang === 'mr'
          ? theme['--font-lang-mr']
          : theme['--font-body']

      const displayFont = lang === 'hi'
        ? theme['--font-lang-hi']
        : lang === 'mr'
          ? theme['--font-lang-mr']
          : theme['--font-display']

      root.style.setProperty('--font-body', bodyFont)
      root.style.setProperty('--font-display', displayFont)
    }
  }, [lang, i18n])

  const value = useMemo(() => ({
    lang,
    setLang: (next) => setLangState(normalizeLang(next))
  }), [lang])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export const useLanguage = () => {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider')
  return ctx
}
