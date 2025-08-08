import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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

    return NextResponse.json({ testSessions })
  } catch (error) {
    console.error('Error fetching recent test sessions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
