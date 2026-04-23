"use client"

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react"
import { ChevronDown } from "lucide-react"

interface SelectContextType {
  value: string
  displayMap: Map<string, string>
  registerDisplay: (value: string, label: string) => void
  onValueChange: (value: string) => void
  open: boolean
  setOpen: (open: boolean) => void
  containerRef: React.RefObject<HTMLDivElement | null>
}

const SelectContext = createContext<SelectContextType | null>(null)

interface SelectProps {
  value?: string
  onValueChange?: (value: string) => void
  children: ReactNode
}

function Select({ value = "", onValueChange, children }: SelectProps) {
  const [open, setOpen] = useState(false)
  const [displayMap] = useState(() => new Map<string, string>())
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open])

  const registerDisplay = (val: string, label: string) => {
    displayMap.set(val, label)
  }

  return (
    <SelectContext.Provider
      value={{
        value,
        displayMap,
        registerDisplay,
        onValueChange: onValueChange ?? (() => {}),
        open,
        setOpen,
        containerRef,
      }}
    >
      <div ref={containerRef} className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  )
}

function SelectTrigger({ className = "", children }: { className?: string; children: ReactNode }) {
  const ctx = useContext(SelectContext)!
  return (
    <button
      type="button"
      onClick={() => ctx.setOpen(!ctx.open)}
      className={`flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50 ml-2 shrink-0" />
    </button>
  )
}

function SelectValue({ placeholder }: { placeholder?: string }) {
  const ctx = useContext(SelectContext)!
  const label = ctx.displayMap.get(ctx.value)
  return <span className="truncate">{label ?? ctx.value ?? placeholder ?? ""}</span>
}

function SelectContent({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ctx = useContext(SelectContext)!
  if (!ctx.open) return null
  return (
    <div className={`absolute top-full z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg max-h-60 overflow-y-auto ${className}`}>
      <div className="py-1">{children}</div>
    </div>
  )
}

function SelectItem({
  value,
  children,
  className = "",
}: {
  value: string
  children: ReactNode
  className?: string
}) {
  const ctx = useContext(SelectContext)!

  useEffect(() => {
    ctx.registerDisplay(value, typeof children === "string" ? children : value)
  }, [value])

  return (
    <button
      type="button"
      onClick={() => {
        ctx.onValueChange(value)
        ctx.setOpen(false)
      }}
      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition-colors ${
        ctx.value === value ? "bg-gray-50 font-medium" : ""
      } ${className}`}
    >
      {children}
    </button>
  )
}

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }
