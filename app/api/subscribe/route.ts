import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 })
    }

    // Log the subscription (in production, connect to your email service like Resend, ConvertKit, etc.)
    console.log("[v0] New email subscription:", email)

    // TODO: Add your email service integration here
    // Examples:
    // - Resend: await resend.contacts.create({ email, audienceId: "..." })
    // - ConvertKit: await fetch(`https://api.convertkit.com/v3/forms/{formId}/subscribe`, ...)
    // - Mailchimp: await mailchimp.lists.addListMember(listId, { email_address: email })

    // For now, we'll just acknowledge the subscription
    // In production, you'd store this in a database or send to an email service

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Subscribe error:", error)
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 })
  }
}
