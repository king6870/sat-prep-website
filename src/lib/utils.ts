import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { PerformanceLevel, CategoryPerformance } from '@/types'
import { PERFORMANCE_THRESHOLDS, SCORE_RANGES } from './constants'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

export function formatTimeShort(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`
  }
  return `${remainingSeconds}s`
}

export function calculatePerformanceLevel(correct: number, total: number): PerformanceLevel {
  if (total === 0) return 'LOW'
  
  const percentage = correct / total
  
  if (percentage >= PERFORMANCE_THRESHOLDS.HIGH) return 'HIGH'
  if (percentage >= PERFORMANCE_THRESHOLDS.MEDIUM) return 'MEDIUM'
  return 'LOW'
}

export function calculateSATScore(correct: number, total: number, isReading: boolean = false): number {
  if (total === 0) return SCORE_RANGES.SECTION_MIN
  
  const percentage = correct / total
  const scoreRange = SCORE_RANGES.SECTION_MAX - SCORE_RANGES.SECTION_MIN
  const rawScore = Math.round(SCORE_RANGES.SECTION_MIN + (percentage * scoreRange))
  
  // Apply slight curve adjustments based on section
  let curveAdjustment = 0
  if (isReading) {
    // Reading tends to have a slightly more generous curve
    curveAdjustment = Math.round(percentage * 20)
  } else {
    // Math curve
    curveAdjustment = Math.round(percentage * 15)
  }
  
  const finalScore = Math.min(SCORE_RANGES.SECTION_MAX, Math.max(SCORE_RANGES.SECTION_MIN, rawScore + curveAdjustment))
  return finalScore
}

export function getScoreColor(score: number, maxScore: number = SCORE_RANGES.SECTION_MAX): string {
  const percentage = score / maxScore
  
  if (percentage >= 0.9) return 'text-green-600'
  if (percentage >= 0.8) return 'text-blue-600'
  if (percentage >= 0.7) return 'text-yellow-600'
  if (percentage >= 0.6) return 'text-orange-600'
  return 'text-red-600'
}

export function getPerformanceColor(level: PerformanceLevel): string {
  switch (level) {
    case 'HIGH': return 'text-green-600 bg-green-50 border-green-200'
    case 'MEDIUM': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    case 'LOW': return 'text-red-600 bg-red-50 border-red-200'
    default: return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function selectQuestionsByDifficulty(
  questions: any[],
  count: number,
  minDifficulty: number,
  maxDifficulty: number,
  averageDifficulty: number
): any[] {
  // Filter questions by difficulty range
  const filteredQuestions = questions.filter(
    q => q.difficulty >= minDifficulty && q.difficulty <= maxDifficulty
  )
  
  if (filteredQuestions.length <= count) {
    return shuffleArray(filteredQuestions)
  }
  
  // Try to get a good distribution around the average difficulty
  const selected: any[] = []
  const shuffled = shuffleArray(filteredQuestions)
  
  // Sort by how close to average difficulty
  shuffled.sort((a, b) => 
    Math.abs(a.difficulty - averageDifficulty) - Math.abs(b.difficulty - averageDifficulty)
  )
  
  return shuffled.slice(0, count)
}

export function calculateCategoryPerformance(responses: any[]): CategoryPerformance[] {
  const categoryStats: Record<string, {
    correct: number
    total: number
    totalTime: number
    totalDifficulty: number
  }> = {}
  
  responses.forEach(response => {
    const key = `${response.question.category}-${response.question.subcategory}`
    
    if (!categoryStats[key]) {
      categoryStats[key] = {
        correct: 0,
        total: 0,
        totalTime: 0,
        totalDifficulty: 0,
      }
    }
    
    categoryStats[key].total++
    categoryStats[key].totalTime += response.timeSpent
    categoryStats[key].totalDifficulty += response.question.difficulty
    
    if (response.isCorrect) {
      categoryStats[key].correct++
    }
  })
  
  return Object.entries(categoryStats).map(([key, stats]) => {
    const [category, subcategory] = key.split('-')
    return {
      category,
      subcategory,
      correct: stats.correct,
      total: stats.total,
      percentage: stats.total > 0 ? (stats.correct / stats.total) * 100 : 0,
      averageTime: stats.total > 0 ? Math.round(stats.totalTime / stats.total) : 0,
      difficulty: stats.total > 0 ? Math.round(stats.totalDifficulty / stats.total) : 0,
    }
  })
}

export function generateStudyRecommendations(categoryPerformance: CategoryPerformance[]) {
  const recommendations: any[] = []
  
  // Sort by performance (lowest first)
  const sortedCategories = [...categoryPerformance].sort((a, b) => a.percentage - b.percentage)
  
  // Focus on lowest performing areas
  const weakAreas = sortedCategories.filter(cat => cat.percentage < 70)
  const strongAreas = sortedCategories.filter(cat => cat.percentage >= 80)
  
  weakAreas.slice(0, 3).forEach((area, index) => {
    recommendations.push({
      area: `${area.category} - ${area.subcategory}`,
      priority: index === 0 ? 'HIGH' : index === 1 ? 'MEDIUM' : 'LOW',
      description: `Focus on improving ${area.subcategory.toLowerCase()} skills. Current accuracy: ${area.percentage.toFixed(1)}%`,
      resources: [
        `Practice ${area.subcategory.toLowerCase()} problems`,
        `Review ${area.category.toLowerCase()} concepts`,
        `Take focused quizzes on ${area.subcategory.toLowerCase()}`,
      ],
      estimatedTime: index === 0 ? '2-3 hours/week' : index === 1 ? '1-2 hours/week' : '30-60 minutes/week',
    })
  })
  
  return {
    recommendations,
    strengthAreas: strongAreas.map(area => `${area.category} - ${area.subcategory}`),
    improvementAreas: weakAreas.map(area => `${area.category} - ${area.subcategory}`),
  }
}
