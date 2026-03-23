'use client'

import { useState } from 'react'
import { PageContainer } from '@/components/layout/page-container'
import { PromptInput } from '@/components/generation/prompt-input'
import { GenerationConfig } from '@/components/generation/generation-config'
import { ImageUpload } from '@/components/image/image-upload'
import { ImageGallery } from '@/components/image/image-gallery'
import { useImageGeneration } from '@/hooks/use-image-generation'
import type { ModelId, AspectRatio, Resolution, ImageData } from '@/types'

export default function ImageEditingPage() {
  const [prompt, setPrompt] = useState('')
  const [model, setModel] = useState<ModelId>('gemini-3.1-flash-image-preview')
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1')
  const [resolution, setResolution] = useState<Resolution>('1K')
  const [sourceImage, setSourceImage] = useState<ImageData | null>(null)
  const { images, text, isLoading, error, generate } = useImageGeneration()

  async function handleGenerate() {
    if (!sourceImage) return
    await generate('/api/edit', {
      prompt,
      model,
      image: sourceImage,
      aspectRatio,
      resolution,
    })
  }

  return (
    <PageContainer
      title="Image Editing"
      description="Upload an image and describe your edits. Nano Banana preserves style, lighting, and perspective."
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-6">
          <GenerationConfig
            model={model}
            aspectRatio={aspectRatio}
            resolution={resolution}
            onModelChange={setModel}
            onAspectRatioChange={setAspectRatio}
            onResolutionChange={setResolution}
          />
        </div>

        <div className="space-y-6 lg:col-span-2">
          <div>
            <h3 className="text-sm font-medium mb-3">Source Image</h3>
            <ImageUpload
              onUpload={setSourceImage}
              currentImage={sourceImage}
              onClear={() => setSourceImage(null)}
            />
          </div>

          <PromptInput
            value={prompt}
            onChange={setPrompt}
            onSubmit={handleGenerate}
            isLoading={isLoading}
            placeholder="Describe the edits you want to make..."
          />

          {error && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
              {error}
            </div>
          )}

          {images.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-3">Result</h3>
              <ImageGallery images={images} isLoading={isLoading} text={text} />
            </div>
          )}

          {isLoading && images.length === 0 && (
            <ImageGallery images={[]} isLoading={true} />
          )}
        </div>
      </div>
    </PageContainer>
  )
}
