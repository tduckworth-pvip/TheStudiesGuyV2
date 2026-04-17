import type { Metadata } from 'next'
import { Figtree } from 'next/font/google'
import './globals.css'

const figtree = Figtree({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-figtree',
})

export const metadata: Metadata = {
  title: 'TheStudiesGuy — Find Clinical Trials',
  description:
    'Search thousands of clinical trials from ClinicalTrials.gov. Find life-changing research studies near you — free to join, no insurance required.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${figtree.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased font-(family-name:--font-figtree)">
        {children}
      </body>
    </html>
  )
}
