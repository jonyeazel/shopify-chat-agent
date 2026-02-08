"use client"

import type React from "react"
import { useRef, useCallback, useState, useEffect } from "react"
import { ArrowUp, Plus, Mic, MicOff, X, FileText } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const PLACEHOLDER_TEXTS = [
  "What are you working on...",
  "Drop a store URL...",
  "Tell me what you sell...",
  "Ask me anything...",
]

const MAX_RECORDING_MS = 120_000
const TRANSCRIBE_TIMEOUT_MS = 12_000
const FEEDBACK_MS = 3000

interface AttachedFile {
  name: string
  content: string
  type: string
}

type MicState =
  | "idle"
  | "requesting"
  | "denied"
  | "recording"
  | "processing" // covers both stopping + transcribing
  | "error"
  | "empty"

interface ChatInputProps {
  input: string
  setInput: (value: string) => void
  onSubmit: (text: string, files: AttachedFile[]) => void
  disabled?: boolean
  placeholder?: string
  onFocusChange?: (focused: boolean) => void
  isExpanded?: boolean
  onToggleExpand?: () => void
  showMicNudge?: boolean
}

function getSupportedMimeType(): string {
  if (typeof MediaRecorder === "undefined") return ""
  if (MediaRecorder.isTypeSupported("audio/webm")) return "audio/webm"
  if (MediaRecorder.isTypeSupported("audio/mp4")) return "audio/mp4"
  if (MediaRecorder.isTypeSupported("audio/ogg")) return "audio/ogg"
  return ""
}

function getFileExtension(mime: string): string {
  if (mime.includes("webm")) return "webm"
  if (mime.includes("mp4")) return "mp4"
  if (mime.includes("ogg")) return "ogg"
  return "webm"
}

export function ChatInput({
  input,
  setInput,
  onSubmit,
  disabled,
  placeholder = "Type a message...",
  onFocusChange,
  isExpanded = false,
  onToggleExpand,
  showMicNudge = false,
}: ChatInputProps) {
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [micState, setMicState] = useState<MicState>("idle")
  const [isOverflowing, setIsOverflowing] = useState(false)
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [audioLevel, setAudioLevel] = useState(0)
  const [micSupported, setMicSupported] = useState(true)
  const [micRingVisible, setMicRingVisible] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioContextRef = useRef<AudioContext | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const maxDurationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const mimeTypeRef = useRef("")
  const micBusyRef = useRef(false)
  const micNudgeShown = useRef(false)
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inputRef = useRef(input)
  inputRef.current = input

  // ── Browser support ──────────────────────────────────────────────
  useEffect(() => {
    const mime = getSupportedMimeType()
    mimeTypeRef.current = mime
    if (!mime || typeof navigator.mediaDevices?.getUserMedia !== "function") {
      setMicSupported(false)
    }
  }, [])

  // ── Mic nudge ────────────────────────────────────────────────────
  useEffect(() => {
    if (showMicNudge && !micNudgeShown.current && micState === "idle") {
      micNudgeShown.current = true
      const t = setTimeout(() => {
        setMicRingVisible(true)
        setTimeout(() => setMicRingVisible(false), 1200)
      }, 600)
      return () => clearTimeout(t)
    }
  }, [showMicNudge, micState])

  // ── Placeholder cycling ──────────────────────────────────────────
  useEffect(() => {
    if (input || micState !== "idle") return
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDER_TEXTS.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [input, micState])

  // ── Cleanup on unmount ───────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current?.state !== "inactive") {
        mediaRecorderRef.current?.stop()
      }
      streamRef.current?.getTracks().forEach((t) => t.stop())
      audioContextRef.current?.close()
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
      if (maxDurationTimerRef.current) clearTimeout(maxDurationTimerRef.current)
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current)
      abortControllerRef.current?.abort()
    }
  }, [])

  // ── Audio level ──────────────────────────────────────────────────
  const startAudioLevel = useCallback((stream: MediaStream) => {
    try {
      const ctx = new AudioContext()
      audioContextRef.current = ctx
      const source = ctx.createMediaStreamSource(stream)
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 256
      analyser.smoothingTimeConstant = 0.7
      source.connect(analyser)

      const buf = new Uint8Array(analyser.frequencyBinCount)
      const tick = () => {
        analyser.getByteFrequencyData(buf)
        setAudioLevel(buf.reduce((a, b) => a + b, 0) / buf.length / 255)
        animationFrameRef.current = requestAnimationFrame(tick)
      }
      tick()
    } catch {
      // AudioContext unavailable
    }
  }, [])

  const stopAudioLevel = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
    audioContextRef.current?.close()
    audioContextRef.current = null
    setAudioLevel(0)
  }, [])

  // ── Clear feedback state ─────────────────────────────────────────
  const clearFeedback = useCallback(() => {
    if (feedbackTimerRef.current) {
      clearTimeout(feedbackTimerRef.current)
      feedbackTimerRef.current = null
    }
  }, [])

  const showFeedback = useCallback(
    (state: "error" | "empty") => {
      clearFeedback()
      setMicState(state)
      feedbackTimerRef.current = setTimeout(() => setMicState("idle"), FEEDBACK_MS)
    },
    [clearFeedback],
  )

  // ── Start recording ──────────────────────────────────────────────
  const startRecording = async () => {
    if (micBusyRef.current) return
    micBusyRef.current = true
    clearFeedback()
    setMicState("requesting")

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const mime = mimeTypeRef.current
      const recorder = new MediaRecorder(stream, { mimeType: mime })
      mediaRecorderRef.current = recorder
      audioChunksRef.current = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data)
      }

      recorder.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: mime })
        stream.getTracks().forEach((t) => t.stop())
        streamRef.current = null
        stopAudioLevel()
        if (maxDurationTimerRef.current) {
          clearTimeout(maxDurationTimerRef.current)
          maxDurationTimerRef.current = null
        }
        await transcribeAudio(blob)
      }

      recorder.start()
      setMicState("recording")
      startAudioLevel(stream)

      // Auto-stop at max duration
      maxDurationTimerRef.current = setTimeout(() => {
        if (mediaRecorderRef.current?.state === "recording") {
          mediaRecorderRef.current.stop()
          setMicState("processing")
        }
      }, MAX_RECORDING_MS)

      try { navigator.vibrate?.(10) } catch {}
    } catch (err: any) {
      if (err?.name === "NotAllowedError" || err?.name === "PermissionDeniedError") {
        setMicState("denied")
      } else {
        showFeedback("error")
      }
    } finally {
      micBusyRef.current = false
    }
  }

  // ── Stop recording ───────────────────────────────────────────────
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === "recording") {
      setMicState("processing")
      mediaRecorderRef.current.stop()
      try { navigator.vibrate?.(10) } catch {}
    }
  }, [])

  // ── Transcribe ───────────────────────────────────────────────────
  const transcribeAudio = async (blob: Blob) => {
    setMicState("processing")

    const controller = new AbortController()
    abortControllerRef.current = controller
    const timeout = setTimeout(() => controller.abort(), TRANSCRIBE_TIMEOUT_MS)

    try {
      const ext = getFileExtension(mimeTypeRef.current)
      const formData = new FormData()
      formData.append("audio", blob, `recording.${ext}`)

      const res = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      })

      clearTimeout(timeout)

      if (res.ok) {
        const { text } = await res.json()
        if (text && text.trim()) {
          const current = inputRef.current
          setInput(current ? `${current} ${text}` : text)
          setMicState("idle")

          requestAnimationFrame(() => {
            if (textareaRef.current) {
              textareaRef.current.focus()
              const len = textareaRef.current.value.length
              textareaRef.current.setSelectionRange(len, len)
            }
          })
          return
        }
        showFeedback("empty")
      } else {
        showFeedback("error")
      }
    } catch {
      showFeedback("error")
    } finally {
      abortControllerRef.current = null
    }
  }

  // ── Cancel ───────────────────────────────────────────────────────
  const cancelProcessing = useCallback(() => {
    abortControllerRef.current?.abort()
    setMicState("idle")
  }, [])

  // ── Mic click ────────────────────────────────────────────────────
  const handleMicClick = () => {
    switch (micState) {
      case "idle":
        startRecording()
        break
      case "recording":
        stopRecording()
        break
      case "processing":
        cancelProcessing()
        break
      case "denied":
        startRecording()
        break
      case "error":
      case "empty":
        clearFeedback()
        setMicState("idle")
        break
    }
  }

  // ── File handling ────────────────────────────────────────────────
  const processFile = useCallback((file: File) => {
    const isCSV = file.name.endsWith(".csv")
    const isImage = file.type.startsWith("image/")
    if (!isCSV && !isImage) return

    if (isImage) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setAttachedFiles((prev) => [...prev, { name: file.name, content, type: "image" }])
      }
      reader.readAsDataURL(file)
    } else {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setAttachedFiles((prev) => [...prev, { name: file.name, content, type: "csv" }])
      }
      reader.readAsText(file)
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) Array.from(files).forEach(processFile)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const files = e.dataTransfer.files
      if (files) Array.from(files).forEach(processFile)
    },
    [processFile],
  )

  const removeFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  // ── Submit ───────────────────────────────────────────────────────
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const inputValue = input || ""
    if ((!inputValue.trim() && attachedFiles.length === 0) || disabled) return

    let messageText = inputValue.trim()
    if (attachedFiles.length > 0) {
      const fileDataString = attachedFiles
        .map((f) => {
          if (f.type === "image") return `[Uploaded image: ${f.name}]`
          return `[Uploaded CSV: ${f.name}]\n${f.content}`
        })
        .join("\n\n")
      messageText = messageText ? `${messageText}\n\n${fileDataString}` : `Here's my data:\n\n${fileDataString}`
    }

    onSubmit(messageText, attachedFiles)
    setInput("")
    setAttachedFiles([])

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    const textarea = e.target
    textarea.style.height = "auto"
    const newHeight = Math.min(textarea.scrollHeight, 200)
    textarea.style.height = newHeight + "px"
    setIsOverflowing(textarea.scrollHeight > 200)
  }

  // ── Derived ──────────────────────────────────────────────────────
  const getPlaceholder = () => {
    switch (micState) {
      case "requesting":
        return "Allow microphone access..."
      case "recording":
        return "Listening..."
      case "processing":
        return "Transcribing..."
      case "error":
        return "Couldn't transcribe — try again"
      case "empty":
        return "No speech detected — try again"
      case "denied":
        return "Microphone access denied"
      default:
        if (attachedFiles.length > 0) return "Add a note..."
        return PLACEHOLDER_TEXTS[placeholderIndex]
    }
  }

  const isBusy = micState === "processing"

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex-1">
        {attachedFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {attachedFiles.map((file, i) => (
              <div key={i} className="flex items-center gap-2 bg-muted rounded-full pl-3 pr-1.5 py-1.5 text-sm">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground max-w-[120px] truncate text-xs">{file.name}</span>
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="w-5 h-5 rounded-full bg-muted-foreground/20 flex items-center justify-center hover:bg-muted-foreground/30 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div
          className={`rounded-xl border transition-all duration-150 ${
            isDragging
              ? "bg-[#e0e0e0] border-foreground/20"
              : "bg-[#ebebeb] border-foreground/[0.08] focus-within:border-foreground/[0.15]"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="relative px-3.5 pt-2.5 pb-1">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              onFocus={() => onFocusChange?.(true)}
              onBlur={() => onFocusChange?.(false)}
              placeholder={getPlaceholder()}
              rows={1}
              style={{ fontSize: "16px", outline: "none" }}
              className="w-full bg-transparent text-base text-foreground placeholder:text-muted-foreground/70 resize-none max-h-[200px] leading-relaxed scrollbar-hide"
              disabled={disabled || isBusy}
            />
          </div>

          <div className="flex items-center justify-between px-2.5 pb-2">
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-foreground/[0.06] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                title="Add file"
              >
                <Plus className="w-[18px] h-[18px] text-foreground/40" strokeWidth={1.5} />
              </button>

              {micSupported && (
                <div className="relative flex items-center justify-center">
                  {/* Nudge ring */}
                  <AnimatePresence>
                    {micRingVisible && (
                      <motion.span
                        initial={{ scale: 1, opacity: 0.35 }}
                        animate={{ scale: 2.5, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="absolute inset-0 rounded-full border-[1.5px] border-foreground/25 pointer-events-none"
                      />
                    )}
                  </AnimatePresence>

                  {/* Audio level ring */}
                  {micState === "recording" && (
                    <span
                      className="absolute inset-[-3px] rounded-full border-[1.5px] border-[#dc2626]/30 pointer-events-none"
                      style={{
                        transform: `scale(${1 + audioLevel * 0.25})`,
                        opacity: 0.2 + audioLevel * 0.5,
                        transition: "transform 75ms ease-out, opacity 75ms ease-out",
                      }}
                    />
                  )}

                  <button
                    type="button"
                    onClick={handleMicClick}
                    disabled={micState === "requesting"}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      micState === "recording"
                        ? "bg-[#dc2626]"
                        : micState === "processing"
                          ? "bg-foreground/[0.06]"
                          : "hover:bg-foreground/[0.06]"
                    }`}
                    style={
                      micState === "recording"
                        ? { transform: `scale(${1 + audioLevel * 0.12})` }
                        : undefined
                    }
                    title={
                      micState === "recording"
                        ? "Stop recording"
                        : micState === "processing"
                          ? "Cancel"
                          : micState === "denied"
                            ? "Tap to retry"
                            : "Voice input"
                    }
                    aria-label={
                      micState === "recording"
                        ? "Stop recording"
                        : micState === "processing"
                          ? "Cancel transcription"
                          : "Start voice input"
                    }
                  >
                    {micState === "recording" ? (
                      <div className="w-2 h-2 bg-white rounded-sm" />
                    ) : micState === "processing" ? (
                      <ProcessingDots />
                    ) : micState === "denied" ? (
                      <MicOff className="w-[18px] h-[18px] text-foreground/30" strokeWidth={1.5} />
                    ) : (
                      <Mic
                        className={`w-[18px] h-[18px] transition-colors duration-150 ${
                          micState === "error" || micState === "empty"
                            ? "text-[#dc2626]/40"
                            : micState === "requesting"
                              ? "text-foreground/20"
                              : "text-foreground/40"
                        }`}
                        strokeWidth={1.5}
                      />
                    )}
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={disabled || isBusy || (!input.trim() && attachedFiles.length === 0)}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                disabled || isBusy || (!input.trim() && attachedFiles.length === 0)
                  ? "bg-foreground/[0.08] cursor-not-allowed"
                  : "bg-foreground hover:opacity-90 active:scale-[0.92] active:opacity-80"
              }`}
            >
              <ArrowUp
                className={`w-4 h-4 ${
                  disabled || isBusy || (!input.trim() && attachedFiles.length === 0)
                    ? "text-foreground/25"
                    : "text-background"
                }`}
                strokeWidth={2.5}
              />
            </button>
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />
    </form>
  )
}

function ProcessingDots() {
  return (
    <div className="flex gap-[3px] items-center">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-[3px] h-[3px] rounded-full bg-foreground/35"
          animate={{ opacity: [0.25, 1, 0.25] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}
