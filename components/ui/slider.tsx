"use client"

interface SliderProps {
  value: number[]
  onValueChange: (value: number[]) => void
  min?: number
  max?: number
  step?: number
  className?: string
}

function Slider({ value, onValueChange, min = 0, max = 100, step = 1, className = "" }: SliderProps) {
  const percentage = ((value[0] - min) / (max - min)) * 100

  return (
    <div className={`relative flex items-center h-5 ${className}`}>
      <div className="relative w-full h-2 bg-gray-200 rounded-full">
        <div
          className="absolute h-full bg-gradient-to-r from-[#4b7db8] to-[#1986f7] rounded-full pointer-events-none"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value[0]}
        onChange={(e) => onValueChange([Number(e.target.value)])}
        className="absolute w-full h-2 opacity-0 cursor-pointer"
      />
    </div>
  )
}

export { Slider }
