'use client'

import { useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/app/components/ui/Button'

interface PaginationProps {
  currentPage: number
  hasNextPage: boolean
  nextPageToken?: string
}

function ChevronLeft() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  )
}

export default function Pagination({ currentPage, hasNextPage, nextPageToken }: PaginationProps) {
  const router = useRouter()
  const params = useSearchParams()
  const [isPending, startTransition] = useTransition()

  function go(token?: string, page?: number) {
    const q = new URLSearchParams(params.toString())
    if (token) {
      q.set('pageToken', token)
    } else {
      q.delete('pageToken')
    }
    if (page !== undefined) q.set('page', String(page))
    startTransition(() => router.push(`/trials?${q.toString()}`))
  }

  return (
    <div className="flex items-center justify-between mt-8">
      <Button
        variant="secondary"
        onClick={() => go(undefined, 1)}
        disabled={currentPage <= 1 || isPending}
      >
        <ChevronLeft />
        Previous
      </Button>

      <span className="text-sm text-slate-400">Page {currentPage}</span>

      <Button
        variant="secondary"
        onClick={() => go(nextPageToken, currentPage + 1)}
        disabled={!hasNextPage || isPending}
        isLoading={isPending}
      >
        Next
        <ChevronRight />
      </Button>
    </div>
  )
}
