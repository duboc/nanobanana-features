import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the gemini module before importing routes
vi.mock('@/lib/gemini', () => ({
  generateImage: vi.fn(),
  editImage: vi.fn(),
  chatGenerate: vi.fn(),
  generateWithReferences: vi.fn(),
  searchGroundedGenerate: vi.fn(),
}))

import { generateImage, editImage, chatGenerate, generateWithReferences, searchGroundedGenerate } from '@/lib/gemini'
import { POST as generateRoute } from '../generate/route'
import { POST as editRoute } from '../edit/route'
import { POST as chatRoute } from '../chat/route'
import { POST as referenceRoute } from '../reference/route'
import { POST as searchRoute } from '../search-grounded/route'
import { NextRequest } from 'next/server'

function makeRequest(body: Record<string, unknown>): NextRequest {
  return new NextRequest('http://localhost:3000/api/test', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

const mockResponse = {
  images: [{ base64: 'abc123', mimeType: 'image/png' }],
  text: 'Generated!',
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('POST /api/generate', () => {
  it('returns 400 when prompt is missing', async () => {
    const req = makeRequest({ model: 'gemini-3.1-flash-image-preview' })
    const res = await generateRoute(req)
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toContain('required')
  })

  it('returns 400 when model is missing', async () => {
    const req = makeRequest({ prompt: 'A cat' })
    const res = await generateRoute(req)
    expect(res.status).toBe(400)
  })

  it('calls generateImage and returns result', async () => {
    vi.mocked(generateImage).mockResolvedValue(mockResponse)
    const req = makeRequest({
      prompt: 'A cat',
      model: 'gemini-3.1-flash-image-preview',
      aspectRatio: '16:9',
      resolution: '2K',
    })
    const res = await generateRoute(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.images).toHaveLength(1)
    expect(generateImage).toHaveBeenCalledWith('A cat', 'gemini-3.1-flash-image-preview', {
      aspectRatio: '16:9',
      resolution: '2K',
      thinkingLevel: undefined,
      includeThoughts: undefined,
      enableSearchGrounding: undefined,
      enableImageSearch: undefined,
    })
  })

  it('returns 500 when generation fails', async () => {
    vi.mocked(generateImage).mockRejectedValue(new Error('API error'))
    const req = makeRequest({
      prompt: 'A cat',
      model: 'gemini-3.1-flash-image-preview',
    })
    const res = await generateRoute(req)
    expect(res.status).toBe(500)
    const data = await res.json()
    expect(data.error).toBe('API error')
  })
})

describe('POST /api/edit', () => {
  it('returns 400 when image is missing', async () => {
    const req = makeRequest({
      prompt: 'Make it blue',
      model: 'gemini-3.1-flash-image-preview',
    })
    const res = await editRoute(req)
    expect(res.status).toBe(400)
  })

  it('calls editImage with correct params', async () => {
    vi.mocked(editImage).mockResolvedValue(mockResponse)
    const req = makeRequest({
      prompt: 'Make it blue',
      model: 'gemini-3.1-flash-image-preview',
      image: { base64: 'img123', mimeType: 'image/png' },
    })
    const res = await editRoute(req)
    expect(res.status).toBe(200)
    expect(editImage).toHaveBeenCalledWith(
      'Make it blue',
      { base64: 'img123', mimeType: 'image/png' },
      'gemini-3.1-flash-image-preview',
      { aspectRatio: undefined, resolution: undefined }
    )
  })
})

describe('POST /api/chat', () => {
  it('returns 400 when message is missing', async () => {
    const req = makeRequest({ model: 'gemini-3.1-flash-image-preview' })
    const res = await chatRoute(req)
    expect(res.status).toBe(400)
  })

  it('calls chatGenerate with history', async () => {
    vi.mocked(chatGenerate).mockResolvedValue(mockResponse)
    const history = [{ role: 'user' as const, parts: [{ text: 'Hi' }] }]
    const req = makeRequest({
      message: 'Make it bigger',
      model: 'gemini-3.1-flash-image-preview',
      history,
    })
    const res = await chatRoute(req)
    expect(res.status).toBe(200)
    expect(chatGenerate).toHaveBeenCalledWith(
      'Make it bigger',
      history,
      'gemini-3.1-flash-image-preview',
      { aspectRatio: undefined, resolution: undefined, image: undefined }
    )
  })
})

describe('POST /api/reference', () => {
  it('returns 400 when images are missing', async () => {
    const req = makeRequest({
      prompt: 'Combine them',
      model: 'gemini-3.1-flash-image-preview',
    })
    const res = await referenceRoute(req)
    expect(res.status).toBe(400)
  })

  it('calls generateWithReferences', async () => {
    vi.mocked(generateWithReferences).mockResolvedValue(mockResponse)
    const images = [{ base64: 'a', mimeType: 'image/png' }, { base64: 'b', mimeType: 'image/jpeg' }]
    const req = makeRequest({
      prompt: 'Combine them',
      model: 'gemini-3.1-flash-image-preview',
      images,
    })
    const res = await referenceRoute(req)
    expect(res.status).toBe(200)
    expect(generateWithReferences).toHaveBeenCalled()
  })
})

describe('POST /api/search-grounded', () => {
  it('returns 400 when prompt is missing', async () => {
    const req = makeRequest({ model: 'gemini-3.1-flash-image-preview' })
    const res = await searchRoute(req)
    expect(res.status).toBe(400)
  })

  it('calls searchGroundedGenerate', async () => {
    vi.mocked(searchGroundedGenerate).mockResolvedValue(mockResponse)
    const req = makeRequest({
      prompt: 'Current weather',
      model: 'gemini-3.1-flash-image-preview',
    })
    const res = await searchRoute(req)
    expect(res.status).toBe(200)
    expect(searchGroundedGenerate).toHaveBeenCalled()
  })
})
