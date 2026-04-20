import { STATUSES, PHASES, STATUS_LABELS, STATUS_STYLES } from '@/lib/trial-constants'

export const dynamic = 'force-static'

export async function GET() {
  return Response.json({
    statuses: STATUSES,
    phases: PHASES,
    statusLabels: STATUS_LABELS,
    statusStyles: STATUS_STYLES,
  })
}
