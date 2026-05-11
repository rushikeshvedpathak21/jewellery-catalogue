import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
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

export default function SearchPage() {
  const { t } = useTranslation()
  const { categories, products } = useCatalog()
  const text = useLangText()
  const { isEnabled: searchOn, disabledMessage: searchMessage } = useFeatureFlag('search')
  const { isEnabled: catalogueOn } = useFeatureFlag('catalogue')
  const { isEnabled: catFilterOn } = useFeatureFlag('category_filter')
  const { isEnabled: metalFilterOn } = useFeatureFlag('metal_filter')
  const { isEnabled: sortOn } = useFeatureFlag('sort_options')
  const [params] = useSearchParams()
  const [query, setQuery] = useState(params.get('q') || '')
  const [category, setCategory] = useState('')
  const [metal, setMetal] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [blocked, setBlocked] = useState(null)

  const list = useMemo(() => {
    let items = products.filter((p) => p.is_visible)
    if (query) items = items.filter((p) => [p.name_en, p.name_hi, p.name_mr, p.description_en, p.description_hi, p.description_mr].some((x) => String(x || '').toLowerCase().includes(query.toLowerCase())))
    if (category) items = items.filter((p) => p.category_id === category)
    if (metal) items = items.filter((p) => p.metal_type === metal)
    if (SORTER[sortBy]) items = [...items].sort(SORTER[sortBy])
    return items
  }, [products, query, category, metal, sortBy])

  if (!searchOn) return <div className="mx-auto max-w-7xl px-4 py-8 md:px-6"><FeatureDisabled title={t('search')} message={searchMessage} /></div>
  if (!catalogueOn) return <div className="mx-auto max-w-7xl px-4 py-8 md:px-6"><FeatureDisabled title={t('catalogue')} message="The catalogue is disabled, so search is unavailable." /></div>

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <h1 className="font-display text-5xl font-semibold" style={{ color: 'var(--clr-section-title)', fontFamily: 'var(--font-section-title)' }}>{t('search')}</h1>
      <div className="mt-6">
        <ProductFilters
          query={query}
          onQueryChange={setQuery}
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
      </div>
      <div className="mt-8">
        {list.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {list.map((product) => <ProductCard key={product.id} product={product} categoryName={text(categories.find((c) => c.id === product.category_id) || {}, 'name')} onBlocked={setBlocked} />)}
          </div>
        ) : <EmptyState title={t('no_products')} description="No matching jewellery items were found." />}
      </div>
      <Modal open={Boolean(blocked)} title="Feature Disabled" onClose={() => setBlocked(null)}>
        <FeatureDisabled title="Feature Disabled" message={blocked === 'product_detail' ? 'Product details are currently unavailable. Please contact us on WhatsApp.' : 'WhatsApp inquiry is temporarily unavailable. Please visit our shop directly.'} />
      </Modal>
    </div>
  )
}
