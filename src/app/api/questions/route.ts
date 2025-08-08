import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { selectQuestionsByDifficulty } from '@/lib/utils'
import { DIFFICULTY_ADJUSTMENTS } from '@/lib/constants'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const subject = searchParams.get('subject') as 'math' | 'reading'
    const module = searchParams.get('module') as string
    const sessionId = searchParams.get('sessionId') as string
    const count = parseInt(searchParams.get('count') || '27')

    if (!subject || !module || !sessionId) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    // Get test session to determine performance level for Module 2
    const testSession = await prisma.testSession.findUnique({
      where: {
        id: sessionId,
        userId: session.user.id
      }
    })

    if (!testSession) {
      return NextResponse.json({ error: 'Test session not found' }, { status: 404 })
    }

    let difficultyConfig = DIFFICULTY_ADJUSTMENTS.MEDIUM_PERFORMANCE // Default for Module 1

    // For Module 2, adjust difficulty based on Module 1 performance
    if (module.includes('MODULE_2')) {
      const performanceField = subject === 'reading' ? 'readingModule1Performance' : 'mathModule1Performance'
      const performance = testSession[performanceField as keyof typeof testSession] as string

      if (performance === 'HIGH') {
        difficultyConfig = DIFFICULTY_ADJUSTMENTS.HIGH_PERFORMANCE
      } else if (performance === 'LOW') {
        difficultyConfig = DIFFICULTY_ADJUSTMENTS.LOW_PERFORMANCE
      }
    }

    // Get all questions for the subject
    const allQuestions = await prisma.question.findMany({
      where: {
        subject: subject
      }
    })

    // Select questions based on difficulty configuration
    const selectedQuestions = selectQuestionsByDifficulty(
      allQuestions,
      count,
      difficultyConfig.minDifficulty,
      difficultyConfig.maxDifficulty,
      difficultyConfig.averageDifficulty
    )

    return NextResponse.json({ questions: selectedQuestions })
  } catch (error) {
    console.error('Error fetching questions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
