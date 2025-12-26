import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { analyzeLogsForErrors } from '@/lib/ai'
import { z } from 'zod'

const BodySchema = z.object({
  deploymentId: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const parsed = BodySchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request body', details: parsed.error.flatten() }, { status: 400 })
    }
    const { deploymentId } = parsed.data

    const deployment = await prisma.deployment.findFirst({
      where: {
        id: deploymentId,
        project: {
          userId: session.user.id,
        },
      },
    })

    if (!deployment) {
      return NextResponse.json({ error: 'Deployment not found' }, { status: 404 })
    }

    const logs = await prisma.log.findMany({
      where: { deploymentId },
      orderBy: { timestamp: 'asc' },
      select: {
        level: true,
        message: true,
      },
    })

    const analysis = await analyzeLogsForErrors(logs)

    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Error analyzing logs:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

