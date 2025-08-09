const { execSync } = require('child_process')

async function migrateDatabase() {
  try {
    console.log('🔧 Starting database migration...')
    
    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set')
    }
    
    console.log('✅ DATABASE_URL found')
    
    // Run Prisma db push to create tables
    console.log('📝 Creating database tables...')
    execSync('npx prisma db push --force-reset', { 
      stdio: 'inherit',
      env: { ...process.env }
    })
    
    console.log('✅ Database tables created successfully')
    
    // Generate Prisma client
    console.log('🔧 Generating Prisma client...')
    execSync('npx prisma generate', { 
      stdio: 'inherit',
      env: { ...process.env }
    })
    
    console.log('✅ Prisma client generated')
    
    console.log('🎉 Database migration completed successfully!')
    
  } catch (error) {
    console.error('❌ Database migration failed:', error.message)
    process.exit(1)
  }
}

migrateDatabase()
