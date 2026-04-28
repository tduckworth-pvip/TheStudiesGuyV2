"use client"

const PILLS = [
  { label: "Depression", count: "800+", top: "6%", left: "4%", delay: "0s" },
  { label: "Breast Cancer", count: "1.2k+", top: "14%", right: "2%", delay: "0.9s" },
  { label: "Alzheimer's", count: "560+", bottom: "30%", left: "0%", delay: "1.6s" },
  { label: "Diabetes", count: "920+", bottom: "20%", right: "4%", delay: "2.3s" },
] as const

const BARS = [
  { label: "Cancer", pct: 92 },
  { label: "Psychiatry", pct: 76 },
  { label: "Neurology", pct: 63 },
]

export default function HeroVisual() {
  return (
    <div
      className="relative w-full h-[500px] flex items-center justify-center select-none"
      aria-hidden="true"
    >
      {/* Ambient glow */}
      <div
        className="absolute rounded-full"
        style={{
          width: "300px",
          height: "300px",
          background: "radial-gradient(circle, #7dd3fc, #0284c7)",
          filter: "blur(56px)",
          opacity: 0.38,
        }}
      />

      {/* Outer orbit ring */}
      <div
        className="absolute w-[340px] h-[340px] rounded-full border border-sky-300/30"
        style={{ animation: "spin-slow 28s linear infinite" }}
      >
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.9)]" />
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-cyan-400" />
      </div>

      {/* Inner orbit ring */}
      <div
        className="absolute w-[270px] h-[270px] rounded-full border border-sky-200/20"
        style={{ animation: "spin-slow-reverse 20s linear infinite" }}
      >
        <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-2 h-2 rounded-full bg-sky-300" />
      </div>

      {/* Glass card */}
      <div
        className="relative z-10 w-64 rounded-3xl p-6 shadow-2xl"
        style={{
          background: "rgba(255,255,255,0.72)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.65)",
          boxShadow: "0 25px 50px rgba(14,165,233,0.18), 0 0 0 1px rgba(255,255,255,0.5) inset",
        }}
      >
        {/* Live indicator */}
        <div className="flex items-center gap-2 mb-5">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          <span className="text-xs text-slate-500 font-medium">Live data from online listings.</span>
        </div>

        {/* Headline number */}
        <div className="text-[2.1rem] font-black text-slate-900 tracking-tight leading-none">
          485,233
        </div>
        <div className="text-xs text-slate-400 font-medium mt-1 mb-5">
          Active studies worldwide
        </div>

        {/* Divider */}
        <div
          className="h-px mb-4"
          style={{ background: "linear-gradient(90deg, #bae6fd, transparent)" }}
        />

        {/* Progress bars */}
        <div className="space-y-3">
          {BARS.map(b => (
            <div key={b.label}>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-600 font-medium">{b.label}</span>
                <span className="text-sky-600 font-bold">{b.pct}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${b.pct}%`,
                    background: "linear-gradient(90deg, #38bdf8, #06b6d4)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom badge */}
        <div className="mt-5 flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50/80">
          <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
            <svg
              className="w-3.5 h-3.5 text-emerald-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </div>
          <span className="text-xs text-emerald-700 font-semibold">+230 new trials this week</span>
        </div>
      </div>

      {/* Floating pills */}
      {PILLS.map(pill => (
        <div
          key={pill.label}
          className="absolute z-20 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-700 whitespace-nowrap shadow-sm"
          style={{
            top: "top" in pill ? pill.top : undefined,
            bottom: "bottom" in pill ? pill.bottom : undefined,
            left: "left" in pill ? pill.left : undefined,
            right: "right" in pill ? pill.right : undefined,
            background: "rgba(255,255,255,0.88)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.75)",
            animation: "float-badge 4s ease-in-out infinite",
            animationDelay: pill.delay,
          }}
        >
          {pill.label} · {pill.count}
        </div>
      ))}
    </div>
  )
}
