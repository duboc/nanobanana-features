import type { ModelConfig, ModelId, AspectRatio, Resolution } from '@/types'

export const ALL_ASPECT_RATIOS: AspectRatio[] = [
  '1:1', '1:4', '1:8', '2:3', '3:2', '3:4',
  '4:1', '4:3', '4:5', '5:4', '8:1', '9:16', '16:9', '21:9',
]

export const FLASH_31_ASPECT_RATIOS: AspectRatio[] = ALL_ASPECT_RATIOS

export const STANDARD_ASPECT_RATIOS: AspectRatio[] = [
  '1:1', '2:3', '3:2', '3:4', '4:3', '4:5', '5:4', '9:16', '16:9', '21:9',
]

export const MODELS: Record<ModelId, ModelConfig> = {
  'gemini-3.1-flash-image-preview': {
    id: 'gemini-3.1-flash-image-preview',
    name: 'Nano Banana 2',
    description: 'High-efficiency model optimized for speed and high-volume use cases. Supports 512 resolution and extended aspect ratios.',
    supportsImageGen: true,
    supportsEdit: true,
    supportsSearchGrounding: true,
    supportsImageSearch: true,
    maxReferenceImages: 14,
    maxCharacterImages: 4,
    maxObjectImages: 10,
    supportedResolutions: ['512', '1K', '2K', '4K'],
    supportedAspectRatios: FLASH_31_ASPECT_RATIOS,
    thinkingLevels: ['minimal', 'high'],
  },
  'gemini-3-pro-image-preview': {
    id: 'gemini-3-pro-image-preview',
    name: 'Nano Banana Pro',
    description: 'Professional asset production model with advanced reasoning. Excels at complex instructions and high-fidelity text rendering.',
    supportsImageGen: true,
    supportsEdit: true,
    supportsSearchGrounding: true,
    supportsImageSearch: false,
    maxReferenceImages: 11,
    maxCharacterImages: 5,
    maxObjectImages: 6,
    supportedResolutions: ['1K', '2K', '4K'],
    supportedAspectRatios: STANDARD_ASPECT_RATIOS,
    thinkingLevels: [],
  },
  'gemini-2.5-flash-image': {
    id: 'gemini-2.5-flash-image',
    name: 'Nano Banana',
    description: 'Efficient model optimized for speed and high-volume, low-latency tasks.',
    supportsImageGen: true,
    supportsEdit: true,
    supportsSearchGrounding: false,
    supportsImageSearch: false,
    maxReferenceImages: 3,
    maxCharacterImages: 0,
    maxObjectImages: 3,
    supportedResolutions: ['1K'],
    supportedAspectRatios: STANDARD_ASPECT_RATIOS,
    thinkingLevels: [],
  },
}

export function getModelConfig(modelId: ModelId): ModelConfig {
  return MODELS[modelId]
}

export function getModelIds(): ModelId[] {
  return Object.keys(MODELS) as ModelId[]
}

export function getAspectRatios(modelId: ModelId): AspectRatio[] {
  return MODELS[modelId].supportedAspectRatios
}

export function getResolutions(modelId: ModelId): Resolution[] {
  return MODELS[modelId].supportedResolutions
}
