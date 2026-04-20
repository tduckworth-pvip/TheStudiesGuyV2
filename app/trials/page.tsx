import { Suspense } from 'react'
import { searchTrials } from '@/lib/clinicaltrials'
import type { TrialStudy } from '@/lib/clinicaltrials'
import { STATUS_PRIORITY } from '@/lib/trial-constants'
import TrialCard from './TrialCard'
import TrialsFilters from './TrialsFilters'
import Pagination from './Pagination'
import Navbar from '@/app/components/Navbar'

function prioritiseStudies(studies: TrialStudy[], country?: string): TrialStudy[] {
  // Reorder each study's locations so the searched-country site appears first
  if (country) {
    for (const study of studies) {
      const locs = study.protocolSection.contactsLocationsModule?.locations
      if (!locs || locs.length <= 1) continue
      const nearby = locs.filter(l => l.country === country)
      const elsewhere = locs.filter(l => l.country !== country)
      study.protocolSection.contactsLocationsModule!.locations = [...nearby, ...elsewhere]
    }
  }
  // Sort studies: RECRUITING → NOT_YET_RECRUITING → AVAILABLE → rest
  return [...studies].sort((a, b) => {
    const pa = STATUS_PRIORITY[a.protocolSection.statusModule.overallStatus] ?? 99
    const pb = STATUS_PRIORITY[b.protocolSection.statusModule.overallStatus] ?? 99
    return pa - pb
  })
}

interface PageProps {
  searchParams: Promise<{
    condition?: string
    status?: string
    phase?: string
    lat?: string
    lng?: string
    location?: string
    country?: string
    pageToken?: string
    page?: string
  }>
}

async function TrialsList({
  condition,
  status,
  phase,
  lat,
  lng,
  location,
  country,
  pageToken,
  page,
}: {
  condition?: string
  status?: string
  phase?: string
  lat?: number
  lng?: number
  location?: string
  country?: string
  pageToken?: string
  page: number
}) {
  const result = await searchTrials({
    condition: condition || undefined,
    status: status ? [status] : undefined,
    phase: phase ? [phase] : undefined,
    lat,
    lng,
    pageToken: pageToken || undefined,
    pageSize: 20,
  })

  const { nextPageToken, totalCount } = result
  const studies = prioritiseStudies(result.studies, country)

  if (!studies.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
          <svg className="w-7 h-7 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-slate-700 font-medium">No trials found</p>
        <p className="text-slate-500 text-sm mt-1">Try adjusting your filters or search term.</p>
      </div>
    )
  }

  return (
    <>
      {totalCount !== undefined && (
        <p className="text-slate-500 text-sm mb-5">
          Showing page {page} —{' '}
          <span className="text-slate-900 font-medium">
            {totalCount.toLocaleString()} total results
          </span>
          {condition && <> for <span className="text-cyan-600">&quot;{condition}&quot;</span></>}
          {lat != null && <> within <span className="text-cyan-600">50 miles</span></>}
        </p>
      )}

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {studies.map(study => (
          <TrialCard key={study.protocolSection.identificationModule.nctId} study={study}
            lat={lat} lng={lng} location={location} />
        ))}
      </div>

      <Pagination
        currentPage={page}
        hasNextPage={!!nextPageToken}
        nextPageToken={nextPageToken}
      />
    </>
  )
}

function TrialsListSkeleton() {
  return (
    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {[...Array(12)].map((_, i) => (
        <div key={i} className="h-56 rounded-2xl bg-slate-200 animate-pulse" />
      ))}
    </div>
  )
}

export default async function TrialsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const condition = params.condition ?? ''
  const status = params.status ?? ''
  const phase = params.phase ?? ''
  const lat = params.lat ? parseFloat(params.lat) : undefined
  const lng = params.lng ? parseFloat(params.lng) : undefined
  const location = params.location ?? ''
  const country = params.country ?? ''
  const pageToken = params.pageToken ?? ''
  const page = Number(params.page ?? 1)

  const hasFilters = !!(condition || status || phase || lat)

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 40%, #f8fafc 100%)' }}>

      <Navbar activePath="/trials" cta={{ label: '← Home', href: '/' }} />

      <div className="pt-28 pb-16 px-4">
        <div className="max-w-7xl mx-auto">

          {/* Page header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
              {hasFilters ? 'Search Results' : 'All Clinical Trials'}
            </h1>
            <p className="text-slate-500">
              {location
                ? <>Trials within 50 miles of <span className="text-slate-900 font-medium">{location.split(',').slice(0, 2).join(',')}</span></>
                : hasFilters
                  ? 'Filtered results from the ClinicalTrials.gov registry'
                  : 'Browse all registered studies from ClinicalTrials.gov — updated in real time'}
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">

            {/* Sidebar filters */}
            <aside className="lg:w-64 shrink-0">
              <div className="sticky top-24 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <h2 className="text-slate-900 font-semibold mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                  </svg>
                  Filters
                </h2>
                <Suspense>
                  <TrialsFilters />
                </Suspense>
              </div>
            </aside>

            {/* Results */}
            <main className="flex-1 min-w-0">
              <Suspense key={`${condition}-${status}-${phase}-${lat}-${pageToken}`} fallback={<TrialsListSkeleton />}>
                <TrialsList
                  condition={condition}
                  status={status}
                  phase={phase}
                  lat={lat}
                  lng={lng}
                  location={location}
                  country={country}
                  pageToken={pageToken}
                  page={page}
                />
              </Suspense>
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}
