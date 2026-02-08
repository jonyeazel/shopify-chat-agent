"use client"

import type React from "react"
import { useRef, useCallback, useState, useEffect } from "react"
import { ArrowUp, Plus, Mic, X, FileText } from "lucide-react"

const PLACEHOLDER_TEXTS = [
  "Type a message...",
  "Drop a store URL...",
  "Ask about pricing...",
  "Ask me anything...",
]

interface AttachedFile {
  name: string
  content: string
  type: string
}

interface ChatInputProps {
  input: string
  setInput: (value: string) => void
  onSubmit: (text: string, files: AttachedFile[]) => void
  disabled?: boolean
  placeholder?: string
  onFocusChange?: (focused: boolean) => void
  isExpanded?: boolean
  onToggleExpand?: () => void
}

export function ChatInput({ 
  input, 
  setInput, 
  onSubmit, 
  disabled, 
  placeholder = "Type a message...",
  onFocusChange,
  isExpanded = false,
  onToggleExpand
}: ChatInputProps) {
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [isOverflowing, setIsOverflowing] = useState(false)
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  // Cycle through placeholder texts
  useEffect(() => {
    if (input) return // Don't cycle if there's input
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDER_TEXTS.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [input])

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
    if (files) {
      Array.from(files).forEach(processFile)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
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
      if (files) {
        Array.from(files).forEach(processFile)
      }
    },
    [processFile],
  )

  const removeFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" })
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
        stream.getTracks().forEach((track) => track.stop())
        await transcribeAudio(audioBlob)
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (err) {
      console.error("Failed to start recording:", err)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsTranscribing(true)
    try {
      const formData = new FormData()
      formData.append("audio", audioBlob, "recording.webm")

      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const { text } = await response.json()
        if (text) {
          setInput(input ? `${input} ${text}` : text)
        }
      }
    } catch (err) {
      console.error("Transcription failed:", err)
    } finally {
      setIsTranscribing(false)
    }
  }

  const handleMicClick = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const inputValue = input || ""
    if ((!inputValue.trim() && attachedFiles.length === 0) || disabled) return

    let messageText = inputValue.trim()
    if (attachedFiles.length > 0) {
      const fileDataString = attachedFiles
        .map((f) => {
          if (f.type === "image") {
            return `[Uploaded image: ${f.name}]`
          }
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
            isDragging ? "bg-[#e0e0e0] border-foreground/20" : "bg-[#ebebeb] border-foreground/[0.08] focus-within:border-foreground/[0.15]"
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
              placeholder={isTranscribing ? "Transcribing..." : attachedFiles.length > 0 ? "Add a note..." : PLACEHOLDER_TEXTS[placeholderIndex]}
              rows={1}
              style={{ fontSize: "16px", outline: "none" }}
              className="w-full bg-transparent text-base text-foreground placeholder:text-muted-foreground/70 resize-none max-h-[200px] leading-relaxed scrollbar-hide"
              disabled={disabled || isTranscribing}
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

              <button
                type="button"
                onClick={handleMicClick}
                disabled={isTranscribing}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  isRecording ? "bg-[#dc2626] scale-110" : "hover:bg-foreground/[0.06]"
                }`}
                title={isRecording ? "Stop recording" : "Voice input"}
              >
                {isRecording ? (
                  <div className="w-2 h-2 bg-white rounded-sm" />
                ) : (
                  <Mic
                    className={`w-[18px] h-[18px] ${isTranscribing ? "text-foreground/20 animate-pulse" : "text-foreground/40"}`}
                    strokeWidth={1.5}
                  />
                )}
              </button>
            </div>

            <button
              type="submit"
              disabled={disabled || isTranscribing || (!input.trim() && attachedFiles.length === 0)}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                disabled || isTranscribing || (!input.trim() && attachedFiles.length === 0)
                  ? "bg-foreground/[0.08] cursor-not-allowed"
                  : "bg-foreground hover:opacity-90 active:scale-[0.92] active:opacity-80"
              }`}
            >
              <ArrowUp className={`w-4 h-4 ${
                disabled || isTranscribing || (!input.trim() && attachedFiles.length === 0)
                  ? "text-foreground/25"
                  : "text-background"
              }`} strokeWidth={2.5} />
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
