import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect()
    
    // Get basic stats
    const userCount = await prisma.user.count()
    const questionCount = await prisma.question.count()
    const sessionCount = await prisma.testSession.count()
    
    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      stats: {
        users: userCount,
        questions: questionCount,
        testSessions: sessionCount
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Health check failed:', error)
    return NextResponse.json({
      status: 'unhealthy',
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
