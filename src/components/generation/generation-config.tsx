'use client'

import { ModelSelector } from './model-selector'
import { AspectRatioPicker } from './aspect-ratio-picker'
import { ResolutionPicker } from './resolution-picker'
import type { ModelId, AspectRatio, Resolution } from '@/types'

interface GenerationConfigProps {
  model: ModelId
  aspectRatio: AspectRatio
  resolution: Resolution
  onModelChange: (model: ModelId) => void
  onAspectRatioChange: (ratio: AspectRatio) => void
  onResolutionChange: (resolution: Resolution) => void
}

export function GenerationConfig({
  model,
  aspectRatio,
  resolution,
  onModelChange,
  onAspectRatioChange,
  onResolutionChange,
}: GenerationConfigProps) {
  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-6">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Configuration
      </h3>
      <ModelSelector value={model} onChange={onModelChange} />
      <AspectRatioPicker value={aspectRatio} onChange={onAspectRatioChange} modelId={model} />
      <ResolutionPicker value={resolution} onChange={onResolutionChange} modelId={model} />
    </div>
  )
}
