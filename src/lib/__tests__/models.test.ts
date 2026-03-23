import { describe, it, expect } from 'vitest'
import {
  MODELS,
  getModelConfig,
  getModelIds,
  getAspectRatios,
  getResolutions,
  ALL_ASPECT_RATIOS,
  FLASH_31_ASPECT_RATIOS,
} from '../models'
import type { ModelId } from '@/types'

describe('models', () => {
  describe('MODELS', () => {
    it('has three model configurations', () => {
      expect(Object.keys(MODELS)).toHaveLength(3)
    })

    it('includes all expected model IDs', () => {
      expect(MODELS['gemini-3.1-flash-image-preview']).toBeDefined()
      expect(MODELS['gemini-3-pro-image-preview']).toBeDefined()
      expect(MODELS['gemini-2.5-flash-image']).toBeDefined()
    })
  })

  describe('getModelConfig', () => {
    it('returns correct config for gemini-3.1-flash-image-preview', () => {
      const config = getModelConfig('gemini-3.1-flash-image-preview')
      expect(config.name).toBe('Nano Banana 2')
      expect(config.supportsSearchGrounding).toBe(true)
      expect(config.supportsImageSearch).toBe(true)
      expect(config.maxReferenceImages).toBe(14)
      expect(config.supportedResolutions).toContain('512')
      expect(config.supportedResolutions).toContain('4K')
      expect(config.thinkingLevels).toEqual(['minimal', 'high'])
    })

    it('returns correct config for gemini-3-pro-image-preview', () => {
      const config = getModelConfig('gemini-3-pro-image-preview')
      expect(config.name).toBe('Nano Banana Pro')
      expect(config.supportsSearchGrounding).toBe(true)
      expect(config.supportsImageSearch).toBe(false)
      expect(config.maxReferenceImages).toBe(11)
      expect(config.supportedResolutions).not.toContain('512')
    })

    it('returns correct config for gemini-2.5-flash-image', () => {
      const config = getModelConfig('gemini-2.5-flash-image')
      expect(config.name).toBe('Nano Banana')
      expect(config.supportsSearchGrounding).toBe(false)
      expect(config.supportedResolutions).toEqual(['1K'])
    })
  })

  describe('getModelIds', () => {
    it('returns all model IDs', () => {
      const ids = getModelIds()
      expect(ids).toHaveLength(3)
      expect(ids).toContain('gemini-3.1-flash-image-preview')
    })
  })

  describe('getAspectRatios', () => {
    it('returns extended ratios for flash 3.1', () => {
      const ratios = getAspectRatios('gemini-3.1-flash-image-preview')
      expect(ratios).toContain('1:4')
      expect(ratios).toContain('4:1')
      expect(ratios).toContain('1:8')
      expect(ratios).toContain('8:1')
    })

    it('returns standard ratios for gemini-2.5-flash-image', () => {
      const ratios = getAspectRatios('gemini-2.5-flash-image')
      expect(ratios).not.toContain('1:4')
      expect(ratios).toContain('1:1')
      expect(ratios).toContain('16:9')
    })
  })

  describe('getResolutions', () => {
    it('returns all resolutions for flash 3.1', () => {
      const resolutions = getResolutions('gemini-3.1-flash-image-preview')
      expect(resolutions).toEqual(['512', '1K', '2K', '4K'])
    })

    it('returns only 1K for gemini-2.5-flash-image', () => {
      const resolutions = getResolutions('gemini-2.5-flash-image')
      expect(resolutions).toEqual(['1K'])
    })

    it('returns 1K-4K for pro', () => {
      const resolutions = getResolutions('gemini-3-pro-image-preview')
      expect(resolutions).toEqual(['1K', '2K', '4K'])
    })
  })

  describe('aspect ratio sets', () => {
    it('ALL_ASPECT_RATIOS includes all 14 options', () => {
      expect(ALL_ASPECT_RATIOS).toHaveLength(14)
    })

    it('FLASH_31_ASPECT_RATIOS equals ALL_ASPECT_RATIOS', () => {
      expect(FLASH_31_ASPECT_RATIOS).toEqual(ALL_ASPECT_RATIOS)
    })
  })
})
