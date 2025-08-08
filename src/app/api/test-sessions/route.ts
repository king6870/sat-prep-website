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

    const { testType } = await request.json()

    if (!['FULL_TEST', 'MATH_ONLY', 'READING_ONLY'].includes(testType)) {
      return NextResponse.json({ error: 'Invalid test type' }, { status: 400 })
    }

    // Check for existing incomplete test session
    const existingSession = await prisma.testSession.findFirst({
      where: {
        userId: session.user.id,
        status: 'IN_PROGRESS'
      }
    })

    if (existingSession) {
      return NextResponse.json({ 
        error: 'You have an incomplete test session',
        existingSessionId: existingSession.id 
      }, { status: 409 })
    }

    // Create new test session
    const testSession = await prisma.testSession.create({
      data: {
        userId: session.user.id,
        testType,
        status: 'IN_PROGRESS',
        currentSection: testType === 'MATH_ONLY' ? 'MATH_MODULE_1' : 'READING_MODULE_1',
        currentQuestion: 0,
      }
    })

    return NextResponse.json({ testSession })
  } catch (error) {
    console.error('Error creating test session:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    if (sessionId) {
      // Get specific test session
      const testSession = await prisma.testSession.findUnique({
        where: {
          id: sessionId,
          userId: session.user.id
        },
        include: {
          responses: {
            include: {
              question: true
            }
          }
        }
      })

      if (!testSession) {
        return NextResponse.json({ error: 'Test session not found' }, { status: 404 })
      }

      return NextResponse.json({ testSession })
    } else {
      // Get all test sessions for user
      const testSessions = await prisma.testSession.findMany({
        where: {
          userId: session.user.id
        },
        orderBy: {
          startTime: 'desc'
        },
        take: 10
      })

      return NextResponse.json({ testSessions })
    }
  } catch (error) {
    console.error('Error fetching test sessions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
