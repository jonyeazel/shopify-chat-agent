"use client"
import { Check } from "lucide-react"

interface PaymentModelSelectorProps {
  selected?: "retainer" | "rev-share" | "hybrid"
  onSelect: (model: "retainer" | "rev-share" | "hybrid") => void
  pricing?: any
}

const models = [
  {
    id: "retainer" as const,
    name: "Monthly Retainer",
    description: "Fixed monthly fee",
  },
  {
    id: "hybrid" as const,
    name: "Hybrid",
    description: "Lower fee + rev share",
  },
  {
    id: "rev-share" as const,
    name: "Revenue Share",
    description: "Performance based",
  },
]

export function PaymentModelSelector({ selected, onSelect }: PaymentModelSelectorProps) {
  return (
    <div className="border border-border rounded-xl p-4">
      <p className="text-xs text-muted-foreground mb-3">Payment model</p>
      <div className="flex gap-2">
        {models.map((model) => (
          <button
            key={model.id}
            onClick={() => onSelect(model.id)}
            className={`flex-1 p-3 rounded-xl border text-left transition-all ${
              selected === model.id ? "border-foreground bg-muted/30" : "border-border hover:border-muted-foreground"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-medium text-foreground">{model.name}</p>
              {selected === model.id && (
                <div className="w-4 h-4 rounded-full bg-foreground flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-background" />
                </div>
              )}
            </div>
            <p className="text-[10px] text-muted-foreground">{model.description}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
