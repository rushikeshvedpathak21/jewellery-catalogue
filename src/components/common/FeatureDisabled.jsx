import { Info, Lock, MessageCircleMore } from 'lucide-react'
import Button from './Button'
import { useSettings } from '../../context/SettingsContext'
import { useLanguage } from '../../context/LanguageContext'

export default function FeatureDisabled({ message, contact = true, title = 'Feature Disabled' }) {
  const { settings } = useSettings()
  const { lang } = useLanguage()
  const text = message || {
    en: 'This feature is currently disabled.',
    hi: 'यह फीचर अभी बंद है।',
    mr: 'हे फीचर सध्या बंद आहे.'
  }[lang]
  const whatsapp = settings?.whatsapp_number ? `https://wa.me/${settings.whatsapp_number}` : 'https://wa.me/'

  return (
    <div className="rounded-3xl border-2 p-6 shadow-soft" style={{ backgroundColor: 'var(--clr-page-bg)', borderColor: 'var(--clr-footer-icon)' }}>
      <div className="flex items-start gap-4">
        <div className="rounded-2xl p-3" style={{ backgroundColor: 'rgba(180, 161, 122, 0.1)', color: 'var(--clr-footer-icon)' }}>
          <Lock className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-2xl font-semibold">{title}</h3>
            <Info className="h-4 w-4" style={{ color: 'var(--clr-footer-icon)' }} />
          </div>
          <p className="mt-2 whitespace-pre-line text-sm leading-6" style={{ color: 'var(--clr-footer-text)' }}>{text}</p>
          {contact ? (
            <a href={whatsapp} target="_blank" rel="noreferrer" className="mt-4 inline-block">
              <Button className="gap-2">
                <MessageCircleMore className="h-4 w-4" />
                Contact on WhatsApp
              </Button>
            </a>
          ) : null}
        </div>
      </div>
    </div>
  )
}
