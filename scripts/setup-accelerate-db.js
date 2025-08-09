const { PrismaClient } = require('@prisma/client')

// For Prisma Accelerate, we need to use the direct database URL for schema operations
const directDatabaseUrl = process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL

if (!directDatabaseUrl) {
  console.error('❌ DIRECT_DATABASE_URL or DATABASE_URL not found')
  process.exit(1)
}

// Extract the direct PostgreSQL URL from Prisma Accelerate URL
let actualDatabaseUrl = directDatabaseUrl

if (directDatabaseUrl.startsWith('prisma+postgres://')) {
  console.log('⚠️  Prisma Accelerate URL detected. You need to provide the direct PostgreSQL URL.')
  console.log('Please set DIRECT_DATABASE_URL to your actual PostgreSQL connection string.')
  console.log('Example: postgresql://username:password@host:port/database')
  process.exit(1)
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: actualDatabaseUrl
    }
  }
})

async function setupDatabase() {
  try {
    console.log('🔧 Setting up database for Prisma Accelerate...')
    
    // Test connection
    await prisma.$connect()
    console.log('✅ Database connected')
    
    // Check if tables exist and create sample data
    try {
      const questionCount = await prisma.question.count()
      console.log(`📊 Current questions in database: ${questionCount}`)
      
      if (questionCount === 0) {
        console.log('📝 Adding sample questions...')
        await addSampleQuestions()
      } else {
        console.log('✅ Database already has questions')
      }
      
      // Final stats
      const stats = {
        users: await prisma.user.count(),
        questions: await prisma.question.count(),
        testSessions: await prisma.testSession.count()
      }
      
      console.log('📊 Final database stats:', stats)
      console.log('🎉 Database setup complete!')
      
    } catch (error) {
      if (error.message.includes('does not exist')) {
        console.log('❌ Database tables do not exist.')
        console.log('📋 You need to run: npx prisma db push')
        console.log('💡 Make sure to use your direct PostgreSQL URL, not the Prisma Accelerate URL')
      } else {
        throw error
      }
    }
    
  } catch (error) {
    console.error('❌ Database setup failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

async function addSampleQuestions() {
  const questions = [
    {
      subject: 'math',
      category: 'Algebra',
      subcategory: 'Linear Equations',
      difficulty: 2,
      estimatedTime: 60,
      question: 'If 3x + 5 = 20, what is the value of x?',
      choiceA: 'x = 3',
      choiceB: 'x = 5',
      choiceC: 'x = 7',
      choiceD: 'x = 15',
      correctAnswer: 'B',
      explanationA: 'Incorrect. If x = 3, then 3(3) + 5 = 14, not 20.',
      explanationB: 'Correct. If x = 5, then 3(5) + 5 = 20.',
      explanationC: 'Incorrect. If x = 7, then 3(7) + 5 = 26, not 20.',
      explanationD: 'Incorrect. If x = 15, then 3(15) + 5 = 50, not 20.',
      solution: 'Subtract 5 from both sides: 3x = 15. Divide by 3: x = 5.',
      hints: ['Start by isolating the term with x', 'Subtract 5 from both sides', 'Divide both sides by 3'],
      skills: ['linear-equations', 'algebra'],
      tags: ['basic-algebra', 'solving-equations']
    },
    {
      subject: 'math',
      category: 'Advanced Math',
      subcategory: 'Quadratics',
      difficulty: 3,
      estimatedTime: 90,
      question: 'What are the solutions to x² - 6x + 8 = 0?',
      choiceA: 'x = 2 and x = 4',
      choiceB: 'x = -2 and x = -4',
      choiceC: 'x = 1 and x = 8',
      choiceD: 'x = 3 and x = 5',
      correctAnswer: 'A',
      explanationA: 'Correct. Factoring gives (x-2)(x-4) = 0, so x = 2 or x = 4.',
      explanationB: 'Incorrect. These would give positive values when substituted.',
      explanationC: 'Incorrect. Check: 1² - 6(1) + 8 = 3 ≠ 0.',
      explanationD: 'Incorrect. Check: 3² - 6(3) + 8 = -1 ≠ 0.',
      solution: 'Factor the quadratic: x² - 6x + 8 = (x-2)(x-4) = 0. So x = 2 or x = 4.',
      hints: ['Try to factor the quadratic', 'Look for two numbers that multiply to 8 and add to -6', 'The numbers are -2 and -4'],
      skills: ['quadratic-equations', 'factoring'],
      tags: ['quadratics', 'factoring']
    },
    {
      subject: 'reading',
      category: 'Reading Comprehension',
      subcategory: 'Literature',
      difficulty: 3,
      estimatedTime: 120,
      passage: 'The old lighthouse stood sentinel on the rocky coast, its weathered walls bearing witness to countless storms. Sarah approached it with a mixture of excitement and trepidation. She had inherited this structure from her great-aunt, along with the responsibility of deciding its fate. The local historical society wanted to preserve it, while developers saw prime real estate. As she climbed the spiral staircase, each step echoed with the weight of history and the burden of choice.',
      question: 'The passage suggests that Sarah feels conflicted because:',
      choiceA: 'She is afraid of heights and storms',
      choiceB: 'She must choose between preservation and development',
      choiceC: 'She never knew her great-aunt well',
      choiceD: 'The lighthouse is in poor condition',
      correctAnswer: 'B',
      explanationA: 'Incorrect. While she feels trepidation, the passage doesn\'t suggest fear of heights or storms.',
      explanationB: 'Correct. The passage explicitly states the conflict between the historical society wanting preservation and developers wanting the land.',
      explanationC: 'Incorrect. The passage doesn\'t mention her relationship with her great-aunt.',
      explanationD: 'Incorrect. While the lighthouse is weathered, this isn\'t presented as the source of her conflict.',
      solution: 'The passage clearly states that "The local historical society wanted to preserve it, while developers saw prime real estate," creating Sarah\'s dilemma.',
      hints: ['Look for the specific conflict mentioned in the passage', 'Focus on the competing interests described', 'The answer relates to the decision Sarah must make'],
      skills: ['reading-comprehension', 'inference'],
      tags: ['literature', 'character-motivation']
    }
  ]

  for (const question of questions) {
    await prisma.question.create({ data: question })
  }

  console.log(`✅ Added ${questions.length} sample questions`)
}

setupDatabase()
