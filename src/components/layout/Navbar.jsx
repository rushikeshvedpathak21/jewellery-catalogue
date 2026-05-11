import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Heart, Search, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSettings } from '../../context/SettingsContext'
import { useFeatureFlag } from '../../hooks/useFeatureFlag'
import { useLanguage } from '../../context/LanguageContext'
import { LANGS } from '../../data/defaults'
import Button from '../common/Button'
import { cn } from '../../lib/utils'

export default function Navbar() {
  const { t } = useTranslation()
  const { settings } = useSettings()
  const { isEnabled: searchOn } = useFeatureFlag('search')
  const { isEnabled: wishlistOn } = useFeatureFlag('wishlist')
  const { lang, setLang } = useLanguage()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const linkClass = 'rounded-full px-4 py-2 text-sm font-medium transition duration-300 ease-in-out'
  const linkStyle = (isActive) => ({
    backgroundColor: isActive ? 'var(--clr-navbar-link-active-bg)' : 'transparent',
    color: isActive ? 'var(--clr-navbar-link-active-text)' : 'var(--clr-navbar-link)',
    fontFamily: 'var(--font-nav)'
  })

  return (
    <header className="sticky top-0 z-40 border-b backdrop-blur" style={{ backgroundColor: 'var(--clr-navbar-bg)', borderColor: 'var(--clr-navbar-border)' }}>
      <div className="h-[2px] w-full" style={{ backgroundColor: 'var(--clr-navbar-link-active-bg)' }} />
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-6">
        <Link to="/" className="min-w-0">
          <div className="font-display text-3xl font-semibold tracking-wide" style={{ color: 'var(--clr-navbar-text)' }}>
            {settings?.shop_name || 'Jewellery Shop'}
          </div>
          <div className="text-xs uppercase tracking-[0.3em]" style={{ fontFamily: 'var(--font-nav)' }}>
            Luxury Catalogue
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          <NavLink className={linkClass} style={({ isActive }) => linkStyle(isActive)} to="/">{t('home')}</NavLink>
          <NavLink className={linkClass} style={({ isActive }) => linkStyle(isActive)} to="/catalogue">{t('categories')}</NavLink>
          <NavLink className={linkClass} style={({ isActive }) => linkStyle(isActive)} to="/new-arrivals">{t('new_arrivals')}</NavLink>
          {wishlistOn ? <NavLink className={linkClass} style={({ isActive }) => linkStyle(isActive)} to="/wishlist">{t('wishlist')}</NavLink> : null}
          <NavLink className={linkClass} style={({ isActive }) => linkStyle(isActive)} to="/admin/login">{t('admin')}</NavLink>
          {searchOn ? (
            <button onClick={() => navigate('/search')} className="rounded-full p-3 transition duration-300 ease-in-out hover:opacity-80" style={{ color: 'var(--clr-navbar-link)' }}>
              <Search className="h-5 w-5" />
            </button>
          ) : null}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <div className="flex rounded-full border p-1" style={{ borderColor: 'var(--clr-navbar-border)' }}>
            {LANGS.map((item) => (
              <button
                key={item.code}
                onClick={() => setLang(item.code)}
                className="rounded-full px-3 py-1 text-xs font-semibold transition duration-300 ease-in-out"
                style={{
                  backgroundColor: lang === item.code ? 'var(--clr-navbar-link-active-bg)' : 'transparent',
                  color: lang === item.code ? 'var(--clr-navbar-link-active-text)' : 'var(--clr-navbar-link)',
                  fontFamily: 'var(--font-nav)'
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <button className="rounded-full border p-2 md:hidden" style={{ borderColor: 'var(--clr-navbar-border)', color: 'var(--clr-navbar-link)' }} onClick={() => setOpen((v) => !v)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t px-4 pb-4 md:hidden" style={{ backgroundColor: 'var(--clr-navbar-bg)', borderColor: 'var(--clr-navbar-border)' }}>
          <div className="flex flex-col gap-2">
            <NavLink onClick={() => setOpen(false)} className={linkClass} style={({ isActive }) => linkStyle(isActive)} to="/">{t('home')}</NavLink>
            <NavLink onClick={() => setOpen(false)} className={linkClass} style={({ isActive }) => linkStyle(isActive)} to="/catalogue">{t('categories')}</NavLink>
            <NavLink onClick={() => setOpen(false)} className={linkClass} style={({ isActive }) => linkStyle(isActive)} to="/new-arrivals">{t('new_arrivals')}</NavLink>
            {wishlistOn ? <NavLink onClick={() => setOpen(false)} className={linkClass} style={({ isActive }) => linkStyle(isActive)} to="/wishlist">{t('wishlist')}</NavLink> : null}
            <NavLink onClick={() => setOpen(false)} className={linkClass} style={({ isActive }) => linkStyle(isActive)} to="/admin/login">{t('admin')}</NavLink>
            {searchOn ? (
              <Button variant="secondary" onClick={() => { setOpen(false); navigate('/search') }} className="justify-start gap-2">
                <Search className="h-4 w-4" />
                {t('search')}
              </Button>
            ) : null}
            <div className="mt-2 flex gap-2">
              {LANGS.map((item) => (
                <button
                  key={item.code}
                  onClick={() => setLang(item.code)}
                  className="rounded-full px-3 py-2 text-xs font-semibold transition duration-300 ease-in-out"
                  style={{
                    backgroundColor: lang === item.code ? 'var(--clr-navbar-link-active-bg)' : 'transparent',
                    color: lang === item.code ? 'var(--clr-navbar-link-active-text)' : 'var(--clr-navbar-link)',
                    border: '1px solid var(--clr-navbar-border)',
                    fontFamily: 'var(--font-nav)'
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}
