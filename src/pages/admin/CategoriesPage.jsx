import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { useCatalog } from '../../context/CatalogContext'
import { useLangText } from '../../hooks/useLangText'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Modal from '../../components/common/Modal'
import Badge from '../../components/common/Badge'

const empty = { name_en: '', name_hi: '', name_mr: '', is_visible: true }

export default function CategoriesPage() {
  const { categories, products, saveCategory, deleteCategory } = useCatalog()
  const text = useLangText()
  const [form, setForm] = useState(empty)
  const [editing, setEditing] = useState(null)
  const [open, setOpen] = useState(false)

  const counts = useMemo(() => products.reduce((acc, p) => {
    acc[p.category_id] = (acc[p.category_id] || 0) + 1
    return acc
  }, {}), [products])

  const startEdit = (category) => { setEditing(category.id); setForm(category); setOpen(true) }
  const submit = async (e) => {
    e.preventDefault()
    await saveCategory(form)
    setForm(empty)
    setEditing(null)
    setOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-5xl font-semibold">Categories</h1>
          <p className="mt-2 text-sm text-neutral-500">Manage category names in EN / HI / MR.</p>
        </div>
        <Button onClick={() => { setEditing(null); setForm(empty); setOpen(true) }} className="gap-2"><Plus className="h-4 w-4" /> Add Category</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <div key={category.id} className="rounded-3xl border border-neutral-100 bg-white p-5 shadow-soft">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-display text-3xl font-semibold text-gold">{text(category, 'name')}</div>
                <div className="mt-1 text-sm text-neutral-500">{counts[category.id] || 0} products</div>
              </div>
              {category.is_visible ? <Badge className="bg-green-100 text-green-700">Visible</Badge> : <Badge className="bg-neutral-100 text-neutral-600">Hidden</Badge>}
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="secondary" onClick={() => startEdit(category)}>Edit</Button>
              <Button variant="danger" onClick={async () => { if (confirm('Delete category?')) await deleteCategory(category.id) }}>Delete</Button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={open} title={editing ? 'Edit Category' : 'Add Category'} onClose={() => { setForm(empty); setEditing(null); setOpen(false) }} footer={<div className="flex justify-end gap-2"><Button variant="secondary" onClick={() => { setForm(empty); setEditing(null); setOpen(false) }}>Cancel</Button><Button onClick={() => document.getElementById('category-submit').click()}>Save</Button></div>}>
        <form id="category-form" onSubmit={submit} className="grid gap-4">
          <Input value={form.name_en} onChange={(e) => setForm({ ...form, name_en: e.target.value })} placeholder="Name EN" />
          <Input value={form.name_hi} onChange={(e) => setForm({ ...form, name_hi: e.target.value })} placeholder="Name HI" />
          <Input value={form.name_mr} onChange={(e) => setForm({ ...form, name_mr: e.target.value })} placeholder="Name MR" />
          <label className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-3 text-sm">
            <input type="checkbox" checked={Boolean(form.is_visible)} onChange={(e) => setForm({ ...form, is_visible: e.target.checked })} />
            Visible
          </label>
          <button id="category-submit" type="submit" className="hidden">submit</button>
        </form>
      </Modal>
    </div>
  )
}
