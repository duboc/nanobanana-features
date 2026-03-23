import { NextRequest, NextResponse } from 'next/server'
import { generateImage } from '@/lib/gemini'
import type { ModelId, AspectRatio, Resolution, ThinkingLevel } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      prompt,
      model,
      aspectRatio,
      resolution,
      thinkingLevel,
      includeThoughts,
      enableSearchGrounding,
      enableImageSearch,
    } = body as {
      prompt: string
      model: ModelId
      aspectRatio?: AspectRatio
      resolution?: Resolution
      thinkingLevel?: ThinkingLevel
      includeThoughts?: boolean
      enableSearchGrounding?: boolean
      enableImageSearch?: boolean
    }

    if (!prompt || !model) {
      return NextResponse.json(
        { error: 'prompt and model are required' },
        { status: 400 }
      )
    }

    const result = await generateImage(prompt, model, {
      aspectRatio,
      resolution,
      thinkingLevel,
      includeThoughts,
      enableSearchGrounding,
      enableImageSearch,
    })

    return NextResponse.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
