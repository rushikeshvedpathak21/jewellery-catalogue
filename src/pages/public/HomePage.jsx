import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSettings } from '../../context/SettingsContext'
import { useCatalog } from '../../context/CatalogContext'
import { useFeatureFlag } from '../../hooks/useFeatureFlag'
import { useLangText } from '../../hooks/useLangText'
import { useRecentViewed } from '../../hooks/useRecentViewed'
import ProductCard from '../../components/product/ProductCard'
import FeatureDisabled from '../../components/common/FeatureDisabled'
import EmptyState from '../../components/common/EmptyState'
import Section from '../../components/public/Section'
import Modal from '../../components/common/Modal'

export default function HomePage() {
  const { t } = useTranslation()
  const { settings } = useSettings()
  const { categories, products } = useCatalog()
  const text = useLangText()
  const { ids: recentIds } = useRecentViewed()  // ← use hook, not raw localStorage
  const { isEnabled: featuredOn, disabledMessage: featuredMessage } = useFeatureFlag('featured_products')
  const { isEnabled: newArrivalsOn, disabledMessage: newArrivalsMessage } = useFeatureFlag('new_arrivals')
  const { isEnabled: recentOn, disabledMessage: recentMessage } = useFeatureFlag('recently_viewed')
  const { isEnabled: catalogueOn } = useFeatureFlag('catalogue')
  const [blocked, setBlocked] = useState(null)

  const featured = useMemo(() => products.filter((p) => p.is_visible && p.is_featured), [products])
  const newArrivals = useMemo(() => products.filter((p) => p.is_visible && p.is_new_arrival), [products])

  // recentIds comes from the hook's state, so it updates reactively when a product is viewed
  const recent = useMemo(
    () => recentIds.map((id) => products.find((p) => p.id === id)).filter(Boolean),
    [recentIds, products]
  )

  const categoryGradients = [
    'linear-gradient(135deg, rgba(107,26,42,0.85), rgba(201,168,76,0.9))',
    'linear-gradient(135deg, rgba(27,94,59,0.85), rgba(201,168,76,0.9))',
    'linear-gradient(135deg, rgba(31,41,55,0.9), rgba(201,168,76,0.9))'
  ]

  return (
    <div>
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <div
          className="relative grid gap-6 overflow-hidden rounded-[2rem] p-6 shadow-soft md:grid-cols-2 md:p-10"
          style={{ background: 'linear-gradient(135deg, var(--clr-hero-bg-from), var(--clr-hero-bg-to))' }}
        >
          <div className="pointer-events-none absolute inset-0 opacity-20">
            <div className="absolute left-10 top-10 h-3 w-3 rounded-full bg-[var(--clr-footer-icon)] animate-pulse" />
            <div className="absolute right-20 top-24 h-2 w-2 rounded-full bg-[var(--clr-footer-icon)] animate-pulse" />
            <div className="absolute bottom-24 left-1/3 h-2 w-2 rounded-full bg-[var(--clr-footer-icon)] animate-pulse" />
          </div>

          <div className="flex flex-col justify-center">
            <div className="text-xs uppercase tracking-[0.3em]" style={{ color: 'var(--clr-hero-tagline)', fontFamily: 'var(--font-body)' }}>
              Luxury Jewellery
            </div>
            <h1 className="mt-3 max-w-xl font-display text-5xl font-semibold leading-tight md:text-7xl" style={{ color: 'var(--clr-hero-title)', fontFamily: 'var(--font-hero-title)' }}>
              {settings?.shop_name || 'Jewellery Shop'}
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-7 md:text-base" style={{ color: 'var(--clr-hero-body)', fontFamily: 'var(--font-hero-body)' }}>
              Discover handcrafted pieces in gold, diamond, silver and more. Enquire directly on WhatsApp without cart or checkout.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/catalogue"
                className="rounded-full px-5 py-3 text-sm font-semibold transition duration-300 ease-in-out hover:shadow-md"
                style={{ backgroundColor: 'var(--clr-hero-btn-primary-bg)', color: 'var(--clr-hero-btn-primary-text)' }}
              >
                {t('shop_now')}
              </Link>
              <Link
                to="/new-arrivals"
                className="rounded-full border px-5 py-3 text-sm font-semibold transition duration-300 ease-in-out hover:shadow-md"
                style={{
                  backgroundColor: 'var(--clr-hero-btn-secondary-bg)',
                  color: 'var(--clr-hero-btn-secondary-text)',
                  borderColor: 'var(--clr-hero-btn-secondary-border)'
                }}
              >
                {t('new_arrivals')}
              </Link>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem]" style={{ background: 'radial-gradient(circle at top, rgba(201,168,76,0.35), rgba(255,255,255,0.92) 55%, rgba(245,237,216,0.95))' }}>
            {settings?.banner_image_url ? (
              <img src={settings.banner_image_url} alt="" className="h-full min-h-[20rem] w-full object-cover" />
            ) : (
              <div className="flex min-h-[20rem] items-center justify-center">
                <div className="text-center">
                  <div className="font-display text-4xl font-semibold" style={{ color: 'var(--clr-footer-icon)' }}>
                    {settings?.shop_name}
                  </div>
                  <div className="mt-2 text-sm uppercase tracking-[0.3em]" style={{ color: 'var(--clr-hero-body)' }}>
                    Premium Catalogue
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <Section title={t('categories')} subtitle="Browse by collection">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.filter((c) => c.is_visible).map((category, index) => (
            <Link
              key={category.id}
              to={`/category/${category.id}`}
              className="rounded-3xl border p-5 shadow-soft transition duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg"
              style={{
                background: categoryGradients[index % categoryGradients.length],
                borderColor: 'rgba(201,168,76,0.3)',
                boxShadow: '0 8px 30px rgba(201,168,76,0.18)'
              }}
            >
              <div className="font-display text-3xl font-semibold" style={{ color: 'var(--clr-category-card-title)', fontFamily: 'var(--font-category-card)' }}>
                {text(category, 'name')}
              </div>
              <p className="mt-2 text-sm" style={{ color: 'var(--clr-category-card-count)' }}>
                {products.filter((p) => p.category_id === category.id).length} products
              </p>
            </Link>
          ))}
        </div>
      </Section>

      {catalogueOn ? (
        <Section title={t('featured_products')}>
          {featuredOn ? (
            featured.length ? (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {featured.slice(0, 6).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    categoryName={text(categories.find((c) => c.id === product.category_id) || {}, 'name')}
                    onBlocked={setBlocked}
                  />
                ))}
              </div>
            ) : <EmptyState title="No featured products" description="Add featured products from admin." />
          ) : <FeatureDisabled message={featuredMessage} title={t('featured_products')} />}
        </Section>
      ) : null}

      {catalogueOn ? (
        <Section title={t('new_arrivals')}>
          {newArrivalsOn ? (
            newArrivals.length ? (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {newArrivals.slice(0, 6).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    categoryName={text(categories.find((c) => c.id === product.category_id) || {}, 'name')}
                    onBlocked={setBlocked}
                  />
                ))}
              </div>
            ) : <EmptyState title="No new arrivals" description="Add new arrivals from admin." />
          ) : <FeatureDisabled message={newArrivalsMessage} title={t('new_arrivals')} />}
        </Section>
      ) : null}

      <Section title={t('recently_viewed')}>
        {recentOn ? (
          recent.length ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {recent.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  categoryName={text(categories.find((c) => c.id === product.category_id) || {}, 'name')}
                  onBlocked={setBlocked}
                />
              ))}
            </div>
          ) : <EmptyState title={t('no_recent')} description="Open a product to populate this section." />
        ) : <FeatureDisabled message={recentMessage} title={t('recently_viewed')} />}
      </Section>

      <Modal open={Boolean(blocked)} title="Feature Disabled" onClose={() => setBlocked(null)}>
        <FeatureDisabled
          title="Feature Disabled"
          message={
            blocked === 'product_detail'
              ? 'Product details are currently unavailable. Please contact us on WhatsApp.'
              : 'WhatsApp inquiry is temporarily unavailable. Please visit our shop directly.'
          }
        />
      </Modal>
    </div>
  )
}
