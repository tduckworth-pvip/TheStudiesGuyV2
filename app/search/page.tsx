"use client"

import { useState, useEffect } from "react"
import {
  Search,
  MapPin,
  Settings,
  CheckCircle,
  RefreshCw,
  Clock,
  ArrowLeft,
  ArrowRight,
  FlaskConical,
  HeartPulse,
  Microscope,
  UserCheck,
  Stethoscope,
  SlidersHorizontal,
  Loader2,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import Navbar from "@/app/components/Navbar"
import Footer from "@/components/footer"
import { useRouter } from "next/navigation"

interface GuidedSearchState {
  step: number
  reasonForSearch: string
  openToEarlyStage: boolean | null
  sex: string
  age: number
  location: string
  radius: string
  acceptsHealthyVolunteers: boolean
  medicalCondition: string
  phases: string[]
  studyType: string
  primaryPurpose: string
  observationalModel: string
}

const SEARCH_REASONS = [
  {
    category: "Living with a condition",
    icon: HeartPulse,
    color: "text-rose-500",
    bg: "bg-rose-50",
    border: "border-rose-100",
    options: [
      {
        text: "I've tried approved treatments, and they are not working for me.",
        sub: "Looking for alternative or next-line therapies",
      },
      {
        text: "I'm interested in finding studies that test new treatments.",
        sub: "Open to experimental or investigational options",
      },
    ],
  },
  {
    category: "Recently diagnosed",
    icon: Stethoscope,
    color: "text-amber-500",
    bg: "bg-amber-50",
    border: "border-amber-100",
    options: [
      {
        text: "I'm looking for treatment options, including unapproved ones.",
        sub: "Willing to consider emerging therapies",
      },
      {
        text: "There are no available treatments at all for my condition.",
        sub: "Seeking any form of clinical intervention",
      },
    ],
  },
  {
    category: "Healthy volunteer",
    icon: UserCheck,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    options: [
      {
        text: "I'd like to volunteer for research that could help others.",
        sub: "Participating as a healthy control subject",
      },
      {
        text: "I'm interested in diagnostic, preventative, or screening studies.",
        sub: "Not seeking treatment — focused on prevention",
      },
    ],
  },
]

const RADIUS_OPTIONS = [
  { value: "5", label: "5 miles" },
  { value: "10", label: "10 miles" },
  { value: "25", label: "25 miles" },
  { value: "50", label: "50 miles" },
  { value: "100", label: "100 miles" },
  { value: "250", label: "250 miles" },
  { value: "no-limit", label: "No limit" },
]

const TRIAL_PHASES = ["Phase 1", "Phase 2", "Phase 3", "Phase 4"]
const STUDY_TYPES = ["Interventional", "Observational", "Expanded Access"]
const PRIMARY_PURPOSES = [
  "Treatment", "Prevention", "Diagnostic", "Supportive Care",
  "Screening", "Health Services Research", "Basic Science",
]
const OBSERVATIONAL_MODELS = [
  "Cohort", "Case control", "Case-only", "Case-crossover",
  "Ecologic or Community", "Family-based",
]
const MAJOR_CITIES = [
  "Los Angeles, CA", "San Francisco, CA", "San Diego, CA", "New York, NY", "Chicago, IL",
  "Houston, TX", "Phoenix, AZ", "Philadelphia, PA", "San Antonio, TX", "Dallas, TX",
  "Austin, TX", "Jacksonville, FL", "Fort Worth, TX", "Columbus, OH", "Charlotte, NC",
  "San Jose, CA", "Indianapolis, IN", "Seattle, WA", "Denver, CO", "Washington, DC",
  "Boston, MA", "El Paso, TX", "Nashville, TN", "Detroit, MI", "Oklahoma City, OK",
  "Portland, OR", "Las Vegas, NV", "Memphis, TN", "Louisville, KY", "Baltimore, MD",
  "Milwaukee, WI", "Albuquerque, NM",
]

const STEP_LABELS = ["Your reason", "Study stage", "Your details"]

export default function GuidedSearchPage() {
  const router = useRouter()

  const [searchState, setSearchState] = useState<GuidedSearchState>({
    step: 1,
    reasonForSearch: "",
    openToEarlyStage: null,
    sex: "all",
    age: 30,
    location: "",
    radius: "25",
    acceptsHealthyVolunteers: false,
    medicalCondition: "",
    phases: [],
    studyType: "",
    primaryPurpose: "",
    observationalModel: "",
  })

  const [counters, setCounters] = useState({ conditions: 2687, sponsors: 4478, studies: 22990 })
  const [isDetectingLocation, setIsDetectingLocation] = useState(false)
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([])
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)

  useEffect(() => {
    let conditionMultiplier = 1
    let studyMultiplier = 1
    if (searchState.reasonForSearch.includes("healthy volunteer") || searchState.reasonForSearch.includes("volunteer")) {
      conditionMultiplier = 0.3
      studyMultiplier = 0.4
    } else if (searchState.reasonForSearch.includes("diagnose") || searchState.reasonForSearch.includes("diagnostic")) {
      conditionMultiplier = 0.7
      studyMultiplier = 0.6
    }
    if (searchState.openToEarlyStage === false) studyMultiplier *= 0.6
    if (searchState.location) studyMultiplier *= 0.8
    if (searchState.age < 18) studyMultiplier *= 0.5
    else if (searchState.age > 65) studyMultiplier *= 0.7
    setCounters({
      conditions: Math.floor(2687 * conditionMultiplier),
      sponsors: 4478,
      studies: Math.floor(22990 * studyMultiplier),
    })
  }, [searchState])

  const handleReasonSelect = (reason: string) => {
    setSearchState((prev) => ({
      ...prev,
      reasonForSearch: reason,
      step: reason.includes("fine-tune") ? 3 : 2,
    }))
  }

  const handleEarlyStageResponse = (response: boolean) => {
    setSearchState((prev) => ({ ...prev, openToEarlyStage: response, step: 3 }))
  }

  const handleLocationInput = (value: string) => {
    setSearchState((prev) => ({ ...prev, location: value }))
    if (value.length >= 2) {
      const filtered = MAJOR_CITIES.filter((city) => city.toLowerCase().includes(value.toLowerCase()))
      setLocationSuggestions(filtered.slice(0, 8))
      setShowLocationSuggestions(true)
    } else {
      setLocationSuggestions([])
      setShowLocationSuggestions(false)
    }
  }

  const handleLocationSelect = (location: string) => {
    setSearchState((prev) => ({ ...prev, location }))
    setShowLocationSuggestions(false)
    setLocationSuggestions([])
  }

  const detectCurrentLocation = async () => {
    setIsDetectingLocation(true)
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000, enableHighAccuracy: true })
      })
      const { latitude, longitude } = position.coords
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
      )
      const data = await response.json()
      if (data.address) {
        const city = data.address.city || data.address.town || data.address.village
        const state = data.address.state
        if (city && state) setSearchState((prev) => ({ ...prev, location: `${city}, ${state}` }))
      }
    } catch {
      // silently fail
    } finally {
      setIsDetectingLocation(false)
    }
  }

  const handlePhaseToggle = (phase: string) => {
    setSearchState((prev) => ({
      ...prev,
      phases: prev.phases.includes(phase)
        ? prev.phases.filter((p) => p !== phase)
        : [...prev.phases, phase],
    }))
  }

  const handleStudyTypeChange = (type: string) => {
    setSearchState((prev) => ({ ...prev, studyType: type, primaryPurpose: "", observationalModel: "" }))
  }

  const geocodeLocation = async (locationText: string): Promise<{ lat: number; lng: number } | null> => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationText)}&limit=1`
      )
      const data = await res.json()
      if (data.length > 0) return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
    } catch {
      // fall through
    }
    return null
  }

  const handleViewResults = async () => {
    setIsNavigating(true)
    const params = new URLSearchParams()
    if (searchState.medicalCondition) params.set("condition", searchState.medicalCondition)
    params.set("status", "RECRUITING")
    if (searchState.sex !== "all") params.set("sex", searchState.sex.toUpperCase())
    params.set("age", searchState.age.toString())
    if (searchState.phases.length > 0) {
      const phaseMap: Record<string, string> = {
        "Phase 1": "PHASE1", "Phase 2": "PHASE2", "Phase 3": "PHASE3", "Phase 4": "PHASE4",
      }
      params.set("phase", phaseMap[searchState.phases[0]] ?? searchState.phases[0])
    }
    if (searchState.location) {
      params.set("location", searchState.location)
      const coords = await geocodeLocation(searchState.location)
      if (coords) {
        params.set("lat", coords.lat.toString())
        params.set("lng", coords.lng.toString())
      }
    }
    router.push(`/trials?${params.toString()}`)
  }

  const isFinetuneSearch = searchState.reasonForSearch.includes("fine-tune")

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(160deg, #f0f7ff 0%, #e8f4fd 40%, #f5f8ff 100%)" }}>
      <Navbar cta={{ label: 'Find Trials', href: '/trials', variant: 'primary' }} />

      {/* Hero strip */}
      <div className="max-w-4xl mx-auto px-4 pt-36 pb-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-5">
          <FlaskConical className="w-3.5 h-3.5" />
          Guided Trial Finder
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-3">
          Find trials matched{" "}
          <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(90deg, #3b82f6, #0ea5e9)" }}>
            to you
          </span>
        </h1>
        <p className="text-slate-500 text-lg max-w-xl mx-auto">
          Answer a few quick questions and we will surface the most relevant clinical studies.
        </p>

        {/* Live stats */}
        <div className="flex items-center justify-center gap-8 mt-8">
          {[
            { value: counters.conditions.toLocaleString(), label: "Conditions" },
            { value: counters.sponsors.toLocaleString(), label: "Sponsors" },
            { value: counters.studies.toLocaleString(), label: "Active studies" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-bold text-slate-900">{value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Step progress */}
      <div className="max-w-lg mx-auto px-4 mt-10 mb-10">
        <div className="flex items-center gap-0">
          {STEP_LABELS.map((label, i) => {
            const step = i + 1
            const isComplete = searchState.step > step
            const isActive = searchState.step === step
            return (
              <div key={step} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                      isComplete
                        ? "bg-blue-600 text-white"
                        : isActive
                        ? "bg-white border-2 border-blue-600 text-blue-600 shadow-md shadow-blue-100"
                        : "bg-white border-2 border-slate-200 text-slate-400"
                    }`}
                  >
                    {isComplete ? <CheckCircle className="w-4 h-4" /> : step}
                  </div>
                  <span className={`text-xs mt-1.5 font-medium whitespace-nowrap ${isActive ? "text-blue-600" : "text-slate-400"}`}>
                    {label}
                  </span>
                </div>
                {i < STEP_LABELS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 mb-5 transition-colors duration-300 ${searchState.step > step ? "bg-blue-600" : "bg-slate-200"}`} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-16">

        {/* ── Step 1 ── */}
        {searchState.step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-2xl font-bold text-slate-900 mb-1 text-center">
              What best describes your reason for searching?
            </h2>
            <p className="text-slate-500 text-center mb-8">Select the option that fits closest — we'll tailor results for you.</p>

            <div className="space-y-5">
              {SEARCH_REASONS.map((category) => {
                const Icon = category.icon
                return (
                  <div key={category.category} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    {/* Category header */}
                    <div className={`flex items-center gap-3 px-5 py-3.5 border-b border-slate-100 ${category.bg}`}>
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${category.bg} border ${category.border}`}>
                        <Icon className={`w-4 h-4 ${category.color}`} />
                      </div>
                      <span className={`text-sm font-semibold ${category.color}`}>{category.category}</span>
                    </div>
                    {/* Options */}
                    <div className="divide-y divide-slate-100">
                      {category.options.map((option) => {
                        const isSelected = searchState.reasonForSearch === option.text
                        return (
                          <button
                            key={option.text}
                            onClick={() => handleReasonSelect(option.text)}
                            className={`w-full px-5 py-4 text-left flex items-start gap-4 transition-colors duration-150 cursor-pointer ${
                              isSelected ? "bg-blue-50" : "hover:bg-slate-50"
                            }`}
                          >
                            <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                              isSelected ? "border-blue-600 bg-blue-600" : "border-slate-300"
                            }`}>
                              {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                            </div>
                            <div>
                              <p className={`text-sm font-medium leading-snug ${isSelected ? "text-blue-900" : "text-slate-800"}`}>
                                {option.text}
                              </p>
                              <p className="text-xs text-slate-500 mt-0.5">{option.sub}</p>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}

              {/* Advanced option */}
              <button
                onClick={() => handleReasonSelect("I understand how clinical trials work and would like to fine-tune the search myself.")}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl border-2 transition-all duration-150 cursor-pointer ${
                  isFinetuneSearch
                    ? "border-blue-600 bg-blue-50"
                    : "border-dashed border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50"
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isFinetuneSearch ? "bg-blue-600" : "bg-slate-100"}`}>
                  <SlidersHorizontal className={`w-4 h-4 ${isFinetuneSearch ? "text-white" : "text-slate-500"}`} />
                </div>
                <div className="text-left">
                  <p className={`text-sm font-semibold ${isFinetuneSearch ? "text-blue-900" : "text-slate-700"}`}>
                    Advanced — fine-tune the search myself
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">I understand how trials work and want full control over filters</p>
                </div>
                <ArrowRight className={`w-4 h-4 ml-auto shrink-0 ${isFinetuneSearch ? "text-blue-600" : "text-slate-400"}`} />
              </button>
            </div>
          </div>
        )}

        {/* ── Step 2 ── */}
        {searchState.step === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <button
              onClick={() => setSearchState((prev) => ({ ...prev, step: 1 }))}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-8 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>

            <h2 className="text-2xl font-bold text-slate-900 mb-1 text-center">
              Are you open to early-stage studies?
            </h2>
            <p className="text-slate-500 text-center max-w-lg mx-auto mb-10">
              New treatments move through FDA testing phases. Phase 1 and early studies focus on safety;
              later phases test effectiveness in larger groups.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl mx-auto">
              {/* Yes */}
              <button
                onClick={() => handleEarlyStageResponse(true)}
                className={`group relative p-8 text-left rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
                  searchState.openToEarlyStage === true
                    ? "border-blue-600 bg-blue-50 shadow-lg shadow-blue-100"
                    : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-md"
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-colors ${
                  searchState.openToEarlyStage === true ? "bg-blue-600" : "bg-emerald-100 group-hover:bg-emerald-200"
                }`}>
                  <Microscope className={`w-7 h-7 ${searchState.openToEarlyStage === true ? "text-white" : "text-emerald-600"}`} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">Yes, I'm open</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Show me all phases including early-stage and experimental studies.
                </p>
                {searchState.openToEarlyStage === true && (
                  <div className="absolute top-4 right-4">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  </div>
                )}
              </button>

              {/* No */}
              <button
                onClick={() => handleEarlyStageResponse(false)}
                className={`group relative p-8 text-left rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
                  searchState.openToEarlyStage === false
                    ? "border-blue-600 bg-blue-50 shadow-lg shadow-blue-100"
                    : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-md"
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-colors ${
                  searchState.openToEarlyStage === false ? "bg-blue-600" : "bg-amber-100 group-hover:bg-amber-200"
                }`}>
                  <Clock className={`w-7 h-7 ${searchState.openToEarlyStage === false ? "text-white" : "text-amber-600"}`} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">No, more established</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Prefer Phase 2 or later studies with more safety and efficacy data.
                </p>
                {searchState.openToEarlyStage === false && (
                  <div className="absolute top-4 right-4">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  </div>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3 ── */}
        {searchState.step === 3 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <button
              onClick={() => setSearchState((prev) => ({ ...prev, step: isFinetuneSearch ? 1 : 2 }))}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-8 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>

            <h2 className="text-2xl font-bold text-slate-900 mb-1 text-center">
              {isFinetuneSearch ? "Configure your search" : "A few more details"}
            </h2>
            <p className="text-slate-500 text-center mb-10">
              {isFinetuneSearch ? "Set advanced filters for a precise search" : "Help us match trials to your profile"}
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left column — Basic */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Settings className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <span className="font-semibold text-slate-800 text-sm">Basic Information</span>
                </div>

                {/* Condition */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                    Medical Condition
                  </label>
                  <Input
                    placeholder="e.g. Type 2 diabetes, depression…"
                    value={searchState.medicalCondition}
                    onChange={(e) => setSearchState((prev) => ({ ...prev, medicalCondition: e.target.value }))}
                    className="h-11 text-sm"
                  />
                </div>

                {/* Sex */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Sex</label>
                  <Select value={searchState.sex} onValueChange={(value) => setSearchState((prev) => ({ ...prev, sex: value }))}>
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Age */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Age</label>
                    <span className="text-sm font-bold text-blue-600 tabular-nums">{searchState.age} yrs</span>
                  </div>
                  <Slider
                    value={[searchState.age]}
                    onValueChange={(value) => setSearchState((prev) => ({ ...prev, age: value[0] }))}
                    max={100}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1.5">
                    <span>0</span><span>50</span><span>100</span>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="City, state…"
                      value={searchState.location}
                      onChange={(e) => handleLocationInput(e.target.value)}
                      className="w-full h-11 pl-9 pr-12 rounded-md border border-gray-300 bg-white text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={detectCurrentLocation}
                      disabled={isDetectingLocation}
                      title="Use my location"
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-md bg-slate-100 hover:bg-blue-100 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {isDetectingLocation
                        ? <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-500" />
                        : <MapPin className="w-3.5 h-3.5 text-slate-500" />}
                    </button>
                    {showLocationSuggestions && locationSuggestions.length > 0 && (
                      <div className="absolute top-full left-0 z-20 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
                        {locationSuggestions.map((loc) => (
                          <button
                            key={loc}
                            onClick={() => handleLocationSelect(loc)}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-left hover:bg-blue-50 transition-colors cursor-pointer"
                          >
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            {loc}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Radius */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Search Radius</label>
                  <Select value={searchState.radius} onValueChange={(value) => setSearchState((prev) => ({ ...prev, radius: value }))}>
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {RADIUS_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Healthy volunteers */}
                <label className="flex items-center gap-3 cursor-pointer group">
                  <Checkbox
                    id="healthyVolunteers"
                    checked={searchState.acceptsHealthyVolunteers}
                    onCheckedChange={(checked) =>
                      setSearchState((prev) => ({ ...prev, acceptsHealthyVolunteers: checked as boolean }))
                    }
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                      Accepts healthy volunteers
                    </p>
                    <p className="text-xs text-slate-400">Show trials open to participants without the condition</p>
                  </div>
                </label>
              </div>

              {/* Right column — Advanced (finetune only) or summary */}
              {isFinetuneSearch ? (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                    <div className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-violet-600" />
                    </div>
                    <span className="font-semibold text-slate-800 text-sm">Advanced Options</span>
                  </div>

                  {/* Phases */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">Trial Phases</label>
                    <div className="grid grid-cols-2 gap-2">
                      {TRIAL_PHASES.map((phase) => {
                        const checked = searchState.phases.includes(phase)
                        return (
                          <button
                            key={phase}
                            onClick={() => handlePhaseToggle(phase)}
                            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border-2 text-sm font-medium transition-all duration-150 cursor-pointer ${
                              checked
                                ? "border-violet-500 bg-violet-50 text-violet-800"
                                : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                            }`}
                          >
                            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                              checked ? "border-violet-500 bg-violet-500" : "border-slate-300"
                            }`}>
                              {checked && (
                                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            {phase}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Study type */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Study Type</label>
                    <Select value={searchState.studyType} onValueChange={handleStudyTypeChange}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select type…" />
                      </SelectTrigger>
                      <SelectContent>
                        {STUDY_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  {searchState.studyType === "Interventional" && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Primary Purpose</label>
                      <Select value={searchState.primaryPurpose} onValueChange={(v) => setSearchState((p) => ({ ...p, primaryPurpose: v }))}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select purpose…" />
                        </SelectTrigger>
                        <SelectContent>
                          {PRIMARY_PURPOSES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {searchState.studyType === "Observational" && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Observational Model</label>
                      <Select value={searchState.observationalModel} onValueChange={(v) => setSearchState((p) => ({ ...p, observationalModel: v }))}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select model…" />
                        </SelectTrigger>
                        <SelectContent>
                          {OBSERVATIONAL_MODELS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              ) : (
                /* Summary card for non-advanced */
                <div className="bg-linear-to-br from-blue-600 to-sky-500 rounded-2xl p-6 text-white flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                      <Search className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">Almost there</h3>
                    <p className="text-blue-100 text-sm leading-relaxed">
                      Fill in your details on the left and we will find actively recruiting trials that match your profile.
                    </p>
                  </div>
                  <div className="mt-8 space-y-2.5 text-sm">
                    {[
                      "Filters by your age & sex eligibility",
                      "Prioritises US-based trials",
                      "Only recruiting studies shown",
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-2.5">
                        <CheckCircle className="w-4 h-4 text-blue-200 shrink-0" />
                        <span className="text-blue-100">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleViewResults}
                disabled={isNavigating}
                className="group flex items-center gap-3 px-8 py-4 rounded-2xl text-white font-semibold text-base shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-200 transition-all duration-200 disabled:opacity-70 cursor-pointer"
                style={{ background: "linear-gradient(135deg, #3b82f6 0%, #0ea5e9 100%)" }}
              >
                {isNavigating ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Search className="w-5 h-5" />
                )}
                {isNavigating ? "Finding trials…" : "View matching trials"}
                {!isNavigating && <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />}
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
