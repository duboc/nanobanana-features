import { describe, it, expect } from 'vitest'
import { STYLE_TEMPLATES } from '../style-templates'

describe('style-templates', () => {
  it('has at least 8 templates', () => {
    expect(STYLE_TEMPLATES.length).toBeGreaterThanOrEqual(8)
  })

  it('each template has all required fields', () => {
    for (const template of STYLE_TEMPLATES) {
      expect(template.id).toBeTruthy()
      expect(template.name).toBeTruthy()
      expect(template.category).toBeTruthy()
      expect(template.description).toBeTruthy()
      expect(template.promptTemplate).toBeTruthy()
      expect(template.examplePrompt).toBeTruthy()
      expect(template.icon).toBeTruthy()
    }
  })

  it('has unique IDs', () => {
    const ids = STYLE_TEMPLATES.map(t => t.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('covers all expected categories', () => {
    const categories = new Set(STYLE_TEMPLATES.map(t => t.category))
    expect(categories).toContain('photorealistic')
    expect(categories).toContain('illustration')
    expect(categories).toContain('text-rendering')
    expect(categories).toContain('product')
    expect(categories).toContain('minimalist')
    expect(categories).toContain('sequential')
    expect(categories).toContain('search-grounded')
  })

  it('example prompts are non-trivial (>50 chars)', () => {
    for (const template of STYLE_TEMPLATES) {
      expect(template.examplePrompt.length).toBeGreaterThan(50)
    }
  })
})
