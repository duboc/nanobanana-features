'use client'

import { cn } from '@/lib/utils'
import { getResolutions } from '@/lib/models'
import type { Resolution, ModelId } from '@/types'

interface ResolutionPickerProps {
  value: Resolution
  onChange: (value: Resolution) => void
  modelId: ModelId
}

const RESOLUTION_LABELS: Record<Resolution, string> = {
  '512': '0.5K',
  '1K': '1K',
  '2K': '2K',
  '4K': '4K',
}

export function ResolutionPicker({ value, onChange, modelId }: ResolutionPickerProps) {
  const resolutions = getResolutions(modelId)

  return (
    <div className="space-y-1.5">
      <label className="text-[13px] font-medium text-foreground">Resolution</label>
      <div className="inline-flex rounded-full border border-border bg-muted/50 p-0.5">
        {resolutions.map(res => (
          <button
            key={res}
            onClick={() => onChange(res)}
            className={cn(
              'rounded-full px-4 py-1 text-[13px] font-medium transition-all',
              value === res
                ? 'bg-white text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {RESOLUTION_LABELS[res]}
          </button>
        ))}
      </div>
    </div>
  )
}
