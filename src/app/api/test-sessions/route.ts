import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Starting test session creation...')
    
    const session = await getServerSession(authOptions)
    console.log('Session:', session ? 'Found' : 'Not found')
    
    if (!session?.user?.id) {
      console.log('❌ No user session found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('✅ User authenticated:', session.user.id)

    const { testType } = await request.json()
    console.log('Test type requested:', testType)

    if (!['FULL_TEST', 'MATH_ONLY', 'READING_ONLY'].includes(testType)) {
      console.log('❌ Invalid test type:', testType)
      return NextResponse.json({ error: 'Invalid test type' }, { status: 400 })
    }

    // Test database connection
    try {
      await prisma.$connect()
      console.log('✅ Database connected')
    } catch (dbError) {
      console.error('❌ Database connection failed:', dbError)
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
    }

    // Check for existing incomplete test session
    console.log('🔍 Checking for existing sessions...')
    const existingSession = await prisma.testSession.findFirst({
      where: {
        userId: session.user.id,
        status: 'IN_PROGRESS'
      }
    })

    if (existingSession) {
      console.log('⚠️ Found existing session:', existingSession.id)
      return NextResponse.json({ 
        error: 'You have an incomplete test session',
        existingSessionId: existingSession.id 
      }, { status: 409 })
    }

    // Create new test session
    console.log('📝 Creating new test session...')
    const testSession = await prisma.testSession.create({
      data: {
        userId: session.user.id,
        testType,
        status: 'IN_PROGRESS',
        currentSection: testType === 'MATH_ONLY' ? 'MATH_MODULE_1' : 'READING_MODULE_1',
        currentQuestion: 0,
      }
    })

    console.log('✅ Test session created:', testSession.id)
    return NextResponse.json({ testSession })
  } catch (error) {
    console.error('❌ Error creating test session:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('🔧 Fetching test sessions...')
    
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      console.log('❌ No user session found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('✅ User authenticated:', session.user.id)

    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    // Test database connection
    try {
      await prisma.$connect()
      console.log('✅ Database connected')
    } catch (dbError) {
      console.error('❌ Database connection failed:', dbError)
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
    }

    if (sessionId) {
      // Get specific test session
      console.log('🔍 Fetching specific session:', sessionId)
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
        console.log('❌ Test session not found:', sessionId)
        return NextResponse.json({ error: 'Test session not found' }, { status: 404 })
      }

      console.log('✅ Test session found')
      return NextResponse.json({ testSession })
    } else {
      // Get all test sessions for user
      console.log('🔍 Fetching all sessions for user')
      const testSessions = await prisma.testSession.findMany({
        where: {
          userId: session.user.id
        },
        orderBy: {
          startTime: 'desc'
        },
        take: 10
      })

      console.log(`✅ Found ${testSessions.length} test sessions`)
      return NextResponse.json({ testSessions })
    }
  } catch (error) {
    console.error('❌ Error fetching test sessions:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
