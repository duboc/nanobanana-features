'use client'

import { useState } from 'react'
import { PageContainer } from '@/components/layout/page-container'
import { PromptInput } from '@/components/generation/prompt-input'
import { GenerationConfig } from '@/components/generation/generation-config'
import { ImageGallery } from '@/components/image/image-gallery'
import { useImageGeneration } from '@/hooks/use-image-generation'
import { STYLE_TEMPLATES } from '@/lib/style-templates'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  Camera,
  Sticker,
  Type,
  Package,
  Minus,
  LayoutGrid,
  Search,
  Droplets,
  Box,
  BookOpen,
} from 'lucide-react'
import type { ModelId, AspectRatio, Resolution, StyleTemplate } from '@/types'

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Camera,
  Sticker,
  Type,
  Package,
  Minus,
  LayoutGrid,
  Search,
  Droplets,
  Box,
  BookOpen,
}

export default function StyleGalleryPage() {
  const [prompt, setPrompt] = useState('')
  const [model, setModel] = useState<ModelId>('gemini-3.1-flash-image-preview')
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1')
  const [resolution, setResolution] = useState<Resolution>('1K')
  const [selectedTemplate, setSelectedTemplate] = useState<StyleTemplate | null>(null)
  const { images, text, isLoading, error, generate } = useImageGeneration()

  function selectTemplate(template: StyleTemplate) {
    setSelectedTemplate(template)
    setPrompt(template.examplePrompt)
    if (template.category === 'search-grounded') {
      setModel('gemini-3.1-flash-image-preview')
    }
  }

  async function handleGenerate() {
    const url = selectedTemplate?.category === 'search-grounded'
      ? '/api/search-grounded'
      : '/api/generate'
    await generate(url, {
      prompt,
      model,
      aspectRatio,
      resolution,
      enableSearchGrounding: selectedTemplate?.category === 'search-grounded',
    })
  }

  return (
    <PageContainer
      title="Style Gallery"
      description="Browse prompt templates and generate images in different styles"
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
          {/* Template grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {STYLE_TEMPLATES.map(template => {
              const Icon = ICON_MAP[template.icon] || Camera
              const isSelected = selectedTemplate?.id === template.id
              return (
                <button
                  key={template.id}
                  onClick={() => selectTemplate(template)}
                  className={cn(
                    'flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all',
                    isSelected
                      ? 'border-gcp-blue bg-gcp-blue/10 text-gcp-blue'
                      : 'border-border hover:border-gcp-blue/20'
                  )}
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-xs font-medium">{template.name}</span>
                </button>
              )
            })}
          </div>

          {/* Selected template details */}
          {selectedTemplate && (
            <Card className="border-gcp-blue/20 bg-gcp-blue/5">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{selectedTemplate.name}</CardTitle>
                  <Badge variant="secondary" className="text-xs capitalize">
                    {selectedTemplate.category}
                  </Badge>
                </div>
                <CardDescription>{selectedTemplate.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium">Template:</span> {selectedTemplate.promptTemplate}
                </p>
              </CardContent>
            </Card>
          )}

          <PromptInput
            value={prompt}
            onChange={setPrompt}
            onSubmit={handleGenerate}
            isLoading={isLoading}
            placeholder="Select a style template above or write your own prompt..."
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
