import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth'
import { checkRateLimit } from './rateLimit'
import { parseAndValidateAIResponse, Schemas } from './aiWrapper'

type Handler = (opts: { session: any; body: any; rawAIResult?: any }) => Promise<Response | NextResponse>

export async function protectAIEndpoint(request: Request, options: {
  bodySchema?: z.ZodTypeAny
  aiSchema?: z.ZodTypeAny
  handler: Handler
}) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json().catch(() => ({}))
    if (options.bodySchema) {
      const parsed = options.bodySchema.safeParse(body)
      if (!parsed.success) return NextResponse.json({ error: 'Invalid request body', details: parsed.error.flatten() }, { status: 400 })
      // replace body with parsed data
      Object.assign(body, parsed.data)
    }

    const rl = checkRateLimit(session.user.id)
    if (!rl.ok) return NextResponse.json({ error: 'Rate limit exceeded', remaining: rl.remaining }, { status: 429 })

    const result = await options.handler({ session, body })

    // if handler produced a raw AI payload to validate, attempt validation
    if (options.aiSchema && (result as any)?.ok !== false) {
      // handlers should return NextResponse or Response with JSON body
      const json = await (result as Response).json().catch(() => null)
      if (json && json.__rawAI) {
        try {
          const validated = await parseAndValidateAIResponse(json.__rawAI, options.aiSchema)
          return NextResponse.json(validated)
        } catch (err) {
          console.error('AI response validation failed (middleware):', err)
          return NextResponse.json({ error: 'AI response validation failed' }, { status: 502 })
        }
      }
    }

    return result
  } catch (err) {
    console.error('protectAIEndpoint error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export const CommonSchemas = Schemas
