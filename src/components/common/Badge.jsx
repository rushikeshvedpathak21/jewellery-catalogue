import { cn } from '../../lib/utils'

export default function Badge({ children, className = '', variant = 'default', style, ...props }) {
  const variantStyle = variant === 'ruby'
    ? { backgroundColor: '#9B1C2E', color: '#ffffff' }
    : {}

  return (
    <span
      style={{ ...variantStyle, ...style }}
      className={cn('inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide', className)}
      {...props}
    >
      {children}
    </span>
  )
}
