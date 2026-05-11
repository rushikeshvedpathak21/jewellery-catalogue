import { useMemo, useState } from 'react'
import Papa from 'papaparse'
import { Plus, CheckSquare, Square } from 'lucide-react'
import { useCatalog } from '../../context/CatalogContext'
import { useFeatureFlag } from '../../hooks/useFeatureFlag'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Textarea from '../../components/common/Textarea'
import Select from '../../components/common/Select'
import Modal from '../../components/common/Modal'
import Badge from '../../components/common/Badge'

const emptyProduct = {
  name_en: '',
  name_hi: '',
  name_mr: '',
  description_en: '',
  description_hi: '',
  description_mr: '',
  category_id: '',
  metal_type: 'Gold',
  weight_grams: 0,
  images: [],
  is_visible: true,
  is_featured: false,
  is_new_arrival: false,
  is_out_of_stock: false
}

export default function ProductsPage() {
  const { products, categories, saveProduct, deleteProduct, bulkUpdateProducts } = useCatalog()
  const { isEnabled: bulkCsvOn } = useFeatureFlag('bulk_csv_upload')
  const { isEnabled: newOn } = useFeatureFlag('new_arrivals')
  const [editing, setEditing] = useState(null)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(emptyProduct)
  const [selected, setSelected] = useState([])
  const [search, setSearch] = useState('')
  const [csvPreview, setCsvPreview] = useState([])
  const [files, setFiles] = useState([])

  const filtered = useMemo(
    () => products.filter((p) => [p.name_en, p.name_hi, p.name_mr].some((x) => String(x || '').toLowerCase().includes(search.toLowerCase()))),
    [products, search]
  )

  const startAdd = () => { setEditing(null); setForm(emptyProduct); setFiles([]); setOpen(true) }
  const startEdit = (product) => { setEditing(product.id); setForm({ ...emptyProduct, ...product }); setFiles([]); setOpen(true) }

  const submit = async (e) => {
    e.preventDefault()
    await saveProduct(form, files)
    setEditing(null)
    setForm(emptyProduct)
    setFiles([])
    setOpen(false)
  }

  const toggleSelected = (id) => setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])

  const bulk = async (patch) => {
    await bulkUpdateProducts(selected, patch)
    setSelected([])
  }

  const handleCsv = (file) => {
    if (!file) return
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => setCsvPreview(results.data.slice(0, 20))
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-5xl font-semibold">Products</h1>
          <p className="mt-2 text-sm text-neutral-500">Create, update and organize products.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={startAdd} className="gap-2"><Plus className="h-4 w-4" /> Add Product</Button>
        </div>
      </div>

      <div className="grid gap-4 rounded-3xl border border-neutral-100 bg-white p-4 shadow-soft md:grid-cols-3">
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." />
        <Select value="" onChange={(e) => {
          const value = e.target.value
          if (!value) return
          const patch = value === 'hide' ? { is_visible: false } : value === 'show' ? { is_visible: true } : value === 'featured' ? { is_featured: true } : value === 'new' ? { is_new_arrival: true } : {}
          bulk(patch)
          e.target.value = ''
        }}>
          <option value="">Bulk action</option>
          <option value="show">Mark visible</option>
          <option value="hide">Hide selected</option>
          <option value="featured">Mark featured</option>
          {newOn ? <option value="new">Mark new arrival</option> : null}
        </Select>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={async () => { if (selected.length && confirm('Delete selected products?')) { for (const id of selected) await deleteProduct(id); setSelected([]) } }}>Delete selected</Button>
          {bulkCsvOn ? <Button variant="secondary" onClick={() => document.getElementById('csv-file').click()}>CSV Preview</Button> : null}
        </div>
      </div>

      {bulkCsvOn ? (
        <div className="rounded-3xl border border-neutral-100 bg-white p-5 shadow-soft">
          <h2 className="font-display text-3xl font-semibold">Bulk CSV Upload</h2>
          <input id="csv-file" type="file" accept=".csv" className="mt-4 block w-full text-sm" onChange={(e) => handleCsv(e.target.files?.[0])} />
          {csvPreview.length ? (
            <div className="mt-4 overflow-x-auto rounded-2xl border">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-neutral-50">
                  <tr>{Object.keys(csvPreview[0] || {}).map((k) => <th key={k} className="px-3 py-2">{k}</th>)}</tr>
                </thead>
                <tbody>{csvPreview.map((row, i) => <tr key={i} className="border-t">{Object.values(row).map((v, j) => <td key={j} className="px-3 py-2">{String(v)}</td>)}</tr>)}</tbody>
              </table>
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="rounded-3xl border border-neutral-100 bg-white p-5 shadow-soft">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b bg-neutral-50">
                <th className="p-3"><Square className="h-4 w-4" /></th>
                <th className="p-3">Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Metal</th>
                <th className="p-3">Views</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id} className="border-b">
                  <td className="p-3">
                    <button type="button" onClick={() => toggleSelected(product.id)}>
                      {selected.includes(product.id) ? <CheckSquare className="h-4 w-4 text-gold" /> : <Square className="h-4 w-4" />}
                    </button>
                  </td>
                  <td className="p-3">{product.name_en}</td>
                  <td className="p-3">{categories.find((c) => c.id === product.category_id)?.name_en || '-'}</td>
                  <td className="p-3">{product.metal_type}</td>
                  <td className="p-3">{product.view_count || 0}</td>
                  <td className="p-3 flex flex-wrap gap-2">
                    {product.is_visible ? <Badge className="bg-green-100 text-green-700">Visible</Badge> : <Badge className="bg-neutral-100 text-neutral-600">Hidden</Badge>}
                    {product.is_featured ? <Badge className="bg-gold/10 text-gold">Featured</Badge> : null}
                    {product.is_new_arrival ? <Badge className="bg-neutral-900 text-white">New</Badge> : null}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Button variant="secondary" onClick={() => startEdit(product)}>Edit</Button>
                      <Button variant="danger" onClick={async () => { if (confirm('Delete this product?')) await deleteProduct(product.id) }}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={open}
        title={editing ? 'Edit Product' : 'Add Product'}
        onClose={() => { setEditing(null); setOpen(false); setForm(emptyProduct); setFiles([]) }}
        footer={<div className="flex justify-end gap-2"><Button variant="secondary" onClick={() => { setEditing(null); setOpen(false); setForm(emptyProduct); setFiles([]) }}>Cancel</Button><Button onClick={() => document.getElementById('product-submit').click()}>Save</Button></div>}
      >
        <form id="product-form" onSubmit={submit} className="grid gap-4 md:grid-cols-2">
          <Input value={form.name_en} onChange={(e) => setForm({ ...form, name_en: e.target.value })} placeholder="Name EN" />
          <Input value={form.name_hi} onChange={(e) => setForm({ ...form, name_hi: e.target.value })} placeholder="Name HI" />
          <Input value={form.name_mr} onChange={(e) => setForm({ ...form, name_mr: e.target.value })} placeholder="Name MR" />
          <Select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
            <option value="">Select Category</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name_en}</option>)}
          </Select>
          <Select value={form.metal_type} onChange={(e) => setForm({ ...form, metal_type: e.target.value })}>
            {['Gold', 'Silver', 'Diamond', 'Platinum'].map((m) => <option key={m} value={m}>{m}</option>)}
          </Select>
          <Input type="number" step="0.01" value={form.weight_grams} onChange={(e) => setForm({ ...form, weight_grams: e.target.value })} placeholder="Weight grams" />
          <Textarea rows="3" value={form.description_en} onChange={(e) => setForm({ ...form, description_en: e.target.value })} placeholder="Description EN" />
          <Textarea rows="3" value={form.description_hi} onChange={(e) => setForm({ ...form, description_hi: e.target.value })} placeholder="Description HI" />
          <Textarea rows="3" value={form.description_mr} onChange={(e) => setForm({ ...form, description_mr: e.target.value })} placeholder="Description MR" />
          <div className="md:col-span-2">
            <label className="text-sm font-medium">Upload Photos</label>
            <input
              type="file"
              accept="image/*"
              multiple
              className="mt-2 block w-full text-sm"
              onChange={(e) => {
                const newFiles = Array.from(e.target.files || [])
                const remaining = Math.max(0, 5 - (form.images?.length || 0))
                setFiles((prev) => [...prev, ...newFiles].slice(0, remaining))
                e.target.value = ''
              }}
            />
            <p className="mt-1 text-xs text-neutral-500">{files.length + (form.images || []).length}/5 images total</p>
            {files.length ? <p className="mt-2 text-xs text-neutral-500">{files.length} new file(s) selected</p> : null}

            {files.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-3">
                {files.map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt="preview"
                      className="h-24 w-24 rounded-lg border object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setFiles((prev) => prev.filter((_, i) => i !== index))}
                      className="absolute -right-2 -top-2 rounded-full bg-red-500 px-2 text-xs text-white"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          {(form.images || []).length > 0 && (
            <div className="md:col-span-2">
              <label className="text-sm font-medium">Saved Images</label>
              <div className="mt-3 flex flex-wrap gap-3">
                {(form.images || []).map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`saved-${index}`}
                      className="h-24 w-24 rounded-lg border object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, images: (prev.images || []).filter((_, i) => i !== index) }))}
                      className="absolute -right-2 -top-2 rounded-full bg-red-500 px-2 text-xs text-white"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <p className="mt-1 text-xs text-neutral-500">Click × to remove a saved image before saving.</p>
            </div>
          )}
          <div className="md:col-span-2 flex flex-wrap gap-3">
            {['is_visible','is_featured','is_new_arrival','is_out_of_stock'].map((key) => (
              <label key={key} className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-sm">
                <input type="checkbox" checked={Boolean(form[key])} onChange={(e) => setForm({ ...form, [key]: e.target.checked })} />
                {key}
              </label>
            ))}
          </div>
          <button id="product-submit" type="submit" className="hidden">submit</button>
        </form>
      </Modal>
    </div>
  )
}
