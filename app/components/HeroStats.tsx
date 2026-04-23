"use client"

import { AnimatedCounter } from './AnimatedCounter'

const HERO_STATS = [
  { target: 2687, label: 'Conditions' },
  { target: 4478, label: 'Sponsors' },
  { target: 22990, label: 'Active studies' },
]

export default function HeroStats() {
  return (
    <div className="mt-10 flex items-center justify-center gap-8 md:gap-12">
      {HERO_STATS.map(({ target, label }) => (
        <div key={label} className="text-center">
          <div className="text-xl md:text-2xl font-bold text-slate-900">
            <AnimatedCounter target={target} />
          </div>
          <div className="text-xs text-slate-500 mt-0.5">{label}</div>
        </div>
      ))}
    </div>
  )
}
