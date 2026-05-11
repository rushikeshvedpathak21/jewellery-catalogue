import Input from '../common/Input'
import Select from '../common/Select'
import { useTranslation } from 'react-i18next'

export default function ProductFilters({ query, onQueryChange, categories, selectedCategory, onCategoryChange, selectedMetal, onMetalChange, sortBy, onSortChange, showCategory = true, showMetal = true, showSort = true }) {
  const { t } = useTranslation()
  return (
    <div className="grid gap-3 md:grid-cols-4">
      <Input value={query} onChange={(e) => onQueryChange(e.target.value)} placeholder={t('search_placeholder')} />
      {showCategory ? <Select value={selectedCategory} onChange={(e) => onCategoryChange(e.target.value)}><option value="">{t('all')} {t('category')}</option>{categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}</Select> : null}
      {showMetal ? <Select value={selectedMetal} onChange={(e) => onMetalChange(e.target.value)}><option value="">{t('all')} {t('metal')}</option>{['Gold', 'Silver', 'Diamond', 'Platinum'].map((m) => <option key={m} value={m}>{m}</option>)}</Select> : null}
      {showSort ? <Select value={sortBy} onChange={(e) => onSortChange(e.target.value)}><option value="newest">Newest</option><option value="views">Most Viewed</option><option value="inquiries">Most Inquired</option><option value="name">Name A-Z</option></Select> : null}
    </div>
  )
}
