'use client'

import { cn } from '@/lib/utils'
import { getAspectRatios } from '@/lib/models'
import type { AspectRatio, ModelId } from '@/types'

interface AspectRatioPickerProps {
  value: AspectRatio
  onChange: (value: AspectRatio) => void
  modelId: ModelId
}

const RATIO_DIMENSIONS: Record<string, { w: number; h: number }> = {
  '1:1': { w: 1, h: 1 },
  '1:4': { w: 1, h: 4 },
  '1:8': { w: 1, h: 8 },
  '2:3': { w: 2, h: 3 },
  '3:2': { w: 3, h: 2 },
  '3:4': { w: 3, h: 4 },
  '4:1': { w: 4, h: 1 },
  '4:3': { w: 4, h: 3 },
  '4:5': { w: 4, h: 5 },
  '5:4': { w: 5, h: 4 },
  '8:1': { w: 8, h: 1 },
  '9:16': { w: 9, h: 16 },
  '16:9': { w: 16, h: 9 },
  '21:9': { w: 21, h: 9 },
}

export function AspectRatioPicker({ value, onChange, modelId }: AspectRatioPickerProps) {
  const ratios = getAspectRatios(modelId)

  return (
    <div className="space-y-2">
      <label className="text-[13px] font-medium text-foreground">Aspect Ratio</label>
      <div className="flex flex-wrap gap-1.5">
        {ratios.map(ratio => {
          const dims = RATIO_DIMENSIONS[ratio]
          const maxDim = 18
          const scale = maxDim / Math.max(dims.w, dims.h)
          const w = Math.max(dims.w * scale, 4)
          const h = Math.max(dims.h * scale, 4)

          return (
            <button
              key={ratio}
              onClick={() => onChange(ratio)}
              className={cn(
                'flex flex-col items-center gap-0.5 rounded-md border px-2.5 py-1.5 transition-all',
                value === ratio
                  ? 'border-gcp-blue bg-gcp-blue/8 text-gcp-blue'
                  : 'border-border hover:border-muted-foreground/40 hover:bg-muted/50'
              )}
            >
              <div
                className={cn(
                  'rounded-[2px]',
                  value === ratio ? 'bg-gcp-blue' : 'bg-muted-foreground/25'
                )}
                style={{ width: `${w}px`, height: `${h}px` }}
              />
              <span className="text-[10px] font-medium">{ratio}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
