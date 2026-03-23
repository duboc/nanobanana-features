'use client'

import { useState } from 'react'
import { PageContainer } from '@/components/layout/page-container'
import { PromptInput } from '@/components/generation/prompt-input'
import { GenerationConfig } from '@/components/generation/generation-config'
import { ImageUpload } from '@/components/image/image-upload'
import { ImageGallery } from '@/components/image/image-gallery'
import { useImageGeneration } from '@/hooks/use-image-generation'
import { base64ToDataUrl } from '@/lib/image-utils'
import { MODELS } from '@/lib/models'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import type { ModelId, AspectRatio, Resolution, ImageData } from '@/types'

export default function ReferenceImagesPage() {
  const [prompt, setPrompt] = useState('')
  const [model, setModel] = useState<ModelId>('gemini-3.1-flash-image-preview')
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1')
  const [resolution, setResolution] = useState<Resolution>('1K')
  const [referenceImages, setReferenceImages] = useState<ImageData[]>([])
  const { images, text, isLoading, error, generate } = useImageGeneration()

  const maxImages = MODELS[model].maxReferenceImages

  async function handleGenerate() {
    if (referenceImages.length === 0) return
    await generate('/api/reference', {
      prompt,
      model,
      images: referenceImages,
      aspectRatio,
      resolution,
    })
  }

  function removeImage(index: number) {
    setReferenceImages(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <PageContainer
      title="Reference Images"
      description={`Combine up to ${maxImages} reference images to generate new compositions`}
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
          {/* Reference images grid */}
          <div>
            <h3 className="text-sm font-medium mb-3">
              Reference Images ({referenceImages.length}/{maxImages})
            </h3>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
              {referenceImages.map((img, i) => (
                <div key={i} className="relative group rounded-lg overflow-hidden border border-border">
                  <img
                    src={base64ToDataUrl(img.base64, img.mimeType)}
                    alt={`Reference ${i + 1}`}
                    className="w-full aspect-square object-cover"
                  />
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(i)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
            {referenceImages.length < maxImages && (
              <div className="mt-3">
                <ImageUpload
                  onUpload={() => {}}
                  multiple
                  onMultipleUpload={newImages =>
                    setReferenceImages(prev => [...prev, ...newImages].slice(0, maxImages))
                  }
                  maxImages={maxImages}
                  currentCount={referenceImages.length}
                />
              </div>
            )}
          </div>

          <PromptInput
            value={prompt}
            onChange={setPrompt}
            onSubmit={handleGenerate}
            isLoading={isLoading}
            placeholder="Describe how to combine the reference images..."
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
