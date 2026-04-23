import Link from 'next/link'
import SearchBar from './components/SearchBar'
import StatsSection from './components/StatsSection'
import BrowseByCategory from './components/BrowseByCategory'
import FaqAccordion from './components/FaqAccordion'
import Navbar from './components/Navbar'

const FEATURES = [
  {
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Access New Treatments',
    desc: 'Get early access to promising new medications and treatments that arent yet available to the public. Be part of medical breakthroughs that could change lives.',
  },
  {
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    title: 'Expert Medical Care',
    desc: 'Receive comprehensive medical care from top researchers and specialists. Your health is closely monitored throughout the entire process.',
  },
  {
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Get Compensated',
    desc: 'Many trials provide compensation for your time and travel expenses. Help advance medical science while earning money for your participation.',
  },
]



export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #65abff 0%, #e0f2fe 40%, #AFD7F9 100%)' }}>

      <Navbar cta={{ label: 'Find Trials', href: '/trials', variant: 'primary' }} />

      {/* Hero */}
      <section className="pt-40 pb-24 px-4">
        <div className="max-w-5xl mx-auto text-center">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
            bg-sky-50 border border-sky-200 text-sky-700 text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" aria-hidden="true" />
            Live data from ClinicalTrials.gov
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-tight mb-6">
            Discover Life-Changing{' '}
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(90deg, #0891b2, #0e7490)' }}>
              Clinical Trials
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Search hundreds of thousands of clinical studies from ClinicalTrials.gov.
            Free to browse. No insurance required. Connect with cutting-edge treatments today.
          </p>

          <SearchBar />

          {/* Badges + tip */}
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            <span className="flex items-center gap-1.5 text-sm text-slate-600">
              <span className="h-2 w-2 rounded-full bg-blue-500 inline-block" />
              Free to participate
            </span>
            <span className="flex items-center gap-1.5 text-sm text-slate-600">
              <span className="h-2 w-2 rounded-full bg-blue-500 inline-block" />
              No insurance needed
            </span>
            <span className="flex items-center gap-1.5 text-sm text-slate-600">
              <span className="h-2 w-2 rounded-full bg-red-500 inline-block" />
              Get paid for your time
            </span>
          </div>
          <p className="mt-3 text-center text-xs text-slate-400">
            💡 Tip: Press Enter in any field or click &ldquo;Search Trials&rdquo; to find matching clinical trials
          </p>
        </div>
      </section>


      {/* Stats */}
      <section className="pb-12 px-2">
        <div className="max-w-5xl mx-auto">
          <StatsSection />
        </div>
      </section>


      {/* Features */}
      <section className="py-12 px-4" id="features">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Why Choose Clinical Trials?
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Access to cutting-edge treatments, expert medical care, and the opportunity to advance medical science
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(f => (
              <div key={f.title}
                className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm
                  hover:shadow-md hover:border-sky-200 transition-all duration-200 group">
                <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center
                  text-sky-600 mb-4 group-hover:bg-sky-100 transition-colors duration-200">
                  {f.icon}
                </div>
                <h3 className="text-slate-900 font-semibold mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      {/* Browse by category */}
      <BrowseByCategory />

{/* CTA Banner — keep cyan gradient, it works on both modes */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto rounded-3xl overflow-hidden relative"
          style={{ background: 'linear-gradient(135deg, rgb(82 227 255) 0%, #0060d1 50%, rgb(8 205 227) 100%)' }}>
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, #22d3ee 0%, transparent 60%)' }}
            aria-hidden="true" />
          <div className="relative px-8 py-14 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to find your trial?
            </h2>
            <p className="text-sky-100 mb-8 max-w-lg mx-auto">
              Search hundreds of thousands of studies — free, instant, and always up to date.
            </p>
            <Link href="/trials"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white font-semibold hover:bg-blue-50 transition-colors duration-200 cursor-pointer text-lg"
              style={{ color: '#0060d1' }}>
              Browse All Trials
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 px-4" id="faq">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Common questions
            </h2>
            <p className="text-slate-500">Everything you need to know about clinical trials.</p>
          </div>
          <div className="max-w-3xl mx-auto">
            <FaqAccordion />
          </div>
        </div>
      </section>

      {/* Stay Updated — Notification Signup */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto rounded-3xl overflow-hidden relative"
          style={{ background: 'linear-gradient(135deg, rgb(82 227 255) 0%, #0060d1 50%, rgb(8 205 227) 100%)' }}>
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #818cf8 0%, transparent 60%), radial-gradient(circle at 80% 50%, #f472b6 0%, transparent 60%)' }}
            aria-hidden="true" />
          <div className="relative px-8 py-14 text-center">

            {/* Bell icon */}
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-6"
              style={{ background: 'rgba(255,255,255,0.2)' }}>
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Stay Updated on New Trials
            </h2>
            <p className="text-blue-100 mb-3 max-w-lg mx-auto">
              Get personalized notifications about clinical trials that match your specific health conditions and location.
            </p>
            <p className="text-white font-semibold text-sm mb-8">
              Access cutting-edge treatments &bull; Earn compensation &bull; Advance medical science
            </p>

            {/* Feature badges */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {[
                'Free notifications',
                'No insurance required',
                'Get paid for participation',
              ].map(label => (
                <span key={label}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white"
                  style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)' }}>
                  <svg className="w-4 h-4 text-green-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {label}
                </span>
              ))}
            </div>

            <a
              href="https://thestudiesguy.com/?utm_source=website&utm_medium=optin&utm_campaign=searchToolOptIn"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white font-semibold
                hover:bg-blue-50 transition-colors duration-200 text-lg"
              style={{ color: '#0060d1' }}>
              Sign Up for Notifications
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>

            <p className="mt-4 text-blue-200 text-sm">
              Join thousands of people finding life-changing clinical trials
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 mt-8" style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 40%, #f8fafc 100%)' }}>
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-sky-500 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <span className="font-bold text-slate-900 text-base">The Studies Guy</span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed mb-3">
                A participant-friendly search platform to connect you with cutting-edge medical research and clinical trials.
              </p>
              <div className="flex items-center gap-1.5 text-sm text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Making clinical trials accessible to everyone
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Quick Links</h3>
              <ul className="space-y-2.5">
                {[
                  { label: 'Home', href: '/' },
                  { label: 'Browse Trials', href: '/trials' },
                  { label: 'About Us', href: '/#features' },
                ].map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-slate-500 hover:text-slate-900 transition-colors duration-200">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal & Support */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Legal &amp; Support</h3>
              <ul className="space-y-2.5">
                {[
                  { label: 'Disclaimer', href: '/disclaimer' },
                  { label: 'Privacy Policy', href: '/disclaimer' },
                  { label: 'Terms of Service', href: '/disclaimer' },
                ].map(link => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-slate-500 hover:text-slate-900 transition-colors duration-200">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Bottom bar */}
          <div className="border-t border-slate-200 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-slate-400">© 2024 The Studies Guy. All rights reserved.</p>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <Link href="/disclaimer" className="hover:text-slate-600 transition-colors duration-200">Disclaimer</Link>
              <span aria-hidden="true">•</span>
              <Link href="/disclaimer" className="hover:text-slate-600 transition-colors duration-200">Privacy</Link>
              <span aria-hidden="true">•</span>
              <Link href="/disclaimer" className="hover:text-slate-600 transition-colors duration-200">Terms</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
