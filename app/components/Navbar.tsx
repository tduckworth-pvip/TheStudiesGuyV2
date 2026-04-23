import Link from 'next/link'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/search', label: 'Guided Search' },
  { href: '/#faq', label: 'FAQ' },
  { href: '/disclaimer', label: 'Disclaimer' },
]

interface NavbarProps {
  activePath?: string
  cta: {
    label: string
    href: string
    variant?: 'primary' | 'secondary'
  }
}

export default function Navbar({ activePath, cta }: NavbarProps) {
  const ctaClass =
    cta.variant === 'primary'
      ? 'bg-sky-500 hover:bg-sky-600 text-white font-semibold'
      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'

  return (
    <nav className="fixed top-4 left-4 right-4 z-50 flex items-center justify-between
      px-6 py-3 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200 shadow-sm">

      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 text-slate-900 font-semibold text-lg">
        <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        TheStudiesGuy
      </Link>

      {/* Centre links */}
      <div className="hidden md:flex items-center gap-6 text-sm text-slate-500">
        {NAV_LINKS.map(link => {
          const isActive = activePath ? link.href === activePath : false
          return (
            <Link
              key={link.href}
              href={link.href}
              className={[
                'transition-colors duration-200',
                isActive ? 'text-slate-900 font-medium' : 'hover:text-slate-900',
              ].join(' ')}
            >
              {link.label}
            </Link>
          )
        })}
      </div>

      {/* CTA */}
      <Link
        href={cta.href}
        className={`px-4 py-2 rounded-xl text-sm transition-colors duration-200 ${ctaClass}`}
      >
        {cta.label}
      </Link>
    </nav>
  )
}
