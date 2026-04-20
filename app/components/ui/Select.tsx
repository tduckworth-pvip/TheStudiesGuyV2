import type { SelectHTMLAttributes } from 'react'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: readonly SelectOption[]
}

export function Select({ label, options, id, className = '', ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-xs text-slate-600 uppercase tracking-wider font-medium">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          className={[
            'w-full appearance-none px-3 py-2.5 pr-8 rounded-xl text-sm text-slate-900',
            'bg-white border border-slate-300',
            'focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-500',
            'transition-all duration-200 cursor-pointer',
            className,
          ].join(' ')}
          {...props}
        >
          {options.map(o => (
            <option key={o.value} value={o.value} className="bg-slate-900 text-white">
              {o.label}
            </option>
          ))}
        </select>
        {/* chevron icon */}
        <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  )
}
