import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCatalog } from '../../context/CatalogContext'
import { useFeatureFlag } from '../../hooks/useFeatureFlag'
import { useLangText } from '../../hooks/useLangText'
import ProductCard from '../../components/product/ProductCard'
import FeatureDisabled from '../../components/common/FeatureDisabled'
import EmptyState from '../../components/common/EmptyState'
import Modal from '../../components/common/Modal'

export default function NewArrivalsPage() {
  const { t } = useTranslation()
  const { products, categories } = useCatalog()
  const text = useLangText()
  const { isEnabled: newOn, disabledMessage } = useFeatureFlag('new_arrivals')
  const { isEnabled: catalogueOn } = useFeatureFlag('catalogue')
  const [blocked, setBlocked] = useState(null)
  const list = useMemo(() => products.filter((p) => p.is_visible && p.is_new_arrival), [products])

  if (!newOn) return <div className="mx-auto max-w-7xl px-4 py-8 md:px-6"><FeatureDisabled title={t('new_arrivals')} message={disabledMessage} /></div>
  if (!catalogueOn) return <div className="mx-auto max-w-7xl px-4 py-8 md:px-6"><FeatureDisabled title={t('catalogue')} message="The catalogue is disabled." /></div>

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <h1 className="font-display text-5xl font-semibold" style={{ color: 'var(--clr-section-title)', fontFamily: 'var(--font-section-title)' }}>{t('new_arrivals')}</h1>
      <div className="mt-8">
        {list.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {list.map((product) => <ProductCard key={product.id} product={product} categoryName={text(categories.find((c) => c.id === product.category_id) || {}, 'name')} onBlocked={setBlocked} />)}
          </div>
        ) : <EmptyState title={t('no_products')} description="No new arrivals are available right now." />}
      </div>
      <Modal open={Boolean(blocked)} title="Feature Disabled" onClose={() => setBlocked(null)}>
        <FeatureDisabled title="Feature Disabled" message={blocked === 'product_detail' ? 'Product details are currently unavailable. Please contact us on WhatsApp.' : 'WhatsApp inquiry is temporarily unavailable. Please visit our shop directly.'} />
      </Modal>
    </div>
  )
}
