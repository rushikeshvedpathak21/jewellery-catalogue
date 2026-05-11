import { useMemo, useState } from 'react'
import { AlertTriangle, Pencil } from 'lucide-react'
import { FEATURE_DEFS } from '../../data/defaults'
import { useFeatureFlags } from '../../context/FeatureFlagContext'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Textarea from '../../components/common/Textarea'
import Badge from '../../components/common/Badge'

const groups = ['Catalogue Features', 'Product Page Features', 'Display Features', 'Admin Features']

export default function FeaturesPage() {
  const { getFlag, toggleFlag, updateFlagMessages, resetDefaults } = useFeatureFlags()
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ en: '', hi: '', mr: '' })

  const openEdit = (flag) => {
    setEditing(flag)
    setForm({ en: flag.disabled_message_en || '', hi: flag.disabled_message_hi || '', mr: flag.disabled_message_mr || '' })
  }

  const save = async () => {
    await updateFlagMessages(editing.feature_key, {
      disabled_message_en: form.en,
      disabled_message_hi: form.hi,
      disabled_message_mr: form.mr
    })
    setEditing(null)
  }

  const grouped = useMemo(() => {
    const out = {}
    for (const g of groups) out[g] = FEATURE_DEFS.filter((x) => x.group === g).map((x) => getFlag(x.feature_key) || x)
    return out
  }, [getFlag])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-5xl font-semibold">Feature Management</h1>
          <p className="mt-2 text-sm text-neutral-500">Turn site features on or off instantly.</p>
        </div>
        <Button variant="secondary" onClick={resetDefaults}>Reset All to Default</Button>
      </div>

      {groups.map((group) => (
        <section key={group} className="space-y-4">
          <h2 className="font-display text-3xl font-semibold">{group}</h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {grouped[group].map((flag) => (
              <div key={flag.feature_key} className="rounded-3xl border border-neutral-100 bg-white p-5 shadow-soft">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-display text-3xl font-semibold">{flag.feature_name_en}</div>
                    <p className="mt-2 text-sm leading-6 text-neutral-600">{FEATURE_DEFS.find((x) => x.feature_key === flag.feature_key)?.description}</p>
                  </div>
                  <Badge className={flag.is_enabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>{flag.is_enabled ? 'ON' : 'OFF'}</Badge>
                </div>
                {(flag.feature_key === 'catalogue' || flag.feature_key === 'whatsapp_inquiry') ? (
                  <div className="mt-4 rounded-2xl bg-amber-50 p-3 text-sm text-amber-900">
                    <AlertTriangle className="mr-2 inline h-4 w-4" />
                    {flag.feature_key === 'catalogue' ? 'Turning this OFF will hide all products from customers.' : 'Turning this OFF will remove all inquiry buttons.'}
                  </div>
                ) : null}
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button onClick={() => toggleFlag(flag.feature_key)} variant={flag.is_enabled ? 'secondary' : 'primary'}>
                    {flag.is_enabled ? 'Turn OFF' : 'Turn ON'}
                  </Button>
                  <Button variant="secondary" onClick={() => openEdit(flag)} className="gap-2"><Pencil className="h-4 w-4" />Edit Messages</Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      <Modal open={Boolean(editing)} title={`Edit Messages — ${editing?.feature_name_en || ''}`} onClose={() => setEditing(null)} footer={<div className="flex justify-end gap-2"><Button variant="secondary" onClick={() => setEditing(null)}>Cancel</Button><Button onClick={save}>Save</Button></div>}>
        <div className="grid gap-4">
          <Textarea rows="3" value={form.en} onChange={(e) => setForm({ ...form, en: e.target.value })} placeholder="English message" />
          <Textarea rows="3" value={form.hi} onChange={(e) => setForm({ ...form, hi: e.target.value })} placeholder="Hindi message" />
          <Textarea rows="3" value={form.mr} onChange={(e) => setForm({ ...form, mr: e.target.value })} placeholder="Marathi message" />
        </div>
      </Modal>
    </div>
  )
}
