import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useCatalog } from '../../context/CatalogContext'
import { useFeatureFlags } from '../../context/FeatureFlagContext'
import StatCard from '../../components/admin/StatCard'
import Button from '../../components/common/Button'
import { sortByInquiries, sortByNewest, sortByViews } from '../../lib/utils'

export default function DashboardPage() {
  const { products, categories } = useCatalog()
  const { flags } = useFeatureFlags()

  const stats = useMemo(() => ({
    products: products.length,
    categories: categories.length,
    views: products.reduce((sum, p) => sum + Number(p.view_count || 0), 0),
    inquiries: products.reduce((sum, p) => sum + Number(p.whatsapp_inquiry_count || 0), 0)
  }), [products, categories])

  const topViewed = sortByViews(products).slice(0, 5)
  const topInquired = sortByInquiries(products).slice(0, 5)
  const recent = sortByNewest(products).slice(0, 5)
  const onCount = flags.filter((f) => f.is_enabled).length
  const offCount = flags.length - onCount

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-5xl font-semibold" style={{ color: 'var(--clr-section-title)' }}>Dashboard</h1>
        <p className="mt-2 text-sm" style={{ color: 'var(--clr-section-subtitle)' }}>Track catalogue health and feature status.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard title="Total Products" value={stats.products} />
        <StatCard title="Total Categories" value={stats.categories} />
        <StatCard title="Total Views" value={stats.views} />
        <StatCard title="Total WhatsApp Inquiries" value={stats.inquiries} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Most Viewed Products" items={topViewed} metric="view_count" />
        <Panel title="Most Inquired Products" items={topInquired} metric="whatsapp_inquiry_count" />
        <Panel title="Recent Products" items={recent} metric="created_at" />
        <div className="rounded-3xl border p-5 shadow-soft" style={{ backgroundColor: 'var(--clr-page-bg)', borderColor: 'var(--clr-input-border)' }}>
          <h2 className="font-display text-3xl font-semibold" style={{ color: 'var(--clr-section-title)' }}>Feature Flags</h2>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <StatCard title="ON" value={onCount} />
            <StatCard title="OFF" value={offCount} />
          </div>
          <Link to="/admin/features" className="mt-5 inline-block">
            <Button>Go to Feature Settings</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

function Panel({ title, items, metric }) {
  return (
    <div className="rounded-3xl border p-5 shadow-soft" style={{ backgroundColor: 'var(--clr-page-bg)', borderColor: 'var(--clr-input-border)' }}>
      <h2 className="font-display text-3xl font-semibold" style={{ color: 'var(--clr-section-title)' }}>{title}</h2>
      <div className="mt-4 space-y-3">
        {items.map((item, idx) => (
          <div key={item.id} className="flex items-center justify-between rounded-2xl px-4 py-3" style={{ backgroundColor: 'var(--clr-footer-bg)' }}>
            <div>
              <div className="font-medium" style={{ color: 'var(--clr-section-title)' }}>{idx + 1}. {item.name_en}</div>
              <div className="text-xs" style={{ color: 'var(--clr-footer-text)' }}>{item.metal_type}</div>
            </div>
            <div className="text-sm font-semibold" style={{ color: 'var(--clr-footer-icon)' }}>{metric === 'created_at' ? new Date(item.created_at).toLocaleDateString() : item[metric] || 0}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
