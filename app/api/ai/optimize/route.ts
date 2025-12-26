import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getAIOptimizationSuggestions } from '@/lib/ai'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { framework, buildCommand, outputDirectory } = await request.json()

    const suggestions = await getAIOptimizationSuggestions(
      framework || 'unknown',
      buildCommand || null,
      outputDirectory || null
    )

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error('Error getting AI optimizations:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

