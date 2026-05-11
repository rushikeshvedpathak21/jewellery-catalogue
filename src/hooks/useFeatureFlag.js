import { useFeatureFlags } from '../context/FeatureFlagContext'
import { useLanguage } from '../context/LanguageContext'

export function useFeatureFlag(key) {
  const { isEnabled, disabledMessage } = useFeatureFlags()
  const { lang } = useLanguage()
  return {
    isEnabled: isEnabled(key),
    disabledMessage: disabledMessage(key, lang)
  }
}
