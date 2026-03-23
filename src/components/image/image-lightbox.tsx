'use client'

import { useEffect, useState } from 'react'
import { base64ToDataUrl } from '@/lib/image-utils'
import { Button } from '@/components/ui/button'
import { X, ChevronLeft, ChevronRight, Download } from 'lucide-react'
import type { ImageData } from '@/types'

interface ImageLightboxProps {
  images: ImageData[]
  initialIndex: number
  onClose: () => void
}

function downloadImage(image: ImageData) {
  const link = document.createElement('a')
  link.href = base64ToDataUrl(image.base64, image.mimeType)
  const ext = image.mimeType.split('/')[1] || 'png'
  link.download = `nano-banana-${Date.now()}.${ext}`
  link.click()
}

export function ImageLightbox({ images, initialIndex, onClose }: ImageLightboxProps) {
  const [index, setIndex] = useState(initialIndex)

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft' && index > 0) setIndex(i => i - 1)
      if (e.key === 'ArrowRight' && index < images.length - 1) setIndex(i => i + 1)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [index, images.length, onClose])

  const image = images[index]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90" onClick={onClose}>
      <div className="relative max-h-[90vh] max-w-[90vw]" onClick={e => e.stopPropagation()}>
        <img
          src={base64ToDataUrl(image.base64, image.mimeType)}
          alt="Generated image"
          className="max-h-[85vh] max-w-full rounded-lg object-contain"
        />

        {/* Controls */}
        <div className="absolute -top-12 right-0 flex gap-2">
          <Button size="icon" variant="ghost" className="text-white hover:bg-white/20" onClick={() => downloadImage(image)}>
            <Download className="h-5 w-5" />
          </Button>
          <Button size="icon" variant="ghost" className="text-white hover:bg-white/20" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        {images.length > 1 && (
          <>
            {index > 0 && (
              <Button
                size="icon"
                variant="ghost"
                className="absolute left-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                onClick={() => setIndex(i => i - 1)}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            )}
            {index < images.length - 1 && (
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                onClick={() => setIndex(i => i + 1)}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            )}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm text-white/70">
              {index + 1} / {images.length}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
