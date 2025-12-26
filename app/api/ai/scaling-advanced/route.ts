import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { predictScalingNeedsAdvanced } from '@/lib/ai-advanced'

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

    // Get historical data
    const deployments = await prisma.deployment.count({
      where: { projectId },
    })

    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const recentDeployments = await prisma.deployment.findMany({
      where: {
        projectId,
        createdAt: { gte: sevenDaysAgo },
      },
      orderBy: { createdAt: 'asc' },
    })

    const historicalData = {
      deployments,
      traffic: recentDeployments.map((d, i) => ({
        timestamp: d.createdAt.toISOString(),
        rps: Math.floor(Math.random() * 1000) + 100, // Mock data
      })),
      errors: recentDeployments
        .filter((d) => d.status === 'failed')
        .map((d) => ({
          timestamp: d.createdAt.toISOString(),
          count: 1,
        })),
    }

    const prediction = await predictScalingNeedsAdvanced(projectId, historicalData)

    return NextResponse.json(prediction)
  } catch (error) {
    console.error('Error in advanced scaling prediction:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

