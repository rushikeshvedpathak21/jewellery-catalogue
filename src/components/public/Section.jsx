export default function Section({ title, subtitle, children }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:px-6" style={{ backgroundColor: 'var(--clr-section-bg)' }}>
      <div className="mb-5">
        <h2 className="font-display text-4xl font-semibold md:text-5xl" style={{ color: 'var(--clr-section-title)', fontFamily: 'var(--font-section-title)' }}>
          {title}
        </h2>
        <hr className="gold-divider" />
        {subtitle ? <p className="mt-1 text-sm md:text-base" style={{ color: 'var(--clr-section-subtitle)', fontFamily: 'var(--font-body)' }}>{subtitle}</p> : null}
      </div>
      {children}
    </section>
  )
}
