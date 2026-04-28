'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/app/components/ui/Button'
import { Select } from '@/app/components/ui/Select'
import { STATUSES, PHASES } from '@/lib/trial-constants'

type GeoState =
  | { status: 'idle' }
  | { status: 'locating' }
  | { status: 'resolved'; lat: number; lng: number; displayName: string; country: string }
  | { status: 'error'; message: string }

async function geocodeText(address: string) {
  const res = await fetch(`/api/geocode?address=${encodeURIComponent(address)}`)
  if (!res.ok) return null
  return res.json() as Promise<{ lat: number; lng: number; displayName: string; country: string }>
}

export default function TrialsFilters() {
  const router = useRouter()
  const params = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [isApplying, setIsApplying] = useState(false)

  const [condition, setCondition] = useState(params.get('condition') ?? '')
  const [status, setStatus] = useState(params.get('status') ?? '')
  const [phase, setPhase] = useState(params.get('phase') ?? '')

  // Initialize location from existing URL params so filters reflect current search
  const initLat = params.get('lat')
  const initLng = params.get('lng')
  const initLocation = params.get('location')
  const initCountry = params.get('country')

  const [locationText, setLocationText] = useState(initLocation ?? '')
  const [geo, setGeo] = useState<GeoState>(
    initLat && initLng && initLocation
      ? { status: 'resolved', lat: Number(initLat), lng: Number(initLng), displayName: initLocation, country: initCountry ?? '' }
      : { status: 'idle' }
  )

  function useMyLocation() {
    if (!navigator.geolocation) {
      setGeo({ status: 'error', message: 'Geolocation not supported by your browser.' })
      return
    }
    setGeo({ status: 'locating' })
    navigator.geolocation.getCurrentPosition(
      async pos => {
        const { latitude: lat, longitude: lng } = pos.coords
        const result = await geocodeText(`${lat},${lng}`)
        const country = result?.country ?? ''
        setGeo({ status: 'resolved', lat, lng, displayName: 'Your current location', country })
        setLocationText('Your current location')
      },
      () => setGeo({ status: 'error', message: 'Unable to access your location.' }),
      { timeout: 8000 }
    )
  }

  function clearLocation() {
    setGeo({ status: 'idle' })
    setLocationText('')
  }

  async function apply() {
    setIsApplying(true)
    try {
      const q = new URLSearchParams()
      if (condition.trim()) q.set('condition', condition.trim())
      if (status) q.set('status', status)
      if (phase) q.set('phase', phase)

      let resolved = geo.status === 'resolved' ? geo : null

      // Geocode typed text if not yet resolved
      if (!resolved && locationText.trim() && locationText !== 'Your current location') {
        const result = await geocodeText(locationText.trim())
        if (result) {
          resolved = { ...result, status: 'resolved' }
          setGeo({ ...result, status: 'resolved' })
        }
      }

      if (resolved) {
        q.set('lat', String(resolved.lat))
        q.set('lng', String(resolved.lng))
        q.set('location', resolved.displayName)
        if (resolved.country) q.set('country', resolved.country)
      }

      startTransition(() => router.push(`/trials?${q.toString()}`))
    } finally {
      setIsApplying(false)
    }
  }

  function clear() {
    setCondition('')
    setStatus('')
    setPhase('')
    clearLocation()
    startTransition(() => router.push('/trials'))
  }

  const isLocating = geo.status === 'locating'
  const hasLocation = geo.status === 'resolved'
  const locationError = geo.status === 'error' ? geo.message : null
  const isBusy = isPending || isApplying

  const inputClass = `w-full py-2.5 rounded-xl text-sm text-slate-900 placeholder-slate-400
    bg-white border border-slate-300 focus:outline-none focus:ring-2
    focus:ring-sky-400/50 focus:border-sky-500 transition-all duration-200`

  const labelClass = 'text-xs text-slate-600 uppercase tracking-wider font-medium'

  return (
    <div className="flex flex-col gap-3">

      {/* Condition */}
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
          className={`${inputClass} pl-9 pr-3`}
        />
      </div>

      {/* Location */}
      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>Location</label>
        <div className="relative">
          {/* Pin / green dot icon */}
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true">
            {hasLocation
              ? <span className="w-2 h-2 rounded-full bg-green-500 block" />
              : (
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )
            }
          </div>

          <input
            type="text"
            value={locationText}
            onChange={e => {
              setLocationText(e.target.value)
              if (hasLocation) setGeo({ status: 'idle' })
            }}
            onKeyDown={e => e.key === 'Enter' && apply()}
            placeholder="City, state, or ZIP…"
            aria-label="Filter by location"
            className={`${inputClass} pl-9 pr-9`}
          />

          {/* Right button: clear or GPS */}
          {hasLocation || locationText ? (
            <button
              type="button"
              onClick={clearLocation}
              aria-label="Clear location"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ) : (
            <button
              type="button"
              onClick={useMyLocation}
              disabled={isLocating}
              aria-label="Use my current location"
              title="Use my current location"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-sky-600 disabled:opacity-50 transition-colors cursor-pointer"
            >
              {isLocating
                ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                )
                : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                )
              }
            </button>
          )}
        </div>

        {/* Status messages */}
        {locationError && (
          <p className="text-xs text-red-600" role="alert">{locationError}</p>
        )}
        {hasLocation && geo.status === 'resolved' && geo.displayName === 'Your current location' && (
          <p className="text-xs text-slate-500">Searching within 50 miles of your location</p>
        )}
        {hasLocation && geo.status === 'resolved' && geo.displayName !== 'Your current location' && (
          <p className="text-xs text-slate-500">
            Within 50 mi of{' '}
            <span className="font-medium text-slate-700">
              {geo.displayName.split(',').slice(0, 2).join(',')}
            </span>
          </p>
        )}
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

      <Button variant="primary" onClick={apply} isLoading={isBusy} className="w-full">
        Apply Filters
      </Button>

      <Button variant="secondary" onClick={clear} disabled={isBusy} className="w-full">
        Clear Filters
      </Button>
    </div>
  )
}
