import { useState, useEffect } from 'react'
import Input from '../../components/common/Input'
import Textarea from '../../components/common/Textarea'
import Button from '../../components/common/Button'
import { useSettings } from '../../context/SettingsContext'
import { uploadBannerImage } from '../../services/catalog'

export default function SettingsPage() {
  const { settings, updateSettings } = useSettings()
  const [form, setForm] = useState(settings)
  const [bannerPreview, setBannerPreview] = useState(settings?.banner_image_url || '')
  const [bannerFile, setBannerFile] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setForm(settings)
    setBannerPreview(settings?.banner_image_url || '')
  }, [settings])

  const onImage = (file) => {
    if (!file) return
    setBannerFile(file)
    // Show local preview immediately
    const reader = new FileReader()
    reader.onload = () => setBannerPreview(String(reader.result))
    reader.readAsDataURL(file)
  }

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      let bannerUrl = form.banner_image_url

      // Upload banner to Supabase Storage if a new file was selected
      if (bannerFile) {
        const uploaded = await uploadBannerImage(bannerFile)
        if (uploaded) bannerUrl = uploaded
      }

      await updateSettings({ ...form, banner_image_url: bannerUrl })
      setBannerFile(null)
      alert('Settings saved!')
    } catch (err) {
      console.error('Settings save error:', err)
      alert('Failed to save settings. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <div>
        <h1 className="font-display text-5xl font-semibold">Shop Settings</h1>
        <p className="mt-2 text-sm text-neutral-500">Update contact, address and banner details.</p>
      </div>

      <div className="grid gap-4 rounded-3xl border border-neutral-100 bg-white p-5 shadow-soft md:grid-cols-2">
        <Input
          value={form.shop_name || ''}
          onChange={(e) => setForm({ ...form, shop_name: e.target.value })}
          placeholder="Shop Name"
        />
        <Input
          value={form.whatsapp_number || ''}
          onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })}
          placeholder="WhatsApp Number (e.g. 919876543210)"
        />
        <Input
          value={form.address || ''}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          placeholder="Address"
        />
        <Input
          value={form.google_maps_link || ''}
          onChange={(e) => setForm({ ...form, google_maps_link: e.target.value })}
          placeholder="Google Maps Link"
        />
        <Input
          value={form.open_hours || ''}
          onChange={(e) => setForm({ ...form, open_hours: e.target.value })}
          placeholder="Open Hours (e.g. Mon-Sun 10AM-8PM)"
        />
        <Input
          value={form.instagram_link || ''}
          onChange={(e) => setForm({ ...form, instagram_link: e.target.value })}
          placeholder="Instagram Link"
        />
        <div className="md:col-span-2">
          <label className="text-sm font-medium">Banner Image</label>
          <input
            type="file"
            accept="image/*"
            className="mt-2 block w-full text-sm"
            onChange={(e) => onImage(e.target.files?.[0])}
          />
          <p className="mt-1 text-xs text-neutral-400">
            Image will be uploaded to Supabase Storage. Max recommended size: 2 MB.
          </p>
          {bannerPreview ? (
            <img src={bannerPreview} alt="Banner preview" className="mt-3 h-56 w-full rounded-3xl object-cover" />
          ) : null}
        </div>
      </div>

      <div className="rounded-3xl border border-neutral-100 bg-white p-5 shadow-soft">
        <h2 className="font-display text-3xl font-semibold">Announcement Bar</h2>
        <div className="mt-4 grid gap-4">
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={Boolean(form.announcement_visible)}
              onChange={(e) => setForm({ ...form, announcement_visible: e.target.checked })}
            />
            Show announcement bar
          </label>
          <p className="text-xs text-neutral-400">
            Separate multiple messages with <code className="rounded bg-neutral-100 px-1">|</code> for a scrolling ticker.
          </p>
          <Textarea
            rows="3"
            value={form.announcement_text_en || ''}
            onChange={(e) => setForm({ ...form, announcement_text_en: e.target.value })}
            placeholder="Announcement (English)"
          />
          <Textarea
            rows="3"
            value={form.announcement_text_hi || ''}
            onChange={(e) => setForm({ ...form, announcement_text_hi: e.target.value })}
            placeholder="Announcement (Hindi)"
          />
          <Textarea
            rows="3"
            value={form.announcement_text_mr || ''}
            onChange={(e) => setForm({ ...form, announcement_text_mr: e.target.value })}
            placeholder="Announcement (Marathi)"
          />
        </div>
      </div>

      <Button type="submit" disabled={saving}>
        {saving ? 'Saving…' : 'Save Settings'}
      </Button>
    </form>
  )
}
