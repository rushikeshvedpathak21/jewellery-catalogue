export default function EmptyState({ title, description }) {
  return (
    <div className="rounded-3xl border border-dashed p-8 text-center" style={{ backgroundColor: 'var(--clr-section-bg)', borderColor: 'var(--clr-footer-border)' }}>
      <h3 className="font-display text-2xl font-semibold" style={{ color: 'var(--clr-section-title)' }}>{title}</h3>
      <p className="mt-2 text-sm" style={{ color: 'var(--clr-section-subtitle)' }}>{description}</p>
    </div>
  )
}
