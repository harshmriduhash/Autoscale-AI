import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { diagnoseAndFixError } from '@/lib/ai-advanced'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { errorLog, codeContext } = await request.json()

    if (!errorLog) {
      return NextResponse.json({ error: 'Error log is required' }, { status: 400 })
    }

    const diagnosis = await diagnoseAndFixError(errorLog, codeContext || '')

    return NextResponse.json(diagnosis)
  } catch (error) {
    console.error('Error in self-healing:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

