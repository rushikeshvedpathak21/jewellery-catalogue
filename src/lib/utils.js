export const cn = (...classes) => classes.filter(Boolean).join(' ')
export const byLang = (row, base, lang = 'en') => row?.[`${base}_${lang}`] ?? row?.[`${base}_en`] ?? ''
export const normalizeLang = (lang) => {
  const code = (lang || 'en').slice(0, 2)
  return ['en', 'hi', 'mr'].includes(code) ? code : 'en'
}
export const moneySafe = (n) => Number.isFinite(Number(n)) ? Number(n) : 0
export const currencyString = (n) => `${moneySafe(n).toFixed(2)} g`
export const sortByNewest = (items = []) => [...items].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
export const sortByViews = (items = []) => [...items].sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
export const sortByInquiries = (items = []) => [...items].sort((a, b) => (b.whatsapp_inquiry_count || 0) - (a.whatsapp_inquiry_count || 0))
export const makeId = () => crypto.randomUUID()
