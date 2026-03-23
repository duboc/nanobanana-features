export interface ModelConfig {
  id: string
  name: string
  description: string
  supportsImageGen: boolean
  supportsEdit: boolean
  supportsSearchGrounding: boolean
  supportsImageSearch: boolean
  maxReferenceImages: number
  maxCharacterImages: number
  maxObjectImages: number
  supportedResolutions: Resolution[]
  supportedAspectRatios: AspectRatio[]
  thinkingLevels: ThinkingLevel[]
}

export type Resolution = '512' | '1K' | '2K' | '4K'

export type AspectRatio =
  | '1:1' | '1:4' | '1:8'
  | '2:3' | '3:2' | '3:4' | '4:1' | '4:3' | '4:5'
  | '5:4' | '8:1' | '9:16' | '16:9' | '21:9'

export type ThinkingLevel = 'minimal' | 'high'

export type ModelId =
  | 'gemini-3.1-flash-image-preview'
  | 'gemini-3-pro-image-preview'
  | 'gemini-2.5-flash-image'

export interface GenerationRequest {
  prompt: string
  model: ModelId
  aspectRatio?: AspectRatio
  resolution?: Resolution
  thinkingLevel?: ThinkingLevel
  includeThoughts?: boolean
  enableSearchGrounding?: boolean
  enableImageSearch?: boolean
}

export interface EditRequest {
  prompt: string
  model: ModelId
  image: ImageData
  aspectRatio?: AspectRatio
  resolution?: Resolution
}

export interface ReferenceRequest {
  prompt: string
  model: ModelId
  images: ImageData[]
  aspectRatio?: AspectRatio
  resolution?: Resolution
}

export interface ChatRequest {
  message: string
  model: ModelId
  history: ChatMessage[]
  aspectRatio?: AspectRatio
  resolution?: Resolution
  image?: ImageData
}

export interface ChatMessage {
  role: 'user' | 'model'
  parts: MessagePart[]
}

export interface MessagePart {
  text?: string
  imageData?: ImageData
}

export interface ImageData {
  base64: string
  mimeType: string
}

export interface GenerationResponse {
  images: ImageData[]
  text?: string
  groundingMetadata?: GroundingMetadata
}

export interface GroundingMetadata {
  searchEntryPoint?: {
    renderedContent: string
  }
  groundingChunks?: GroundingChunk[]
  searchQueries?: string[]
}

export interface GroundingChunk {
  web?: {
    uri: string
    title: string
  }
  image?: {
    uri: string
    imageUri: string
  }
}

export interface StyleTemplate {
  id: string
  name: string
  category: StyleCategory
  description: string
  promptTemplate: string
  examplePrompt: string
  icon: string
}

export type StyleCategory =
  | 'photorealistic'
  | 'illustration'
  | 'text-rendering'
  | 'product'
  | 'minimalist'
  | 'sequential'
  | 'search-grounded'
