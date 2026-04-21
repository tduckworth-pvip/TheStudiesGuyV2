import Link from "next/link"

const NAV_LINKS = [
  { href: "/trials", label: "Browse Trials" },
  { href: "/search", label: "Guided Search" },
  { href: "/#faq", label: "FAQ" },
]

export default function Header() {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <Link href="/" className="flex items-center gap-2 text-gray-900 font-semibold text-lg">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#4b7db8] to-[#1986f7] flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        TheStudiesGuy
      </Link>

      <div className="hidden md:flex items-center gap-6 text-sm text-gray-500">
        {NAV_LINKS.map((link) => (
          <Link key={link.href} href={link.href} className="hover:text-gray-900 transition-colors duration-200">
            {link.label}
          </Link>
        ))}
      </div>

      <Link
        href="/trials"
        className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#4b7db8] to-[#1986f7] hover:from-[#3a6a9a] hover:to-[#1674d4] transition-all duration-200"
      >
        Find Trials
      </Link>
    </nav>
  )
}
