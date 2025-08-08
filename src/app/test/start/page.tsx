'use client'

import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { BookOpen, Calculator, Clock, AlertCircle, Target } from 'lucide-react'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { TEST_CONFIG } from '@/lib/constants'
import { formatTime } from '@/lib/utils'

export default function TestStartPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const testType = searchParams.get('type') || 'full'

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  const getTestConfig = () => {
    switch (testType) {
      case 'reading':
        return {
          type: 'READING_ONLY',
          title: 'Reading Practice Test',
          description: 'Focus on reading comprehension and analysis',
          sections: ['Reading (64 minutes, 54 questions)'],
          totalTime: TEST_CONFIG.reading.totalTime,
          icon: BookOpen,
          color: 'green'
        }
      case 'math':
        return {
          type: 'MATH_ONLY',
          title: 'Math Practice Test',
          description: 'Practice mathematical reasoning and problem solving',
          sections: ['Math (70 minutes, 44 questions)'],
          totalTime: TEST_CONFIG.math.totalTime,
          icon: Calculator,
          color: 'purple'
        }
      default:
        return {
          type: 'FULL_TEST',
          title: 'Full SAT Practice Test',
          description: 'Complete adaptive SAT with both Reading and Math sections',
          sections: [
            'Reading (64 minutes, 54 questions)',
            '10-minute break',
            'Math (70 minutes, 44 questions)'
          ],
          totalTime: TEST_CONFIG.reading.totalTime + TEST_CONFIG.breakTime + TEST_CONFIG.math.totalTime,
          icon: Target,
          color: 'blue'
        }
    }
  }

  const config = getTestConfig()
  const IconComponent = config.icon

  const startTest = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await fetch('/api/test-sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testType: config.type
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 409) {
          // Existing incomplete session
          const continueTest = confirm(
            'You have an incomplete test session. Would you like to continue it?'
          )
          if (continueTest) {
            router.push(`/test/${data.existingSessionId}`)
            return
          } else {
            setError('Please complete or abandon your existing test session first.')
            return
          }
        }
        throw new Error(data.error || 'Failed to start test')
      }

      // Redirect to test interface
      router.push(`/test/${data.testSession.id}`)
    } catch (error) {
      console.error('Error starting test:', error)
      setError(error instanceof Error ? error.message : 'Failed to start test')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!session?.user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className={`p-4 bg-${config.color}-100 rounded-lg w-fit mx-auto mb-4`}>
            <IconComponent className={`h-16 w-16 text-${config.color}-600`} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {config.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {config.description}
          </p>
        </div>

        <div className="card max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Test Overview</h2>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-gray-500" />
              <span className="text-gray-700">
                Total Time: <strong>{formatTime(config.totalTime)}</strong>
              </span>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">Test Sections:</h3>
              <ul className="space-y-1 ml-6">
                {config.sections.map((section, index) => (
                  <li key={index} className="text-gray-700 list-disc">
                    {section}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-900 mb-2">Important Information</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• This test uses adaptive modules - Module 2 difficulty adjusts based on Module 1 performance</li>
                  <li>• You cannot go back to previous questions once submitted</li>
                  <li>• Your progress will be automatically saved</li>
                  <li>• Make sure you have a stable internet connection</li>
                  <li>• Find a quiet environment free from distractions</li>
                </ul>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <span className="text-red-800">{error}</span>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => router.back()}
              className="btn-secondary flex-1"
              disabled={loading}
            >
              Back
            </button>
            <button
              onClick={startTest}
              disabled={loading}
              className="btn-primary flex-1 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Starting Test...</span>
                </>
              ) : (
                <>
                  <IconComponent className="h-5 w-5" />
                  <span>Start Test</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Need help? Contact support or review our test-taking tips before starting.
          </p>
        </div>
      </div>
    </div>
  )
}
