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
    <div className="space-y-2">
      <label className="text-sm font-medium">Resolution</label>
      <div className="inline-flex rounded-lg border border-border p-1">
        {resolutions.map(res => (
          <button
            key={res}
            onClick={() => onChange(res)}
            className={cn(
              'rounded-md px-4 py-1.5 text-sm font-medium transition-all',
              value === res
                ? 'bg-primary text-primary-foreground shadow-sm'
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
