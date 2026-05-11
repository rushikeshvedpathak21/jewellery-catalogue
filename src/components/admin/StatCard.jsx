export default function StatCard({ title, value, hint }) {
  return (
    <div className="rounded-3xl border p-5 shadow-soft" style={{ background: 'linear-gradient(180deg, var(--clr-page-bg), var(--clr-footer-bg))', borderColor: 'var(--clr-input-border)' }}>
      <div className="text-sm" style={{ color: 'var(--clr-footer-text)' }}>{title}</div>
      <div className="mt-2 font-display text-4xl font-semibold" style={{ color: 'var(--clr-footer-icon)' }}>{value}</div>
      {hint ? <p className="mt-2 text-xs" style={{ color: 'var(--clr-footer-text)' }}>{hint}</p> : null}
    </div>
  )
}
