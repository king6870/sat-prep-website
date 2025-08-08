'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BookOpen, Calculator, Clock, Target, TrendingUp, Users } from 'lucide-react'
import SignInButton from '@/components/auth/SignInButton'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [recentTests, setRecentTests] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (session?.user) {
      fetchRecentTests()
    }
  }, [session])

  const fetchRecentTests = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/test-sessions/recent')
      if (response.ok) {
        const data = await response.json()
        setRecentTests(data.testSessions || [])
      }
    } catch (error) {
      console.error('Error fetching recent tests:', error)
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Target className="h-8 w-8 text-primary-600" />
              <h1 className="text-2xl font-bold text-gray-900">SAT Prep Master</h1>
            </div>
            <div className="flex items-center space-x-4">
              {session?.user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    Welcome, {session.user.name?.split(' ')[0]}!
                  </span>
                  <Link
                    href="/dashboard"
                    className="btn-primary"
                  >
                    Dashboard
                  </Link>
                </div>
              ) : (
                <SignInButton />
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {session?.user ? (
          /* Authenticated User Dashboard */
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Ready to Master the SAT?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Take adaptive practice tests that adjust to your performance, 
                get detailed analytics, and improve your score with personalized recommendations.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-6">
              <Link
                href="/test/start"
                className="card hover:shadow-lg transition-shadow duration-200 group"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-primary-100 rounded-lg group-hover:bg-primary-200 transition-colors">
                    <BookOpen className="h-8 w-8 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Full Practice Test</h3>
                    <p className="text-gray-600">Complete adaptive SAT with both sections</p>
                    <p className="text-sm text-gray-500 mt-1">~2.5 hours • 98 questions</p>
                  </div>
                </div>
              </Link>

              <Link
                href="/test/start?type=reading"
                className="card hover:shadow-lg transition-shadow duration-200 group"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                    <BookOpen className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Reading Only</h3>
                    <p className="text-gray-600">Focus on reading comprehension</p>
                    <p className="text-sm text-gray-500 mt-1">64 minutes • 54 questions</p>
                  </div>
                </div>
              </Link>

              <Link
                href="/test/start?type=math"
                className="card hover:shadow-lg transition-shadow duration-200 group"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                    <Calculator className="h-8 w-8 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Math Only</h3>
                    <p className="text-gray-600">Practice mathematical reasoning</p>
                    <p className="text-sm text-gray-500 mt-1">70 minutes • 44 questions</p>
                  </div>
                </div>
              </Link>
            </div>

            {/* Recent Tests */}
            {recentTests.length > 0 && (
              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Practice Tests</h3>
                <div className="space-y-3">
                  {recentTests.slice(0, 3).map((test: any) => (
                    <div key={test.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">
                          {test.testType === 'FULL_TEST' ? 'Full Practice Test' : 
                           test.testType === 'READING_ONLY' ? 'Reading Practice' : 'Math Practice'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(test.startTime).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        {test.totalScore && (
                          <p className="font-semibold text-primary-600">
                            {test.totalScore}/1600
                          </p>
                        )}
                        <p className="text-sm text-gray-600 capitalize">
                          {test.status.toLowerCase()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link
                  href="/dashboard/history"
                  className="inline-block mt-4 text-primary-600 hover:text-primary-700 font-medium"
                >
                  View all tests →
                </Link>
              </div>
            )}

            {/* Features Overview */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="p-3 bg-blue-100 rounded-lg w-fit mx-auto mb-3">
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Adaptive Testing</h4>
                <p className="text-sm text-gray-600">
                  Questions adjust based on your performance in Module 1
                </p>
              </div>

              <div className="text-center">
                <div className="p-3 bg-green-100 rounded-lg w-fit mx-auto mb-3">
                  <Clock className="h-8 w-8 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Real Timing</h4>
                <p className="text-sm text-gray-600">
                  Authentic SAT timing with 10-minute break between sections
                </p>
              </div>

              <div className="text-center">
                <div className="p-3 bg-purple-100 rounded-lg w-fit mx-auto mb-3">
                  <Target className="h-8 w-8 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Detailed Analytics</h4>
                <p className="text-sm text-gray-600">
                  Track performance by category and get improvement suggestions
                </p>
              </div>

              <div className="text-center">
                <div className="p-3 bg-orange-100 rounded-lg w-fit mx-auto mb-3">
                  <Users className="h-8 w-8 text-orange-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Score Prediction</h4>
                <p className="text-sm text-gray-600">
                  Get accurate score predictions out of 1600 points
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Landing Page for Non-Authenticated Users */
          <div className="space-y-16">
            {/* Hero Section */}
            <div className="text-center">
              <h2 className="text-5xl font-bold text-gray-900 mb-6">
                Master the Digital SAT
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Experience the most realistic SAT practice with adaptive testing, 
                detailed analytics, and personalized study recommendations. 
                Improve your score with AI-powered insights.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <SignInButton className="btn-primary text-lg px-8 py-3" />
                <Link
                  href="#features"
                  className="btn-secondary text-lg px-8 py-3"
                >
                  Learn More
                </Link>
              </div>
            </div>

            {/* Features Section */}
            <div id="features" className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="card text-center">
                <div className="p-4 bg-primary-100 rounded-lg w-fit mx-auto mb-4">
                  <BookOpen className="h-12 w-12 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Adaptive Testing</h3>
                <p className="text-gray-600">
                  Experience the real Digital SAT format with adaptive modules that 
                  adjust difficulty based on your Module 1 performance.
                </p>
              </div>

              <div className="card text-center">
                <div className="p-4 bg-green-100 rounded-lg w-fit mx-auto mb-4">
                  <TrendingUp className="h-12 w-12 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Detailed Analytics</h3>
                <p className="text-gray-600">
                  Get comprehensive performance breakdowns by category, 
                  time analysis, and personalized improvement recommendations.
                </p>
              </div>

              <div className="card text-center">
                <div className="p-4 bg-purple-100 rounded-lg w-fit mx-auto mb-4">
                  <Clock className="h-12 w-12 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Authentic Timing</h3>
                <p className="text-gray-600">
                  Practice with real SAT timing: 64 minutes for Reading, 
                  70 minutes for Math, with a 10-minute break between sections.
                </p>
              </div>

              <div className="card text-center">
                <div className="p-4 bg-orange-100 rounded-lg w-fit mx-auto mb-4">
                  <Target className="h-12 w-12 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Score Prediction</h3>
                <p className="text-gray-600">
                  Get accurate score predictions out of 1600 points with 
                  detailed breakdowns for Reading and Math sections.
                </p>
              </div>

              <div className="card text-center">
                <div className="p-4 bg-blue-100 rounded-lg w-fit mx-auto mb-4">
                  <Calculator className="h-12 w-12 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Complete Coverage</h3>
                <p className="text-gray-600">
                  Practice all SAT topics: Algebra, Advanced Math, Problem Solving, 
                  Geometry, Reading Comprehension, and Writing & Language.
                </p>
              </div>

              <div className="card text-center">
                <div className="p-4 bg-red-100 rounded-lg w-fit mx-auto mb-4">
                  <Users className="h-12 w-12 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Progress Tracking</h3>
                <p className="text-gray-600">
                  Monitor your improvement over time with detailed test history 
                  and performance trends across all practice sessions.
                </p>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center bg-primary-600 text-white rounded-2xl p-12">
              <h3 className="text-3xl font-bold mb-4">
                Ready to Improve Your SAT Score?
              </h3>
              <p className="text-xl mb-8 text-primary-100">
                Join thousands of students who have improved their scores with our adaptive practice tests.
              </p>
              <SignInButton className="bg-white text-primary-600 hover:bg-gray-100 font-semibold px-8 py-3 rounded-lg text-lg" />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Target className="h-6 w-6" />
              <span className="text-xl font-bold">SAT Prep Master</span>
            </div>
            <p className="text-gray-400 mb-4">
              The most comprehensive and realistic Digital SAT practice platform.
            </p>
            <p className="text-sm text-gray-500">
              © 2024 SAT Prep Master. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
