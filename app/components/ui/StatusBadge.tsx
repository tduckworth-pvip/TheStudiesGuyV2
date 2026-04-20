import { STATUS_STYLES, STATUS_LABELS } from '@/lib/trial-constants'

interface StatusBadgeProps {
  status: string
  className?: string
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const style = STATUS_STYLES[status] ?? 'bg-slate-500/15 text-slate-400 border-slate-500/20'
  const label = STATUS_LABELS[status] ?? status.replace(/_/g, ' ')

  return (
    <span className={`inline-flex items-center text-xs px-2.5 py-1 rounded-full border font-medium ${style} ${className}`}>
      {status === 'RECRUITING' && (
        <span
          className="recruiting-pulse inline-block w-1.5 h-1.5 rounded-full bg-green-400 mr-1.5 animate-pulse"
          aria-hidden="true"
        />
      )}
      {label}
    </span>
  )
}
