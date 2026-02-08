import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get("audio") as File | null

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 })
    }

    // Preserve the original filename and mime type from the client
    const fileName = audioFile.name || "audio.webm"
    const mimeType = audioFile.type || "audio/webm"
    const file = new File([audioFile], fileName, { type: mimeType })

    const openaiFormData = new FormData()
    openaiFormData.append("file", file)
    openaiFormData.append("model", "whisper-1")
    openaiFormData.append("language", "en")

    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: openaiFormData,
    })

    if (!response.ok) {
      const error = await response.text()
      console.error("OpenAI transcription error:", error)
      return NextResponse.json({ error: "Transcription failed" }, { status: 500 })
    }

    const result = await response.json()
    return NextResponse.json({ text: result.text })
  } catch (error) {
    console.error("Transcription error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
