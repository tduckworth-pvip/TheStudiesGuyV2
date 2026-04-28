"use client"

import { AnimatedCounter } from './AnimatedCounter'

const STATS = [
  {
    value: 2687,
    label: 'Conditions',
    detail: 'Searchable on our platform',
    iconBg: '#fff1f2',
    iconColor: '#f43f5e',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    value: 4478,
    label: 'Sponsors',
    detail: 'Research organizations',
    iconBg: '#f5f3ff',
    iconColor: '#8b5cf6',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    value: 22990,
    label: 'Active Studies',
    detail: 'Recruiting participants now',
    iconBg: '#ecfeff',
    iconColor: '#0891b2',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
]

export default function StatsSection() {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.72)',
        boxShadow: '0 8px 32px rgba(14,165,233,0.1), 0 1px 4px rgba(0,0,0,0.06)',
      }}
    >
      {/* Rainbow gradient top bar */}
      <div className="flex divide-x divide-slate-100">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="flex-1 flex flex-col items-center justify-center text-center py-5 px-2 sm:py-8 sm:px-6 gap-0.5"
          >
            {/* Coloured icon — sm+ only */}
            <div
              className="hidden sm:flex w-10 h-10 rounded-xl items-center justify-center mb-2 shrink-0"
              style={{ background: stat.iconBg, color: stat.iconColor }}
            >
              {stat.icon}
            </div>

            {/* Animated number */}
            <div className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 leading-none">
              <AnimatedCounter target={stat.value} suffix="+" />
            </div>

            {/* Label */}
            <div className="text-xs sm:text-sm font-semibold text-slate-700 mt-1 leading-tight">
              {stat.label}
            </div>

            {/* Sublabel — sm+ only */}
            <div className="hidden sm:block text-xs text-slate-400 mt-0.5 leading-snug">
              {stat.detail}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
