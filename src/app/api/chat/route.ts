import { NextRequest, NextResponse } from 'next/server'
import { chatGenerate } from '@/lib/gemini'
import type { ModelId, AspectRatio, Resolution, ChatMessage, ImageData } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, model, history, aspectRatio, resolution, image } = body as {
      message: string
      model: ModelId
      history: ChatMessage[]
      aspectRatio?: AspectRatio
      resolution?: Resolution
      image?: ImageData
    }

    if (!message || !model) {
      return NextResponse.json(
        { error: 'message and model are required' },
        { status: 400 }
      )
    }

    const result = await chatGenerate(message, history || [], model, {
      aspectRatio,
      resolution,
      image,
    })

    return NextResponse.json(result)
  } catch (err) {
    const message_ = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message_ }, { status: 500 })
  }
}
