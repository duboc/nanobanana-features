import { GoogleGenAI } from '@google/genai'
import type {
  ModelId,
  AspectRatio,
  Resolution,
  ThinkingLevel,
  GenerationResponse,
  ImageData,
  ChatMessage,
  GroundingMetadata,
} from '@/types'

const ai = new GoogleGenAI({
  vertexai: true,
  project: process.env.GOOGLE_CLOUD_PROJECT!,
  location: process.env.GOOGLE_CLOUD_LOCATION || 'us-central1',
})

function buildImageConfig(aspectRatio?: AspectRatio, resolution?: Resolution) {
  const config: Record<string, string> = {}
  if (aspectRatio) config.aspectRatio = aspectRatio
  if (resolution) config.imageSize = resolution
  return Object.keys(config).length > 0 ? config : undefined
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractResponse(response: any): GenerationResponse {
  const images: ImageData[] = []
  let text = ''

  const parts = response.candidates?.[0]?.content?.parts || []
  for (const part of parts) {
    if (part.thought) continue
    if (part.text) {
      text += part.text
    } else if (part.inlineData?.data && part.inlineData?.mimeType) {
      images.push({
        base64: part.inlineData.data,
        mimeType: part.inlineData.mimeType,
      })
    }
  }

  const rawGrounding = response.candidates?.[0]?.groundingMetadata as Record<string, unknown> | undefined
  let groundingMetadata: GroundingMetadata | undefined
  if (rawGrounding) {
    groundingMetadata = {
      searchEntryPoint: rawGrounding.searchEntryPoint as GroundingMetadata['searchEntryPoint'],
      groundingChunks: rawGrounding.groundingChunks as GroundingMetadata['groundingChunks'],
      searchQueries: (rawGrounding.webSearchQueries || rawGrounding.imageSearchQueries) as string[] | undefined,
    }
  }

  return {
    images,
    text: text || undefined,
    groundingMetadata,
  }
}

export async function generateImage(
  prompt: string,
  model: ModelId,
  options?: {
    aspectRatio?: AspectRatio
    resolution?: Resolution
    thinkingLevel?: ThinkingLevel
    includeThoughts?: boolean
    enableSearchGrounding?: boolean
    enableImageSearch?: boolean
    imageOnly?: boolean
  }
): Promise<GenerationResponse> {
  const config: Record<string, unknown> = {
    responseModalities: options?.imageOnly ? ['IMAGE'] : ['TEXT', 'IMAGE'],
  }

  const imageConfig = buildImageConfig(options?.aspectRatio, options?.resolution)
  if (imageConfig) config.imageConfig = imageConfig

  if (options?.thinkingLevel) {
    config.thinkingConfig = {
      thinkingLevel: options.thinkingLevel === 'high' ? 'High' : 'Minimal',
      includeThoughts: options.includeThoughts ?? false,
    }
  }

  if (options?.enableSearchGrounding) {
    if (options?.enableImageSearch && model === 'gemini-3.1-flash-image-preview') {
      config.tools = [{
        googleSearch: {
          searchTypes: {
            webSearch: {},
            imageSearch: {},
          },
        },
      }]
    } else {
      config.tools = [{ googleSearch: {} }]
    }
  }

  const response = await ai.models.generateContent({
    model,
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config,
  })

  return extractResponse(response)
}

export async function editImage(
  prompt: string,
  image: ImageData,
  model: ModelId,
  options?: {
    aspectRatio?: AspectRatio
    resolution?: Resolution
  }
): Promise<GenerationResponse> {
  const config: Record<string, unknown> = {
    responseModalities: ['TEXT', 'IMAGE'],
  }

  const imageConfig = buildImageConfig(options?.aspectRatio, options?.resolution)
  if (imageConfig) config.imageConfig = imageConfig

  const response = await ai.models.generateContent({
    model,
    contents: [{
      role: 'user',
      parts: [
        { text: prompt },
        { inlineData: { data: image.base64, mimeType: image.mimeType } },
      ],
    }],
    config,
  })

  return extractResponse(response)
}

export async function generateWithReferences(
  prompt: string,
  images: ImageData[],
  model: ModelId,
  options?: {
    aspectRatio?: AspectRatio
    resolution?: Resolution
  }
): Promise<GenerationResponse> {
  const config: Record<string, unknown> = {
    responseModalities: ['TEXT', 'IMAGE'],
  }

  const imageConfig = buildImageConfig(options?.aspectRatio, options?.resolution)
  if (imageConfig) config.imageConfig = imageConfig

  const parts: Array<{ text: string } | { inlineData: { data: string; mimeType: string } }> = [
    { text: prompt },
    ...images.map(img => ({
      inlineData: { data: img.base64, mimeType: img.mimeType },
    })),
  ]

  const response = await ai.models.generateContent({
    model,
    contents: [{ role: 'user', parts }],
    config,
  })

  return extractResponse(response)
}

export async function chatGenerate(
  message: string,
  history: ChatMessage[],
  model: ModelId,
  options?: {
    aspectRatio?: AspectRatio
    resolution?: Resolution
    image?: ImageData
  }
): Promise<GenerationResponse> {
  const config: Record<string, unknown> = {
    responseModalities: ['TEXT', 'IMAGE'],
  }

  const imageConfig = buildImageConfig(options?.aspectRatio, options?.resolution)
  if (imageConfig) config.imageConfig = imageConfig

  const contents = history.map(msg => ({
    role: msg.role,
    parts: msg.parts.map(p => {
      if (p.text) return { text: p.text }
      if (p.imageData) return { inlineData: { data: p.imageData.base64, mimeType: p.imageData.mimeType } }
      return { text: '' }
    }),
  }))

  const newParts: Array<{ text: string } | { inlineData: { data: string; mimeType: string } }> = [
    { text: message },
  ]
  if (options?.image) {
    newParts.push({
      inlineData: { data: options.image.base64, mimeType: options.image.mimeType },
    })
  }

  contents.push({ role: 'user', parts: newParts })

  const response = await ai.models.generateContent({
    model,
    contents,
    config,
  })

  return extractResponse(response)
}

export async function searchGroundedGenerate(
  prompt: string,
  model: ModelId,
  options?: {
    aspectRatio?: AspectRatio
    resolution?: Resolution
    enableImageSearch?: boolean
  }
): Promise<GenerationResponse> {
  return generateImage(prompt, model, {
    ...options,
    enableSearchGrounding: true,
  })
}
