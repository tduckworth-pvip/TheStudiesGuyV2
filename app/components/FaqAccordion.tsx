'use client'

import { useState } from 'react'

const faqs = [
  {
    q: 'What is a clinical trial?',
    a: 'A clinical trial is a research study involving human volunteers that tests new medical approaches — including drugs, devices, therapies, and preventive interventions — to evaluate their safety and effectiveness.',
  },
  {
    q: 'Is participation free?',
    a: 'Most clinical trials are free to participate in. Many trials also provide compensation for your time and cover travel expenses. Specific details vary by study.',
  },
  {
    q: 'How do I know if a trial is safe?',
    a: 'All trials listed on ClinicalTrials.gov are registered with the U.S. National Library of Medicine. Each trial is reviewed by an Institutional Review Board (IRB) and follows strict federal regulations to protect participants.',
  },
  {
    q: 'Can I leave a trial after joining?',
    a: 'Yes. Participation is always voluntary. You can withdraw from any clinical trial at any time, for any reason, without penalty or loss of benefits you are otherwise entitled to.',
  },
  {
    q: 'What does "Recruiting" status mean?',
    a: '"Recruiting" means the study is actively looking for participants. Other statuses include "Not yet recruiting," "Active, not recruiting," and "Completed."',
  },
  {
    q: 'Do I need insurance to participate?',
    a: 'Not necessarily. Many trials cover all study-related costs. However, costs related to routine care may or may not be covered — always check the specific trial details.',
  },
]

export default function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => (
        <div
          key={i}
          className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden"
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
            className="w-full flex items-center justify-between px-6 py-5 text-left
              text-white font-medium cursor-pointer hover:bg-white/5 transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-cyan-400/60 focus:ring-inset"
          >
            <span>{faq.q}</span>
            <svg
              className={`w-5 h-5 text-cyan-400 shrink-0 ml-4 transition-transform duration-200
                ${open === i ? 'rotate-180' : ''}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {open === i && (
            <div className="px-6 pb-5 text-slate-300 text-sm leading-relaxed border-t border-white/10 pt-4">
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
