'use client'

import { ModelSelector } from './model-selector'
import { AspectRatioPicker } from './aspect-ratio-picker'
import { ResolutionPicker } from './resolution-picker'
import { MODELS } from '@/lib/models'
import { cn } from '@/lib/utils'
import type { ModelId, AspectRatio, Resolution, ThinkingLevel } from '@/types'

interface GenerationConfigProps {
  model: ModelId
  aspectRatio: AspectRatio
  resolution: Resolution
  onModelChange: (model: ModelId) => void
  onAspectRatioChange: (ratio: AspectRatio) => void
  onResolutionChange: (resolution: Resolution) => void
  thinkingLevel?: ThinkingLevel
  onThinkingLevelChange?: (level: ThinkingLevel) => void
  imageOnly?: boolean
  onImageOnlyChange?: (imageOnly: boolean) => void
}

export function GenerationConfig({
  model,
  aspectRatio,
  resolution,
  onModelChange,
  onAspectRatioChange,
  onResolutionChange,
  thinkingLevel,
  onThinkingLevelChange,
  imageOnly,
  onImageOnlyChange,
}: GenerationConfigProps) {
  const modelConfig = MODELS[model]
  const hasThinking = modelConfig.thinkingLevels.length > 0

  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-6">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Configuration
      </h3>
      <ModelSelector value={model} onChange={onModelChange} />
      <AspectRatioPicker value={aspectRatio} onChange={onAspectRatioChange} modelId={model} />
      <ResolutionPicker value={resolution} onChange={onResolutionChange} modelId={model} />

      {/* Thinking Level (only for models that support it) */}
      {hasThinking && onThinkingLevelChange && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Thinking Level</label>
          <div className="inline-flex rounded-lg border border-border p-1">
            {modelConfig.thinkingLevels.map(level => (
              <button
                key={level}
                onClick={() => onThinkingLevelChange(level)}
                className={cn(
                  'rounded-md px-4 py-1.5 text-sm font-medium capitalize transition-all',
                  thinkingLevel === level
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {level}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Higher thinking improves quality but increases latency
          </p>
        </div>
      )}

      {/* Output Mode */}
      {onImageOnlyChange !== undefined && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Output Mode</label>
          <div className="inline-flex rounded-lg border border-border p-1">
            <button
              onClick={() => onImageOnlyChange(false)}
              className={cn(
                'rounded-md px-4 py-1.5 text-sm font-medium transition-all',
                !imageOnly
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Text + Image
            </button>
            <button
              onClick={() => onImageOnlyChange(true)}
              className={cn(
                'rounded-md px-4 py-1.5 text-sm font-medium transition-all',
                imageOnly
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Image Only
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
