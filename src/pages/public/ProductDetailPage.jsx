import { useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Share2, MessageCircleMore, Heart, ArrowLeft } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { useCatalog } from '../../context/CatalogContext'
import { useSettings } from '../../context/SettingsContext'
import { useFeatureFlag } from '../../hooks/useFeatureFlag'
import { useLangText } from '../../hooks/useLangText'
import { useWishlist } from '../../context/WishlistContext'
import { useRecentViewed } from '../../hooks/useRecentViewed'
import FeatureDisabled from '../../components/common/FeatureDisabled'
import Button from '../../components/common/Button'
import ProductGallery from '../../components/product/ProductGallery'
import ProductCard from '../../components/product/ProductCard'
import Badge from '../../components/common/Badge'

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { products, categories, incrementMetric } = useCatalog()
  const { settings } = useSettings()
  const text = useLangText()
  const { add } = useRecentViewed()
  const { has, toggle } = useWishlist()
  const { isEnabled: detailOn, disabledMessage } = useFeatureFlag('product_detail')
  const { isEnabled: whatsappOn } = useFeatureFlag('whatsapp_inquiry')
  const { isEnabled: shareOn } = useFeatureFlag('share_product')
  const { isEnabled: qrOn } = useFeatureFlag('qr_code')
  const { isEnabled: relatedOn } = useFeatureFlag('related_products')
  const { isEnabled: wishlistOn } = useFeatureFlag('wishlist')
  const product = products.find((p) => p.id === id)
  const category = categories.find((c) => c.id === product?.category_id)
  const related = useMemo(() => products.filter((p) => p.is_visible && p.category_id === product?.category_id && p.id !== product?.id).slice(0, 4), [products, product])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  useEffect(() => {
    if (product) {
      add(product.id)
      incrementMetric(product.id, 'view_count')
    }
  }, [product?.id])

  const shareProduct = async () => {
    const url = window.location.href
    const title = product ? text(product, 'name') : ''
    if (navigator.share) await navigator.share({ title, text: title, url })
    else { await navigator.clipboard.writeText(url); alert('Link copied.') }
  }

  const askWhatsApp = () => {
    const productUrl = window.location.href
    const imageUrl = product.images?.[0] || ''
    const imageSection = /^https?:\/\//i.test(imageUrl)
      ? `
Product Image:
${imageUrl}`
      : ''

    const message = `Hello, I am interested in this jewellery product.

Product: ${text(product, 'name')}

Product Link:
${productUrl}${imageSection}

Please share more details.`

    const msg = encodeURIComponent(message)

    window.open(`https://wa.me/${settings?.whatsapp_number || ''}?text=${msg}`, '_blank', 'noreferrer')
  }

  if (!detailOn) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 md:px-6">
        <FeatureDisabled title="Product details" message={disabledMessage} />
        <div className="mt-4">
          <Button variant="secondary" onClick={() => navigate(-1)} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Go back
          </Button>
        </div>
      </div>
    )
  }

  if (!product) return <div className="mx-auto max-w-4xl px-4 py-8 md:px-6">Product not found.</div>

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6" style={{ backgroundColor: 'var(--clr-page-bg)' }}>
      <button onClick={() => navigate(-1)} className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold" style={{ borderColor: 'var(--clr-input-border)' }}>
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="grid gap-8 lg:grid-cols-2">
        <ProductGallery images={product.images || []} />

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge style={{ backgroundColor: 'var(--clr-product-badge-new-bg)', color: 'var(--clr-product-badge-new-text)' }}>{category ? text(category, 'name') : 'Jewellery'}</Badge>
            <Badge style={{ backgroundColor: 'var(--clr-product-card-bg)', color: 'var(--clr-footer-icon)', border: '1px solid var(--clr-product-card-border)' }}>{product.metal_type}</Badge>
            {product.is_new_arrival ? <Badge style={{ backgroundColor: 'var(--clr-product-badge-new-bg)', color: 'var(--clr-product-badge-new-text)' }}>New Arrival</Badge> : null}
            {product.is_out_of_stock ? <Badge style={{ backgroundColor: '#6B1A2A', color: '#ffffff' }}>Out of stock</Badge> : null}
          </div>

          <h1 className="mt-4 font-display text-5xl font-semibold md:text-6xl" style={{ color: 'var(--clr-section-title)', fontFamily: 'var(--font-display)' }}>
            {text(product, 'name')}
          </h1>

          <p className="mt-4 text-base leading-8" style={{ color: 'var(--clr-product-card-meta)', fontFamily: 'var(--font-body)' }}>
            {text(product, 'description')}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-4 rounded-3xl border p-5" style={{ borderColor: 'var(--clr-product-card-border)', backgroundColor: 'var(--clr-product-card-bg)' }}>
            <div>
              <div className="text-xs uppercase tracking-[0.25em]" style={{ color: 'var(--clr-footer-icon)' }}>Weight</div>
              <div className="mt-1 text-lg font-semibold" style={{ color: 'var(--clr-product-card-title)' }}>{product.weight_grams} g</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.25em]" style={{ color: 'var(--clr-footer-icon)' }}>Views</div>
              <div className="mt-1 text-lg font-semibold" style={{ color: 'var(--clr-product-card-title)' }}>{product.view_count || 0}</div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {whatsappOn ? (
              <Button
                onClick={askWhatsApp}
                className="w-full gap-2 md:w-auto"
                style={{ backgroundColor: 'var(--clr-whatsapp-btn-bg)', backgroundImage: 'none', color: 'var(--clr-whatsapp-btn-text)', borderColor: 'transparent' }}
              >
                <MessageCircleMore className="h-4 w-4" />
                Ask on WhatsApp
              </Button>
            ) : null}
            {wishlistOn ? (
              <Button
                variant="secondary"
                onClick={() => toggle(product.id)}
                className="gap-2"
                style={{
                  backgroundColor: 'var(--clr-wishlist-btn-bg)',
                  color: 'var(--clr-wishlist-btn-text)',
                  borderColor: 'var(--clr-wishlist-btn-border)'
                }}
              >
                <Heart className={has(product.id) ? 'h-4 w-4 fill-current' : 'h-4 w-4'} />
                {has(product.id) ? 'Wishlisted' : 'Wishlist'}
              </Button>
            ) : null}
            {shareOn ? (
              <Button variant="secondary" onClick={shareProduct} className="gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            ) : null}
          </div>

          {qrOn ? (
            <div className="mt-6 rounded-3xl border p-5 shadow-soft" style={{ borderColor: 'var(--clr-product-card-border)', backgroundColor: 'var(--clr-product-card-bg)' }}>
              <div className="mb-4 font-semibold" style={{ color: 'var(--clr-section-title)' }}>QR Code</div>
              <QRCodeSVG value={window.location.href} size={140} />
            </div>
          ) : null}
        </div>
      </div>

      {relatedOn ? (
        <section className="mt-14">
          <hr className="gold-divider" />
          <h2 className="font-display text-4xl font-semibold" style={{ color: 'var(--clr-section-title)', fontFamily: 'var(--font-section-title)' }}>Related Products</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {related.map((item) => <ProductCard key={item.id} product={item} categoryName={category ? text(category, 'name') : ''} />)}
          </div>
        </section>
      ) : null}
    </div>
  )
}
