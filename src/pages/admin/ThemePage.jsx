import { useEffect, useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import {
  DEFAULT_COLORS,
  saveThemeColors,
  resetThemeColors,
  getCurrentColors,
  applyColors,
  loadGoogleFonts
} from '../../lib/themeLoader'
import Button from '../../components/common/Button'

const ENGLISH_FONTS = [
  { label: 'Inter', value: "'Inter', sans-serif" },
  { label: 'Lato', value: "'Lato', sans-serif" },
  { label: 'Roboto', value: "'Roboto', sans-serif" },
  { label: 'Poppins', value: "'Poppins', sans-serif" },
  { label: 'Montserrat', value: "'Montserrat', sans-serif" },
  { label: 'Raleway', value: "'Raleway', sans-serif" },
  { label: 'Playfair Display', value: "'Playfair Display', serif" },
  { label: 'Cormorant Garamond', value: "'Cormorant Garamond', serif" },
  { label: 'EB Garamond', value: "'EB Garamond', serif" },
  { label: 'DM Serif Display', value: "'DM Serif Display', serif" },
]

const DEVANAGARI_FONTS = [
  { label: 'Hind', value: "'Hind', sans-serif" },
  { label: 'Mukta', value: "'Mukta', sans-serif" },
  { label: 'Baloo 2', value: "'Baloo 2', cursive" },
  { label: 'Noto Sans Devanagari', value: "'Noto Sans Devanagari', sans-serif" },
  { label: 'Tiro Devanagari Sanskrit', value: "'Tiro Devanagari Sanskrit', serif" },
  { label: 'Poppins', value: "'Poppins', sans-serif" },
]

const SECTIONS = [
  {
    title: 'Navbar',
    colors: [
      ['--clr-navbar-bg', 'Background'],
      ['--clr-navbar-border', 'Border'],
      ['--clr-navbar-text', 'Shop Name'],
      ['--clr-navbar-link', 'Nav Links'],
      ['--clr-navbar-link-active-bg', 'Active Link Background'],
      ['--clr-navbar-link-active-text', 'Active Link Text'],
    ],
    fonts: [['--font-nav', 'Navigation Font', ENGLISH_FONTS]],
  },
  {
    title: 'Announcement Bar',
    colors: [
      ['--clr-announcement-bg', 'Background'],
      ['--clr-announcement-text', 'Text'],
      ['--clr-announcement-border', 'Border'],
    ],
    fonts: [['--font-announcement', 'Announcement Font', ENGLISH_FONTS]],
  },
  {
    title: 'Hero / Banner',
    colors: [
      ['--clr-hero-bg-from', 'Background Start'],
      ['--clr-hero-bg-to', 'Background End'],
      ['--clr-hero-title', 'Title'],
      ['--clr-hero-tagline', 'Tagline'],
      ['--clr-hero-body', 'Body Text'],
      ['--clr-hero-btn-primary-bg', 'Primary Button Background'],
      ['--clr-hero-btn-primary-text', 'Primary Button Text'],
      ['--clr-hero-btn-secondary-bg', 'Secondary Button Background'],
      ['--clr-hero-btn-secondary-text', 'Secondary Button Text'],
      ['--clr-hero-btn-secondary-border', 'Secondary Button Border'],
    ],
    fonts: [
      ['--font-hero-title', 'Hero Title Font', ENGLISH_FONTS],
      ['--font-hero-body', 'Hero Body Font', ENGLISH_FONTS],
    ],
  },
  {
    title: 'Category Cards',
    colors: [
      ['--clr-category-card-bg', 'Card Background'],
      ['--clr-category-card-border', 'Card Border'],
      ['--clr-category-card-title', 'Category Name'],
      ['--clr-category-card-count', 'Product Count'],
    ],
    fonts: [['--font-category-card', 'Category Font', ENGLISH_FONTS]],
  },
  {
    title: 'Page Sections',
    colors: [
      ['--clr-section-bg', 'Section Background'],
      ['--clr-section-title', 'Section Title'],
      ['--clr-section-subtitle', 'Section Subtitle'],
      ['--clr-page-bg', 'Page Background'],
    ],
    fonts: [['--font-section-title', 'Section Title Font', ENGLISH_FONTS]],
  },
  {
    title: 'Product Cards',
    colors: [
      ['--clr-product-card-bg', 'Card Background'],
      ['--clr-product-card-border', 'Card Border'],
      ['--clr-product-card-title', 'Product Name'],
      ['--clr-product-card-meta', 'Meta Text (metal/weight)'],
      ['--clr-product-card-img-bg', 'Image Background'],
      ['--clr-product-badge-new-bg', 'New Badge Background'],
      ['--clr-product-badge-new-text', 'New Badge Text'],
    ],
    fonts: [
      ['--font-product-card-title', 'Product Title Font', ENGLISH_FONTS],
      ['--font-product-card-body', 'Product Body Font', ENGLISH_FONTS],
    ],
  },
  {
    title: 'Buttons / Actions',
    colors: [
      ['--clr-whatsapp-btn-bg', 'WhatsApp Button Background'],
      ['--clr-whatsapp-btn-text', 'WhatsApp Button Text'],
      ['--clr-wishlist-btn-bg', 'Wishlist Button Background'],
      ['--clr-wishlist-btn-border', 'Wishlist Button Border'],
      ['--clr-wishlist-btn-text', 'Wishlist Button Text'],
    ],
  },
  {
    title: 'Footer',
    colors: [
      ['--clr-footer-bg', 'Background'],
      ['--clr-footer-border', 'Border'],
      ['--clr-footer-text', 'Body Text'],
      ['--clr-footer-heading', 'Headings'],
      ['--clr-footer-link', 'Links'],
      ['--clr-footer-icon', 'Icons'],
    ],
    fonts: [['--font-footer', 'Footer Font', ENGLISH_FONTS]],
  },
  {
    title: 'Page & Inputs',
    colors: [
      ['--clr-page-bg', 'Page Background'],
      ['--clr-input-border', 'Input Border'],
      ['--clr-input-bg', 'Input Background'],
      ['--clr-input-focus', 'Focus Ring Color'],
    ],
    fonts: [['--font-body', 'Body Font', ENGLISH_FONTS]],
  },
  {
    title: 'Admin Sidebar',
    colors: [
      ['--clr-admin-sidebar-bg', 'Sidebar Background'],
      ['--clr-admin-sidebar-border', 'Sidebar Border'],
      ['--clr-admin-sidebar-text', 'Sidebar Text'],
      ['--clr-admin-sidebar-active-bg', 'Active Item Background'],
      ['--clr-admin-sidebar-active-text', 'Active Item Text'],
    ],
  },
  {
    title: 'Floating WhatsApp Button',
    colors: [
      ['--clr-floating-wa-bg', 'Button Background'],
      ['--clr-floating-wa-text', 'Button Text'],
    ],
  },
  {
    title: 'Language Fonts',
    colors: [],
    fonts: [
      ['--font-lang-hi', 'Hindi Font', DEVANAGARI_FONTS],
      ['--font-lang-mr', 'Marathi Font', DEVANAGARI_FONTS],
      ['--font-body', 'English Body Font', ENGLISH_FONTS],
      ['--font-display', 'English Display Font', ENGLISH_FONTS],
    ],
  },
]

function ColorRow({ label, k, colors, handleChange }) {
  return (
    <div
      className="flex items-center gap-3 rounded-2xl border p-3"
      style={{ borderColor: 'var(--clr-input-border)', backgroundColor: 'var(--clr-section-bg)' }}
    >
      <div
        className="h-6 w-6 flex-shrink-0 rounded-full border"
        style={{ backgroundColor: colors[k], borderColor: 'var(--clr-input-border)' }}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium" style={{ color: 'var(--clr-section-title)' }}>{label}</p>
        <input
          type="text"
          className="mt-1 w-full rounded-xl border p-2 text-sm font-mono"
          style={{ backgroundColor: 'var(--clr-input-bg)', borderColor: 'var(--clr-input-border)' }}
          value={colors[k] || ''}
          onChange={(e) => handleChange(k, e.target.value)}
        />
      </div>
      <input
        type="color"
        className="h-9 w-9 flex-shrink-0 cursor-pointer rounded-xl border-0"
        value={colors[k] || '#000000'}
        onChange={(e) => handleChange(k, e.target.value)}
      />
    </div>
  )
}

function FontRow({ label, k, colors, handleChange, options }) {
  const listId = `${k}-options`
  return (
    <div
      className="rounded-2xl border p-4"
      style={{ borderColor: 'var(--clr-input-border)', backgroundColor: 'var(--clr-section-bg)' }}
    >
      <div className="mb-2 text-sm font-medium" style={{ color: 'var(--clr-section-title)' }}>{label}</div>
      <input
        list={listId}
        className="w-full rounded-2xl border px-4 py-3 text-sm"
        style={{ backgroundColor: 'var(--clr-input-bg)', borderColor: 'var(--clr-input-border)' }}
        value={colors[k] || ''}
        onChange={(e) => handleChange(k, e.target.value)}
      />
      <datalist id={listId}>
        {options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </datalist>
      <div
        className="mt-3 rounded-2xl border p-4"
        style={{ borderColor: 'var(--clr-input-border)', backgroundColor: 'var(--clr-page-bg)' }}
      >
        <div className="text-xs uppercase tracking-[0.25em]" style={{ color: 'var(--clr-footer-icon)' }}>Preview</div>
        <div className="mt-2 text-xl font-semibold" style={{ fontFamily: colors[k], color: 'var(--clr-section-title)' }}>
          अ आ इ ई उ ऊ · Aa Bb Cc
        </div>
        <div className="mt-1 text-sm leading-6" style={{ fontFamily: colors[k], color: 'var(--clr-section-subtitle)' }}>
          नमस्ते, हमारे आभूषण संग्रह में आपका स्वागत है. / Welcome to our jewellery collection.
        </div>
      </div>
    </div>
  )
}

export default function ThemePage() {
  const [colors, setColors] = useState(() => getCurrentColors())
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)  // { msg, type }
  const [activeSections, setActiveSections] = useState(
    () => Object.fromEntries(SECTIONS.map((s) => [s.title, true]))
  )

  // Live preview: apply CSS variables immediately when any color/font changes
  useEffect(() => {
    applyColors(colors)
    loadGoogleFonts(colors)
  }, [colors])

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    window.clearTimeout(window.__jkThemeToast)
    window.__jkThemeToast = window.setTimeout(() => setToast(null), 4000)
  }

  const handleChange = (key, value) => setColors((prev) => ({ ...prev, [key]: value }))

  const handleSave = async () => {
    setSaving(true)
    try {
      await saveThemeColors(colors)
      showToast('✓ Theme saved! All visitors will now see the updated colors.')
    } catch (err) {
      console.error('Theme save error:', err)
      if (String(err?.message).includes('migration')) {
        showToast('⚠ Missing DB column — run supabase_migration.sql in Supabase SQL Editor, then try again.', 'warn')
      } else {
        showToast("⚠ Saved in your browser only. Other visitors won't see it until the DB column exists.", "warn")
      }
    } finally {
      setSaving(false)
    }
  }

  const handleReset = async () => {
    if (!window.confirm('Reset ALL colors to original defaults?')) return
    setSaving(true)
    try {
      resetThemeColors()
      setColors({ ...DEFAULT_COLORS })
      showToast('✓ Colors reset to defaults.')
    } finally {
      setSaving(false)
    }
  }

  const toggleSection = (title) => setActiveSections((prev) => ({ ...prev, [title]: !prev[title] }))

  const Actions = () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button onClick={handleSave} disabled={saving}>
        {saving ? 'Saving…' : 'Save & Apply'}
      </Button>
      <button
        onClick={handleReset}
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-full border border-red-400 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
      >
        <AlertTriangle className="h-4 w-4" />
        Reset to Default
      </button>
    </div>
  )

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold md:text-4xl" style={{ color: 'var(--clr-section-title)' }}>
            Theme &amp; Colors
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--clr-section-subtitle)' }}>
            Colors preview live as you edit. Click <strong>Save &amp; Apply</strong> to publish to all visitors.
          </p>
        </div>
        <Actions />
      </div>

      {SECTIONS.map((section) => (
        <div
          key={section.title}
          className="rounded-3xl border bg-white p-5 shadow-soft"
          style={{ borderColor: 'var(--clr-input-border)' }}
        >
          <button
            type="button"
            className="flex w-full items-center justify-between gap-3 text-left"
            onClick={() => toggleSection(section.title)}
          >
            <h2 className="font-display text-2xl font-semibold" style={{ color: 'var(--clr-section-title)' }}>
              {section.title}
            </h2>
            <span className="text-xs uppercase tracking-[0.25em]" style={{ color: 'var(--clr-footer-icon)' }}>
              {activeSections[section.title] ? 'Hide' : 'Show'}
            </span>
          </button>

          {activeSections[section.title] ? (
            <div className="mt-5 space-y-5">
              {section.colors.length ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {section.colors.map(([key, label]) => (
                    <ColorRow key={key} label={label} k={key} colors={colors} handleChange={handleChange} />
                  ))}
                </div>
              ) : null}

              {section.fonts?.length ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {section.fonts.map(([key, label, options]) => (
                    <FontRow key={key} label={label} k={key} colors={colors} handleChange={handleChange} options={options} />
                  ))}
                </div>
              ) : null}

              {section.title === 'Language Fonts' ? (
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                  <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--clr-input-border)', backgroundColor: 'var(--clr-page-bg)' }}>
                    <div className="text-sm font-medium" style={{ color: 'var(--clr-section-title)' }}>English Preview</div>
                    <div className="mt-3">
                      <div className="text-2xl font-semibold" style={{ fontFamily: colors['--font-display'], color: 'var(--clr-section-title)' }}>
                        Aa Bb Cc — The quick brown fox
                      </div>
                      <p className="mt-2 text-sm leading-6" style={{ fontFamily: colors['--font-body'], color: 'var(--clr-section-subtitle)' }}>
                        Discover our handcrafted jewellery collection.
                      </p>
                    </div>
                  </div>
                  <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--clr-input-border)', backgroundColor: 'var(--clr-page-bg)' }}>
                    <div className="text-sm font-medium" style={{ color: 'var(--clr-section-title)' }}>Hindi Font Preview</div>
                    <div className="mt-3" style={{ fontFamily: colors['--font-lang-hi'] }}>
                      <div className="text-2xl font-semibold" style={{ color: 'var(--clr-section-title)' }}>अ आ इ ई उ ऊ</div>
                      <p className="mt-2 text-sm leading-6" style={{ color: 'var(--clr-section-subtitle)' }}>
                        नमस्ते, हमारे आभूषण संग्रह में आपका स्वागत है।
                      </p>
                    </div>
                  </div>
                  <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--clr-input-border)', backgroundColor: 'var(--clr-page-bg)' }}>
                    <div className="text-sm font-medium" style={{ color: 'var(--clr-section-title)' }}>Marathi Font Preview</div>
                    <div className="mt-3" style={{ fontFamily: colors['--font-lang-mr'] }}>
                      <div className="text-2xl font-semibold" style={{ color: 'var(--clr-section-title)' }}>अ आ इ ई उ ऊ</div>
                      <p className="mt-2 text-sm leading-6" style={{ color: 'var(--clr-section-subtitle)' }}>
                        नमस्कार, आमच्या दागिन्यांच्या संग्रहात आपले स्वागत आहे।
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      ))}

      <Actions />

      {/* Toast notification */}
      {toast ? (
        <div
          className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-lg transition ${
            toast.type === 'warn' ? 'bg-amber-500' : 'bg-green-600'
          }`}
        >
          {toast.msg}
        </div>
      ) : null}
    </div>
  )
}
