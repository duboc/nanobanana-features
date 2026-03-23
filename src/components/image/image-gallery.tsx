'use client'

import { useState } from 'react'
import { ImageCard } from './image-card'
import { ImageLightbox } from './image-lightbox'
import { Skeleton } from '@/components/ui/skeleton'
import type { ImageData } from '@/types'

interface ImageGalleryProps {
  images: ImageData[]
  isLoading?: boolean
  text?: string
}

export function ImageGallery({ images, isLoading, text }: ImageGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Skeleton className="aspect-square rounded-xl" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 animate-bounce rounded-full bg-gcp-blue [animation-delay:0ms]" />
          <div className="h-2 w-2 animate-bounce rounded-full bg-gcp-blue [animation-delay:150ms]" />
          <div className="h-2 w-2 animate-bounce rounded-full bg-gcp-blue [animation-delay:300ms]" />
          <span className="text-sm text-muted-foreground ml-2">Generating...</span>
        </div>
      </div>
    )
  }

  if (images.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      {text && (
        <div className="rounded-lg border border-border bg-card/50 p-4">
          <p className="text-sm whitespace-pre-wrap">{text}</p>
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {images.map((image, i) => (
          <ImageCard
            key={i}
            image={image}
            onExpand={() => setLightboxIndex(i)}
          />
        ))}
      </div>
      {lightboxIndex !== null && (
        <ImageLightbox
          images={images}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  )
}
