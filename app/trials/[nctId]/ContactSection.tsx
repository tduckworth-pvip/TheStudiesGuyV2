'use client'

import { useState } from 'react'
import { Button } from '@/app/components/ui/Button'

interface Contact {
  name?: string
  role?: string
  phone?: string
  email?: string
}

interface Props {
  centralContacts: Contact[]
  officials: Array<{ name?: string; affiliation?: string; role?: string }>
  nctId: string
  trialTitle: string
}

export default function ContactSection({ centralContacts, officials, nctId, trialTitle }: Props) {
  const [open, setOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', illness: '' })

  const allContacts = centralContacts.length > 0 ? centralContacts : officials.map(o => ({
    name: o.name,
    role: o.role,
    email: undefined,
    phone: undefined,
  }))

  const primaryEmail = centralContacts.find(c => c.email)?.email

  function set(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (primaryEmail) {
      const body = [
        `Hi,`,
        ``,
        `I am interested in participating in clinical trial ${nctId} — "${trialTitle}".`,
        ``,
        `My details:`,
        `Name: ${form.name}`,
        `Email: ${form.email}`,
        `Phone: ${form.phone}`,
        ``,
        `About my condition:`,
        form.illness,
        ``,
        `I found this trial on TheStudiesGuy.`,
      ].join('\n')

      window.location.href = `mailto:${primaryEmail}?subject=Trial Inquiry: ${nctId}&body=${encodeURIComponent(body)}`
    }
    setSubmitted(true)
  }

  const inputCls = `w-full px-3 py-2.5 rounded-xl text-sm text-slate-900 placeholder-slate-400
    bg-white border border-slate-300 focus:outline-none focus:ring-2
    focus:ring-cyan-400/50 focus:border-cyan-500 transition-all duration-200`

  return (
    <>
      {/* Contact list */}
      {allContacts.length > 0 && (
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-slate-900 font-semibold text-sm">Trial Contacts</h2>
            <Button variant="primary" onClick={() => { setOpen(true); setSubmitted(false) }}
              className="text-xs py-1.5 px-3">
              Send Inquiry
            </Button>
          </div>
          <div className="px-5 py-4 flex flex-col gap-4">
            {allContacts.map((c, i) => (
              <div key={i} className="flex flex-col gap-0.5">
                {c.name && <span className="text-sm text-slate-900 font-medium">{c.name}</span>}
                {c.role && (
                  <span className="text-xs text-cyan-600 font-medium uppercase tracking-wide">
                    {c.role.replace(/_/g, ' ')}
                  </span>
                )}
                {c.phone && (
                  <a href={`tel:${c.phone}`}
                    className="text-xs text-slate-500 hover:text-slate-700 transition-colors flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {c.phone}
                  </a>
                )}
                {c.email && (
                  <a href={`mailto:${c.email}`}
                    className="text-xs text-cyan-600 hover:text-cyan-700 transition-colors truncate flex items-center gap-1">
                    <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {c.email}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog" aria-modal="true" aria-labelledby="inquiry-title">

          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setOpen(false)} aria-hidden="true" />

          {/* Panel */}
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 id="inquiry-title" className="text-slate-900 font-semibold">Send Trial Inquiry</h3>
                <p className="text-xs text-slate-500 mt-0.5">NCT ID: {nctId}</p>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close"
                className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer p-1 rounded-lg hover:bg-slate-100">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {submitted ? (
              <div className="px-6 py-10 flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-slate-900 font-semibold">Inquiry sent!</p>
                <p className="text-slate-500 text-sm">
                  {primaryEmail
                    ? 'Your email client should have opened with a pre-filled message.'
                    : 'Please visit ClinicalTrials.gov to find direct contact details for this trial.'}
                </p>
                <Button variant="secondary" onClick={() => setOpen(false)} className="mt-2">Close</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="inq-name" className="text-xs font-medium text-slate-600">Full Name</label>
                  <input id="inq-name" type="text" required placeholder="Jane Smith"
                    value={form.name} onChange={set('name')} className={inputCls} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="inq-email" className="text-xs font-medium text-slate-600">Email Address</label>
                  <input id="inq-email" type="email" required placeholder="jane@example.com"
                    value={form.email} onChange={set('email')} className={inputCls} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="inq-phone" className="text-xs font-medium text-slate-600">Phone Number</label>
                  <input id="inq-phone" type="tel" placeholder="+1 (555) 000-0000"
                    value={form.phone} onChange={set('phone')} className={inputCls} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="inq-illness" className="text-xs font-medium text-slate-600">
                    About your condition
                    <span className="text-slate-400 font-normal ml-1">(brief description)</span>
                  </label>
                  <textarea id="inq-illness" required rows={4}
                    placeholder="Please describe your condition, relevant medical history, and why you're interested in this trial…"
                    value={form.illness} onChange={set('illness')}
                    className={`${inputCls} resize-none`} />
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Submitting will open your email client with a pre-filled message to the trial contact.
                  Your information is not stored on our servers.
                </p>
                <div className="flex gap-3 pt-1">
                  <Button type="submit" variant="primary" className="flex-1">Send Inquiry</Button>
                  <Button type="button" variant="secondary" onClick={() => setOpen(false)} className="flex-1">Cancel</Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
