import { describe, it, expect } from 'vitest'
import { base64ToDataUrl, detectMimeType, validateImageFile } from '../image-utils'

describe('image-utils', () => {
  describe('base64ToDataUrl', () => {
    it('creates a valid data URL from base64 and mime type', () => {
      const result = base64ToDataUrl('abc123', 'image/png')
      expect(result).toBe('data:image/png;base64,abc123')
    })

    it('works with jpeg mime type', () => {
      const result = base64ToDataUrl('xyz', 'image/jpeg')
      expect(result).toBe('data:image/jpeg;base64,xyz')
    })
  })

  describe('detectMimeType', () => {
    it('detects PNG from base64 header', () => {
      // PNG magic bytes: 89 50 4E 47 -> iVBORw in base64
      expect(detectMimeType('iVBORw0KGgo=')).toBe('image/png')
    })

    it('detects JPEG from base64 header', () => {
      // JPEG magic bytes: FF D8 FF -> /9j/ in base64
      expect(detectMimeType('/9j/4AAQ')).toBe('image/jpeg')
    })

    it('detects GIF from base64 header', () => {
      // GIF magic bytes: 47 49 46 -> R0lG in base64
      expect(detectMimeType('R0lGODlh')).toBe('image/gif')
    })

    it('detects WebP from base64 header', () => {
      // WebP: starts with RIFF....WEBP -> UklGR in base64
      expect(detectMimeType('UklGRlYA')).toBe('image/webp')
    })

    it('defaults to image/png for unknown formats', () => {
      expect(detectMimeType('AAAAAAAA')).toBe('image/png')
    })
  })

  describe('validateImageFile', () => {
    it('accepts valid image MIME types', () => {
      expect(validateImageFile('image/png')).toBe(true)
      expect(validateImageFile('image/jpeg')).toBe(true)
      expect(validateImageFile('image/gif')).toBe(true)
      expect(validateImageFile('image/webp')).toBe(true)
    })

    it('rejects non-image MIME types', () => {
      expect(validateImageFile('text/plain')).toBe(false)
      expect(validateImageFile('application/pdf')).toBe(false)
      expect(validateImageFile('video/mp4')).toBe(false)
    })
  })
})
