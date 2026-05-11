import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCatalog } from '../../context/CatalogContext'
import { useWishlist } from '../../context/WishlistContext'
import { useFeatureFlag } from '../../hooks/useFeatureFlag'
import { useLangText } from '../../hooks/useLangText'
import ProductCard from '../../components/product/ProductCard'
import FeatureDisabled from '../../components/common/FeatureDisabled'
import EmptyState from '../../components/common/EmptyState'
import Modal from '../../components/common/Modal'

export default function WishlistPage() {
  const { t } = useTranslation()
  const { products, categories } = useCatalog()
  const text = useLangText()
  const { items } = useWishlist()
  const { isEnabled: wishlistOn, disabledMessage } = useFeatureFlag('wishlist')
  const [blocked, setBlocked] = useState(null)
  const saved = useMemo(() => items.map((id) => products.find((p) => p.id === id)).filter(Boolean), [items, products])

  if (!wishlistOn) return <div className="mx-auto max-w-7xl px-4 py-8 md:px-6"><FeatureDisabled title={t('wishlist')} message={disabledMessage} /></div>

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <h1 className="font-display text-5xl font-semibold" style={{ color: 'var(--clr-section-title)', fontFamily: 'var(--font-section-title)' }}>{t('wishlist')}</h1>
      <div className="mt-8">
        {saved.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {saved.map((product) => <ProductCard key={product.id} product={product} categoryName={text(categories.find((c) => c.id === product.category_id) || {}, 'name')} onBlocked={setBlocked} />)}
          </div>
        ) : <EmptyState title={t('no_wishlist')} description="Tap the heart on any product to save it." />}
      </div>
      <Modal open={Boolean(blocked)} title="Feature Disabled" onClose={() => setBlocked(null)}>
        <FeatureDisabled title="Feature Disabled" message={blocked === 'product_detail' ? 'Product details are currently unavailable. Please contact us on WhatsApp.' : 'WhatsApp inquiry is temporarily unavailable. Please visit our shop directly.'} />
      </Modal>
    </div>
  )
}
