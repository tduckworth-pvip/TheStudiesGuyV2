'use client'

import React, { useState, useMemo, useRef, useEffect } from 'react'
import { getCountries, getCountryCallingCode } from 'libphonenumber-js'
import { Button } from '@/app/components/ui/Button'
import { Map, MapMarker, MarkerContent, MarkerTooltip, MapControls, type MapRef } from '@/components/ui/map'

const countryNames = new Intl.DisplayNames(['en'], { type: 'region' })

function toFlag(cc: string) {
  return cc.toUpperCase().split('').map(c => String.fromCodePoint(c.charCodeAt(0) + 127397)).join('')
}

const COUNTRY_OPTIONS = getCountries()
  .map(cc => ({
    cc,
    flag: toFlag(cc),
    name: countryNames.of(cc) ?? cc,
    dial: `+${getCountryCallingCode(cc)}`,
  }))
  .sort((a, b) => {
    if (a.cc === 'US') return -1
    if (b.cc === 'US') return 1
    if (a.cc === 'GB') return -1
    if (b.cc === 'GB') return 1
    return a.name.localeCompare(b.name)
  })

// ─── Dial Code Picker ────────────────────────────────────────────────────────

function DialCodePicker({ value, onChange }: { value: string; onChange: (cc: string) => void }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const selected = COUNTRY_OPTIONS.find(o => o.cc === value) ?? COUNTRY_OPTIONS[0]

  const filtered = search.trim()
    ? COUNTRY_OPTIONS.filter(o =>
        o.name.toLowerCase().includes(search.toLowerCase()) ||
        o.dial.includes(search)
      )
    : COUNTRY_OPTIONS

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => { setOpen(o => !o); setSearch('') }}
        className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-200 bg-white
          text-sm text-slate-700 hover:border-slate-300 transition-all duration-200 cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-sky-400/50 focus:border-sky-500 whitespace-nowrap"
      >
        <span>{selected.flag}</span>
        <span className="font-medium">{selected.dial}</span>
        <svg className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 top-full left-0 mt-1.5 w-72 bg-white rounded-xl border border-slate-200
          shadow-lg overflow-hidden">
          <div className="p-2 border-b border-slate-100">
            <input
              autoFocus
              type="text"
              placeholder="Search country…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm text-slate-900 placeholder-slate-400
                border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-400/50
                focus:border-sky-500 transition-all duration-200"
            />
          </div>
          <ul className="max-h-60 overflow-y-auto py-1">
            {filtered.length === 0 && (
              <li className="px-4 py-3 text-sm text-slate-400 text-center">No results</li>
            )}
            {filtered.map((o, i) => {
              const isPinned = (o.cc === 'US' || o.cc === 'GB') && !search.trim()
              const showDivider = isPinned && i === 1 && filtered[2]?.cc !== 'US' && filtered[2]?.cc !== 'GB'
              return (
                <React.Fragment key={o.cc}>
                  <li>
                    <button
                      type="button"
                      onClick={() => { onChange(o.cc); setOpen(false); setSearch('') }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left
                        hover:bg-slate-50 transition-colors duration-100 cursor-pointer
                        ${o.cc === value ? 'bg-sky-50 text-sky-700' : 'text-slate-700'}`}
                    >
                      <span className="text-base">{o.flag}</span>
                      <span className="flex-1 truncate">{o.name}</span>
                      <span className="text-slate-400 shrink-0">{o.dial}</span>
                    </button>
                  </li>
                  {showDivider && (
                    <li className="mx-3 my-1 border-t border-slate-100" />
                  )}
                </React.Fragment>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}

interface SiteContact {
  name?: string
  role?: string
  phone?: string
  email?: string
}

interface Location {
  facility?: string
  city?: string
  state?: string
  country?: string
  status?: string
  geoPoint?: { lat: number; lon: number }
  contacts?: SiteContact[]
}

interface Props {
  locations: Location[]
  nctId: string
  trialTitle: string
  sponsorName?: string
}

const DISTANCE_OPTIONS = [
  { label: '25 mi (40 km)', value: 25 },
  { label: '50 mi (80 km)', value: 50 },
  { label: '100 mi (about 160 km)', value: 100 },
  { label: '250 mi (about 400 km)', value: 250 },
  { label: 'Any distance', value: Infinity },
]

function haversineMiles(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 3959
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

const PAGE_SIZE = 5

// ─── Step 1: Site Selector ────────────────────────────────────────────────────

interface SiteSelectorProps {
  locations: Location[]
  selectedIndex: number | null
  onSelect: (i: number) => void
  onNext: () => void
}

function SiteSelector({ locations, selectedIndex, onSelect, onNext }: SiteSelectorProps) {
  const [locationInput, setLocationInput] = useState('')
  const [geocoding, setGeocoding] = useState(false)
  const [geocodeError, setGeocodeError] = useState('')
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [distanceMiles, setDistanceMiles] = useState(100)
  const [page, setPage] = useState(1)
  const viewport = { center: [-98.58, 39.83] as [number, number], zoom: 3 }
  const mapRef = useRef<MapRef>(null)

  async function handleGeocode() {
    if (!locationInput.trim()) return
    setGeocoding(true)
    setGeocodeError('')
    try {
      const res = await fetch(`/api/geocode?address=${encodeURIComponent(locationInput)}`)
      const data = await res.json()
      if (!res.ok) { setGeocodeError(data.error ?? 'Location not found'); return }
      setUserCoords({ lat: data.lat, lng: data.lng })
      setPage(1)
    } catch {
      setGeocodeError('Could not reach geocoding service')
    } finally {
      setGeocoding(false)
    }
  }

  type SiteWithDist = { loc: Location; originalIndex: number; dist: number | null }

  const withDistances = useMemo<SiteWithDist[]>(() => {
    return locations.map((loc, originalIndex) => {
      const dist = userCoords && loc.geoPoint
        ? haversineMiles(userCoords.lat, userCoords.lng, loc.geoPoint.lat, loc.geoPoint.lon)
        : null
      return { loc, originalIndex, dist }
    })
  }, [locations, userCoords])

  const filtered = useMemo<SiteWithDist[]>(() => {
    if (!userCoords) return withDistances
    return withDistances
      .filter(({ dist }: SiteWithDist) => dist === null || dist <= distanceMiles)
      .sort((a: SiteWithDist, b: SiteWithDist) => (a.dist ?? Infinity) - (b.dist ?? Infinity))
  }, [withDistances, userCoords, distanceMiles])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const inputCls = `w-full px-3 py-2.5 rounded-xl text-sm text-slate-900 placeholder-slate-400
    bg-white border border-slate-200 focus:outline-none focus:ring-2
    focus:ring-sky-400/50 focus:border-sky-500 transition-all duration-200`

  function handleSelect(originalIndex: number) {
    onSelect(originalIndex)
    const loc = locations[originalIndex]
    if (loc.geoPoint) {
      mapRef.current?.flyTo({ center: [loc.geoPoint.lon, loc.geoPoint.lat], zoom: 10, duration: 1200 })
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Filter row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Enter your location (city, zip, or address)"
            value={locationInput}
            onChange={e => setLocationInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleGeocode()}
            className={inputCls}
          />
          {geocodeError && (
            <p className="absolute -bottom-5 left-0 text-xs text-red-500">{geocodeError}</p>
          )}
        </div>
        <select
          value={distanceMiles}
          onChange={e => { setDistanceMiles(Number(e.target.value)); setPage(1) }}
          className="px-3 py-2.5 rounded-xl text-sm text-slate-700 bg-white border border-slate-200
            focus:outline-none focus:ring-2 focus:ring-sky-400/50 focus:border-sky-500
            transition-all duration-200 cursor-pointer min-w-[180px]"
        >
          {DISTANCE_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <Button
          variant="primary"
          onClick={handleGeocode}
          isLoading={geocoding}
          className="bg-sky-600 hover:bg-sky-700 whitespace-nowrap"
        >
          Search
        </Button>
      </div>

      {/* Count */}
      <p className="text-sm text-slate-500">
        {filtered.length} study center{filtered.length !== 1 ? 's' : ''} available
        {userCoords && distanceMiles !== Infinity ? ` within ${distanceMiles} mi` : ''}
      </p>

      {/* Split: list + map */}
      <div className="flex flex-col-reverse md:flex-row gap-4 md:items-start">

        {/* Site list */}
        <div className="w-full md:flex-1 min-w-0 flex flex-col gap-2">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">
              No sites found. Try increasing the distance or a different area.
            </div>
          ) : (
            pageItems.map(({ loc, originalIndex, dist }, pageIdx) => {
              const isSelected = selectedIndex === originalIndex
              const cityLine = [loc.city, loc.state, loc.country].filter(Boolean).join(' ')
              return (
                <button
                  key={originalIndex}
                  type="button"
                  onClick={() => handleSelect(originalIndex)}
                  className={`w-full text-left flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'border-sky-500 bg-sky-50 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition-colors ${
                    isSelected ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {pageIdx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {loc.facility ?? `Site ${originalIndex + 1}`}
                    </p>
                    {cityLine && (
                      <p className="text-xs text-slate-500 mt-0.5">
                        {cityLine}
                        {dist !== null && (
                          <span className="text-sky-500 ml-1">
                            ({Math.round(dist).toLocaleString()} mi away)
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                </button>
              )
            })
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center gap-1 justify-between mt-1">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400
                    hover:border-slate-300 hover:text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed
                    transition-all duration-150 cursor-pointer text-sm"
                  aria-label="Previous page"
                >‹</button>
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setPage(i + 1)}
                    className={`w-7 h-7 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                      page === i + 1
                        ? 'bg-sky-500 text-white border border-sky-500'
                        : 'border border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >{i + 1}</button>
                ))}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400
                    hover:border-slate-300 hover:text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed
                    transition-all duration-150 cursor-pointer text-sm"
                  aria-label="Next page"
                >›</button>
              </div>
              <span className="text-xs text-slate-400">
                {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
              </span>
            </div>
          )}
        </div>

        {/* Map */}
        <div className="w-full h-56 md:w-85 md:h-95 shrink-0 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
          <Map
            ref={mapRef}
            theme="light"
            center={viewport.center}
            zoom={viewport.zoom}
            styles={{
              light: 'https://tiles.openfreemap.org/styles/liberty',
              dark: 'https://tiles.openfreemap.org/styles/dark',
            }}
          >
            <MapControls showZoom position="bottom-right" />
            {pageItems.map(({ loc, originalIndex }, pageIdx) => {
              if (!loc.geoPoint) return null
              const isSelected = selectedIndex === originalIndex
              return (
                <MapMarker
                  key={originalIndex}
                  longitude={loc.geoPoint.lon}
                  latitude={loc.geoPoint.lat}
                  onClick={() => handleSelect(originalIndex)}
                >
                  <MarkerContent>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                      shadow-md border-2 border-white cursor-pointer transition-transform hover:scale-110 ${
                      isSelected ? 'bg-sky-500 text-white scale-125' : 'bg-slate-700 text-white'
                    }`}>
                      {pageIdx + 1}
                    </div>
                  </MarkerContent>
                  <MarkerTooltip>
                    <span className="text-xs font-medium">
                      {loc.facility ?? `Site ${originalIndex + 1}`}
                    </span>
                  </MarkerTooltip>
                </MapMarker>
              )
            })}
          </Map>
        </div>
      </div>

      {/* Footer action */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        {selectedIndex !== null ? (
          <div className="text-sm">
            <span className="text-slate-500">You have selected </span>
            <span className="font-semibold text-slate-900">
              {locations[selectedIndex]?.facility ?? `Site ${selectedIndex + 1}`}
            </span>
            {locations[selectedIndex]?.city && (
              <span className="text-sky-500 text-xs ml-1">
                {[locations[selectedIndex].city, locations[selectedIndex].state].filter(Boolean).join(', ')}
              </span>
            )}
          </div>
        ) : (
          <p className="text-xs text-slate-400">Select a site above to continue</p>
        )}
        <Button
          onClick={onNext}
          disabled={selectedIndex === null}
          className="bg-sky-600 hover:bg-sky-700 text-white"
        >
          Next →
        </Button>
      </div>
    </div>
  )
}

// ─── Step 2: Contact Form ─────────────────────────────────────────────────────

interface ContactFormProps {
  selectedSite: Location
  nctId: string
  trialTitle: string
  sponsorName?: string
  onBack: () => void
  onSuccess: (email: string) => void
}

function ContactForm({ selectedSite, nctId, trialTitle, sponsorName, onBack, onSuccess }: ContactFormProps) {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dialCode: 'US',
  })
  const [ageConsent, setAgeConsent] = useState(false)
  const [dbConsent, setDbConsent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  function set(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!ageConsent || !dbConsent) return
    setSending(true)
    setError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          nctId,
          trialTitle,
          siteName: selectedSite.facility,
          siteCity: selectedSite.city,
          siteState: selectedSite.state,
          siteCountry: selectedSite.country,
          siteContacts: selectedSite.contacts ?? [],
        }),
      })
      if (!res.ok) { setError('Something went wrong. Please try again.'); return }
      onSuccess(form.email)
    } catch {
      setError('Network error. Please check your connection.')
    } finally {
      setSending(false)
    }
  }

  const cityLine = [selectedSite.city, selectedSite.state, selectedSite.country].filter(Boolean).join(' ')

  const inputCls = `w-full px-3 py-2.5 rounded-xl text-sm text-slate-900 placeholder-slate-400
    bg-white border border-slate-200 focus:outline-none focus:ring-2
    focus:ring-sky-400/50 focus:border-sky-500 transition-all duration-200`

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50">
          <div className="w-9 h-9 rounded-full bg-sky-100 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">{sponsorName ?? 'Research Team'}</p>
            <p className="text-xs text-slate-500">Primary Contact</p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50">
          <div className="w-9 h-9 rounded-full bg-sky-100 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">
              {selectedSite.facility ?? 'Selected Site'}
            </p>
            {cityLine && <p className="text-xs text-slate-500 truncate">{cityLine}</p>}
          </div>
        </div>
      </div>

      {/* Name row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-700">
            First name <span className="text-red-500">*</span>
          </label>
          <input type="text" required placeholder="Jane" value={form.firstName}
            onChange={set('firstName')} className={inputCls} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-700">
            Last name <span className="text-red-500">*</span>
          </label>
          <input type="text" required placeholder="Smith" value={form.lastName}
            onChange={set('lastName')} className={inputCls} />
        </div>
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-700">
          Email <span className="text-red-500">*</span>
        </label>
        <input type="email" required placeholder="jane@example.com" value={form.email}
          onChange={set('email')} className={inputCls} />
      </div>

      {/* Phone */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-700">
          Phone number <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2">
          <DialCodePicker
            value={form.dialCode}
            onChange={cc => setForm(prev => ({ ...prev, dialCode: cc }))}
          />
          <input type="tel" required placeholder="Phone number" value={form.phone}
            onChange={set('phone')} className={`${inputCls} flex-1`} />
        </div>
      </div>

      {/* Checkboxes */}
      <div className="flex flex-col gap-3">
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={ageConsent}
            onChange={e => setAgeConsent(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-slate-300 accent-sky-600 cursor-pointer"
          />
          <span className="text-sm text-slate-700 leading-snug">
            I am at least 18 years old.
          </span>
        </label>

        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={dbConsent}
            onChange={e => setDbConsent(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-slate-300 accent-sky-600 cursor-pointer"
          />
          <span className="text-sm leading-relaxed">
            <span className="text-red-500 font-medium">By sending a message, </span>
            <span className="text-slate-600">
              I agree to share my information with the study team for the selected site and consent to be added to the{' '}
              <strong className="text-slate-800">TheStudiesGuy database</strong> to receive notifications about relevant
              future trials. TheStudiesGuy values your privacy; your information will be handled in accordance with our{' '}
              <a href="/privacy" className="text-sky-500 hover:underline">Privacy Policy</a>.
            </span>
          </span>
        </label>
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <Button type="button" variant="secondary" onClick={onBack}>
          ← Back
        </Button>
        <Button
          type="submit"
          isLoading={sending}
          disabled={!ageConsent || !dbConsent || sending}
          className="bg-sky-600 hover:bg-sky-700 text-white"
        >
          Send ›
        </Button>
      </div>
    </form>
  )
}

// ─── Step 3: Success ──────────────────────────────────────────────────────────

function SuccessScreen({ site, email }: { site: Location; email: string }) {
  return (
    <div className="flex flex-col items-center text-center gap-4 py-8">
      <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
        <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div>
        <h3 className="text-slate-900 font-semibold text-lg">Message sent!</h3>
        <p className="text-slate-500 text-sm mt-1 max-w-sm">
          Your inquiry has been forwarded to the study team at{' '}
          <strong className="text-slate-700">{site.facility ?? 'the selected site'}</strong>.
          A confirmation email has been sent to <strong className="text-slate-700">{email}</strong>.
        </p>
      </div>
      {(site.contacts ?? []).length > 0 && (
        <div className="w-full max-w-sm bg-slate-50 rounded-xl border border-slate-200 px-4 py-3 text-left">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Site contact info</p>
          <div className="flex flex-col gap-2">
            {(site.contacts ?? []).map((c, i) => (
              <div key={i} className="text-sm text-slate-700">
                {c.name && <span className="font-medium">{c.name}</span>}
                {c.role && <span className="text-slate-400 text-xs ml-1">· {c.role.replace(/_/g, ' ')}</span>}
                {c.phone && <p className="text-xs text-slate-500">{c.phone}</p>}
                {c.email && (
                  <a href={`mailto:${c.email}`} className="text-xs text-sky-500 hover:underline">{c.email}</a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Root export ──────────────────────────────────────────────────────────────

export default function SiteSelectorFlow({ locations, nctId, trialTitle, sponsorName }: Props) {
  const [step, setStep] = useState<'select' | 'contact' | 'success'>('select')
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [submittedEmail, setSubmittedEmail] = useState('')

  const STEP_LABELS = [
    { key: 'select', label: 'Select a site' },
    { key: 'contact', label: 'Send a message' },
  ]

  return (
    <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
      {/* Stepper header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
        {STEP_LABELS.map((s, i) => {
          const isActive = step === s.key || (step === 'success' && s.key === 'contact')
          const isPast = (i === 0 && (step === 'contact' || step === 'success'))
          return (
            <span key={s.key} className="flex items-center gap-2 text-sm">
              {i > 0 && <span className="text-slate-300">›</span>}
              <span className={
                isActive ? 'text-slate-900 font-semibold'
                : isPast ? 'text-slate-400'
                : 'text-slate-400'
              }>
                {s.label}
              </span>
            </span>
          )
        })}
      </div>

      {/* Panel */}
      <div className="px-6 py-6">
        {/* Step title */}
        {step !== 'success' && (
          <div className="mb-5">
            <h2 className="text-slate-900 font-bold text-lg">
              {step === 'select' ? 'Select a site' : 'Send a message'}
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {step === 'select'
                ? 'Enter your location to find study centers near you'
                : 'Enter your contact details to connect with the study team'}
            </p>
          </div>
        )}

        {step === 'select' && (
          <SiteSelector
            locations={locations}
            selectedIndex={selectedIndex}
            onSelect={setSelectedIndex}
            onNext={() => setStep('contact')}
          />
        )}

        {step === 'contact' && selectedIndex !== null && (
          <ContactForm
            selectedSite={locations[selectedIndex]}
            nctId={nctId}
            trialTitle={trialTitle}
            sponsorName={sponsorName}
            onBack={() => setStep('select')}
            onSuccess={(email: string) => {
              setSubmittedEmail(email)
              setStep('success')
            }}
          />
        )}

        {step === 'success' && selectedIndex !== null && (
          <SuccessScreen site={locations[selectedIndex]} email={submittedEmail} />
        )}
      </div>
    </div>
  )
}
