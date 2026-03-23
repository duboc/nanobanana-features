'use client'

import { useState, useCallback } from 'react'
import type { ChatMessage, ImageData, GenerationResponse } from '@/types'

interface UseChatSessionReturn {
  messages: ChatMessage[]
  isLoading: boolean
  error: string | null
  sendMessage: (text: string, body: Record<string, unknown>) => Promise<void>
  clearHistory: () => void
}

export function useChatSession(): UseChatSessionReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = useCallback(async (text: string, body: Record<string, unknown>) => {
    setIsLoading(true)
    setError(null)

    const userMessage: ChatMessage = {
      role: 'user',
      parts: [{ text }],
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...body,
          message: text,
          history: messages,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Chat failed (${response.status})`)
      }

      const data: GenerationResponse = await response.json()

      const assistantParts: ChatMessage['parts'] = []
      if (data.text) assistantParts.push({ text: data.text })
      for (const img of data.images) {
        assistantParts.push({ imageData: img })
      }

      const assistantMessage: ChatMessage = {
        role: 'model',
        parts: assistantParts,
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
      // Remove the user message on error
      setMessages(messages)
    } finally {
      setIsLoading(false)
    }
  }, [messages])

  const clearHistory = useCallback(() => {
    setMessages([])
    setError(null)
  }, [])

  return { messages, isLoading, error, sendMessage, clearHistory }
}
