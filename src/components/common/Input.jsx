import { cn } from '../../lib/utils'

export default function Input({
  className = '',
  style,
  onFocus,
  onBlur,
  ...props
}) {
  return (
    <input
      className={cn('w-full rounded-2xl border px-4 py-3 text-sm outline-none transition duration-300 ease-in-out', className)}
      style={{
        backgroundColor: 'var(--clr-input-bg)',
        borderColor: 'var(--clr-input-border)',
        ...style
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = 'var(--clr-input-focus)'
        onFocus?.(e)
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = 'var(--clr-input-border)'
        onBlur?.(e)
      }}
      {...props}
    />
  )
}
