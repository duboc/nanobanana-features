'use client'

import { useState, useRef } from 'react'
import { PageContainer } from '@/components/layout/page-container'
import { PromptInput } from '@/components/generation/prompt-input'
import { ModelSelector } from '@/components/generation/model-selector'
import { AspectRatioPicker } from '@/components/generation/aspect-ratio-picker'
import { ResolutionPicker } from '@/components/generation/resolution-picker'
import { ChatHistory } from '@/components/chat/chat-history'
import { useChatSession } from '@/hooks/use-chat-session'
import { base64ToDataUrl, validateImageFile } from '@/lib/image-utils'
import { Button } from '@/components/ui/button'
import { Trash2, ImagePlus, X } from 'lucide-react'
import type { ModelId, AspectRatio, Resolution, ImageData } from '@/types'

export default function MultiTurnPage() {
  const [prompt, setPrompt] = useState('')
  const [model, setModel] = useState<ModelId>('gemini-3.1-flash-image-preview')
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1')
  const [resolution, setResolution] = useState<Resolution>('1K')
  const [attachedImage, setAttachedImage] = useState<ImageData | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { messages, isLoading, error, sendMessage, clearHistory } = useChatSession()

  async function handleSend() {
    const text = prompt
    const image = attachedImage
    setPrompt('')
    setAttachedImage(null)
    await sendMessage(text, { model, aspectRatio, resolution, image })
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !validateImageFile(file.type)) return
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1]
      setAttachedImage({ base64, mimeType: file.type })
    }
    reader.readAsDataURL(file)
    e.target.value = ''
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

          {/* Attached image preview */}
          {attachedImage && (
            <div className="mx-4 mb-2 flex items-start gap-2">
              <div className="relative inline-block rounded-lg border border-border overflow-hidden">
                <img
                  src={base64ToDataUrl(attachedImage.base64, attachedImage.mimeType)}
                  alt="Attached"
                  className="h-20 w-20 object-cover"
                />
                <button
                  onClick={() => setAttachedImage(null)}
                  className="absolute top-0.5 right-0.5 rounded-full bg-destructive p-0.5"
                >
                  <X className="h-3 w-3 text-white" />
                </button>
              </div>
            </div>
          )}

          <div className="border-t border-border p-4">
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <PromptInput
                  value={prompt}
                  onChange={setPrompt}
                  onSubmit={handleSend}
                  isLoading={isLoading}
                  placeholder="Describe an image or ask for changes..."
                />
              </div>
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/gif,image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 shrink-0"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                >
                  <ImagePlus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}
