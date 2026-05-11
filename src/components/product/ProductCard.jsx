import { Heart, MessageCircleMore } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Badge from '../common/Badge'
import Button from '../common/Button'
import { byLang, currencyString, cn } from '../../lib/utils'
import { useLanguage } from '../../context/LanguageContext'
import { useFeatureFlag } from '../../hooks/useFeatureFlag'
import { useWishlist } from '../../context/WishlistContext'
import { useSettings } from '../../context/SettingsContext'

export default function ProductCard({ product, categoryName = '', onBlocked, className = '' }) {
  const navigate = useNavigate()
  const { lang } = useLanguage()
  const { settings } = useSettings()
  const { isEnabled: detailOn } = useFeatureFlag('product_detail')
  const { isEnabled: wishlistOn } = useFeatureFlag('wishlist')
  const { isEnabled: whatsappOn } = useFeatureFlag('whatsapp_inquiry')
  const { isEnabled: newArrivalOn } = useFeatureFlag('new_arrivals')
  const { has, toggle } = useWishlist()

  const openDetail = () => {
    if (!detailOn) return onBlocked?.('product_detail')
    navigate(`/product/${product.id}`)
  }

  const askWhatsApp = (e) => {
    e.stopPropagation()
    if (!whatsappOn) return onBlocked?.('whatsapp_inquiry')

    const name = byLang(product, 'name', lang)
    const productUrl = `${window.location.origin}/product/${product.id}`
    const imageUrl = product.images?.[0] || ''
    const imageSection = /^https?:\/\//i.test(imageUrl)
      ? `
Product Image:
${imageUrl}`
      : ''

    const message = `Hello, I am interested in this jewellery product.

Product: ${name}

Product Link:
${productUrl}${imageSection}

Please share more details.`

    const msg = encodeURIComponent(message)

    window.open(`https://wa.me/${settings?.whatsapp_number || ''}?text=${msg}`, '_blank', 'noreferrer')
  }

  return (
    <article
      onClick={openDetail}
      className={cn('group overflow-hidden rounded-3xl border shadow-soft transition duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg', className)}
      style={{ backgroundColor: 'var(--clr-product-card-bg)', borderColor: 'var(--clr-product-card-border)' }}
    >
      <div className="h-[3px] w-full" style={{ background: 'linear-gradient(90deg, var(--clr-product-badge-new-bg), var(--clr-footer-icon))' }} />
      <div className="relative aspect-square overflow-hidden" style={{ backgroundColor: 'var(--clr-product-card-img-bg)' }}>
        <img src={product.images?.[0] || ''} alt={byLang(product, 'name', lang)} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        {newArrivalOn && product.is_new_arrival ? <Badge className="absolute left-3 top-3" style={{ backgroundColor: 'var(--clr-product-badge-new-bg)', color: 'var(--clr-product-badge-new-text)' }}>New</Badge> : null}
        {product.is_out_of_stock ? <Badge className="absolute right-3 top-3" style={{ backgroundColor: '#6B1A2A', color: '#ffffff' }}>Out of stock</Badge> : null}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/45 to-transparent p-4 text-white">
          <div className="text-xs uppercase tracking-[0.25em]" style={{ color: 'var(--clr-footer-icon)', fontFamily: 'var(--font-product-card-body)' }}>
            {categoryName}
          </div>
        </div>
      </div>
      <div className="space-y-3 p-4">
        <div>
          <h3 className="text-2xl font-semibold leading-tight" style={{ color: 'var(--clr-product-card-title)', fontFamily: 'var(--font-product-card-title)' }}>
            {byLang(product, 'name', lang)}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm leading-6" style={{ color: 'var(--clr-product-card-meta)', fontFamily: 'var(--font-product-card-body)' }}>
            {byLang(product, 'description', lang)}
          </p>
        </div>
        <div className="flex items-center justify-between text-sm" style={{ color: 'var(--clr-product-card-meta)', fontFamily: 'var(--font-product-card-body)' }}>
          <span>{product.metal_type}</span>
          <span>{currencyString(product.weight_grams)}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {whatsappOn ? (
            <Button
              className="flex-1 gap-2"
              onClick={askWhatsApp}
              style={{ backgroundColor: 'var(--clr-whatsapp-btn-bg)', backgroundImage: 'none', color: 'var(--clr-whatsapp-btn-text)', borderColor: 'transparent' }}
            >
              <MessageCircleMore className="h-4 w-4" />
              Ask
            </Button>
          ) : (
            <Button className="flex-1 gap-2" onClick={(e) => { e.stopPropagation(); onBlocked?.('whatsapp_inquiry') }} variant="secondary">
              <MessageCircleMore className="h-4 w-4" />
              WhatsApp Off
            </Button>
          )}
          {wishlistOn ? (
            <Button
              className="gap-2"
              variant="secondary"
              onClick={(e) => { e.stopPropagation(); toggle(product.id) }}
              style={{
                backgroundColor: 'var(--clr-wishlist-btn-bg)',
                color: 'var(--clr-wishlist-btn-text)',
                borderColor: 'var(--clr-wishlist-btn-border)'
              }}
            >
              <Heart className={cn('h-4 w-4', has(product.id) ? 'fill-current' : '')} />
            </Button>
          ) : null}
        </div>
      </div>
    </article>
  )
}
