import { useSettings } from '../../context/SettingsContext'
import { useLanguage } from '../../context/LanguageContext'
import { useFeatureFlag } from '../../hooks/useFeatureFlag'

export default function AnnouncementBar() {
  const { settings } = useSettings()
  const { lang } = useLanguage()
  const { isEnabled } = useFeatureFlag('announcement_bar')
  const raw = settings?.[`announcement_text_${lang}`] || settings?.announcement_text_en || ''
  if (!isEnabled || !settings?.announcement_visible || !raw) return null

  const parts = raw.split('|').map((part) => part.trim()).filter(Boolean)
  const ticker = [...parts, ...parts]

  return (
    <div className="border-b overflow-hidden" style={{ backgroundColor: 'var(--clr-announcement-bg)', color: 'var(--clr-announcement-text)', borderColor: 'var(--clr-announcement-border)' }}>
      <div className="whitespace-nowrap py-2 text-center text-sm font-semibold animate-marquee" style={{ fontFamily: 'var(--font-announcement)' }}>
        {ticker.map((part, index) => (
          <span key={`${part}-${index}`} className="mx-6 inline-flex items-center gap-3">
            {index > 0 ? <span aria-hidden="true">◆</span> : null}
            <span>{part}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
