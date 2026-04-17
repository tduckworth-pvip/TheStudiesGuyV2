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
    }
    designModule?: {
      phases?: string[]
    }
    contactsLocationsModule?: {
      locations?: Array<{
        city?: string
        state?: string
        country?: string
      }>
    }
    sponsorCollaboratorsModule?: {
      leadSponsor?: { name: string }
    }
    eligibilityModule?: {
      minimumAge?: string
      maximumAge?: string
      sex?: string
    }
  }
}

export interface TrialSearchParams {
  condition?: string
  intervention?: string
  status?: string[]
  phase?: string[]
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
  if (params.phase?.length) query.set('filter.phase', params.phase.join(','))
  query.set('pageSize', String(params.pageSize ?? 10))
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
