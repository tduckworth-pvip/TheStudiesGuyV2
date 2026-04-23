import { Resend } from 'resend'
import { NextRequest } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

const RESEARCH_EMAIL = process.env.PVIP_RESEARCH_EMAIL ?? 'research@thestudiesguy.com'
const FROM_EMAIL = process.env.FROM_EMAIL ?? 'onboarding@resend.dev'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const {
    firstName,
    lastName,
    email,
    phone,
    nctId,
    trialTitle,
    siteName,
    siteCity,
    siteState,
    siteCountry,
    siteContacts,
  } = body

  const fullName = `${firstName} ${lastName}`
  const siteLocation = [siteCity, siteState, siteCountry].filter(Boolean).join(', ')

  const teamHtml = `
    <h2>New Study Inquiry — PVIP</h2>
    <p>A patient has expressed interest in a clinical trial via <strong>TheStudiesGuy</strong> (a PVIP partner platform).</p>
    <hr/>
    <h3>Patient Details</h3>
    <table cellpadding="6">
      <tr><td><strong>Name</strong></td><td>${fullName}</td></tr>
      <tr><td><strong>Email</strong></td><td>${email}</td></tr>
      <tr><td><strong>Phone</strong></td><td>${phone || 'Not provided'}</td></tr>
    </table>
    <h3>Trial</h3>
    <table cellpadding="6">
      <tr><td><strong>NCT ID</strong></td><td>${nctId}</td></tr>
      <tr><td><strong>Title</strong></td><td>${trialTitle}</td></tr>
      <tr><td><strong>Selected Site</strong></td><td>${siteName ?? 'N/A'} — ${siteLocation}</td></tr>
    </table>
    <p style="color:#888;font-size:12px">Sent via TheStudiesGuy · PVIP</p>
  `

  const siteContactLines = (siteContacts ?? [])
    .map((c: { name?: string; role?: string; phone?: string; email?: string }) => {
      const parts = [c.name, c.role, c.phone, c.email].filter(Boolean)
      return `<li>${parts.join(' · ')}</li>`
    })
    .join('')

  const patientHtml = `
    <h2>You're one step closer to joining a clinical trial</h2>
    <p>Hi ${firstName}, your inquiry has been sent to the study team. Here's what we've passed along on your behalf.</p>
    <hr/>
    <h3>Your Selected Site</h3>
    <p><strong>${siteName ?? 'Study Site'}</strong><br/>${siteLocation}</p>
    ${siteContactLines ? `<h3>Study Contact Info</h3><ul>${siteContactLines}</ul>` : ''}
    <h3>Trial</h3>
    <p>${trialTitle}<br/><small>NCT: ${nctId}</small></p>
    <hr/>
    <p>You have been added to the <strong>TheStudiesGuy</strong> database and may be contacted about future relevant trials.</p>
    <p style="color:#888;font-size:12px">TheStudiesGuy · Powered by PVIP</p>
  `

  const [teamResult, patientResult] = await Promise.all([
    resend.emails.send({
      from: FROM_EMAIL,
      to: RESEARCH_EMAIL,
      subject: `Trial Inquiry [PVIP]: ${nctId} — ${fullName}`,
      html: teamHtml,
    }),
    resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Your study inquiry has been sent — ${nctId}`,
      html: patientHtml,
    }),
  ])

  if (teamResult.error || patientResult.error) {
    console.error('Email send error:', teamResult.error ?? patientResult.error)
    return Response.json({ error: 'Failed to send emails' }, { status: 500 })
  }

  return Response.json({ ok: true })
}
