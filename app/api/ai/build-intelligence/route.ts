import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { analyzeBuildIntelligence } from '@/lib/ai-advanced'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { projectId, buildHistory, currentChanges } = await request.json()

    const analysis = await analyzeBuildIntelligence(projectId, buildHistory || [], currentChanges || [])

    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Error analyzing build intelligence:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

