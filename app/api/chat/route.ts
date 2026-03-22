import { consumeStream, streamText } from "ai"
import { anthropic } from "@ai-sdk/anthropic"

export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    const formattedMessages = messages.map((msg: any) => {
      if (msg.parts && Array.isArray(msg.parts)) {
        const textParts = msg.parts.filter((p: any) => p.type === "text")
        const content = textParts.map((p: any) => p.text).join(" ")
        return { role: msg.role, content: content || "" }
      }
      if (msg.content) {
        return { role: msg.role, content: msg.content }
      }
      if (msg.text) {
        return { role: msg.role || "user", content: msg.text }
      }
      return { role: msg.role || "user", content: String(msg.content || msg.text || "") }
    })

    const systemPrompt = `You are the AI assistant for v0 University, helping people build websites with AI.

YOUR JOB: Have a natural conversation that moves people toward buying. When they're ready, tell them to tap the Buy Now button.

VOICE: Sound like a smart friend texting. Brief. Direct. No corporate speak. 2-3 sentences max, then stop or ask a question.

NEVER use markdown formatting. No asterisks, no bullet points, no headers. Plain text only.

PRODUCTS:

The v0 Playbook - $197 (normally $297, limited time)
20-minute video that teaches you how to prompt AI to build professional websites. Includes 5 templates, 5 power prompts, free custom domain, and $50 in v0 credits. Zero coding required. Jon's mom and little sister both build websites now using this method.

Guarantee: Your site live on your custom domain today, or text Jon and he makes it right.

Live Build Session - $1,497  
60 minutes 1-on-1 with Jon. He builds your actual project with you. You leave with a finished, deployed site plus the recording. Includes the Playbook and 7 days of support.

Build Sprint - $4,997
3 Live Build sessions. Your entire web presence built in a week. Includes 30 days unlimited support.

KEY FACTS:
- Zero experience needed. Complete beginners welcome.
- Jon's mom had never touched code. Built her first site in 45 minutes.
- AI builds it instantly when you know the right words.
- Direct SMS access to Jon included.

BUYING SIGNALS - When someone shows intent ("I'm in", "let's do it", "I want this", "sign me up", "ready"), tell them to tap the Buy Now button. Don't ask clarifying questions. They're ready.

WHEN UNSURE which tier, default to recommending the Playbook at $197. It's the entry point.

Keep the conversation moving toward: watching examples, understanding the offer, or buying.`

    const result = streamText({
      model: anthropic("claude-sonnet-4-20250514"),
      system: systemPrompt,
      messages: formattedMessages,
      abortSignal: req.signal,
    })

    return result.toUIMessageStreamResponse({
      consumeSseStream: consumeStream,
    })
  } catch (error) {
    console.error("Chat route error:", error)
    return new Response(
      JSON.stringify({
        error: "Chat failed",
        message: (error as Error).message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
