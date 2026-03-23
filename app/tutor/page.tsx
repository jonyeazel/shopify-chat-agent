"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { siteConfig } from "@/lib/site-config"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

export default function TutorPage() {
  const [password, setPassword] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authError, setAuthError] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Check for stored password on mount
  useEffect(() => {
    const stored = localStorage.getItem("tutor_password")
    if (stored) {
      setPassword(stored)
      setIsAuthenticated(true)
    }
  }, [])

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError("")
    
    // Test the password with a simple API call
    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          password, 
          messages: [{ role: "user", content: "Hello" }] 
        }),
      })
      
      if (res.ok) {
        localStorage.setItem("tutor_password", password)
        setIsAuthenticated(true)
        setMessages([{
          id: "welcome",
          role: "assistant",
          content: "Welcome to v0 Tutor. I'm here to teach you Jon's exact methodology for building websites with AI.\n\nThe secret is simple: A tight 36-word seed prompt + saying \"cook\" until it's done.\n\nWhat would you like to build? Or ask me anything about the method."
        }])
      } else {
        setAuthError("Invalid access code. Check your email for your code after purchase.")
      }
    } catch {
      setAuthError("Connection error. Please try again.")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error("No reader")

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
      }
      setMessages(prev => [...prev, assistantMessage])

      const decoder = new TextDecoder()
      let buffer = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split("\n")
        buffer = lines.pop() || ""

        for (const line of lines) {
          if (line.startsWith("0:")) {
            try {
              const text = JSON.parse(line.slice(2))
              setMessages(prev => {
                const updated = [...prev]
                const lastIdx = updated.length - 1
                if (updated[lastIdx]?.role === "assistant") {
                  updated[lastIdx] = {
                    ...updated[lastIdx],
                    content: updated[lastIdx].content + text,
                  }
                }
                return updated
              })
            } catch {
              // Skip parse errors
            }
          }
        }
      }
    } catch (error) {
      console.error("Error:", error)
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  // Password entry screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f4f4f5] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-black/[0.08]">
            <div className="flex items-center gap-3 mb-6">
              <img
                src={siteConfig.brand.avatarUrl}
                alt="v0 Tutor"
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h1 className="text-xl font-semibold text-foreground">v0 Tutor</h1>
                <p className="text-sm text-muted-foreground">Private Access</p>
              </div>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Enter your access code
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your access code"
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-[#f4f4f5] focus:outline-none focus:ring-2 focus:ring-[#635BFF] focus:border-transparent transition-all"
                  autoFocus
                />
                {authError && (
                  <p className="mt-2 text-sm text-red-500">{authError}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-[#635BFF] text-white font-medium rounded-xl hover:bg-[#5851ea] transition-colors"
              >
                Access Tutor
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Don't have an access code?{" "}
              <a href="/" className="text-[#635BFF] hover:underline">
                Get v0 Tutor
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    )
  }

  // Main tutor chat interface
  return (
    <div className="min-h-screen bg-[#f4f4f5] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-black/[0.08] px-4 py-3 flex items-center gap-3">
        <img
          src={siteConfig.brand.avatarUrl}
          alt="v0 Tutor"
          className="w-10 h-10 rounded-full"
        />
        <div>
          <h1 className="text-lg font-semibold text-foreground">v0 Tutor</h1>
          <p className="text-xs text-muted-foreground">Your private AI tutor</p>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem("tutor_password")
            setIsAuthenticated(false)
            setPassword("")
            setMessages([])
          }}
          className="ml-auto text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Sign Out
        </button>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence mode="popLayout">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] md:max-w-[70%] px-4 py-3 rounded-2xl ${
                  message.role === "user"
                    ? "bg-[#635BFF] text-white"
                    : "bg-white text-foreground border border-black/[0.08]"
                }`}
              >
                <p className="whitespace-pre-wrap text-[15px] leading-relaxed">
                  {message.content}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-white px-4 py-3 rounded-2xl border border-black/[0.08]">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-neutral-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-neutral-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-neutral-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-black/[0.08] p-4">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="flex gap-3">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
              placeholder="Ask about the method, get help with a prompt..."
              className="flex-1 px-4 py-3 rounded-xl border border-neutral-200 bg-[#f4f4f5] focus:outline-none focus:ring-2 focus:ring-[#635BFF] focus:border-transparent transition-all resize-none"
              rows={1}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-6 py-3 bg-[#635BFF] text-white font-medium rounded-xl hover:bg-[#5851ea] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
