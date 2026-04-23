'use client'

interface Contact {
  name?: string
  role?: string
  phone?: string
  email?: string
}

interface Props {
  centralContacts: Contact[]
  officials: Array<{ name?: string; affiliation?: string; role?: string }>
}

export default function ContactSection({ centralContacts, officials }: Props) {
  const allContacts = centralContacts.length > 0
    ? centralContacts
    : officials.map(o => ({ name: o.name, role: o.role, email: undefined, phone: undefined }))

  if (allContacts.length === 0) return null

  return (
    <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex flex-col gap-3">
        <h2 className="text-slate-900 font-semibold text-sm">Trial Contacts</h2>
       
      </div>
      <div className="px-5 py-4 flex flex-col gap-4">
        {allContacts.map((c, i) => (
          <div key={i} className="flex flex-col gap-0.5">
            {c.name && <span className="text-sm text-slate-900 font-medium">{c.name}</span>}
            {c.role && (
              <span className="text-xs text-sky-600 font-medium uppercase tracking-wide">
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
                className="text-xs text-sky-600 hover:text-sky-700 transition-colors truncate flex items-center gap-1">
                <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {c.email}
              </a>
            )}
          </div>
        ))}
         <a
          href="#site-selector"
          className="inline-flex items-center justify-center gap-2 rounded-xl font-medium
            transition-colors duration-200 cursor-pointer px-4 py-2.5 text-sm
            bg-sky-500 hover:bg-sky-600 text-white"
        >
          Send to Research Team
        </a>
      </div>
    </div>
  )
}
