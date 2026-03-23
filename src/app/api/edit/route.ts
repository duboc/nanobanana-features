import { NextRequest, NextResponse } from 'next/server'
import { editImage } from '@/lib/gemini'
import type { ModelId, AspectRatio, Resolution, ImageData } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt, model, image, aspectRatio, resolution } = body as {
      prompt: string
      model: ModelId
      image: ImageData
      aspectRatio?: AspectRatio
      resolution?: Resolution
    }

    if (!prompt || !model || !image?.base64 || !image?.mimeType) {
      return NextResponse.json(
        { error: 'prompt, model, and image are required' },
        { status: 400 }
      )
    }

    const result = await editImage(prompt, image, model, {
      aspectRatio,
      resolution,
    })

    return NextResponse.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
