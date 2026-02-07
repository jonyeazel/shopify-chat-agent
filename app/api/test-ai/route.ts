import { generateText } from "ai"

export async function GET() {
  try {
    // Check if API key exists
    const hasKey = !!process.env.AI_GATEWAY_API_KEY

    if (!hasKey) {
      return Response.json({
        success: false,
        error: "AI_GATEWAY_API_KEY not found in environment",
      })
    }

    // Try a simple generation with no tools
    const result = await generateText({
      model: "anthropic/claude-sonnet-4-20250514",
      prompt: "Say hello in exactly 3 words.",
      maxTokens: 20,
    })

    return Response.json({
      success: true,
      response: result.text,
      hasKey: true,
    })
  } catch (error) {
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    })
  }
}
