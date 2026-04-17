'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [status, setStatus] = useState<'loading' | 'connected' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    supabase
      .from('_dummy_ping')
      .select('*')
      .limit(1)
      .then(({ error }) => {
        if (error && error.code === '42P01') {
          // Table doesn't exist but connection works
          setStatus('connected')
          setMessage('Connected — Supabase is reachable.')
        } else if (error) {
          setStatus('error')
          setMessage(error.message)
        } else {
          setStatus('connected')
          setMessage('Connected to Supabase.')
        }
      })
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-white dark:bg-black">
      <div className="max-w-2xl w-full space-y-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          TheStudiesGuy V2
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Next.js 16 + React 19 + Supabase
        </p>

        <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-6 text-left space-y-3">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Supabase Connection
          </h2>

          {status === 'loading' && (
            <p className="text-gray-400 text-sm animate-pulse">Connecting…</p>
          )}
          {status === 'connected' && (
            <p className="text-green-600 dark:text-green-400 text-sm font-medium">
              ✓ {message}
            </p>
          )}
          {status === 'error' && (
            <p className="text-red-500 text-sm">✗ {message}</p>
          )}

          <p className="text-gray-400 dark:text-gray-500 text-xs font-mono break-all">
            {process.env.NEXT_PUBLIC_SUPABASE_URL}
          </p>
        </div>

        <p className="text-gray-400 text-sm">
          Edit <code className="font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">app/page.tsx</code> to get started.
        </p>
      </div>
    </main>
  )
}
