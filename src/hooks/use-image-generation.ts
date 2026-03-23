'use client'

import { useState, useCallback } from 'react'
import type { ImageData, GenerationResponse, GroundingMetadata } from '@/types'

interface UseImageGenerationReturn {
  images: ImageData[]
  text?: string
  groundingMetadata?: GroundingMetadata
  isLoading: boolean
  error: string | null
  generate: (url: string, body: Record<string, unknown>) => Promise<void>
  clear: () => void
}

export function useImageGeneration(): UseImageGenerationReturn {
  const [images, setImages] = useState<ImageData[]>([])
  const [text, setText] = useState<string | undefined>()
  const [groundingMetadata, setGroundingMetadata] = useState<GroundingMetadata | undefined>()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generate = useCallback(async (url: string, body: Record<string, unknown>) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Generation failed (${response.status})`)
      }

      const data: GenerationResponse = await response.json()
      setImages(data.images)
      setText(data.text)
      setGroundingMetadata(data.groundingMetadata)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clear = useCallback(() => {
    setImages([])
    setText(undefined)
    setGroundingMetadata(undefined)
    setError(null)
  }, [])

  return { images, text, groundingMetadata, isLoading, error, generate, clear }
}
