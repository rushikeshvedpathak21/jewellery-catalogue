import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { TRANSLATIONS } from './data/defaults'

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: TRANSLATIONS.en },
    hi: { translation: TRANSLATIONS.hi },
    mr: { translation: TRANSLATIONS.mr }
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
})

export default i18n
