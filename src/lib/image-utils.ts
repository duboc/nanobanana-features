const VALID_IMAGE_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/webp',
])

export function base64ToDataUrl(base64: string, mimeType: string): string {
  return `data:${mimeType};base64,${base64}`
}

export function detectMimeType(base64: string): string {
  if (base64.startsWith('iVBOR')) return 'image/png'
  if (base64.startsWith('/9j/')) return 'image/jpeg'
  if (base64.startsWith('R0lG')) return 'image/gif'
  if (base64.startsWith('UklGR')) return 'image/webp'
  return 'image/png'
}

export function validateImageFile(mimeType: string): boolean {
  return VALID_IMAGE_TYPES.has(mimeType)
}
