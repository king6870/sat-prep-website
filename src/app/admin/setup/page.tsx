'use client'

import { useState } from 'react'
import { AlertCircle, Database, CheckCircle, Loader } from 'lucide-react'

export default function DatabaseSetupPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const setupDatabase = async () => {
    try {
      setLoading(true)
      setError('')
      setResult(null)

      const response = await fetch('/api/admin/setup-db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (response.ok) {
        setResult(data)
      } else {
        setError(data.error || 'Setup failed')
        setResult(data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const checkHealth = async () => {
    try {
      setLoading(true)
      setError('')
      setResult(null)

      const response = await fetch('/api/health')
      const data = await response.json()

      setResult(data)
      if (!response.ok) {
        setError(data.error || 'Health check failed')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <Database className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Database Setup
          </h1>
          <p className="text-gray-600">
            Initialize your SAT Prep database with sample questions
          </p>
        </div>

        <div className="card max-w-2xl mx-auto">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={checkHealth}
                disabled={loading}
                className="btn-secondary flex items-center justify-center space-x-2 flex-1"
              >
                {loading ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <span>Check Database Health</span>
              </button>

              <button
                onClick={setupDatabase}
                disabled={loading}
                className="btn-primary flex items-center justify-center space-x-2 flex-1"
              >
                {loading ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <Database className="h-4 w-4" />
                )}
                <span>Setup Database</span>
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-red-900 mb-2">Error</h3>
                    <p className="text-red-800 text-sm">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {result && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-medium text-green-900 mb-2">
                      {result.message || result.status || 'Result'}
                    </h3>
                    
                    {result.stats && (
                      <div className="text-sm space-y-1">
                        <p><strong>Users:</strong> {result.stats.users}</p>
                        <p><strong>Questions:</strong> {result.stats.questions}</p>
                        <p><strong>Test Sessions:</strong> {result.stats.testSessions}</p>
                      </div>
                    )}

                    <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-auto">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
