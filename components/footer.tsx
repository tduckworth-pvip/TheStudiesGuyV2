import Link from "next/link"

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 lg:px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-700 font-semibold">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-r from-[#4b7db8] to-[#1986f7] flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            TheStudiesGuy
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link href="/trials" className="hover:text-gray-900 transition-colors">Browse Trials</Link>
            <Link href="/search" className="hover:text-gray-900 transition-colors">Guided Search</Link>
            <Link href="/#faq" className="hover:text-gray-900 transition-colors">FAQ</Link>
          </div>

          <p className="text-xs text-gray-400">
            Data sourced from{" "}
            <a href="https://clinicaltrials.gov" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">
              ClinicalTrials.gov
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
