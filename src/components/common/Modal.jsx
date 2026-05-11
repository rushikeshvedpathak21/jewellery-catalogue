import { X } from 'lucide-react'
import Button from './Button'

export default function Modal({ open, title, onClose, children, footer = null, maxW = 'max-w-3xl' }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
      <div className={`w-full ${maxW} overflow-hidden rounded-3xl shadow-soft`} style={{ backgroundColor: 'var(--clr-section-bg)' }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ backgroundColor: 'var(--clr-navbar-text)' }}>
          <h3 className="font-display text-2xl font-semibold" style={{ color: 'var(--clr-navbar-link-active-text)' }}>
            {title}
          </h3>
          <button type="button" onClick={onClose} className="rounded-full p-2 transition hover:opacity-80" style={{ color: '#fff7d6' }}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-[80vh] overflow-y-auto p-5">
          {children}
        </div>
        {footer ? <div className="border-t px-5 py-4" style={{ borderColor: 'var(--clr-footer-border)' }}>{footer}</div> : null}
      </div>
    </div>
  )
}
