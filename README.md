# SAT Prep Website - Complete Adaptive Testing Platform

A comprehensive SAT preparation website with adaptive testing, detailed analytics, and personalized study recommendations.

## 🚀 Features

- **Adaptive Testing**: Module 2 difficulty adjusts based on Module 1 performance
- **Authentic Timing**: 64 min Reading (54 questions), 70 min Math (44 questions), 10 min break
- **Complete Analytics**: Performance tracking by category, time analysis, improvement suggestions
- **Score Calculation**: Accurate scoring out of 1600 points
- **Google OAuth**: Secure authentication
- **Question Bank**: Complete questions with passages, hints, and explanations

## 🛠️ Setup Instructions

### 1. Environment Variables

Create a `.env.local` file with:

```env
# Database
DATABASE_URL="your_postgresql_connection_string"

# NextAuth.js
NEXTAUTH_URL="your_deployed_url_or_http://localhost:3000"
NEXTAUTH_SECRET="your_random_secret_key"

# Google OAuth
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
```

### 2. Database Setup

```bash
# Push database schema
npx prisma db push

# Initialize with sample data
npm run db:init
```

### 3. Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

### 4. Production Deployment

The app is configured for Vercel deployment:

1. Connect your GitHub repo to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main

## 🔧 Troubleshooting

### Database Connection Issues

1. **Check API Health**: Visit `/api/health` to test database connection
2. **Verify Environment Variables**: Ensure `DATABASE_URL` is correct
3. **Initialize Database**: Run `npm run db:init` to add sample questions

### Common Errors

- **500 Internal Server Error**: Usually database connection issues
- **404 on /dashboard**: Route not implemented yet (coming soon)
- **No questions available**: Run database initialization script

### Debug Mode

Check browser console and server logs for detailed error messages. API routes include extensive logging.

## 📊 Database Schema

- **Users**: Google OAuth authentication
- **Questions**: SAT questions with passages, hints, explanations
- **TestSessions**: Adaptive test instances
- **QuestionResponses**: Student answers with timing
- **TestResults**: Final scores and analytics

## 🎯 Test Configuration

- **Reading**: 2 modules × 27 questions × 32 minutes
- **Math**: 2 modules × 22 questions × 35 minutes
- **Adaptive Logic**: Module 2 difficulty based on Module 1 performance
- **Scoring**: Authentic SAT scoring out of 1600

## 📈 Analytics Features

- Performance by category/subcategory
- Time analysis per question
- Hint usage tracking
- Study recommendations
- Progress over time

## 🔐 Security

- Google OAuth authentication
- Session-based authorization
- Database-level user isolation
- Secure API endpoints

## 📝 API Endpoints

- `GET /api/health` - Database health check
- `POST /api/test-sessions` - Create new test session
- `GET /api/test-sessions/recent` - Get recent tests
- `GET /api/questions` - Fetch adaptive questions
- `POST /api/question-responses` - Save student responses

## 🚧 Coming Soon

- Complete test interface
- Results and analytics dashboard
- Question review system
- Study plan recommendations
- Progress tracking over time

## 📞 Support

For issues or questions, check the browser console and server logs for detailed error information.
