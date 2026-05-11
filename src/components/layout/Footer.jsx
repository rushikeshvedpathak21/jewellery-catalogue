import { Link } from 'react-router-dom'
import { Instagram, MapPinned, PhoneCall } from 'lucide-react'
import { useSettings } from '../../context/SettingsContext'
import { useFeatureFlag } from '../../hooks/useFeatureFlag'

export default function Footer() {
  const { settings } = useSettings()
  const { isEnabled: instaOn } = useFeatureFlag('instagram_link')
  const { isEnabled: mapsOn } = useFeatureFlag('google_maps')

  return (
    <footer className="mt-16 border-t" style={{ backgroundColor: 'var(--clr-footer-bg)', borderColor: 'var(--clr-footer-border)' }}>
      <div className="h-[3px] w-full" style={{ background: 'linear-gradient(90deg, transparent, var(--clr-footer-icon), transparent)' }} />
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-3 md:px-6">
        <div>
          <div className="font-display text-3xl font-semibold" style={{ color: 'var(--clr-footer-icon)' }}>{settings?.shop_name}</div>
          <p className="mt-3 text-sm leading-6" style={{ color: 'var(--clr-footer-text)', fontFamily: 'var(--font-footer)' }}>{settings?.address}</p>
          <p className="mt-2 text-sm" style={{ color: 'var(--clr-footer-text)', fontFamily: 'var(--font-footer)' }}>{settings?.open_hours}</p>
        </div>
        <div>
          <h3 className="font-semibold" style={{ color: 'var(--clr-footer-heading)', fontFamily: 'var(--font-footer)' }}>Contact</h3>
          <a className="mt-3 flex items-center gap-2 text-sm transition hover:opacity-80" style={{ color: 'var(--clr-footer-link)', fontFamily: 'var(--font-footer)' }} href={`https://wa.me/${settings?.whatsapp_number || ''}`} target="_blank" rel="noreferrer">
            <PhoneCall className="h-4 w-4" style={{ color: 'var(--clr-footer-icon)' }} />
            WhatsApp
          </a>
          {mapsOn && settings?.google_maps_link ? (
            <a className="mt-3 flex items-center gap-2 text-sm transition hover:opacity-80" style={{ color: 'var(--clr-footer-link)', fontFamily: 'var(--font-footer)' }} href={settings.google_maps_link} target="_blank" rel="noreferrer">
              <MapPinned className="h-4 w-4" style={{ color: 'var(--clr-footer-icon)' }} />
              Google Maps
            </a>
          ) : null}
          {instaOn && settings?.instagram_link ? (
            <a className="mt-3 flex items-center gap-2 text-sm transition hover:opacity-80" style={{ color: 'var(--clr-footer-link)', fontFamily: 'var(--font-footer)' }} href={settings.instagram_link} target="_blank" rel="noreferrer">
              <Instagram className="h-4 w-4" style={{ color: 'var(--clr-footer-icon)' }} />
              Instagram
            </a>
          ) : null}
        </div>
        <div>
          <h3 className="font-semibold" style={{ color: 'var(--clr-footer-heading)', fontFamily: 'var(--font-footer)' }}>Navigate</h3>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <Link to="/" style={{ color: 'var(--clr-footer-link)', fontFamily: 'var(--font-footer)' }}>Home</Link>
            <Link to="/catalogue" style={{ color: 'var(--clr-footer-link)', fontFamily: 'var(--font-footer)' }}>Catalogue</Link>
            <Link to="/new-arrivals" style={{ color: 'var(--clr-footer-link)', fontFamily: 'var(--font-footer)' }}>New Arrivals</Link>
            <Link to="/wishlist" style={{ color: 'var(--clr-footer-link)', fontFamily: 'var(--font-footer)' }}>Wishlist</Link>
          </div>
        </div>
      </div>
      <div className="border-t px-4 py-3 text-center text-xs italic" style={{ borderColor: 'var(--clr-footer-border)', color: 'var(--clr-footer-icon)', fontFamily: 'var(--font-footer)' }}>
        Crafted with love · BIS Hallmarked
      </div>
      <div className="px-4 pb-5 text-center text-xs" style={{ color: '#9ca3af', fontFamily: 'var(--font-footer)' }}>
        © {new Date().getFullYear()} {settings?.shop_name || 'Jewellery Shop'}
      </div>
    </footer>
  )
}
