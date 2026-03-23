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
    <div className="space-y-5 rounded-lg border border-border bg-card p-5 shadow-sm">
      <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Configuration
      </h3>
      <ModelSelector value={model} onChange={onModelChange} />
      <AspectRatioPicker value={aspectRatio} onChange={onAspectRatioChange} modelId={model} />
      <ResolutionPicker value={resolution} onChange={onResolutionChange} modelId={model} />

      {hasThinking && onThinkingLevelChange && (
        <div className="space-y-2">
          <label className="text-[13px] font-medium text-foreground">Thinking Level</label>
          <div className="inline-flex rounded-full border border-border bg-muted/50 p-0.5">
            {modelConfig.thinkingLevels.map(level => (
              <button
                key={level}
                onClick={() => onThinkingLevelChange(level)}
                className={cn(
                  'rounded-full px-4 py-1 text-[13px] font-medium capitalize transition-all',
                  thinkingLevel === level
                    ? 'bg-white text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {level}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground">
            Higher thinking improves quality but increases latency
          </p>
        </div>
      )}

      {onImageOnlyChange !== undefined && (
        <div className="space-y-2">
          <label className="text-[13px] font-medium text-foreground">Output Mode</label>
          <div className="inline-flex rounded-full border border-border bg-muted/50 p-0.5">
            <button
              onClick={() => onImageOnlyChange(false)}
              className={cn(
                'rounded-full px-4 py-1 text-[13px] font-medium transition-all',
                !imageOnly
                  ? 'bg-white text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Text + Image
            </button>
            <button
              onClick={() => onImageOnlyChange(true)}
              className={cn(
                'rounded-full px-4 py-1 text-[13px] font-medium transition-all',
                imageOnly
                  ? 'bg-white text-foreground shadow-sm'
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
