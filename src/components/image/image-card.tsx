'use client'

import { base64ToDataUrl } from '@/lib/image-utils'
import { Button } from '@/components/ui/button'
import { Download, Maximize2 } from 'lucide-react'
import type { ImageData } from '@/types'

interface ImageCardProps {
  image: ImageData
  onExpand?: () => void
}

function downloadImage(image: ImageData) {
  const link = document.createElement('a')
  link.href = base64ToDataUrl(image.base64, image.mimeType)
  const ext = image.mimeType.split('/')[1] || 'png'
  link.download = `nano-banana-${Date.now()}.${ext}`
  link.click()
}

export function ImageCard({ image, onExpand }: ImageCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card">
      <img
        src={base64ToDataUrl(image.base64, image.mimeType)}
        alt="Generated image"
        className="w-full object-cover"
      />
      <div className="absolute inset-0 flex items-end justify-end gap-2 bg-gradient-to-t from-black/60 via-transparent to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
        {onExpand && (
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8"
            onClick={onExpand}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        )}
        <Button
          size="icon"
          variant="secondary"
          className="h-8 w-8"
          onClick={() => downloadImage(image)}
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
