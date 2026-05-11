import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import {
  bulkUpdateProducts,
  deleteCategory,
  deleteProduct,
  incrementProductMetric,
  loadCategories,
  loadProducts,
  saveCategory,
  saveProduct
} from '../services/catalog'
import { hasSupabase, supabase } from '../lib/supabase'

const CatalogContext = createContext(null)

export function CatalogProvider({ children }) {
  // Start EMPTY — not with seed data — so stale defaults never flash on screen
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const channelsRef = useRef([])

  const refresh = async () => {
    const [cat, prod] = await Promise.all([loadCategories(), loadProducts()])
    setCategories(cat || [])
    setProducts(prod || [])
    setLoading(false)
  }

  useEffect(() => {
    refresh()

    if (!hasSupabase || !supabase) return

    const productChannel = supabase
      .channel('catalog-products')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        loadProducts().then((data) => setProducts(data || []))
      })
      .subscribe()

    const categoryChannel = supabase
      .channel('catalog-categories')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, () => {
        loadCategories().then((data) => setCategories(data || []))
      })
      .subscribe()

    channelsRef.current = [productChannel, categoryChannel]
    return () => {
      channelsRef.current.forEach((ch) => supabase.removeChannel(ch))
      channelsRef.current = []
    }
  }, [])

  const categoryMap = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, c])),
    [categories]
  )

  const value = useMemo(() => ({
    categories,
    products,
    categoryMap,
    loading,
    refresh,
    saveCategory: async (payload) => { const s = await saveCategory(payload); await refresh(); return s },
    deleteCategory: async (id) => { await deleteCategory(id); await refresh() },
    saveProduct: async (payload, files = []) => { const s = await saveProduct(payload, files); await refresh(); return s },
    deleteProduct: async (id) => { await deleteProduct(id); await refresh() },
    bulkUpdateProducts: async (ids, patch) => { await bulkUpdateProducts(ids, patch); await refresh() },
    incrementMetric: async (id, field) => {
      await incrementProductMetric(id, field)
      setProducts((prev) =>
        prev.map((p) => p.id === id ? { ...p, [field]: Number(p[field] || 0) + 1 } : p)
      )
    }
  }), [categories, products, categoryMap, loading])

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
}

export const useCatalog = () => {
  const ctx = useContext(CatalogContext)
  if (!ctx) throw new Error('useCatalog must be used inside CatalogProvider')
  return ctx
}
