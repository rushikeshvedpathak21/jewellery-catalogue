import { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCatalog } from '../../context/CatalogContext'
import { useFeatureFlag } from '../../hooks/useFeatureFlag'
import { useLangText } from '../../hooks/useLangText'
import ProductFilters from '../../components/product/ProductFilters'
import ProductCard from '../../components/product/ProductCard'
import FeatureDisabled from '../../components/common/FeatureDisabled'
import EmptyState from '../../components/common/EmptyState'
import Modal from '../../components/common/Modal'

const SORTER = {
  newest: (a, b) => new Date(b.created_at) - new Date(a.created_at),
  views: (a, b) => (b.view_count || 0) - (a.view_count || 0),
  inquiries: (a, b) => (b.whatsapp_inquiry_count || 0) - (a.whatsapp_inquiry_count || 0),
  name: (a, b) => (a.name_en || '').localeCompare(b.name_en || '')
}

export default function CategoryPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { categories, products } = useCatalog()
  const text = useLangText()
  const { isEnabled: catalogueOn, disabledMessage: catalogueMessage } = useFeatureFlag('catalogue')
  const { isEnabled: catFilterOn } = useFeatureFlag('category_filter')
  const { isEnabled: metalFilterOn } = useFeatureFlag('metal_filter')
  const { isEnabled: sortOn } = useFeatureFlag('sort_options')
  const [category, setCategory] = useState(id || '')
  const [metal, setMetal] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [blocked, setBlocked] = useState(null)

  const activeCategory = categories.find((c) => c.id === category) || categories.find((c) => c.id === id) || categories[0]
  const list = useMemo(() => {
    let items = products.filter((p) => p.is_visible)
    if (activeCategory?.id) items = items.filter((p) => p.category_id === activeCategory.id)
    if (metal) items = items.filter((p) => p.metal_type === metal)
    if (SORTER[sortBy]) items = [...items].sort(SORTER[sortBy])
    return items
  }, [products, activeCategory, metal, sortBy])

  if (!catalogueOn) return <div className="mx-auto max-w-7xl px-4 py-8 md:px-6"><FeatureDisabled title={t('catalogue')} message={catalogueMessage} /></div>

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-5xl font-semibold" style={{ color: 'var(--clr-section-title)', fontFamily: 'var(--font-section-title)' }}>
            {activeCategory ? text(activeCategory, 'name') : t('categories')}
          </h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--clr-section-subtitle)', fontFamily: 'var(--font-body)' }}>Explore jewellery curated by category.</p>
        </div>
        <button onClick={() => navigate('/catalogue')} className="rounded-full border px-4 py-2 text-sm font-semibold" style={{ borderColor: 'var(--clr-input-border)', color: 'var(--clr-section-title)' }}>{t('all_products')}</button>
      </div>

      <ProductFilters
        query=""
        onQueryChange={() => {}}
        categories={categories.map((c) => ({ id: c.id, name: text(c, 'name') }))}
        selectedCategory={category}
        onCategoryChange={setCategory}
        selectedMetal={metal}
        onMetalChange={setMetal}
        sortBy={sortBy}
        onSortChange={setSortBy}
        showCategory={catFilterOn}
        showMetal={metalFilterOn}
        showSort={sortOn}
      />

      <div className="mt-8">
        {list.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {list.map((product) => <ProductCard key={product.id} product={product} categoryName={text(activeCategory || {}, 'name')} onBlocked={setBlocked} />)}
          </div>
        ) : <EmptyState title={t('no_products')} description="No items in this category right now." />}
      </div>

      <Modal open={Boolean(blocked)} title="Feature Disabled" onClose={() => setBlocked(null)}>
        <FeatureDisabled title="Feature Disabled" message={blocked === 'product_detail' ? 'Product details are currently unavailable. Please contact us on WhatsApp.' : 'WhatsApp inquiry is temporarily unavailable. Please visit our shop directly.'} />
      </Modal>
    </div>
  )
}
