import { PHASE_API_MAP } from './trial-constants'

const BASE_URL = 'https://clinicaltrials.gov/api/v2'

export interface TrialStudy {
  protocolSection: {
    identificationModule: {
      nctId: string
      briefTitle: string
      officialTitle?: string
    }
    statusModule: {
      overallStatus: string
      startDateStruct?: { date: string }
      completionDateStruct?: { date: string }
    }
    conditionsModule?: {
      conditions: string[]
    }
    descriptionModule?: {
      briefSummary?: string
      detailedDescription?: string
    }
    designModule?: {
      phases?: string[]
      enrollmentInfo?: { count?: number; type?: string }
    }
    contactsLocationsModule?: {
      centralContacts?: Array<{
        name?: string
        role?: string
        phone?: string
        email?: string
      }>
      overallOfficials?: Array<{
        name?: string
        affiliation?: string
        role?: string
      }>
      locations?: Array<{
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
      }>
    }
    sponsorCollaboratorsModule?: {
      leadSponsor?: { name: string }
    }
    eligibilityModule?: {
      minimumAge?: string
      maximumAge?: string
      sex?: string
      eligibilityCriteria?: string
    }
    armsInterventionsModule?: {
      interventions?: Array<{
        type?: string
        name?: string
        description?: string
      }>
    }
    outcomesModule?: {
      primaryOutcomes?: Array<{
        measure?: string
        description?: string
        timeFrame?: string
      }>
      secondaryOutcomes?: Array<{
        measure?: string
        description?: string
        timeFrame?: string
      }>
    }
  }
}

export interface TrialSearchParams {
  condition?: string
  intervention?: string
  status?: string[]
  phase?: string[]
  lat?: number
  lng?: number
  radiusMiles?: number
  pageSize?: number
  pageToken?: string
}

export interface TrialSearchResult {
  studies: TrialStudy[]
  nextPageToken?: string
  totalCount?: number
}

export async function searchTrials(params: TrialSearchParams): Promise<TrialSearchResult> {
  const query = new URLSearchParams()

  if (params.condition) query.set('query.cond', params.condition)
  if (params.intervention) query.set('query.intr', params.intervention)
  if (params.status?.length) query.set('filter.overallStatus', params.status.join(','))
  if (params.phase?.length) {
    const numeric = params.phase.map(p => PHASE_API_MAP[p]).filter(Boolean)
    if (numeric.length) query.set('aggFilters', `phase:${numeric.join(',')}`)
  }
  query.set('pageSize', String(params.pageSize ?? 10))
  if (params.lat != null && params.lng != null) {
    const radius = params.radiusMiles ?? 50
    query.set('filter.geo', `distance(${params.lat},${params.lng},${radius}mi)`)
  }
  if (params.pageToken) query.set('pageToken', params.pageToken)
  query.set('format', 'json')

  const res = await fetch(`${BASE_URL}/studies?${query.toString()}`, {
    next: { revalidate: 300 },
  })

  if (!res.ok) throw new Error(`ClinicalTrials API error: ${res.status}`)

  const data = await res.json()
  return {
    studies: data.studies ?? [],
    nextPageToken: data.nextPageToken,
    totalCount: data.totalCount,
  }
}

export async function getTrialById(nctId: string): Promise<TrialStudy> {
  const res = await fetch(`${BASE_URL}/studies/${nctId}?format=json`, {
    next: { revalidate: 3600 },
  })
  if (!res.ok) throw new Error(`ClinicalTrials API error: ${res.status}`)
  return res.json()
}

export async function getTrialStats(): Promise<{ total: number; recruiting: number }> {
  const [totalRes, recruitingRes] = await Promise.all([
    fetch(`${BASE_URL}/studies?pageSize=1&format=json`, { next: { revalidate: 3600 } }),
    fetch(`${BASE_URL}/studies?filter.overallStatus=RECRUITING&pageSize=1&format=json`, {
      next: { revalidate: 3600 },
    }),
  ])

  const [total, recruiting] = await Promise.all([totalRes.json(), recruitingRes.json()])
  return {
    total: total.totalCount ?? 0,
    recruiting: recruiting.totalCount ?? 0,
  }
}
