"use client"

import { useState, useEffect, useRef } from "react"

interface Props {
  target: number
  duration?: number
  suffix?: string
}

export function AnimatedCounter({ target, duration = 2000, suffix = "" }: Props) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const steps = 60
          const stepTime = duration / steps
          let step = 0

          const timer = setInterval(() => {
            step++
            const progress = step / steps
            const easeOut = 1 - Math.pow(1 - progress, 3)
            setValue(Math.floor(target * easeOut))
            if (step >= steps) {
              clearInterval(timer)
              setValue(target)
            }
          }, stepTime)
        }
      },
      { threshold: 0.3 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target, duration])

  return (
    <span ref={ref} suppressHydrationWarning>
      {value.toLocaleString()}{suffix}
    </span>
  )
}
