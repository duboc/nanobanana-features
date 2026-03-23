'use client'

import { useEffect, useRef } from 'react'
import { ChatMessage } from './chat-message'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { ChatMessage as ChatMessageType } from '@/types'

interface ChatHistoryProps {
  messages: ChatMessageType[]
  isLoading?: boolean
}

export function ChatHistory({ messages, isLoading }: ChatHistoryProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center text-muted-foreground">
        <div className="text-center">
          <p className="text-lg font-medium">Start a conversation</p>
          <p className="text-sm mt-1">Describe an image to generate, then iterate on it</p>
        </div>
      </div>
    )
  }

  return (
    <ScrollArea className="flex-1 px-4">
      <div className="space-y-4 py-4">
        {messages.map((msg, i) => (
          <ChatMessage key={i} message={msg} />
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-md border border-border bg-card px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:0ms]" />
                <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:150ms]" />
                <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  )
}
