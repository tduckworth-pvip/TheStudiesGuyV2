"use client"

interface CheckboxProps {
  id?: string
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  className?: string
}

function Checkbox({ id, checked, onCheckedChange, className = "" }: CheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      id={id}
      aria-checked={checked}
      onClick={() => onCheckedChange?.(!checked)}
      className={`h-4 w-4 shrink-0 rounded border-2 flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
        checked ? "bg-[#4b7db8] border-[#4b7db8]" : "bg-white border-gray-300"
      } ${className}`}
    >
      {checked && (
        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      )}
    </button>
  )
}

export { Checkbox }
