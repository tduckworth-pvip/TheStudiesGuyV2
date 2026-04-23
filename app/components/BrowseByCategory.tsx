"use client"

import { useState } from "react"
import Link from "next/link"

const BG = ["bg-white"]

interface Condition {
  name: string
  trials: number
  addedThisMonth: number
}

interface Category {
  id: string
  label: string
  icon: React.ReactNode
  conditions: Condition[]
}

const CATEGORIES: Category[] = [
  {
    id: "psychiatry",
    label: "Psychiatry",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    conditions: [
      { name: "Depression", trials: 800, addedThisMonth: 20 },
      { name: "Anxiety", trials: 1000, addedThisMonth: 30 },
      { name: "Schizophrenia", trials: 200, addedThisMonth: 8 },
      { name: "Bipolar Disorder", trials: 150, addedThisMonth: 6 },
      { name: "ADHD", trials: 300, addedThisMonth: 12 },
      { name: "Borderline Personality", trials: 80, addedThisMonth: 3 },
    ],
  },
  {
    id: "cancer",
    label: "Cancer",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    conditions: [
      { name: "Breast Cancer", trials: 1200, addedThisMonth: 45 },
      { name: "Lung Cancer", trials: 980, addedThisMonth: 38 },
      { name: "Prostate Cancer", trials: 650, addedThisMonth: 22 },
      { name: "Leukemia", trials: 420, addedThisMonth: 17 },
      { name: "Lymphoma", trials: 380, addedThisMonth: 14 },
      { name: "Melanoma", trials: 290, addedThisMonth: 11 },
    ],
  },
  {
    id: "chronic",
    label: "Chronic Illness",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    conditions: [
      { name: "Type 2 Diabetes", trials: 920, addedThisMonth: 34 },
      { name: "Heart Disease", trials: 740, addedThisMonth: 28 },
      { name: "Arthritis", trials: 510, addedThisMonth: 19 },
      { name: "Hypertension", trials: 660, addedThisMonth: 25 },
      { name: "Fibromyalgia", trials: 180, addedThisMonth: 7 },
      { name: "Chronic Fatigue", trials: 130, addedThisMonth: 5 },
    ],
  },
  {
    id: "neurology",
    label: "Neurology",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    conditions: [
      { name: "Alzheimer's", trials: 560, addedThisMonth: 21 },
      { name: "Parkinson's", trials: 430, addedThisMonth: 16 },
      { name: "Multiple Sclerosis", trials: 390, addedThisMonth: 15 },
      { name: "Epilepsy", trials: 310, addedThisMonth: 12 },
      { name: "Migraine", trials: 250, addedThisMonth: 9 },
      { name: "ALS", trials: 140, addedThisMonth: 6 },
    ],
  },
  {
    id: "immune",
    label: "Immune System",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    conditions: [
      { name: "Lupus", trials: 320, addedThisMonth: 12 },
      { name: "Rheumatoid Arthritis", trials: 480, addedThisMonth: 18 },
      { name: "Crohn's Disease", trials: 270, addedThisMonth: 10 },
      { name: "Ulcerative Colitis", trials: 240, addedThisMonth: 9 },
      { name: "Psoriasis", trials: 310, addedThisMonth: 11 },
      { name: "Eczema", trials: 190, addedThisMonth: 7 },
    ],
  },
  {
    id: "respiratory",
    label: "Respiratory",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    ),
    conditions: [
      { name: "Asthma", trials: 580, addedThisMonth: 22 },
      { name: "COPD", trials: 430, addedThisMonth: 16 },
      { name: "COVID-19", trials: 890, addedThisMonth: 33 },
      { name: "Pulmonary Fibrosis", trials: 180, addedThisMonth: 7 },
      { name: "Sleep Apnea", trials: 220, addedThisMonth: 8 },
      { name: "Cystic Fibrosis", trials: 140, addedThisMonth: 5 },
    ],
  },
  {
    id: "endocrinology",
    label: "Endocrinology",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    ),
    conditions: [
      { name: "Thyroid Disease", trials: 290, addedThisMonth: 11 },
      { name: "Obesity", trials: 520, addedThisMonth: 20 },
      { name: "PCOS", trials: 230, addedThisMonth: 9 },
      { name: "Osteoporosis", trials: 310, addedThisMonth: 12 },
      { name: "Adrenal Disorders", trials: 110, addedThisMonth: 4 },
      { name: "Metabolic Syndrome", trials: 370, addedThisMonth: 14 },
    ],
  },
]

export default function BrowseByCategory() {
  const [activeId, setActiveId] = useState("psychiatry")
  const active = CATEGORIES.find(c => c.id === activeId)!

  return (
    <section className="py-12 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Heading */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            Browse a broad selection of new treatments
          </h2>
          <p className="text-slate-500">
            Choose from over 30,000 active clinical trials, with new additions every month.
          </p>
        </div>

        {/* Category tabs — scrollable on mobile */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveId(cat.id)}
              className={[
                "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap shrink-0",
                "transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400",
                activeId === cat.id
                  ? "bg-sky-500 text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-sky-300 hover:text-sky-700",
              ].join(" ")}
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>

        {/* Condition cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {active.conditions.map((condition, i) => (
            <div
              key={condition.name}
              className={[
                "group relative p-6 rounded-2xl border border-slate-200",
                BG[i % BG.length],
                "hover:border-sky-300 hover:shadow-md transition-all duration-200 cursor-pointer",
              ].join(" ")}
            >
              <h3 className="text-slate-900 font-bold text-lg mb-3">{condition.name}</h3>

              <div className="flex items-end justify-between mb-4">
                <div>
                  <span className="text-4xl font-bold text-slate-900" suppressHydrationWarning>
                    {condition.trials.toLocaleString('en-US')}
                  </span>
                  <p className="text-sm text-slate-500 mt-0.5">trials</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                  {condition.addedThisMonth} added this month
                </div>
              </div>

              <Link
                href={`/trials?condition=${encodeURIComponent(condition.name)}&status=RECRUITING`}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-600 hover:text-sky-700 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded"
                onClick={e => e.stopPropagation()}
              >
                View trials
                <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
