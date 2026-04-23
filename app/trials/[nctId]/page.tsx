import { notFound } from 'next/navigation'
import { getTrialById } from '@/lib/clinicaltrials'
import { StatusBadge } from '@/app/components/ui/StatusBadge'
import { SEX_LABELS } from '@/lib/trial-constants'
import Navbar from '@/app/components/Navbar'
import ContactSection from './ContactSection'
import SiteSelectorFlow from './SiteSelectorFlow'

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100">
        <h2 className="text-slate-900 font-semibold text-sm">{title}</h2>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  )
}

function StatBlock({ label, value }: { label: string; value?: string | number }) {
  if (!value) return null
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">{label}</span>
      <span className="text-sm text-slate-900 font-semibold">{value}</span>
    </div>
  )
}

interface PageProps {
  params: Promise<{ nctId: string }>
}

export default async function TrialDetailPage({ params }: PageProps) {
  const { nctId } = await params
  let study
  try {
    study = await getTrialById(nctId)
  } catch {
    notFound()
  }

  const p = study.protocolSection
  const title = p.identificationModule.officialTitle ?? p.identificationModule.briefTitle
  const status = p.statusModule.overallStatus

  const summary = p.descriptionModule?.briefSummary
  const detailedDesc = p.descriptionModule?.detailedDescription
  const conditions = p.conditionsModule?.conditions ?? []
  const phases = p.designModule?.phases ?? []
  const enrollment = p.designModule?.enrollmentInfo
  const sponsor = p.sponsorCollaboratorsModule?.leadSponsor?.name
  const startDate = p.statusModule.startDateStruct?.date
  const endDate = p.statusModule.completionDateStruct?.date
  const eligibility = p.eligibilityModule
  const locations = p.contactsLocationsModule?.locations ?? []
  const centralContacts = p.contactsLocationsModule?.centralContacts ?? []
  const officials = p.contactsLocationsModule?.overallOfficials ?? []
  const interventions = p.armsInterventionsModule?.interventions ?? []
  const primaryOutcomes = p.outcomesModule?.primaryOutcomes ?? []
  const secondaryOutcomes = p.outcomesModule?.secondaryOutcomes ?? []

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 40%, #f8fafc 100%)' }}>

      <Navbar activePath="/trials" cta={{ label: '← Back to trials', href: '/trials' }} />

      <div className="pt-28 pb-16 px-4">
        <div className="max-w-6xl mx-auto flex flex-col gap-6">

          {/* Hero card */}
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <StatusBadge status={status} />
              <span className="text-xs font-mono text-slate-500">
                NCT ID: <span className="text-sky-600/80">{nctId}</span>
              </span>
            </div>

            <h1 className="text-xl md:text-2xl font-bold text-slate-900 leading-snug mb-4">{title}</h1>

            {summary && (
              <p className="text-slate-600 text-sm leading-relaxed border-l-2 border-sky-500/60 pl-4">
                {summary}
              </p>
            )}

            {/* Stats strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
              <StatBlock label="Start date" value={startDate} />
              <StatBlock label="Est. completion" value={endDate} />
              {enrollment?.count && (
                <StatBlock label="Enrollment" value={`${enrollment.count.toLocaleString()} participants`} />
              )}
              <StatBlock label="Locations" value={locations.length ? `${locations.length} site${locations.length !== 1 ? 's' : ''}` : undefined} />
              <StatBlock label="Organization" value={sponsor} />
              {phases.length > 0 && (
                <StatBlock label="Phase" value={phases.map(ph => ph.replace(/_/g, ' ')).join(', ')} />
              )}
            </div>
          </div>

          {/* Two-column layout */}
          <div className="flex flex-col lg:flex-row gap-6">

            {/* Left: main content */}
            <div className="flex-1 flex flex-col gap-6 min-w-0">

              {/* Interventions */}
              {interventions.length > 0 && (
                <SectionCard title="Interventions">
                  <div className="flex flex-col gap-4">
                    {interventions.map((inv, i) => (
                      <div key={i} className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          {inv.type && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 font-medium">
                              {inv.type.replace(/_/g, ' ')}
                            </span>
                          )}
                          {inv.name && <span className="text-sm text-slate-900 font-medium">{inv.name}</span>}
                        </div>
                        {inv.description && (
                          <p className="text-sm text-slate-600 leading-relaxed">{inv.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </SectionCard>
              )}

              {/* Detailed description */}
              {detailedDesc && (
                <SectionCard title="Detailed Description">
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{detailedDesc}</p>
                </SectionCard>
              )}

              {/* Study Outcomes */}
              {(primaryOutcomes.length > 0 || secondaryOutcomes.length > 0) && (
                <SectionCard title="Study Outcomes">
                  <div className="flex flex-col gap-6">
                    {primaryOutcomes.length > 0 && (
                      <div className="flex flex-col gap-3">
                        <h3 className="text-xs text-slate-500 uppercase tracking-wider font-medium">Primary Outcomes</h3>
                        {primaryOutcomes.map((o, i) => (
                          <div key={i} className="flex flex-col gap-1 pl-3 border-l-2 border-sky-400/50">
                            {o.measure && <p className="text-sm text-slate-900 font-medium">{o.measure}</p>}
                            {o.description && <p className="text-xs text-slate-600 leading-relaxed">{o.description}</p>}
                            {o.timeFrame && <p className="text-xs text-slate-500">Time frame: {o.timeFrame}</p>}
                          </div>
                        ))}
                      </div>
                    )}
                    {secondaryOutcomes.length > 0 && (
                      <div className="flex flex-col gap-3">
                        <h3 className="text-xs text-slate-500 uppercase tracking-wider font-medium">Secondary Outcomes</h3>
                        {secondaryOutcomes.map((o, i) => (
                          <div key={i} className="flex flex-col gap-1 pl-3 border-l-2 border-slate-200">
                            {o.measure && <p className="text-sm text-slate-900 font-medium">{o.measure}</p>}
                            {o.description && <p className="text-xs text-slate-600 leading-relaxed">{o.description}</p>}
                            {o.timeFrame && <p className="text-xs text-slate-500">Time frame: {o.timeFrame}</p>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </SectionCard>
              )}

              {/* Study Locations + Contact Flow */}
              {locations.length > 0 && (
                <div id="site-selector">
                  <SiteSelectorFlow
                    locations={locations}
                    nctId={nctId}
                    trialTitle={title}
                    sponsorName={sponsor}
                  />
                </div>
              )}
            </div>

            {/* Right: sidebar */}
            <div className="lg:w-80 shrink-0 flex flex-col gap-6">

              {/* Contact section */}
              <ContactSection
                centralContacts={centralContacts}
                officials={officials}
              />

              {/* Eligibility */}
              <SectionCard title="Eligibility">
                <div className="flex flex-col gap-4">
                  {eligibility?.sex && (
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Sex</p>
                      <p className="text-sm text-slate-900">{SEX_LABELS[eligibility.sex] ?? eligibility.sex}</p>
                    </div>
                  )}
                  {(eligibility?.minimumAge || eligibility?.maximumAge) && (
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Age Range</p>
                      <p className="text-sm text-slate-900">
                        {[eligibility.minimumAge, eligibility.maximumAge].filter(Boolean).join(' – ')}
                      </p>
                    </div>
                  )}
                  {phases.length > 0 && (
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Phases</p>
                      <p className="text-sm text-slate-900">{phases.map(ph => ph.replace(/_/g, ' ')).join(', ')}</p>
                    </div>
                  )}
                  {eligibility?.eligibilityCriteria && (
                    <div>
                      <p className="text-xs text-slate-500 mb-2">Eligibility Criteria</p>
                      <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                        {eligibility.eligibilityCriteria}
                      </p>
                    </div>
                  )}
                </div>
              </SectionCard>

              {/* Conditions */}
              {conditions.length > 0 && (
                <SectionCard title="Conditions">
                  <div className="flex flex-wrap gap-2">
                    {conditions.map(c => (
                      <span key={c} className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                        {c}
                      </span>
                    ))}
                  </div>
                </SectionCard>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
