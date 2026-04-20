'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

type GeoState =
  | { status: 'idle' }
  | { status: 'locating' }
  | { status: 'resolved'; lat: number; lng: number; displayName: string; country: string }
  | { status: 'error'; message: string }

export default function SearchBar() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [condition, setCondition] = useState('')
  const [locationText, setLocationText] = useState('')
  const [geo, setGeo] = useState<GeoState>({ status: 'idle' })

  async function geocodeText(address: string): Promise<{ lat: number; lng: number; displayName: string; country: string } | null> {
    const res = await fetch(`/api/geocode?address=${encodeURIComponent(address)}`)
    if (!res.ok) return null
    return res.json()
  }

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

  async function handleSubmit(e: React.BaseSyntheticEvent) {
    e.preventDefault()
    if (!condition.trim()) return

    const q = new URLSearchParams()
    q.set('condition', condition.trim())

    let resolved = geo.status === 'resolved' ? geo : null

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
  }

  const isLocating = geo.status === 'locating'
  const hasLocation = geo.status === 'resolved'
  const locationError = geo.status === 'error' ? geo.message : null

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-2 p-2 rounded-2xl bg-white border border-slate-200 shadow-lg">

        {/* Condition field */}
        <div className="relative flex-1 min-w-0">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500 pointer-events-none" aria-hidden="true">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={condition}
            onChange={e => setCondition(e.target.value)}
            placeholder="Condition, disease, or keyword…"
            aria-label="Search by condition"
            className="w-full pl-9 pr-3 py-3 rounded-xl text-slate-900 placeholder-slate-400 bg-transparent
              focus:outline-none focus:ring-2 focus:ring-cyan-400/40 text-sm"
          />
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px bg-slate-200 self-stretch my-1" aria-hidden="true" />
        <div className="sm:hidden h-px bg-slate-200 mx-1" aria-hidden="true" />

        {/* Location field */}
        <div className="relative flex-1 min-w-0 flex items-center">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true">
            {hasLocation
              ? <span className="w-2 h-2 rounded-full bg-green-500 block" />
              : <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            }
          </div>
          <input
            type="text"
            value={locationText}
            onChange={e => { setLocationText(e.target.value); if (hasLocation) setGeo({ status: 'idle' }) }}
            placeholder="City, state, or ZIP (50 mi radius)"
            aria-label="Search by location"
            className="w-full pl-9 pr-8 py-3 rounded-xl text-slate-900 placeholder-slate-400 bg-transparent
              focus:outline-none focus:ring-2 focus:ring-cyan-400/40 text-sm"
          />
          {hasLocation || locationText ? (
            <button
              type="button"
              onClick={clearLocation}
              aria-label="Clear location"
              className="absolute right-2 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
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
              className="absolute right-2 text-slate-400 hover:text-cyan-600 disabled:opacity-50 transition-colors cursor-pointer"
            >
              {isLocating
                ? <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
              }
            </button>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending || !condition.trim()}
          className="shrink-0 px-6 py-3 rounded-xl font-semibold text-sm
            bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed
            text-white transition-colors duration-200 cursor-pointer"
        >
          {isPending ? 'Searching…' : 'Find Trials'}
        </button>
      </div>

      {locationError && (
        <p className="mt-2 text-xs text-red-600 text-center" role="alert">{locationError}</p>
      )}

      {hasLocation && geo.status === 'resolved' && geo.displayName !== 'Your current location' && (
        <p className="mt-2 text-xs text-slate-500 text-center">
          Searching within 50 miles of <span className="text-slate-700 font-medium">{geo.displayName.split(',').slice(0, 2).join(',')}</span>
        </p>
      )}
    </form>
  )
}
