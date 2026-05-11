import { MessageCircleMore } from 'lucide-react'
import { useSettings } from '../../context/SettingsContext'

export default function FloatingWhatsApp() {
  const { settings } = useSettings()
  if (!settings?.whatsapp_number) return null

  return (
    <a
      href={`https://wa.me/${settings.whatsapp_number}`}
      target="_blank"
      rel="noreferrer"
      className="group fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-white shadow-soft"
      style={{ backgroundColor: 'var(--clr-floating-wa-bg)', color: 'var(--clr-floating-wa-text)' }}
    >
      <span className="absolute -inset-1 -z-10 rounded-full border border-amber-300/70 opacity-70 animate-pulse" />
      <MessageCircleMore className="h-5 w-5" />
      <span className="hidden whitespace-nowrap md:inline">WhatsApp</span>
      <span className="absolute -top-10 right-0 hidden rounded-full bg-black px-3 py-1 text-xs text-white shadow-lg group-hover:block">
        Chat with us
      </span>
    </a>
  )
}
