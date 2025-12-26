import { describe, it, expect } from 'vitest'
import { parseAndValidateAIResponse } from '@/lib/aiWrapper'
import { Schemas } from '@/lib/aiWrapper'

describe('aiWrapper', () => {
  it('parses valid JSON string and validates against schema', async () => {
    const raw = JSON.stringify({ refactoredCode: 'x', changes: ['c'], improvements: [], explanation: 'e' })
    const parsed = await parseAndValidateAIResponse(raw, Schemas.refactor)
    expect(parsed.refactoredCode).toBe('x')
  })

  it('throws for invalid payload', async () => {
    await expect(parseAndValidateAIResponse('{bad json', Schemas.refactor)).rejects.toBeDefined()
  })
})
