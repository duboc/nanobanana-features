'use client'

import { base64ToDataUrl } from '@/lib/image-utils'
import { cn } from '@/lib/utils'
import type { ChatMessage as ChatMessageType } from '@/types'

interface ChatMessageProps {
  message: ChatMessageType
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'

  return (
    <div className={cn('flex gap-3', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-3 space-y-3',
          isUser
            ? 'bg-primary text-primary-foreground rounded-br-md'
            : 'bg-card border border-border rounded-bl-md'
        )}
      >
        {message.parts.map((part, i) => {
          if (part.text) {
            return (
              <p key={i} className="text-sm whitespace-pre-wrap">
                {part.text}
              </p>
            )
          }
          if (part.imageData) {
            return (
              <img
                key={i}
                src={base64ToDataUrl(part.imageData.base64, part.imageData.mimeType)}
                alt="Chat image"
                className="max-w-full rounded-lg"
              />
            )
          }
          return null
        })}
      </div>
    </div>
  )
}
