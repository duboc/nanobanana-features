'use client'

import { useState } from 'react'
import { PageContainer } from '@/components/layout/page-container'
import { PromptInput } from '@/components/generation/prompt-input'
import { GenerationConfig } from '@/components/generation/generation-config'
import { ImageGallery } from '@/components/image/image-gallery'
import { useImageGeneration } from '@/hooks/use-image-generation'
import type { ModelId, AspectRatio, Resolution } from '@/types'

export default function TextToImagePage() {
  const [prompt, setPrompt] = useState('')
  const [model, setModel] = useState<ModelId>('gemini-3.1-flash-image-preview')
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1')
  const [resolution, setResolution] = useState<Resolution>('1K')
  const { images, text, isLoading, error, generate } = useImageGeneration()

  async function handleGenerate() {
    await generate('/api/generate', {
      prompt,
      model,
      aspectRatio,
      resolution,
    })
  }

  return (
    <PageContainer
      title="Text to Image"
      description="Generate images from text prompts using any Nano Banana model"
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left: Config */}
        <div className="lg:col-span-1">
          <GenerationConfig
            model={model}
            aspectRatio={aspectRatio}
            resolution={resolution}
            onModelChange={setModel}
            onAspectRatioChange={setAspectRatio}
            onResolutionChange={setResolution}
          />
        </div>

        {/* Right: Prompt + Results */}
        <div className="space-y-6 lg:col-span-2">
          <PromptInput
            value={prompt}
            onChange={setPrompt}
            onSubmit={handleGenerate}
            isLoading={isLoading}
          />

          {error && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
              {error}
            </div>
          )}

          <ImageGallery images={images} isLoading={isLoading} text={text} />
        </div>
      </div>
    </PageContainer>
  )
}
