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
  codebase: z.any().optional(),
  projectName: z.string().optional(),
})

export async function POST(request: NextRequest) {
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
    const { codebase, projectName } = parsed.data

    const rl = checkRateLimit(session.user.id)
    if (!rl.ok) return NextResponse.json({ error: 'Rate limit exceeded', remaining: rl.remaining }, { status: 429 })

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        apiDocs: 'API documentation will be generated',
        architecture: 'Architecture diagram description',
        readme: '# Project Documentation',
      })
    }

    const prompt = `Generate comprehensive documentation for this project:

Project Name: ${projectName}
Codebase Summary: ${JSON.stringify(codebase || {})}

Provide JSON response:
{
  "apiDocs": "API documentation in markdown",
  "architecture": "Architecture description and diagram text",
  "readme": "README.md content",
  "erd": "Database schema description",
  "deploymentGuide": "Deployment instructions"
}`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a technical documentation expert. Generate comprehensive, clear documentation.',
        },
        { role: 'user', content: prompt },
      ],
      max_tokens: 2000,
      temperature: 0.4,
      response_format: { type: 'json_object' },
    })

    try {
      const validated = await parseAndValidateAIResponse(completion.choices[0]?.message?.content || '{}', Schemas.docs)
      return NextResponse.json(validated)
    } catch (err) {
      console.error('AI response validation failed:', err)
      return NextResponse.json({ error: 'AI response validation failed' }, { status: 502 })
    }
  } catch (error) {
    console.error('Error generating docs:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

