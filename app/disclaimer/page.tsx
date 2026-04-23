import Link from 'next/link'
import Navbar from '@/app/components/Navbar'

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 40%, #f8fafc 100%)' }}>
      <Navbar activePath="/disclaimer" cta={{ label: 'Find Trials', href: '/trials', variant: 'primary' }} />

      <div className="pt-32 pb-20 px-4">
        <div className="max-w-2xl mx-auto">

          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors duration-200 mb-8">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>

          <h1 className="text-3xl font-bold text-slate-900 mb-1">Disclaimer</h1>
          <p className="text-sm text-sky-600 mb-8">Important information about our clinical trial listing service</p>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-8">

            <section>
              <h2 className="text-base font-semibold text-slate-900 mb-3">The Studies Guy Clinical Trial Platform</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                The Studies Guy is an online platform that provides access to clinical research studies curated from public and proprietary sources.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-slate-900 mb-3">Study Information Responsibility</h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Study information on The Studies Guy platform is provided by study sponsors or investigators. The responsibility of complying with all applicable laws and regulations and providing complete, accurate, and up-to-date study information lies with the study sponsor or investigator.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                The Studies Guy is not liable or responsible for any data provided by these sponsors and investigators. The Studies Guy will only provide a review of the study information for any discernable errors, apparent deficits, or irregularities in listings.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-slate-900 mb-3">Medical Advice Disclaimer</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Please consult with your doctor or a healthcare professional before making any decisions regarding clinical trial participation. For more information about the clinical trials, we recommend reviewing our resource about clinical trials.
              </p>
            </section>

            <div className="rounded-xl bg-sky-50 border border-sky-200 p-5">
              <p className="text-sm font-semibold text-sky-800 mb-2">Important Notice</p>
              <p className="text-sm text-sky-700 leading-relaxed">
                This platform serves as an informational resource only. Clinical trial participation involves significant medical decisions that should be made in consultation with qualified healthcare professionals. The information provided here is not a substitute for professional medical advice, diagnosis, or treatment.
              </p>
            </div>

          </div>

          <div className="mt-10 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-semibold text-sm transition-colors duration-200"
            >
              Return to Home
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}
