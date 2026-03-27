import { Check, ExternalLink, Gift } from "lucide-react"
import Link from "next/link"
import { stripe } from "@/lib/stripe"
import { getProduct } from "@/lib/products"

interface Props {
  searchParams: Promise<{ session_id?: string; product?: string }>
}

export default async function SuccessPage({ searchParams }: Props) {
  const { session_id, product: productId } = await searchParams

  let customerEmail = ""
  let productName = ""

  if (session_id) {
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id)
      customerEmail = session.customer_details?.email ?? ""
      const product = getProduct(productId ?? "")
      productName = product?.name ?? "your purchase"
    } catch {
      // silently fail - still show success UI
    }
  }

  const isTutor = productId === "v0-tutor"
  const isClone = productId === "clone-site"

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f4f5] p-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-black/[0.06] shadow-sm p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-[#635BFF]/10 flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-[#635BFF]" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-semibold text-neutral-900 mb-1 tracking-tight">
            {isTutor ? "You're in." : isClone ? "Let's build." : "Payment confirmed."}
          </h1>
          <p className="text-neutral-500 text-[15px]">
            {isTutor
              ? "Your private v0 Tutor is ready."
              : isClone
              ? "Jon will reach out within 24 hours."
              : `Thanks for purchasing ${productName}.`}
          </p>
          {customerEmail && (
            <p className="text-sm text-neutral-400 mt-1">Confirmation sent to {customerEmail}</p>
          )}
        </div>

        {/* Next steps */}
        <div className="space-y-3 mb-8">
          {isTutor ? (
            <>
              <Link
                href="/tutor"
                className="flex items-center gap-4 p-4 bg-[#635BFF] rounded-2xl hover:bg-[#5851ea] transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 text-sm font-semibold text-white">
                  1
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white">Open your v0 Tutor</p>
                  <p className="text-sm text-white/70">Available 24/7. Start with the seed prompt system.</p>
                </div>
              </Link>
              <a
                href="https://v0.link/jon"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-neutral-50 rounded-2xl hover:bg-neutral-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center flex-shrink-0 text-sm font-semibold">
                  2
                </div>
                <div className="flex-1">
                  <p className="font-medium text-neutral-900">Get $10 free v0 credits</p>
                  <p className="text-sm text-neutral-500">Sign up through Jon's link to start building.</p>
                </div>
                <ExternalLink className="w-4 h-4 text-neutral-400" />
              </a>
              <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-2xl">
                <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center flex-shrink-0 text-sm font-semibold">
                  3
                </div>
                <div className="flex-1">
                  <p className="font-medium text-neutral-900">Write your first seed prompt</p>
                  <p className="text-sm text-neutral-500">36 words or less. Then say "Cook".</p>
                </div>
              </div>
            </>
          ) : isClone ? (
            <>
              <a
                href="sms:+14078677201&body=Hey%20Jon%2C%20I%20just%20purchased%20Clone%20This%20Site"
                className="flex items-center gap-4 p-4 bg-[#007AFF] rounded-2xl hover:opacity-90 transition-opacity"
              >
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 text-sm font-semibold text-white">
                  1
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white">Text Jon to get started</p>
                  <p className="text-sm text-white/70">He reads every message.</p>
                </div>
              </a>
              <a
                href="https://v0.link/jon"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-neutral-50 rounded-2xl hover:bg-neutral-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center flex-shrink-0 text-sm font-semibold">
                  2
                </div>
                <div className="flex-1">
                  <p className="font-medium text-neutral-900">Get your v0 account ready</p>
                  <p className="text-sm text-neutral-500">Sign up with Jon's link for $10 free credits.</p>
                </div>
                <Gift className="w-4 h-4 text-neutral-400" />
              </a>
            </>
          ) : (
            <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-2xl">
              <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center flex-shrink-0 text-sm font-semibold">
                1
              </div>
              <div className="flex-1">
                <p className="font-medium text-neutral-900">Check your email</p>
                <p className="text-sm text-neutral-500">Next steps are on their way.</p>
              </div>
            </div>
          )}
        </div>

        <Link
          href="/"
          className="block w-full text-center py-3 text-neutral-400 hover:text-neutral-700 transition-colors text-sm"
        >
          Return to v0 University
        </Link>
      </div>
    </div>
  )
}
