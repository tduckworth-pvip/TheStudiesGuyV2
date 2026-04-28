"use client"

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Blob 1 – cyan */}
      <div
        className="absolute rounded-full"
        style={{
          width: "700px",
          height: "700px",
          top: "-300px",
          left: "-200px",
          background: "radial-gradient(circle, #67e8f9 0%, #0891b2 60%)",
          filter: "blur(80px)",
          opacity: 0.22,
          animation: "blob-float 9s ease-in-out infinite",
        }}
      />
      {/* Blob 2 – blue */}
      <div
        className="absolute rounded-full"
        style={{
          width: "600px",
          height: "600px",
          top: "-200px",
          right: "-200px",
          background: "radial-gradient(circle, #93c5fd 0%, #1d4ed8 60%)",
          filter: "blur(80px)",
          opacity: 0.18,
          animation: "blob-float 12s ease-in-out infinite reverse",
          animationDelay: "-4s",
        }}
      />
      {/* Blob 3 – teal */}
      <div
        className="absolute rounded-full"
        style={{
          width: "500px",
          height: "500px",
          bottom: "-100px",
          left: "30%",
          background: "radial-gradient(circle, #5eead4 0%, #0f766e 60%)",
          filter: "blur(80px)",
          opacity: 0.14,
          animation: "blob-float 14s ease-in-out infinite",
          animationDelay: "-7s",
        }}
      />
      {/* Dot grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, #0f172a 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          opacity: 0.04,
        }}
      />
    </div>
  )
}
