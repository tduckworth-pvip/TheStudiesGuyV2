import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'sm' | 'md'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  isLoading?: boolean
}

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-cyan-500 hover:bg-cyan-600 text-white font-semibold',
  secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200',
  ghost: 'hover:bg-slate-100 text-slate-500 hover:text-slate-900',
}

const SIZES: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2.5 text-sm',
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-xl font-medium',
        'transition-colors duration-200 cursor-pointer',
        'disabled:opacity-60 disabled:cursor-not-allowed',
        VARIANTS[variant],
        SIZES[size],
        className,
      ].join(' ')}
      {...props}
    >
      {isLoading ? 'Loading…' : children}
    </button>
  )
}
