import { NextRequest, NextResponse } from 'next/server'
import { searchGroundedGenerate } from '@/lib/gemini'
import type { ModelId, AspectRatio, Resolution } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt, model, aspectRatio, resolution, enableImageSearch } = body as {
      prompt: string
      model: ModelId
      aspectRatio?: AspectRatio
      resolution?: Resolution
      enableImageSearch?: boolean
    }

    if (!prompt || !model) {
      return NextResponse.json(
        { error: 'prompt and model are required' },
        { status: 400 }
      )
    }

    const result = await searchGroundedGenerate(prompt, model, {
      aspectRatio,
      resolution,
      enableImageSearch,
    })

    return NextResponse.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
