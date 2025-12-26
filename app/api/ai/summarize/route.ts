import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { summarizeLogs } from '@/lib/ai'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { deploymentId } = await request.json()

    if (!deploymentId) {
      return NextResponse.json({ error: 'Deployment ID is required' }, { status: 400 })
    }

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
        timestamp: true,
      },
    })

    const summary = await summarizeLogs(logs)

    return NextResponse.json({ summary })
  } catch (error) {
    console.error('Error summarizing logs:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

