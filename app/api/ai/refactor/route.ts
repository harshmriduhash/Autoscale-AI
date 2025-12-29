import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import OpenAI from 'openai'
import { z } from 'zod'
import { checkRateLimit } from '@/lib/rateLimit'
import { parseAndValidateAIResponse, Schemas } from '@/lib/aiWrapper'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const BodySchema = z.object({
  code: z.string(),
  targetFramework: z.string().optional(),
  refactorType: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = BodySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request body', details: parsed.error.flatten() }, { status: 400 })
    }
    const { code, targetFramework, refactorType } = parsed.data

    const rl = checkRateLimit(session.user.id)
    if (!rl.ok) return NextResponse.json({ error: 'Rate limit exceeded', remaining: rl.remaining }, { status: 429 })

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        refactoredCode: code,
        changes: ['No refactoring performed'],
        improvements: [],
      })
    }

    const prompt = `Refactor this code${targetFramework ? ` to ${targetFramework}` : ''}${refactorType ? ` with focus on ${refactorType}` : ''}:

Code:
${code}

Provide JSON response:
{
  "refactoredCode": "refactored code",
  "changes": ["list of changes made"],
  "improvements": ["improvements achieved"],
  "explanation": "explanation of refactoring"
}`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are an expert code refactoring engineer. Improve code quality, performance, and maintainability.',
        },
        { role: 'user', content: prompt },
      ],
      max_tokens: 2000,
      temperature: 0.3,
      response_format: { type: 'json_object' },
    })
    try {
      const validated = await parseAndValidateAIResponse(completion.choices[0]?.message?.content || '{}', Schemas.refactor)
      return NextResponse.json(validated)
    } catch (err) {
      console.error('AI response validation failed:', err)
      return NextResponse.json({ error: 'AI response validation failed' }, { status: 502 })
    }
  } catch (error) {
    console.error('Error refactoring code:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
