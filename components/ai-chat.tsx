"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { motion, AnimatePresence } from "framer-motion"

interface AIChatProps {
  leadId?: string
  storeDomain?: string
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  inline?: boolean
}

export function AIChat({ leadId, storeDomain, isOpen: controlledOpen, onOpenChange, inline = false }: AIChatProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isOpen = controlledOpen ?? internalOpen
  const setIsOpen = onOpenChange ?? setInternalOpen

  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    initialMessages: [],
    body: { leadId, storeDomain },
  })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || status !== "ready") return
    sendMessage({ text: input })
    setInput("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const suggestedPrompts = ["What causes low conversion?", "How do I export my data?", "What ROI can I expect?"]

  if (inline) {
    return (
      <div className="flex flex-col h-full bg-background rounded-xl border border-border overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex-shrink-0">
          <span className="text-sm font-medium text-foreground">Questions</span>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide p-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-2">
              <p className="text-xs text-muted-foreground mb-4">Ask about CRO, your store, or the process</p>
              <div className="space-y-2 w-full">
                {suggestedPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage({ text: prompt })}
                    className="w-full text-left text-xs px-3 py-2.5 rounded-xl border border-border hover:bg-muted text-foreground transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[90%] ${
                      message.role === "user"
                        ? "bg-foreground text-background rounded-[16px] rounded-br-md px-3.5 py-2"
                        : "text-foreground"
                    }`}
                  >
                    {message.parts?.map((part, i) => {
                      if (part.type === "text") {
                        return (
                          <p key={i} className="text-xs leading-relaxed whitespace-pre-wrap">
                            {part.text}
                          </p>
                        )
                      }
                      return null
                    })}
                  </div>
                </div>
              ))}
              {status === "streaming" && (
                <div className="flex gap-1 py-2">
                  <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-pulse" />
                  <span
                    className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-pulse"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-pulse"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="p-3 pt-0 flex-shrink-0">
          <form onSubmit={handleSubmit}>
            <div className="bg-muted rounded-[16px] p-1.5">
              <div className="flex items-center gap-1.5">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a question..."
                  rows={1}
                  className="flex-1 bg-transparent px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none resize-none"
                  disabled={status !== "ready"}
                />
                <button
                  type="submit"
                  disabled={status !== "ready" || !input.trim()}
                  className="h-7 px-3 rounded-[12px] bg-foreground text-background text-xs font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-foreground/90 transition-colors flex-shrink-0"
                >
                  Send
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 h-10 px-4 rounded-full bg-foreground text-background hover:bg-foreground/90 text-sm font-medium shadow-lg transition-colors"
      >
        {isOpen ? "Close" : "Questions?"}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed bottom-16 right-4 z-50 w-[360px] max-w-[calc(100vw-32px)] h-[480px] max-h-[70vh] bg-background border border-border rounded-xl overflow-hidden flex flex-col"
          >
            <div className="px-4 py-3 border-b border-border flex items-center justify-between flex-shrink-0">
              <span className="text-sm font-medium text-foreground">CRO Assistant</span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide p-4">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <p className="text-xs text-muted-foreground mb-5 max-w-[200px]">
                    Questions about CRO, metrics, or the process.
                  </p>
                  <div className="space-y-2 w-full max-w-[260px]">
                    {suggestedPrompts.map((prompt, i) => (
                      <button
                        key={i}
                        onClick={() => sendMessage({ text: prompt })}
                        className="w-full text-left text-sm px-4 py-2.5 rounded-xl border border-border hover:bg-muted text-foreground transition-colors"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] ${
                          message.role === "user"
                            ? "bg-foreground text-background rounded-[16px] rounded-br-md px-4 py-2.5"
                            : "text-foreground"
                        }`}
                      >
                        {message.parts?.map((part, i) => {
                          if (part.type === "text") {
                            return (
                              <p key={i} className="text-sm whitespace-pre-wrap leading-relaxed">
                                {part.text}
                              </p>
                            )
                          }
                          return null
                        })}
                      </div>
                    </div>
                  ))}
                  {status === "streaming" && (
                    <div className="flex gap-1.5 py-2">
                      <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-pulse" />
                      <span
                        className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-pulse"
                        style={{ animationDelay: "150ms" }}
                      />
                      <span
                        className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-pulse"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            <div className="p-4 pt-0 flex-shrink-0">
              <form onSubmit={handleSubmit}>
                <div className="bg-muted rounded-[16px] p-2">
                  <div className="flex items-center gap-2">
                    <textarea
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Message..."
                      rows={1}
                      className="flex-1 bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none resize-none"
                      disabled={status !== "ready"}
                    />
                    <button
                      type="submit"
                      disabled={status !== "ready" || !input.trim()}
                      className="h-8 px-3 rounded-[12px] bg-foreground text-background text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-foreground/90 transition-colors flex-shrink-0"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </form>
              <p className="text-[10px] text-muted-foreground text-center mt-2">AI can make mistakes.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
