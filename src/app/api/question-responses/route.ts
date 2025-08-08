import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const {
      testSessionId,
      questionId,
      selectedAnswer,
      timeSpent,
      hintsUsed,
      module,
      questionOrder
    } = await request.json()

    // Verify test session belongs to user
    const testSession = await prisma.testSession.findUnique({
      where: {
        id: testSessionId,
        userId: session.user.id
      }
    })

    if (!testSession) {
      return NextResponse.json({ error: 'Test session not found' }, { status: 404 })
    }

    // Get question to check correct answer
    const question = await prisma.question.findUnique({
      where: { id: questionId }
    })

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 })
    }

    const isCorrect = selectedAnswer === question.correctAnswer

    // Create or update question response
    const response = await prisma.questionResponse.upsert({
      where: {
        testSessionId_questionId: {
          testSessionId,
          questionId
        }
      },
      update: {
        selectedAnswer,
        isCorrect,
        timeSpent,
        hintsUsed
      },
      create: {
        testSessionId,
        questionId,
        selectedAnswer,
        isCorrect,
        timeSpent,
        hintsUsed,
        module,
        questionOrder
      }
    })

    return NextResponse.json({ response })
  } catch (error) {
    console.error('Error saving question response:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
