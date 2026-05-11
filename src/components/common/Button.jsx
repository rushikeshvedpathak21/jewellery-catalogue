import { cn } from '../../lib/utils'

export default function Button({
  style,
  children,
  className = '',
  variant = 'primary',
  type = 'button',
  disabled = false,
  ...props
}) {
  const base = 'inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition duration-300 ease-in-out active:scale-[0.98] hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none'
  const variantStyles = {
    primary: {
      backgroundImage: 'linear-gradient(135deg, var(--clr-hero-btn-primary-bg), var(--clr-hero-btn-primary-bg))',
      color: 'var(--clr-hero-btn-primary-text)',
      borderColor: 'transparent'
    },
    secondary: {
      backgroundColor: 'var(--clr-hero-btn-secondary-bg)',
      color: 'var(--clr-hero-btn-secondary-text)',
      borderColor: 'var(--clr-hero-btn-secondary-border)',
      borderWidth: 1,
      borderStyle: 'solid'
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'inherit'
    },
    danger: {
      backgroundColor: '#dc2626',
      color: '#ffffff',
      borderColor: '#dc2626'
    }
  }

  return (
    <button
      type={type}
      disabled={disabled}
      style={{ ...variantStyles[variant], ...style }}
      className={cn(base, variant !== 'primary' ? 'border' : '', className)}
      {...props}
    >
      {children}
    </button>
  )
}
