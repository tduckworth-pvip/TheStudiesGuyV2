import { NextRequest } from 'next/server'

const GHL_WEBHOOK_URL = process.env.GHL_WEBHOOK_URL

export async function POST(req: NextRequest) {
  if (!GHL_WEBHOOK_URL) {
    console.error('GHL_WEBHOOK_URL is not set')
    return Response.json({ error: 'Email service not configured' }, { status: 500 })
  }

  const body = await req.json()
  const {
    firstName,
    lastName,
    email,
    phone,
    dialCode,
    ageConsent,
    dbConsent,
    nctId,
    trialTitle,
    siteName,
    siteCity,
    siteState,
    siteCountry,
    siteContacts,
  } = body

  const siteLocation = [siteCity, siteState, siteCountry].filter(Boolean).join(', ')

  const contacts: Array<{ name?: string; role?: string; phone?: string; email?: string }> = siteContacts ?? []
  // TEST MODE: override site contact email to avoid emailing real researchers during development
  // Remove the override line below when ready for production
  const TEST_EMAIL_OVERRIDE = process.env.TEST_EMAIL_OVERRIDE
  const siteContactEmail = TEST_EMAIL_OVERRIDE ?? contacts.find(c => c.email)?.email ?? ''
  const siteContactName = contacts.find(c => c.name)?.name ?? ''
  const siteContactPhone = contacts.find(c => c.phone)?.phone ?? ''

  const res = await fetch(GHL_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      firstName,
      lastName,
      email,
      phone,
      dialCode,
      ageConsent,
      dbConsent,
      nctId,
      trialTitle,
      siteName: siteName ?? '',
      siteLocation,
      siteContactEmail,
      siteContactName,
      siteContactPhone,
      siteContacts: contacts,
      source: 'TheStudiesGuy',
      partner: 'PVIP',
    }),
  })

  if (!res.ok) {
    console.error('GHL webhook error:', res.status, await res.text())
    return Response.json({ error: 'Failed to submit inquiry' }, { status: 500 })
  }

  return Response.json({ ok: true })
}
