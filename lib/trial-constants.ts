export const STATUS_STYLES: Record<string, string> = {
  RECRUITING: 'bg-green-50 text-green-700 border-green-200',
  NOT_YET_RECRUITING: 'bg-amber-50 text-amber-700 border-amber-200',
  AVAILABLE: 'bg-purple-50 text-purple-700 border-purple-200',
  ACTIVE_NOT_RECRUITING: 'bg-blue-50 text-blue-700 border-blue-200',
  COMPLETED: 'bg-slate-100 text-slate-600 border-slate-300',
  TERMINATED: 'bg-red-50 text-red-700 border-red-200',
  WITHDRAWN: 'bg-orange-50 text-orange-700 border-orange-200',
}

export const STATUS_LABELS: Record<string, string> = {
  RECRUITING: 'Recruiting',
  NOT_YET_RECRUITING: 'Not Yet Recruiting',
  AVAILABLE: 'Available',
  ACTIVE_NOT_RECRUITING: 'Active, Not Recruiting',
  COMPLETED: 'Completed',
  TERMINATED: 'Terminated',
  WITHDRAWN: 'Withdrawn',
}

/** Lower number = shown first. Studies contactable by patients get the lowest priority numbers. */
export const STATUS_PRIORITY: Record<string, number> = {
  RECRUITING: 0,
  NOT_YET_RECRUITING: 1,
  AVAILABLE: 2,
  ACTIVE_NOT_RECRUITING: 3,
  COMPLETED: 4,
  TERMINATED: 5,
  WITHDRAWN: 6,
}

export const STATUSES = [
  { value: '', label: 'All Statuses' },
  { value: 'RECRUITING', label: 'Recruiting' },
  { value: 'NOT_YET_RECRUITING', label: 'Not Yet Recruiting' },
  { value: 'ACTIVE_NOT_RECRUITING', label: 'Active, Not Recruiting' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'TERMINATED', label: 'Terminated' },
] as const

export const PHASES = [
  { value: '', label: 'All Phases' },
  { value: 'EARLY_PHASE1', label: 'Early Phase 1' },
  { value: 'PHASE1', label: 'Phase 1' },
  { value: 'PHASE2', label: 'Phase 2' },
  { value: 'PHASE3', label: 'Phase 3' },
  { value: 'PHASE4', label: 'Phase 4' },
  { value: 'NA', label: 'N/A' },
] as const

export const SEX_LABELS: Record<string, string> = {
  ALL: 'All sexes',
  MALE: 'Male only',
  FEMALE: 'Female only',
}

// ClinicalTrials.gov v2 API expects numeric phase values
export const PHASE_API_MAP: Record<string, string> = {
  EARLY_PHASE1: '0',
  PHASE1: '1',
  PHASE2: '2',
  PHASE3: '3',
  PHASE4: '4',
  NA: '5',
}
