import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const deployment = await prisma.deployment.findFirst({
      where: {
        id: params.id,
        project: {
          userId: session.user.id,
        },
      },
      include: {
        project: {
          select: {
            name: true,
            framework: true,
            buildCommand: true,
            outputDirectory: true,
          },
        },
        logs: {
          orderBy: { timestamp: 'asc' },
        },
      },
    })

    if (!deployment) {
      return NextResponse.json({ error: 'Deployment not found' }, { status: 404 })
    }

    return NextResponse.json(deployment)
  } catch (error) {
    console.error('Error fetching deployment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { action } = await request.json()

    const deployment = await prisma.deployment.findFirst({
      where: {
        id: params.id,
        project: {
          userId: session.user.id,
        },
      },
      include: {
        project: true,
      },
    })

    if (!deployment) {
      return NextResponse.json({ error: 'Deployment not found' }, { status: 404 })
    }

    if (action === 'rollback') {
      // Find previous successful deployment
      const previousDeployment = await prisma.deployment.findFirst({
        where: {
          projectId: deployment.projectId,
          id: { not: deployment.id },
          status: 'success',
        },
        orderBy: { createdAt: 'desc' },
      })

      if (!previousDeployment) {
        return NextResponse.json(
          { error: 'No previous deployment found to rollback to' },
          { status: 400 }
        )
      }

      // Create new deployment with previous version's config
      const rollbackDeployment = await prisma.deployment.create({
        data: {
          projectId: deployment.projectId,
          status: 'success',
          url: previousDeployment.url,
          version: deployment.version + 1,
        },
      })

      return NextResponse.json(rollbackDeployment)
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error processing deployment action:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

