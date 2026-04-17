'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

export default function SearchBar() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    startTransition(() => {
      router.push(`/trials?condition=${encodeURIComponent(query.trim())}`)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative flex items-center">
        <div className="absolute left-4 text-cyan-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by condition, disease, or keyword…"
          aria-label="Search clinical trials"
          className="w-full pl-12 pr-36 py-4 rounded-2xl text-white placeholder-slate-400
            bg-white/10 backdrop-blur-md border border-white/20
            focus:outline-none focus:ring-2 focus:ring-cyan-400/60 focus:border-cyan-400/60
            transition-all duration-200 text-base"
        />
        <button
          type="submit"
          disabled={isPending || !query.trim()}
          className="absolute right-2 px-5 py-2.5 rounded-xl font-semibold text-sm
            bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed
            text-white transition-colors duration-200 cursor-pointer"
        >
          {isPending ? 'Searching…' : 'Search Trials'}
        </button>
      </div>
    </form>
  )
}
