'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { MODELS, getModelIds } from '@/lib/models'
import type { ModelId } from '@/types'

interface ModelSelectorProps {
  value: ModelId
  onChange: (value: ModelId) => void
}

export function ModelSelector({ value, onChange }: ModelSelectorProps) {
  const modelIds = getModelIds()

  return (
    <div className="space-y-1.5">
      <label className="text-[13px] font-medium text-foreground">Model</label>
      <Select value={value} onValueChange={v => onChange(v as ModelId)}>
        <SelectTrigger className="w-full rounded-md">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {modelIds.map(id => {
            const model = MODELS[id]
            return (
              <SelectItem key={id} value={id}>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[13px]">{model.name}</span>
                  {model.supportsSearchGrounding && (
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 rounded-full">
                      Search
                    </Badge>
                  )}
                </div>
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
      <p className="text-[11px] text-muted-foreground leading-relaxed">{MODELS[value].description}</p>
    </div>
  )
}
