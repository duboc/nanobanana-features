'use client'

import { useState } from 'react'
import { PageContainer } from '@/components/layout/page-container'
import { PromptInput } from '@/components/generation/prompt-input'
import { ModelSelector } from '@/components/generation/model-selector'
import { AspectRatioPicker } from '@/components/generation/aspect-ratio-picker'
import { ResolutionPicker } from '@/components/generation/resolution-picker'
import { ChatHistory } from '@/components/chat/chat-history'
import { useChatSession } from '@/hooks/use-chat-session'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import type { ModelId, AspectRatio, Resolution } from '@/types'

export default function MultiTurnPage() {
  const [prompt, setPrompt] = useState('')
  const [model, setModel] = useState<ModelId>('gemini-3.1-flash-image-preview')
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1')
  const [resolution, setResolution] = useState<Resolution>('1K')
  const { messages, isLoading, error, sendMessage, clearHistory } = useChatSession()

  async function handleSend() {
    const text = prompt
    setPrompt('')
    await sendMessage(text, { model, aspectRatio, resolution })
  }

  return (
    <PageContainer
      title="Multi-turn Chat"
      description="Have a conversation to iteratively create and refine images"
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Sidebar config */}
        <div className="space-y-6 lg:col-span-1">
          <div className="rounded-xl border border-border bg-card p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Settings
              </h3>
              {messages.length > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  onClick={clearHistory}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            <ModelSelector value={model} onChange={setModel} />
            <AspectRatioPicker value={aspectRatio} onChange={setAspectRatio} modelId={model} />
            <ResolutionPicker value={resolution} onChange={setResolution} modelId={model} />
          </div>
        </div>

        {/* Chat area */}
        <div className="flex flex-col lg:col-span-3 min-h-[600px] rounded-xl border border-border bg-card/30">
          <ChatHistory messages={messages} isLoading={isLoading} />

          {error && (
            <div className="mx-4 mb-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="border-t border-border p-4">
            <PromptInput
              value={prompt}
              onChange={setPrompt}
              onSubmit={handleSend}
              isLoading={isLoading}
              placeholder="Describe an image or ask for changes..."
            />
          </div>
        </div>
      </div>
    </PageContainer>
  )
}
