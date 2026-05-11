import { useLanguage } from '../context/LanguageContext'
import { byLang } from '../lib/utils'

export function useLangText() {
  const { lang } = useLanguage()
  return (row, base) => byLang(row, base, lang)
}
