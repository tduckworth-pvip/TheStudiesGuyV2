'use client'

import { useState } from 'react'
import { STATUS_STYLES, STATUS_LABELS } from '@/lib/trial-constants'

interface Location {
  facility?: string
  city?: string
  state?: string
  country?: string
  status?: string
  geoPoint?: { lat: number; lon: number }
  contacts?: Array<{
    name?: string
    role?: string
    phone?: string
    email?: string
  }>
}

interface Props {
  locations: Location[]
  patientLat?: number
  patientLng?: number
}

function haversineMiles(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function LocationEntry({ loc }: { loc: Location }) {
  const locStatus = loc.status?.toUpperCase().replace(/ /g, '_')
  const locContacts = loc.contacts ?? []
  const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(
    [loc.facility, loc.city, loc.state, loc.country].filter(Boolean).join(', ')
  )}`
  const cityLine = [loc.city, loc.state].filter(Boolean).join(', ')

  return (
    <li className="flex items-stretch gap-0">
      <div className="w-1 shrink-0 rounded-full bg-cyan-400 mr-3" />
      <div className="flex-1 min-w-0 py-0.5">
        {loc.facility && (
          <p className="text-sm font-semibold text-slate-900 leading-snug">{loc.facility}</p>
        )}
        {cityLine && (
          <p className="text-xs text-slate-500 mt-0.5">{cityLine}</p>
        )}
        {locStatus && (
          <span className={`inline-block mt-1.5 text-xs font-medium px-2 py-0.5 rounded-full border
            ${STATUS_STYLES[locStatus] ?? 'bg-slate-100 text-slate-600 border-slate-200'}`}>
            {STATUS_LABELS[locStatus] ?? loc.status}
          </span>
        )}
        {locContacts.length > 0 && (
          <div className="mt-2 flex flex-col gap-1">
            {locContacts.map((c, ci) => (
              <div key={ci} className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
                {c.name && <span className="text-xs text-slate-600 font-medium">Contact: {c.name}</span>}
                {c.phone && (
                  <a href={`tel:${c.phone}`} className="text-xs text-slate-500 hover:text-slate-700 transition-colors">
                    {c.phone}
                  </a>
                )}
                {c.email && (
                  <a href={`mailto:${c.email}`}
                    className="text-xs text-cyan-600 hover:text-cyan-700 hover:underline transition-colors">
                    {c.email}
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
        <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1 mt-1.5 text-xs text-slate-400 hover:text-cyan-600 transition-colors cursor-pointer">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          View on map
        </a>
      </div>
    </li>
  )
}

function CountryGroup({ country, locs }: { country: string; locs: Location[] }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-slate-50
          hover:bg-slate-100 transition-colors duration-200 cursor-pointer text-left"
        aria-expanded={open}
      >
        <span className="font-semibold text-slate-800 text-sm">
          {country}
          <span className="ml-2 text-xs font-normal text-slate-400">
            {locs.length} site{locs.length !== 1 ? 's' : ''}
          </span>
        </span>
        <svg
          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <ul className="px-4 py-4 flex flex-col gap-4 border-t border-slate-100">
          {locs.map((loc, i) => <LocationEntry key={i} loc={loc} />)}
        </ul>
      )}
    </div>
  )
}

export default function LocationsSection({ locations, patientLat, patientLng }: Props) {
  const [collapsedOpen, setCollapsedOpen] = useState(false)

  const hasPatientLocation = patientLat != null && patientLng != null

  const usLocations = locations.filter(l => l.country === 'United States')

  // If patient location provided, split US into nearby vs far. Otherwise show all US expanded.
  const nearbyUS = hasPatientLocation
    ? usLocations.filter(l =>
        l.geoPoint
          ? haversineMiles(patientLat, patientLng, l.geoPoint.lat, l.geoPoint.lon) <= 50
          : false
      )
    : usLocations

  const farUS = hasPatientLocation
    ? usLocations.filter(l =>
        l.geoPoint
          ? haversineMiles(patientLat, patientLng, l.geoPoint.lat, l.geoPoint.lon) > 50
          : true
      )
    : []

  // Collapsed section: far US + all non-US, grouped by country
  const collapsedByCountry = [
    ...farUS,
    ...locations.filter(l => l.country !== 'United States'),
  ].reduce<Record<string, Location[]>>((acc, loc) => {
    const country = loc.country ?? 'Other'
    if (!acc[country]) acc[country] = []
    acc[country].push(loc)
    return acc
  }, {})

  const collapsedCountries = Object.keys(collapsedByCountry).sort((a, b) =>
    a === 'United States' ? -1 : b === 'United States' ? 1 : a.localeCompare(b)
  )
  const collapsedTotal = locations.length - nearbyUS.length

  // No patient location: group everything by country as collapsible accordion
  const allCountries = locations.reduce<Record<string, Location[]>>((acc, loc) => {
    const country = loc.country ?? 'Other'
    if (!acc[country]) acc[country] = []
    acc[country].push(loc)
    return acc
  }, {})

  return (
    <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-slate-900 font-semibold">Study Locations</h2>
        <span className="text-sm text-slate-400">
          {locations.length} site{locations.length !== 1 ? 's' : ''} worldwide
        </span>
      </div>

      <div className="px-6 py-5 flex flex-col gap-6">
        {hasPatientLocation ? (
          <>
            {/* Nearby US — expanded */}
            {nearbyUS.length > 0 ? (
              <div>
                <h3 className="text-sm font-bold text-slate-900 pb-2 mb-4 border-b border-slate-100 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-500" aria-hidden="true" />
                    United States — within 50 miles
                  </span>
                  <span className="text-xs font-normal text-slate-400">
                    {nearbyUS.length} site{nearbyUS.length !== 1 ? 's' : ''}
                  </span>
                </h3>
                <ul className="flex flex-col gap-4">
                  {nearbyUS.map((loc, i) => <LocationEntry key={i} loc={loc} />)}
                </ul>
              </div>
            ) : (
              <p className="text-sm text-slate-500 text-center py-2">
                No US sites found within 50 miles of your location.
              </p>
            )}

            {/* Everything else — collapsed */}
            {collapsedCountries.length > 0 && (
              <div className="border-t border-slate-100 pt-4">
                <button
                  onClick={() => setCollapsedOpen(o => !o)}
                  className="w-full flex items-center justify-between text-sm font-semibold
                    text-slate-600 hover:text-slate-900 transition-colors duration-200 cursor-pointer"
                  aria-expanded={collapsedOpen}
                >
                  <span className="flex items-center gap-2">
                    <svg
                      className={`w-4 h-4 text-cyan-500 transition-transform duration-200 ${collapsedOpen ? 'rotate-180' : ''}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    {collapsedOpen ? 'Hide' : 'Show'} other locations
                  </span>
                  <span className="text-xs font-normal text-slate-400">
                    {collapsedTotal} site{collapsedTotal !== 1 ? 's' : ''} · {collapsedCountries.length} countr{collapsedCountries.length !== 1 ? 'ies' : 'y'}
                  </span>
                </button>
                {collapsedOpen && (
                  <div className="mt-4 flex flex-col gap-3">
                    {collapsedCountries.map(country => (
                      <CountryGroup key={country} country={country} locs={collapsedByCountry[country]} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          /* No patient location — show US expanded, all others collapsed */
          <>
            {usLocations.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-slate-900 pb-2 mb-4 border-b border-slate-100 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-500" aria-hidden="true" />
                    United States
                  </span>
                  <span className="text-xs font-normal text-slate-400">
                    {usLocations.length} site{usLocations.length !== 1 ? 's' : ''}
                  </span>
                </h3>
                <ul className="flex flex-col gap-4">
                  {usLocations.map((loc, i) => <LocationEntry key={i} loc={loc} />)}
                </ul>
              </div>
            )}
            {Object.keys(allCountries).filter(c => c !== 'United States').length > 0 && (
              <div className={usLocations.length > 0 ? 'border-t border-slate-100 pt-4' : ''}>
                <button
                  onClick={() => setCollapsedOpen(o => !o)}
                  className="w-full flex items-center justify-between text-sm font-semibold
                    text-slate-600 hover:text-slate-900 transition-colors duration-200 cursor-pointer"
                  aria-expanded={collapsedOpen}
                >
                  <span className="flex items-center gap-2">
                    <svg
                      className={`w-4 h-4 text-cyan-500 transition-transform duration-200 ${collapsedOpen ? 'rotate-180' : ''}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    {collapsedOpen ? 'Hide' : 'Show'} international locations
                  </span>
                  <span className="text-xs font-normal text-slate-400">
                    {Object.keys(allCountries).filter(c => c !== 'United States').length} countr{Object.keys(allCountries).filter(c => c !== 'United States').length !== 1 ? 'ies' : 'y'}
                  </span>
                </button>
                {collapsedOpen && (
                  <div className="mt-4 flex flex-col gap-3">
                    {Object.keys(allCountries).filter(c => c !== 'United States').sort().map(country => (
                      <CountryGroup key={country} country={country} locs={allCountries[country]} />
                    ))}
                  </div>
                )}
              </div>
            )}
            {usLocations.length === 0 && (
              <div className="flex flex-col gap-3">
                {Object.keys(allCountries).sort().map(country => (
                  <CountryGroup key={country} country={country} locs={allCountries[country]} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
