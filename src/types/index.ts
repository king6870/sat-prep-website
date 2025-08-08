export interface Question {
  id: string
  subject: 'math' | 'reading'
  category: string
  subcategory: string
  difficulty: number
  estimatedTime: number
  passage?: string
  question: string
  choiceA: string
  choiceB: string
  choiceC: string
  choiceD: string
  correctAnswer: 'A' | 'B' | 'C' | 'D'
  explanationA: string
  explanationB: string
  explanationC: string
  explanationD: string
  solution: string
  hints: string[]
  skills: string[]
  tags: string[]
}

export interface QuestionResponse {
  id: string
  testSessionId: string
  questionId: string
  selectedAnswer?: 'A' | 'B' | 'C' | 'D'
  isCorrect?: boolean
  timeSpent: number
  hintsUsed: number
  module: TestModule
  questionOrder: number
}

export type TestModule = 'READING_MODULE_1' | 'READING_MODULE_2' | 'MATH_MODULE_1' | 'MATH_MODULE_2'

export type TestSection = 'READING' | 'BREAK' | 'MATH'

export type TestStatus = 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED'

export type PerformanceLevel = 'LOW' | 'MEDIUM' | 'HIGH'

export interface TestSession {
  id: string
  userId: string
  testType: 'FULL_TEST' | 'MATH_ONLY' | 'READING_ONLY'
  status: TestStatus
  currentSection?: string
  currentQuestion: number
  startTime: Date
  endTime?: Date
  totalScore?: number
  readingScore?: number
  mathScore?: number
  readingModule1Score?: number
  readingModule1Time?: number
  readingModule2Score?: number
  readingModule2Time?: number
  mathModule1Score?: number
  mathModule1Time?: number
  mathModule2Score?: number
  mathModule2Time?: number
  readingModule1Performance?: PerformanceLevel
  mathModule1Performance?: PerformanceLevel
}

export interface TestResult {
  id: string
  userId: string
  testSessionId: string
  totalScore: number
  readingScore: number
  mathScore: number
  readingCorrect: number
  readingIncorrect: number
  readingSkipped: number
  mathCorrect: number
  mathIncorrect: number
  mathSkipped: number
  totalTimeSpent: number
  readingTimeSpent: number
  mathTimeSpent: number
  categoryPerformance: Record<string, any>
  strengthAreas: string[]
  improvementAreas: string[]
  recommendedStudyPlan?: Record<string, any>
}

export interface TestConfig {
  reading: {
    totalTime: number // 64 minutes in seconds
    totalQuestions: number // 54 questions
    module1Questions: number // 27 questions
    module2Questions: number // 27 questions
    module1Time: number // 32 minutes in seconds
    module2Time: number // 32 minutes in seconds
  }
  math: {
    totalTime: number // 70 minutes in seconds
    totalQuestions: number // 44 questions
    module1Questions: number // 22 questions
    module2Questions: number // 22 questions
    module1Time: number // 35 minutes in seconds
    module2Time: number // 35 minutes in seconds
  }
  breakTime: number // 10 minutes in seconds
}

export interface CategoryPerformance {
  category: string
  subcategory: string
  correct: number
  total: number
  percentage: number
  averageTime: number
  difficulty: number
}

export interface StudyRecommendation {
  area: string
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
  description: string
  resources: string[]
  estimatedTime: string
}
