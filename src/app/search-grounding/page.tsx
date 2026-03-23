'use client'

import { useState } from 'react'
import { PageContainer } from '@/components/layout/page-container'
import { PromptInput } from '@/components/generation/prompt-input'
import { ModelSelector } from '@/components/generation/model-selector'
import { AspectRatioPicker } from '@/components/generation/aspect-ratio-picker'
import { ResolutionPicker } from '@/components/generation/resolution-picker'
import { ImageGallery } from '@/components/image/image-gallery'
import { useImageGeneration } from '@/hooks/use-image-generation'
import { Badge } from '@/components/ui/badge'
import { MODELS } from '@/lib/models'
import { ExternalLink, Search } from 'lucide-react'
import type { ModelId, AspectRatio, Resolution } from '@/types'

const EXAMPLE_PROMPTS = [
  'Visualize the current weather forecast for the next 5 days in San Francisco as a clean, modern weather chart',
  'Create a stylish graphic of the latest Champions League results',
  'Make a simple but stylish infographic about the current state of AI research in 2026',
  'Generate a modern data visualization of global renewable energy adoption trends',
]

export default function SearchGroundingPage() {
  const [prompt, setPrompt] = useState('')
  const [model, setModel] = useState<ModelId>('gemini-3.1-flash-image-preview')
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9')
  const [resolution, setResolution] = useState<Resolution>('1K')
  const [enableImageSearch, setEnableImageSearch] = useState(false)
  const { images, text, groundingMetadata, isLoading, error, generate } = useImageGeneration()

  const supportsSearch = MODELS[model].supportsSearchGrounding
  const supportsImageSearch = MODELS[model].supportsImageSearch

  async function handleGenerate() {
    await generate('/api/search-grounded', {
      prompt,
      model,
      aspectRatio,
      resolution,
      enableImageSearch: enableImageSearch && supportsImageSearch,
    })
  }

  return (
    <PageContainer
      title="Search Grounding"
      description="Generate images based on real-time information from Google Search"
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-lg border border-border bg-card p-5 shadow-sm space-y-5">
            <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Configuration
            </h3>
            <ModelSelector value={model} onChange={setModel} />
            {!supportsSearch && (
              <div className="rounded-lg border border-gcp-yellow/30 bg-gcp-yellow/10 p-3 text-xs text-gcp-yellow">
                This model does not support Search Grounding. Use Nano Banana 2 or Pro.
              </div>
            )}
            <AspectRatioPicker value={aspectRatio} onChange={setAspectRatio} modelId={model} />
            <ResolutionPicker value={resolution} onChange={setResolution} modelId={model} />

            {supportsImageSearch && (
              <div className="space-y-2">
                <label className="text-[13px] font-medium text-foreground">Image Search</label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableImageSearch}
                    onChange={e => setEnableImageSearch(e.target.checked)}
                    className="rounded border-border"
                  />
                  <span className="text-sm text-muted-foreground">
                    Enable Google Image Search grounding
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* Example prompts */}
          <div className="rounded-lg border border-border bg-card p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Try These
            </h3>
            {EXAMPLE_PROMPTS.map((p, i) => (
              <button
                key={i}
                onClick={() => setPrompt(p)}
                className="block w-full rounded-lg border border-border p-3 text-left text-xs text-muted-foreground hover:border-gcp-blue/30 hover:text-foreground transition-all"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <PromptInput
            value={prompt}
            onChange={setPrompt}
            onSubmit={handleGenerate}
            isLoading={isLoading}
            placeholder="Ask about current events, weather, sports results..."
          />

          {error && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
              {error}
            </div>
          )}

          <ImageGallery images={images} isLoading={isLoading} text={text} />

          {/* Grounding sources */}
          {groundingMetadata?.groundingChunks && groundingMetadata.groundingChunks.length > 0 && (
            <div className="rounded-lg border border-border bg-card p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-gcp-blue" />
                <h3 className="text-sm font-semibold">Sources</h3>
              </div>
              <div className="space-y-2">
                {groundingMetadata.groundingChunks.map((chunk, i) => (
                  <div key={i}>
                    {chunk.web && (
                      <a
                        href={chunk.web.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-lg border border-border p-3 text-sm hover:border-gcp-blue/30 transition-all"
                      >
                        <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground" />
                        <span className="truncate">{chunk.web.title || chunk.web.uri}</span>
                      </a>
                    )}
                  </div>
                ))}
              </div>
              {groundingMetadata.searchQueries && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {groundingMetadata.searchQueries.map((q, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {q}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  )
}
