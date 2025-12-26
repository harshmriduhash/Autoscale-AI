import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { simulateLoadAndPredict } from '@/lib/ai-advanced'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { endpoints, currentTraffic } = await request.json()

    const simulation = await simulateLoadAndPredict(endpoints || [], currentTraffic || 0)

    return NextResponse.json(simulation)
  } catch (error) {
    console.error('Error in load simulation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

