import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const html = `
<!DOCTYPE html>
<html>
<head>
    <title>SAT Prep Database Setup</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
        .card { border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .success { background-color: #d4edda; border-color: #c3e6cb; color: #155724; }
        .error { background-color: #f8d7da; border-color: #f5c6cb; color: #721c24; }
        .info { background-color: #d1ecf1; border-color: #bee5eb; color: #0c5460; }
        button { background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; margin: 5px; }
        button:hover { background: #0056b3; }
        pre { background: #f8f9fa; padding: 10px; border-radius: 4px; overflow-x: auto; }
    </style>
</head>
<body>
    <h1>🎯 SAT Prep Database Setup</h1>
    
    <div class="card info">
        <h3>Database Status Check</h3>
        <p>This page will help you set up your SAT Prep database.</p>
        <button onclick="checkHealth()">Check Database Health</button>
        <button onclick="setupDatabase()">Setup Database</button>
    </div>

    <div id="result"></div>

    <script>
        async function checkHealth() {
            document.getElementById('result').innerHTML = '<div class="card info">Checking database health...</div>';
            
            try {
                const response = await fetch('/api/health');
                const data = await response.json();
                
                let className = response.ok ? 'success' : 'error';
                document.getElementById('result').innerHTML = 
                    '<div class="card ' + className + '">' +
                    '<h3>Database Health Check</h3>' +
                    '<pre>' + JSON.stringify(data, null, 2) + '</pre>' +
                    '</div>';
            } catch (error) {
                document.getElementById('result').innerHTML = 
                    '<div class="card error"><h3>Error</h3><p>' + error.message + '</p></div>';
            }
        }

        async function setupDatabase() {
            document.getElementById('result').innerHTML = '<div class="card info">Setting up database...</div>';
            
            try {
                const response = await fetch('/api/admin/setup-db', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                });
                const data = await response.json();
                
                let className = response.ok ? 'success' : 'error';
                document.getElementById('result').innerHTML = 
                    '<div class="card ' + className + '">' +
                    '<h3>Database Setup Result</h3>' +
                    '<pre>' + JSON.stringify(data, null, 2) + '</pre>' +
                    '</div>';
            } catch (error) {
                document.getElementById('result').innerHTML = 
                    '<div class="card error"><h3>Error</h3><p>' + error.message + '</p></div>';
            }
        }

        // Auto-check health on page load
        window.onload = function() {
            checkHealth();
        };
    </script>
</body>
</html>`;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Quick database setup via GET endpoint...')
    
    // Test connection first
    await prisma.$connect()
    console.log('✅ Database connected')
    
    // Check if tables exist
    try {
      const questionCount = await prisma.question.count()
      
      if (questionCount > 0) {
        return NextResponse.json({
          message: 'Database already has questions',
          stats: {
            users: await prisma.user.count(),
            questions: questionCount,
            testSessions: await prisma.testSession.count()
          }
        })
      }
      
      // Add sample questions
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
          subject: 'reading',
          category: 'Reading Comprehension',
          subcategory: 'Literature',
          difficulty: 3,
          estimatedTime: 120,
          passage: 'The old lighthouse stood sentinel on the rocky coast, its weathered walls bearing witness to countless storms. Sarah approached it with a mixture of excitement and trepidation.',
          question: 'The passage suggests that Sarah feels:',
          choiceA: 'Excited only',
          choiceB: 'Mixed emotions',
          choiceC: 'Afraid only',
          choiceD: 'Indifferent',
          correctAnswer: 'B',
          explanationA: 'Incorrect. The passage mentions both excitement and trepidation.',
          explanationB: 'Correct. The passage states she felt "a mixture of excitement and trepidation."',
          explanationC: 'Incorrect. She feels trepidation but also excitement.',
          explanationD: 'Incorrect. She clearly has strong emotions about the lighthouse.',
          solution: 'The passage explicitly states Sarah approached "with a mixture of excitement and trepidation."',
          hints: ['Look for words describing Sarah\'s emotions', 'The passage mentions two different feelings', 'Focus on the word "mixture"'],
          skills: ['reading-comprehension', 'inference'],
          tags: ['literature', 'character-emotions']
        }
      ]
      
      for (const question of questions) {
        await prisma.question.create({ data: question })
      }
      
      return NextResponse.json({
        message: 'Database setup successful!',
        questionsAdded: questions.length,
        stats: {
          users: await prisma.user.count(),
          questions: await prisma.question.count(),
          testSessions: await prisma.testSession.count()
        }
      })
      
    } catch (error) {
      return NextResponse.json({
        error: 'Database tables do not exist',
        message: 'You need to create the database schema first',
        details: error instanceof Error ? error.message : 'Unknown error',
        instructions: [
          '1. Get your direct PostgreSQL URL (not Prisma Accelerate URL)',
          '2. Run: npx prisma db push with the direct URL',
          '3. Then try this setup again'
        ]
      }, { status: 500 })
    }
    
  } catch (error) {
    console.error('Setup failed:', error)
    return NextResponse.json({
      error: 'Database connection failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
