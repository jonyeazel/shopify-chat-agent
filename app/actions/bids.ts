"use server"

import { createClient } from "@/lib/supabase/server"

export interface BidData {
  name?: string
  email: string
  phone?: string
  storeDomain?: string
  serviceCategory: string
  serviceId: string
  projectDescription: string
  selectedTier: string
  bidAmount: number
  uploadedImages?: string[]
}

export async function submitBid(data: BidData) {
  const supabase = await createClient()

  const { data: bid, error } = await supabase
    .from("project_bids")
    .insert({
      name: data.name,
      email: data.email,
      phone: data.phone,
      store_domain: data.storeDomain,
      service_category: data.serviceCategory,
      project_description: `${data.serviceId}: ${data.projectDescription}`,
      selected_tier: data.selectedTier,
      bid_amount: data.bidAmount * 100, // Convert to cents
      uploaded_images: data.uploadedImages,
      status: "pending",
    })
    .select()
    .single()

  if (error) {
    console.error("Error submitting bid:", error)
    return { success: false, error: error.message }
  }

  return { success: true, bidId: bid.id }
}

export async function getBids(status?: string) {
  const supabase = await createClient()

  let query = supabase.from("project_bids").select("*").order("created_at", { ascending: false })

  if (status) {
    query = query.eq("status", status)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching bids:", error)
    return []
  }

  return data
}

export async function updateBidStatus(
  bidId: string,
  status: "accepted" | "rejected" | "countered",
  counterAmount?: number,
  adminNotes?: string,
) {
  const supabase = await createClient()

  const updateData: any = {
    status,
    updated_at: new Date().toISOString(),
  }

  if (counterAmount) updateData.counter_amount = counterAmount * 100
  if (adminNotes) updateData.admin_notes = adminNotes

  const { error } = await supabase.from("project_bids").update(updateData).eq("id", bidId)

  if (error) {
    console.error("Error updating bid:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}
