'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/app/components/ui/Button'
import { Select } from '@/app/components/ui/Select'
import { STATUSES, PHASES } from '@/lib/trial-constants'

export default function TrialsFilters() {
  const router = useRouter()
  const params = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [condition, setCondition] = useState(params.get('condition') ?? '')
  const [status, setStatus] = useState(params.get('status') ?? '')
  const [phase, setPhase] = useState(params.get('phase') ?? '')

  function apply() {
    const q = new URLSearchParams()
    if (condition.trim()) q.set('condition', condition.trim())
    if (status) q.set('status', status)
    if (phase) q.set('phase', phase)
    startTransition(() => router.push(`/trials?${q.toString()}`))
  }

  function clear() {
    setCondition('')
    setStatus('')
    setPhase('')
    startTransition(() => router.push('/trials'))
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Search input */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-500 pointer-events-none" aria-hidden="true">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={condition}
          onChange={e => setCondition(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && apply()}
          placeholder="Condition, disease, keyword…"
          aria-label="Search by condition"
          className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm text-slate-900 placeholder-slate-400
            bg-white border border-slate-300 focus:outline-none focus:ring-2
            focus:ring-sky-400/50 focus:border-sky-500 transition-all duration-200"
        />
      </div>

      <Select
        id="filter-status"
        label="Status"
        options={STATUSES}
        value={status}
        onChange={e => setStatus(e.target.value)}
        aria-label="Filter by status"
      />

      <Select
        id="filter-phase"
        label="Phase"
        options={PHASES}
        value={phase}
        onChange={e => setPhase(e.target.value)}
        aria-label="Filter by phase"
      />

      <Button variant="primary" onClick={apply} isLoading={isPending} className="w-full">
        Apply Filters
      </Button>

      <Button variant="secondary" onClick={clear} disabled={isPending} className="w-full">
        Clear Filters
      </Button>
    </div>
  )
}
