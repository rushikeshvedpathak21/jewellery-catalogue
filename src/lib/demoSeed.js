import { CATEGORIES_SEED, SETTINGS_SEED, FEATURE_FLAGS_SEED, PRODUCTS_SEED } from '../data/defaults'

export const DEMO_KEYS = {
  categories: 'jk_demo_categories',
  products: 'jk_demo_products',
  settings: 'jk_demo_settings',
  featureFlags: 'jk_demo_feature_flags',
  wishlist: 'jk_demo_wishlist',
  language: 'jk_demo_language',
  adminSession: 'jk_demo_admin_session',
  recentlyViewed: 'jk_demo_recently_viewed'
}

export const initDemoData = () => {
  const seedIfMissing = (key, value) => {
    if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify(value))
  }
  seedIfMissing(DEMO_KEYS.categories, CATEGORIES_SEED)
  seedIfMissing(DEMO_KEYS.products, PRODUCTS_SEED)
  seedIfMissing(DEMO_KEYS.settings, SETTINGS_SEED)
  seedIfMissing(DEMO_KEYS.featureFlags, FEATURE_FLAGS_SEED)
  seedIfMissing(DEMO_KEYS.wishlist, [])
  seedIfMissing(DEMO_KEYS.language, 'en')
  seedIfMissing(DEMO_KEYS.recentlyViewed, [])
}
