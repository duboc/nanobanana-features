'use client'

import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Send, Loader2 } from 'lucide-react'
import { useRef, type KeyboardEvent } from 'react'

interface PromptInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  isLoading?: boolean
  placeholder?: string
}

export function PromptInput({
  value,
  onChange,
  onSubmit,
  isLoading = false,
  placeholder = 'Describe the image you want to generate...',
}: PromptInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      if (!isLoading && value.trim()) onSubmit()
    }
  }

  return (
    <div className="relative">
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={isLoading}
        className="min-h-[120px] resize-none pr-14 text-sm"
        rows={4}
      />
      <div className="absolute bottom-3 right-3 flex items-center gap-2">
        <span className="text-[10px] text-muted-foreground hidden sm:inline">
          {typeof navigator !== 'undefined' && navigator.platform?.includes('Mac') ? '⌘' : 'Ctrl'}+Enter
        </span>
        <Button
          size="icon"
          onClick={onSubmit}
          disabled={isLoading || !value.trim()}
          className="h-8 w-8"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  )
}
