import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Starting database initialization...')
    
    // Check if tables exist by trying to count users
    try {
      await prisma.user.count()
      console.log('✅ Database tables already exist')
    } catch (error) {
      console.log('❌ Database tables do not exist')
      return NextResponse.json({
        error: 'Database tables do not exist. Please run: npx prisma db push',
        details: 'You need to create the database schema first',
        instructions: [
          '1. Set DATABASE_URL in your environment',
          '2. Run: npx prisma db push',
          '3. Then call this endpoint again'
        ]
      }, { status: 500 })
    }
    
    // Check if questions already exist
    const questionCount = await prisma.question.count()
    if (questionCount > 0) {
      return NextResponse.json({
        message: 'Database already initialized',
        stats: {
          questions: questionCount,
          users: await prisma.user.count(),
          testSessions: await prisma.testSession.count()
        }
      })
    }
    
    console.log('📝 Adding sample questions...')
    
    // Add sample math questions
    const mathQuestions = [
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
        subject: 'math',
        category: 'Problem Solving',
        subcategory: 'Percentages',
        difficulty: 2,
        estimatedTime: 75,
        question: 'If a shirt originally costs $40 and is marked down 25%, what is the sale price?',
        choiceA: '$25',
        choiceB: '$30',
        choiceC: '$35',
        choiceD: '$10',
        correctAnswer: 'B',
        explanationA: 'Incorrect. This would be a 37.5% discount.',
        explanationB: 'Correct. 25% of $40 is $10, so $40 - $10 = $30.',
        explanationC: 'Incorrect. This would be a 12.5% discount.',
        explanationD: 'Incorrect. This is the amount of the discount, not the sale price.',
        solution: 'Calculate 25% of $40: 0.25 × $40 = $10. Subtract from original: $40 - $10 = $30.',
        hints: ['Calculate the discount amount first', '25% = 0.25', 'Subtract the discount from the original price'],
        skills: ['percentages', 'word-problems'],
        tags: ['percentages', 'discounts']
      }
    ]

    // Add sample reading questions
    const readingQuestions = [
      {
        subject: 'reading',
        category: 'Reading Comprehension',
        subcategory: 'Literature',
        difficulty: 3,
        estimatedTime: 120,
        passage: 'The old lighthouse stood sentinel on the rocky coast, its weathered walls bearing witness to countless storms. Sarah approached it with a mixture of excitement and trepidation. She had inherited this structure from her great-aunt, along with the responsibility of deciding its fate. The local historical society wanted to preserve it, while developers saw prime real estate. As she climbed the spiral staircase, each step echoed with the weight of history and the burden of choice. The view from the top was breathtaking—endless ocean stretching to the horizon, waves crashing against the rocks below. But Sarah knew that beauty alone wouldn\'t pay for the extensive repairs needed to keep the lighthouse standing.',
        question: 'The passage suggests that Sarah feels conflicted because:',
        choiceA: 'She is afraid of heights and storms',
        choiceB: 'She must choose between preservation and development',
        choiceC: 'She never knew her great-aunt well',
        choiceD: 'The lighthouse is in poor condition',
        correctAnswer: 'B',
        explanationA: 'Incorrect. While she feels trepidation, the passage doesn\'t suggest fear of heights or storms.',
        explanationB: 'Correct. The passage explicitly states the conflict between the historical society wanting preservation and developers wanting the land.',
        explanationC: 'Incorrect. The passage doesn\'t mention her relationship with her great-aunt.',
        explanationD: 'Incorrect. While the lighthouse needs repairs, this isn\'t presented as the main source of her conflict.',
        solution: 'The passage clearly states that "The local historical society wanted to preserve it, while developers saw prime real estate," creating Sarah\'s dilemma.',
        hints: ['Look for the specific conflict mentioned in the passage', 'Focus on the competing interests described', 'The answer relates to the decision Sarah must make'],
        skills: ['reading-comprehension', 'inference'],
        tags: ['literature', 'character-motivation']
      },
      {
        subject: 'reading',
        category: 'Reading Comprehension',
        subcategory: 'Science',
        difficulty: 4,
        estimatedTime: 150,
        passage: 'Recent studies in marine biology have revealed fascinating insights into the communication patterns of dolphins. Using sophisticated underwater recording equipment, researchers have discovered that dolphins employ a complex system of clicks, whistles, and body language to convey information. Each dolphin appears to have a unique "signature whistle" that functions much like a name, allowing individuals to identify themselves to others in their pod. Furthermore, dolphins have been observed modifying their communication patterns based on environmental factors such as water clarity and ambient noise levels. This adaptive behavior suggests a level of cognitive flexibility previously underestimated in marine mammals.',
        question: 'According to the passage, dolphins demonstrate cognitive flexibility by:',
        choiceA: 'Using sophisticated recording equipment',
        choiceB: 'Having unique signature whistles',
        choiceC: 'Adapting communication to environmental conditions',
        choiceD: 'Living in organized pods',
        correctAnswer: 'C',
        explanationA: 'Incorrect. The recording equipment is used by researchers, not dolphins.',
        explanationB: 'Incorrect. While signature whistles show complexity, the passage doesn\'t link them to cognitive flexibility.',
        explanationC: 'Correct. The passage states that dolphins modify their communication based on environmental factors, which demonstrates cognitive flexibility.',
        explanationD: 'Incorrect. Pod organization is not mentioned as evidence of cognitive flexibility.',
        solution: 'The passage explicitly states that dolphins "modify their communication patterns based on environmental factors" and calls this "adaptive behavior" that "suggests cognitive flexibility."',
        hints: ['Look for what the passage says demonstrates cognitive flexibility', 'Focus on adaptive behavior mentioned', 'Environmental factors are key'],
        skills: ['reading-comprehension', 'scientific-analysis'],
        tags: ['science', 'animal-behavior']
      }
    ]

    // Insert all questions
    const allQuestions = [...mathQuestions, ...readingQuestions]
    for (const question of allQuestions) {
      await prisma.question.create({ data: question })
    }

    console.log(`✅ Added ${allQuestions.length} sample questions`)

    // Get final stats
    const finalStats = {
      users: await prisma.user.count(),
      questions: await prisma.question.count(),
      testSessions: await prisma.testSession.count()
    }

    return NextResponse.json({
      message: 'Database initialized successfully',
      questionsAdded: allQuestions.length,
      stats: finalStats,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Database initialization failed:', error)
    return NextResponse.json({
      error: 'Database initialization failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
