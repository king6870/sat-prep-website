import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    console.log('🔧 Fetching recent test sessions...')
    
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      console.log('❌ No user session found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('✅ User authenticated:', session.user.id)

    // Test database connection
    try {
      await prisma.$connect()
      console.log('✅ Database connected')
    } catch (dbError) {
      console.error('❌ Database connection failed:', dbError)
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
    }

    const testSessions = await prisma.testSession.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        startTime: 'desc'
      },
      take: 5,
      select: {
        id: true,
        testType: true,
        status: true,
        startTime: true,
        totalScore: true,
        readingScore: true,
        mathScore: true
      }
    })

    console.log(`✅ Found ${testSessions.length} recent test sessions`)
    return NextResponse.json({ testSessions })
  } catch (error) {
    console.error('❌ Error fetching recent test sessions:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
