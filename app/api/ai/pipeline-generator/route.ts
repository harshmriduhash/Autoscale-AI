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
  repoStructure: z.any().optional(),
  framework: z.string().optional(),
  dependencies: z.array(z.string()).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const parsedBody = BodySchema.safeParse(body)
    if (!parsedBody.success) {
      return NextResponse.json({ error: 'Invalid request body', details: parsedBody.error.flatten() }, { status: 400 })
    }
    const { repoStructure, framework, dependencies } = parsedBody.data

    // Rate limit per user
    const rl = checkRateLimit(session.user.id)
    if (!rl.ok) return NextResponse.json({ error: 'Rate limit exceeded', remaining: rl.remaining }, { status: 429 })

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        config: {
          build: 'npm run build',
          install: 'npm install',
          cache: ['node_modules', '.next'],
        },
        githubActions: '',
        vercelConfig: '',
      })
    }

    const prompt = `Generate an optimized CI/CD pipeline configuration for this project:

Framework: ${framework}
Dependencies: ${JSON.stringify(dependencies || [])}
Repo Structure: ${JSON.stringify(repoStructure || {})}

Provide JSON response:
{
  "config": {
    "build": "build command",
    "install": "install command",
    "cache": ["paths to cache"],
    "test": "test command"
  },
  "githubActions": "YAML workflow content",
  "vercelConfig": "vercel.json content",
  "optimizations": ["optimization suggestions"]
}`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a CI/CD expert. Generate optimized pipeline configurations.',
        },
        { role: 'user', content: prompt },
      ],
      max_tokens: 1500,
      temperature: 0.3,
      response_format: { type: 'json_object' },
    })

    try {
      const validated = await parseAndValidateAIResponse(completion.choices[0]?.message?.content || '{}', Schemas.pipeline)
      return NextResponse.json(validated)
    } catch (err) {
      console.error('AI response validation failed:', err)
      return NextResponse.json({ error: 'AI response validation failed' }, { status: 502 })
    }
  } catch (error) {
    console.error('Error generating pipeline:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

