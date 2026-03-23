import { NextRequest, NextResponse } from 'next/server'
import { generateWithReferences } from '@/lib/gemini'
import type { ModelId, AspectRatio, Resolution, ImageData } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt, model, images, aspectRatio, resolution } = body as {
      prompt: string
      model: ModelId
      images: ImageData[]
      aspectRatio?: AspectRatio
      resolution?: Resolution
    }

    if (!prompt || !model || !images?.length) {
      return NextResponse.json(
        { error: 'prompt, model, and at least one image are required' },
        { status: 400 }
      )
    }

    const result = await generateWithReferences(prompt, images, model, {
      aspectRatio,
      resolution,
    })

    return NextResponse.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
