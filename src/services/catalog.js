import { hasSupabase, supabase } from '../lib/supabase'
import { ls } from '../lib/localStore'
import { DEMO_KEYS } from '../lib/demoSeed'
import { CATEGORIES_SEED, PRODUCTS_SEED } from '../data/defaults'
import { makeId } from '../lib/utils'

// ─── Storage bucket name (must match bucket created in Supabase Dashboard) ───
const BUCKET = 'products'

const firstDefined = (...values) => values.find((v) => v !== undefined && v !== null && v !== '')

function slugify(text = '') {
  return String(text)
    .trim()
    .toLowerCase()
    .replace(/['\"]/g, '')
    .replace(/[^a-z0-9\u0900-\u097F]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function normalizeCategoryRow(row = {}) {
  const baseName = firstDefined(row.name_en, row.name, row.slug, row.name_hi, row.name_mr) || ''
  return {
    id: row.id || row.slug || slugify(baseName) || makeId(),
    name_en: firstDefined(row.name_en, row.name, baseName) || '',
    name_hi: firstDefined(row.name_hi, row.name, baseName) || '',
    name_mr: firstDefined(row.name_mr, row.name, baseName) || '',
    is_visible: row.is_visible ?? row.enabled ?? true,
    created_at: row.created_at || new Date().toISOString(),
    name: firstDefined(row.name, row.name_en, baseName) || '',
    slug: firstDefined(row.slug, slugify(baseName)) || '',
    image_url: firstDefined(row.image_url, row.imageUrl, '') || '',
  }
}

export function normalizeProductRow(row = {}) {
  const baseName = firstDefined(row.name_en, row.name, row.title) || ''
  const baseDesc = firstDefined(row.description_en, row.description, row.desc) || ''
  const images = Array.isArray(row.images)
    ? row.images
    : typeof row.image === 'string' && row.image
      ? [row.image]
      : []

  return {
    id: row.id || makeId(),
    name_en: firstDefined(row.name_en, row.name, baseName) || '',
    name_hi: firstDefined(row.name_hi, row.name, baseName) || '',
    name_mr: firstDefined(row.name_mr, row.name, baseName) || '',
    description_en: firstDefined(row.description_en, row.description, baseDesc) || '',
    description_hi: firstDefined(row.description_hi, row.description, baseDesc) || '',
    description_mr: firstDefined(row.description_mr, row.description, baseDesc) || '',
    category_id: firstDefined(row.category_id, row.category, row.category_slug) || '',
    metal_type: firstDefined(row.metal_type, row.metal, 'Gold') || 'Gold',
    weight_grams: Number(firstDefined(row.weight_grams, row.price, 0) || 0),
    images,
    is_visible: row.is_visible ?? row.visible ?? true,
    is_featured: row.is_featured ?? row.featured ?? false,
    is_new_arrival: row.is_new_arrival ?? row.new_arrival ?? false,
    is_out_of_stock: row.is_out_of_stock ?? row.out_of_stock ?? false,
    view_count: Number(row.view_count ?? row.views ?? 0),
    whatsapp_inquiry_count: Number(row.whatsapp_inquiry_count ?? row.inquiry_count ?? 0),
    created_at: row.created_at || new Date().toISOString(),
    name: firstDefined(row.name, row.name_en, baseName) || '',
    category: firstDefined(row.category, row.category_id, row.category_slug) || '',
    description: firstDefined(row.description, row.description_en, baseDesc) || '',
    price: firstDefined(row.price, row.weight_grams, 0) || 0,
    featured: row.featured ?? row.is_featured ?? false,
  }
}

function normalizeCategoryList(rows = []) { return rows.map(normalizeCategoryRow) }
function normalizeProductList(rows = []) { return rows.map(normalizeProductRow) }
function read(key, fallback) { return ls.get(key, fallback) }
function save(key, value) { ls.set(key, value) }

// ─── CATEGORIES ───────────────────────────────────────────────────────────────

export async function loadCategories() {
  if (hasSupabase) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error && data) return normalizeCategoryList(data)
    console.error('loadCategories error:', error)
  }
  return normalizeCategoryList(read(DEMO_KEYS.categories, CATEGORIES_SEED))
}

export async function saveCategory(category) {
  const normalized = normalizeCategoryRow(category)
  const payload = {
    id: normalized.id,
    name: normalized.name_en || normalized.name,
    slug: normalized.slug || slugify(normalized.name_en),
    image_url: normalized.image_url || '',
    name_en: normalized.name_en,
    name_hi: normalized.name_hi,
    name_mr: normalized.name_mr,
    is_visible: normalized.is_visible,
    created_at: normalized.created_at,
  }

  if (hasSupabase) {
    const { data, error } = await supabase
      .from('categories')
      .upsert(payload, { onConflict: 'id' })
      .select()
      .single()
    if (!error && data) return normalizeCategoryRow(data)
    console.error('saveCategory error:', error)
  }

  const list = read(DEMO_KEYS.categories, CATEGORIES_SEED).map(normalizeCategoryRow)
  const idx = list.findIndex((x) => x.id === normalized.id)
  const next = idx >= 0 ? list.map((x, i) => (i === idx ? normalized : x)) : [normalized, ...list]
  save(DEMO_KEYS.categories, next)
  return normalized
}

export async function deleteCategory(id) {
  if (hasSupabase) {
    await supabase.from('products').update({ category_id: null, category: null }).eq('category_id', id)
    await supabase.from('categories').delete().eq('id', id)
    return
  }
  const cats = read(DEMO_KEYS.categories, CATEGORIES_SEED).map(normalizeCategoryRow)
  save(DEMO_KEYS.categories, cats.filter((x) => x.id !== id))
  const prods = read(DEMO_KEYS.products, PRODUCTS_SEED).map(normalizeProductRow)
  save(DEMO_KEYS.products, prods.map((p) => p.category_id === id ? { ...p, category_id: null, category: null } : p))
}

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────

export async function loadProducts() {
  if (hasSupabase) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error && data) return normalizeProductList(data)
    console.error('loadProducts error:', error)
  }
  return normalizeProductList(read(DEMO_KEYS.products, PRODUCTS_SEED))
}

export async function saveProduct(product, files = []) {
  const uploadedUrls = files.length ? await uploadProductImages(files) : []
  const existingImages = Array.isArray(product.images) ? product.images : []
  const mergedImages = [...existingImages, ...uploadedUrls].slice(0, 5)

  const normalized = normalizeProductRow({
    ...product,
    images: mergedImages,
    id: product.id || makeId(),
    created_at: product.created_at || new Date().toISOString(),
  })

  const payload = {
    id: normalized.id,
    created_at: normalized.created_at,
    images: mergedImages,
    // Simple original columns (always present)
    name: normalized.name_en,
    category: normalized.category_id || normalized.category || '',
    description: normalized.description_en,
    price: String(normalized.weight_grams || 0),
    featured: Boolean(normalized.is_featured),
    // Extended columns (added by supabase_migration.sql)
    name_en: normalized.name_en,
    name_hi: normalized.name_hi,
    name_mr: normalized.name_mr,
    description_en: normalized.description_en,
    description_hi: normalized.description_hi,
    description_mr: normalized.description_mr,
    category_id: normalized.category_id || null,
    metal_type: normalized.metal_type,
    weight_grams: Number(normalized.weight_grams || 0),
    is_visible: normalized.is_visible,
    is_featured: normalized.is_featured,
    is_new_arrival: normalized.is_new_arrival,
    is_out_of_stock: normalized.is_out_of_stock,
    view_count: Number(normalized.view_count || 0),
    whatsapp_inquiry_count: Number(normalized.whatsapp_inquiry_count || 0),
  }

  if (hasSupabase) {
    const { data, error } = await supabase
      .from('products')
      .upsert(payload, { onConflict: 'id' })
      .select()
      .single()
    if (!error && data) return normalizeProductRow(data)
    console.error('saveProduct error:', error)
  }

  const list = read(DEMO_KEYS.products, PRODUCTS_SEED).map(normalizeProductRow)
  const idx = list.findIndex((x) => x.id === normalized.id)
  const next = idx >= 0 ? list.map((x, i) => (i === idx ? normalized : x)) : [normalized, ...list]
  save(DEMO_KEYS.products, next)
  return normalized
}

export async function deleteProduct(id) {
  if (hasSupabase) {
    await supabase.from('products').delete().eq('id', id)
    return
  }
  const list = read(DEMO_KEYS.products, PRODUCTS_SEED).map(normalizeProductRow)
  save(DEMO_KEYS.products, list.filter((x) => x.id !== id))
}

export async function bulkUpdateProducts(ids = [], patch = {}) {
  if (!ids.length) return []

  if (hasSupabase) {
    const dbPatch = {}
    if (patch.is_visible !== undefined)     dbPatch.is_visible     = patch.is_visible
    if (patch.is_featured !== undefined)    dbPatch.is_featured    = patch.is_featured
    if (patch.is_new_arrival !== undefined) dbPatch.is_new_arrival = patch.is_new_arrival
    if (patch.is_out_of_stock !== undefined) dbPatch.is_out_of_stock = patch.is_out_of_stock
    if (Object.keys(dbPatch).length) {
      await supabase.from('products').update(dbPatch).in('id', ids)
    }
    return loadProducts()
  }

  const products = read(DEMO_KEYS.products, PRODUCTS_SEED).map(normalizeProductRow)
  const updated = products.map((p) => ids.includes(p.id) ? normalizeProductRow({ ...p, ...patch }) : p)
  save(DEMO_KEYS.products, updated)
  return updated
}

export async function incrementProductMetric(id, field) {
  if (hasSupabase) {
    // Fetch current value, then do targeted update (avoids loading all products)
    const { data: current } = await supabase
      .from('products').select(field).eq('id', id).single()
    if (current) {
      await supabase
        .from('products')
        .update({ [field]: Number(current[field] || 0) + 1 })
        .eq('id', id)
    }
    return
  }

  const products = read(DEMO_KEYS.products, PRODUCTS_SEED).map(normalizeProductRow)
  const updated = products.map((p) =>
    p.id === id ? normalizeProductRow({ ...p, [field]: Number(p[field] || 0) + 1 }) : p
  )
  save(DEMO_KEYS.products, updated)
  return updated.find((p) => p.id === id)
}

// ─── IMAGE UPLOAD ─────────────────────────────────────────────────────────────

async function fileToDataUrl(file) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => resolve('')
    reader.readAsDataURL(file)
  })
}

export async function uploadProductImages(files = []) {
  if (!files.length) return []

  const fallbacks = await Promise.all(files.map(fileToDataUrl))
  if (!hasSupabase || !supabase?.storage) return fallbacks.filter(Boolean)

  const urls = []
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const ext = (file?.name?.split('.').pop() || 'png').toLowerCase()
    const path = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    try {
      const { data: uploadData, error } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { upsert: true, contentType: file.type || undefined })

      if (!error && uploadData?.path) {
        const { data: publicData } = supabase.storage.from(BUCKET).getPublicUrl(uploadData.path)
        if (publicData?.publicUrl) { urls.push(publicData.publicUrl); continue }
      }
      console.error('Image upload error:', error)
    } catch (err) {
      console.error('Image upload exception:', err)
    }

    if (fallbacks[i]) urls.push(fallbacks[i])
  }
  return urls
}

export async function uploadBannerImage(file) {
  if (!file) return null

  if (!hasSupabase || !supabase?.storage) return fileToDataUrl(file)

  const ext = (file?.name?.split('.').pop() || 'png').toLowerCase()
  const path = `banners/banner-${Date.now()}.${ext}`

  try {
    const { data: uploadData, error } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { upsert: true, contentType: file.type || undefined })

    if (!error && uploadData?.path) {
      const { data: publicData } = supabase.storage.from(BUCKET).getPublicUrl(uploadData.path)
      if (publicData?.publicUrl) return publicData.publicUrl
    }
    console.error('Banner upload error:', error)
  } catch (err) {
    console.error('Banner upload exception:', err)
  }

  return fileToDataUrl(file)
}
