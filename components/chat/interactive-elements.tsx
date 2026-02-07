"use client"

import { useState } from "react"
import { Check, Star } from "lucide-react"

export function QuickReplyButtons({
  options,
  onSelect,
}: {
  options: string[]
  onSelect: (option: string) => void
}) {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div className="flex flex-wrap gap-2 my-3">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => {
            setSelected(option)
            onSelect(option)
          }}
          disabled={selected !== null}
          className={`px-4 py-2 rounded-full text-sm border transition-all ${
            selected === option
              ? "bg-primary text-primary-foreground border-primary"
              : selected
                ? "opacity-50 border-border"
                : "border-border hover:border-foreground/30 active:scale-95"
          }`}
        >
          {selected === option && <Check className="w-3 h-3 inline mr-1" />}
          {option}
        </button>
      ))}
    </div>
  )
}

export function MultiSelectOptions({
  title,
  options,
  onSubmit,
}: {
  title: string
  options: string[]
  onSubmit: (selected: string[]) => void
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [submitted, setSubmitted] = useState(false)

  const toggle = (option: string) => {
    const newSelected = new Set(selected)
    if (newSelected.has(option)) {
      newSelected.delete(option)
    } else {
      newSelected.add(option)
    }
    setSelected(newSelected)
  }

  return (
    <div className="my-3 p-4 rounded-xl bg-muted/30 border border-border">
      <p className="font-medium text-sm mb-3">{title}</p>
      <div className="space-y-2">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => !submitted && toggle(option)}
            disabled={submitted}
            className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
              selected.has(option) ? "border-primary bg-primary/5" : "border-border hover:border-foreground/30"
            } ${submitted ? "opacity-60" : ""}`}
          >
            <div
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                selected.has(option) ? "bg-primary border-primary" : "border-muted-foreground/30"
              }`}
            >
              {selected.has(option) && <Check className="w-3 h-3 text-primary-foreground" />}
            </div>
            <span className="text-sm">{option}</span>
          </button>
        ))}
      </div>
      {!submitted && selected.size > 0 && (
        <button
          onClick={() => {
            setSubmitted(true)
            onSubmit(Array.from(selected))
          }}
          className="mt-3 w-full py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 active:scale-[0.98] transition-all"
        >
          Continue with {selected.size} selected
        </button>
      )}
    </div>
  )
}

export function BudgetSlider({
  min,
  max,
  step,
  onSubmit,
}: {
  min: number
  max: number
  step: number
  onSubmit: (value: number) => void
}) {
  const [value, setValue] = useState(Math.floor((min + max) / 2))
  const [submitted, setSubmitted] = useState(false)

  return (
    <div className="my-3 p-4 rounded-xl bg-muted/30 border border-border">
      <div className="flex items-center justify-between mb-3">
        <p className="font-medium text-sm">Your budget range</p>
        <span className="text-lg font-semibold">${value.toLocaleString()}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => !submitted && setValue(Number(e.target.value))}
        disabled={submitted}
        className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
      />
      <div className="flex justify-between text-xs text-muted-foreground mt-2">
        <span>${min.toLocaleString()}</span>
        <span>${max.toLocaleString()}+</span>
      </div>
      {!submitted && (
        <button
          onClick={() => {
            setSubmitted(true)
            onSubmit(value)
          }}
          className="mt-3 w-full py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 active:scale-[0.98] transition-all"
        >
          Set budget
        </button>
      )}
    </div>
  )
}

export function EmailCapture({
  prompt,
  onSubmit,
}: {
  prompt: string
  onSubmit: (email: string) => void
}) {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  return (
    <div className="my-3 p-4 rounded-xl bg-muted/30 border border-border">
      <p className="text-sm mb-3">{prompt}</p>
      {!submitted ? (
        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-foreground/30"
          />
          <button
            onClick={() => {
              if (isValid) {
                setSubmitted(true)
                onSubmit(email)
              }
            }}
            disabled={!isValid}
            className="px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            Submit
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-sm text-primary">
          <Check className="w-4 h-4" />
          <span>Got it! I'll reach out soon.</span>
        </div>
      )}
    </div>
  )
}

export function StarRating({
  prompt,
  onSubmit,
}: {
  prompt: string
  onSubmit: (rating: number) => void
}) {
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [submitted, setSubmitted] = useState(false)

  return (
    <div className="my-3 p-4 rounded-xl bg-muted/30 border border-border text-center">
      <p className="text-sm mb-3">{prompt}</p>
      <div className="flex justify-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => {
              if (!submitted) {
                setRating(star)
                setSubmitted(true)
                onSubmit(star)
              }
            }}
            onMouseEnter={() => !submitted && setHover(star)}
            onMouseLeave={() => !submitted && setHover(0)}
            disabled={submitted}
            className="p-1 transition-transform hover:scale-110"
          >
            <Star
              className={`w-8 h-8 transition-colors ${
                star <= (hover || rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"
              }`}
            />
          </button>
        ))}
      </div>
      {submitted && <p className="text-sm text-muted-foreground mt-2">Thanks for your feedback!</p>}
    </div>
  )
}

export function ProgressSteps({
  steps,
  currentStep,
}: {
  steps: string[]
  currentStep: number
}) {
  return (
    <div className="my-3 flex items-center justify-between">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center">
          <div className={`flex flex-col items-center ${i > 0 ? "ml-2" : ""}`}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                i < currentStep
                  ? "bg-primary text-primary-foreground"
                  : i === currentStep
                    ? "bg-primary/20 text-primary border-2 border-primary"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {i < currentStep ? <Check className="w-4 h-4" /> : i + 1}
            </div>
            <span className="text-[10px] mt-1 text-muted-foreground max-w-[60px] text-center truncate">{step}</span>
          </div>
          {i < steps.length - 1 && <div className={`w-8 h-0.5 mx-1 ${i < currentStep ? "bg-primary" : "bg-muted"}`} />}
        </div>
      ))}
    </div>
  )
}
