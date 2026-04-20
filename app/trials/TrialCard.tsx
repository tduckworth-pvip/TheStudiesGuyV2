import Link from 'next/link'
import type { TrialStudy } from '@/lib/clinicaltrials'
import { StatusBadge } from '@/app/components/ui/StatusBadge'

interface Props {
  study: TrialStudy
  lat?: number
  lng?: number
  location?: string
}

export default function TrialCard({ study, lat, lng, location }: Props) {
  const { protocolSection: p } = study
  const nctId = p.identificationModule.nctId

  const detailHref = (() => {
    const q = new URLSearchParams()
    if (lat != null) q.set('lat', String(lat))
    if (lng != null) q.set('lng', String(lng))
    if (location) q.set('location', location)
    const qs = q.toString()
    return qs ? `/trials/${nctId}?${qs}` : `/trials/${nctId}`
  })()
  const title = p.identificationModule.briefTitle
  const status = p.statusModule.overallStatus
  const conditions = p.conditionsModule?.conditions?.slice(0, 3) ?? []
  const phases = p.designModule?.phases ?? []
  const summary = p.descriptionModule?.briefSummary?.slice(0, 180)
  const sponsor = p.sponsorCollaboratorsModule?.leadSponsor?.name
  const locations = p.contactsLocationsModule?.locations ?? []
  const city = locations[0]?.city
  const country = locations[0]?.country
  const extraLocations = locations.length - 1

  return (
    <Link href={detailHref} className="trial-card group flex flex-col gap-4 p-6 rounded-2xl
      bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-cyan-300">

      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <span className="text-xs font-mono text-cyan-600/70">{nctId}</span>
        <StatusBadge status={status} className="shrink-0" />
      </div>

      {/* Title */}
      <h2 className="text-slate-900 font-semibold text-sm leading-snug line-clamp-2
        group-hover:text-cyan-700 transition-colors duration-200">
        {title}
      </h2>

      {/* Summary */}
      {summary && (
        <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">
          {summary}{summary.length === 180 ? '…' : ''}
        </p>
      )}

      {/* Tags row */}
      <div className="flex flex-wrap gap-1.5 mt-auto">
        {phases.map(ph => (
          <span key={ph} className="text-xs px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200">
            {ph.replace('_', ' ')}
          </span>
        ))}
        {conditions.map(c => (
          <span key={c} className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            {c}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-400">
        <span className="truncate max-w-[60%]">{sponsor}</span>
        {(city || country) && (
          <span className="flex items-center gap-1 shrink-0">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            {[city, country].filter(Boolean).join(', ')}
            {extraLocations > 0 && <span className="text-slate-400">(+{extraLocations})</span>}
          </span>
        )}
      </div>

      <span className="text-xs text-cyan-500/70 group-hover:text-cyan-600 transition-colors duration-200">
        View trial details →
      </span>
    </Link>
  )
}
