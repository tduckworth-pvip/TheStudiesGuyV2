import { Suspense } from 'react'
import Link from 'next/link'
import SearchBar from './components/SearchBar'
import StatsSection from './components/StatsSection'
import FaqAccordion from './components/FaqAccordion'

const CONDITIONS = [
  'Cancer', 'Diabetes', 'Heart Disease', 'Alzheimer\'s',
  'Depression', 'Asthma', 'COVID-19', 'Arthritis',
]

const FEATURES = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Verified & Trusted',
    desc: 'Every trial is registered with the U.S. National Library of Medicine and reviewed by an Institutional Review Board.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    title: 'Powerful Search',
    desc: 'Filter by condition, location, phase, status, and more. Access the full ClinicalTrials.gov database instantly.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Free to Participate',
    desc: 'No insurance required. Many studies offer compensation for your time and travel. Always free to browse.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Global Reach',
    desc: 'Find trials across 190+ countries. Filter by city or country to locate studies within reach of you.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    title: 'Detailed Trial Info',
    desc: 'View eligibility criteria, phase, sponsor, contact info, and full protocol details for every study.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Real-Time Data',
    desc: 'Powered directly by the ClinicalTrials.gov API v2. Results are always current, refreshed every 5 minutes.',
  },
]

const STEPS = [
  { step: '01', title: 'Search', desc: 'Enter a condition, disease, or keyword to find relevant trials.' },
  { step: '02', title: 'Filter', desc: 'Narrow results by status, phase, location, or intervention.' },
  { step: '03', title: 'Review', desc: 'Read eligibility requirements and trial details in full.' },
  { step: '04', title: 'Connect', desc: 'Contact the study team directly through the trial listing.' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #05091a 0%, #0a0e27 50%, #05091a 100%)' }}>

      {/* Nav */}
      <nav className="fixed top-4 left-4 right-4 z-50 flex items-center justify-between
        px-6 py-3 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
        <Link href="/" className="flex items-center gap-2 text-white font-semibold text-lg">
          <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          TheStudiesGuy
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm text-slate-300">
          <Link href="/trials" className="hover:text-white transition-colors duration-200 cursor-pointer">Browse Trials</Link>
          <Link href="/#how-it-works" className="hover:text-white transition-colors duration-200 cursor-pointer">How It Works</Link>
          <Link href="/#faq" className="hover:text-white transition-colors duration-200 cursor-pointer">FAQ</Link>
        </div>
        <Link href="/trials"
          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white text-sm font-semibold
            transition-colors duration-200 cursor-pointer">
          Find Trials
        </Link>
      </nav>

      {/* Hero */}
      <section className="pt-40 pb-24 px-4">
        <div className="max-w-4xl mx-auto text-center">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
            bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" aria-hidden="true" />
            Live data from ClinicalTrials.gov
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            Discover Life-Changing{' '}
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(90deg, #22d3ee, #0891b2)' }}>
              Clinical Trials
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Search hundreds of thousands of clinical studies from ClinicalTrials.gov.
            Free to browse. No insurance required. Connect with cutting-edge treatments today.
          </p>

          <SearchBar />

          {/* Quick search tags */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <span className="text-slate-500 text-sm self-center">Popular:</span>
            {CONDITIONS.map(c => (
              <Link key={c} href={`/trials?condition=${encodeURIComponent(c)}`}
                className="px-3 py-1.5 rounded-full text-xs text-slate-300 bg-white/5 border border-white/10
                  hover:border-cyan-400/40 hover:text-cyan-300 transition-colors duration-200 cursor-pointer">
                {c}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="pb-24 px-4">
        <div className="max-w-5xl mx-auto">
          <Suspense fallback={
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 rounded-2xl bg-white/5 animate-pulse" />
              ))}
            </div>
          }>
            <StatsSection />
          </Suspense>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4" id="features">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything you need to find your trial
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Built on the official ClinicalTrials.gov API v2 — the world's largest registry of clinical research.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(f => (
              <div key={f.title}
                className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10
                  hover:border-cyan-400/30 hover:bg-white/8 transition-all duration-200 group">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/15 flex items-center justify-center
                  text-cyan-400 mb-4 group-hover:bg-cyan-500/25 transition-colors duration-200">
                  {f.icon}
                </div>
                <h3 className="text-white font-semibold mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-4" id="how-it-works">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How it works</h2>
            <p className="text-slate-400">Find and join a clinical trial in four simple steps.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s, i) => (
              <div key={s.step} className="relative">
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-linear-to-r from-cyan-500/30 to-transparent z-0" aria-hidden="true" />
                )}
                <div className="relative z-10 p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <div className="text-4xl font-bold text-cyan-500/30 mb-3">{s.step}</div>
                  <h3 className="text-white font-semibold mb-2">{s.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto rounded-3xl overflow-hidden relative"
          style={{ background: 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)' }}>
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, #22d3ee 0%, transparent 60%)' }}
            aria-hidden="true" />
          <div className="relative px-8 py-14 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to find your trial?
            </h2>
            <p className="text-cyan-100 mb-8 max-w-lg mx-auto">
              Search hundreds of thousands of studies — free, instant, and always up to date.
            </p>
            <Link href="/trials"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-cyan-700
                font-semibold hover:bg-cyan-50 transition-colors duration-200 cursor-pointer text-lg">
              Browse All Trials
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-4" id="faq">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Common questions
            </h2>
            <p className="text-slate-400">Everything you need to know about clinical trials.</p>
          </div>
          <FaqAccordion />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10 px-4 mt-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <div className="w-6 h-6 rounded bg-cyan-500 flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span>TheStudiesGuy — Powered by ClinicalTrials.gov</span>
          </div>
          <p className="text-slate-500 text-xs text-center max-w-sm">
            For informational purposes only. Always consult a healthcare professional before joining any clinical study.
          </p>
        </div>
      </footer>

    </div>
  )
}
