import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { simulateDeployment } from '@/lib/deployments'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')

    const where: any = {
      project: {
        userId: session.user.id,
      },
    }

    if (projectId) {
      where.projectId = projectId
    }

    const deployments = await prisma.deployment.findMany({
      where,
      include: {
        project: {
          select: {
            name: true,
            framework: true,
          },
        },
        _count: {
          select: { logs: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    return NextResponse.json(deployments)
  } catch (error) {
    console.error('Error fetching deployments:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { projectId } = await request.json()

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 })
    }

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: session.user.id,
      },
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Get latest deployment version
    const latestDeployment = await prisma.deployment.findFirst({
      where: { projectId },
      orderBy: { version: 'desc' },
    })

    const nextVersion = latestDeployment ? latestDeployment.version + 1 : 1

    // Create deployment record first
    const deployment = await prisma.deployment.create({
      data: {
        projectId,
        status: 'pending',
        version: nextVersion,
      },
      include: {
        project: {
          select: {
            name: true,
            framework: true,
          },
        },
      },
    })

    // Start deployment simulation in background (don't await)
    simulateDeployment(
      projectId,
      project.name,
      project.framework,
      project.buildCommand,
      project.outputDirectory
    ).then(async (deploymentId) => {
      // Update version after deployment starts
      await prisma.deployment.update({
        where: { id: deploymentId },
        data: { version: nextVersion },
      })
    }).catch((error) => {
      console.error('Deployment simulation error:', error)
      // Update deployment status to failed
      prisma.deployment.update({
        where: { id: deployment.id },
        data: {
          status: 'failed',
          errorMessage: error.message || 'Deployment failed',
        },
      })
    })

    return NextResponse.json(deployment, { status: 201 })
  } catch (error) {
    console.error('Error creating deployment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

