import { TestConfig } from '@/types'

export const TEST_CONFIG: TestConfig = {
  reading: {
    totalTime: 64 * 60, // 64 minutes in seconds
    totalQuestions: 54,
    module1Questions: 27,
    module2Questions: 27,
    module1Time: 32 * 60, // 32 minutes in seconds
    module2Time: 32 * 60, // 32 minutes in seconds
  },
  math: {
    totalTime: 70 * 60, // 70 minutes in seconds
    totalQuestions: 44,
    module1Questions: 22,
    module2Questions: 22,
    module1Time: 35 * 60, // 35 minutes in seconds
    module2Time: 35 * 60, // 35 minutes in seconds
  },
  breakTime: 10 * 60, // 10 minutes in seconds
}

export const SCORE_RANGES = {
  TOTAL_MAX: 1600,
  SECTION_MAX: 800,
  SECTION_MIN: 200,
}

export const PERFORMANCE_THRESHOLDS = {
  HIGH: 0.75, // 75% or higher
  MEDIUM: 0.50, // 50-74%
  LOW: 0.0, // Below 50%
}

export const DIFFICULTY_ADJUSTMENTS = {
  HIGH_PERFORMANCE: {
    minDifficulty: 3,
    maxDifficulty: 5,
    averageDifficulty: 4,
  },
  MEDIUM_PERFORMANCE: {
    minDifficulty: 2,
    maxDifficulty: 4,
    averageDifficulty: 3,
  },
  LOW_PERFORMANCE: {
    minDifficulty: 1,
    maxDifficulty: 3,
    averageDifficulty: 2,
  },
}

export const SUBJECT_CATEGORIES = {
  math: {
    'Algebra': ['Linear Equations', 'Systems of Equations', 'Inequalities', 'Functions'],
    'Advanced Math': ['Quadratics', 'Polynomials', 'Rational Expressions', 'Exponentials'],
    'Problem Solving': ['Ratios and Proportions', 'Percentages', 'Data Analysis', 'Word Problems'],
    'Geometry': ['Area and Perimeter', 'Volume', 'Coordinate Geometry', 'Triangles and Circles'],
  },
  reading: {
    'Reading Comprehension': ['Literature', 'Social Studies', 'Science'],
    'Vocabulary in Context': ['Word Meaning', 'Tone Analysis', 'Style Analysis'],
    'Command of Evidence': ['Supporting Claims', 'Analyzing Arguments', 'Evidence Evaluation'],
    'Analysis': ['Author Purpose', 'Rhetorical Devices', 'Text Structure'],
  },
}

export const TIME_WARNINGS = {
  FIRST_WARNING: 0.75, // 75% of time elapsed
  SECOND_WARNING: 0.90, // 90% of time elapsed
  FINAL_WARNING: 0.95, // 95% of time elapsed
}
