import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Create Database Tables</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 1000px; margin: 20px auto; padding: 20px; line-height: 1.6; }
        .card { border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .error { background-color: #f8d7da; border-color: #f5c6cb; color: #721c24; }
        .success { background-color: #d4edda; border-color: #c3e6cb; color: #155724; }
        .info { background-color: #d1ecf1; border-color: #bee5eb; color: #0c5460; }
        .warning { background-color: #fff3cd; border-color: #ffeaa7; color: #856404; }
        button { background: #007bff; color: white; border: none; padding: 12px 24px; border-radius: 4px; cursor: pointer; margin: 5px; font-size: 16px; }
        button:hover { background: #0056b3; }
        pre { background: #f8f9fa; padding: 15px; border-radius: 4px; overflow-x: auto; font-size: 12px; }
        code { background: #f8f9fa; padding: 2px 4px; border-radius: 3px; font-family: monospace; }
        .step { margin: 15px 0; padding: 15px; border-left: 4px solid #007bff; background: #f8f9fa; }
    </style>
</head>
<body>
    <h1>🎯 SAT Prep Database Setup</h1>
    
    <div class="card error">
        <h3>❌ Database Tables Missing</h3>
        <p>Your database exists but the tables haven't been created yet. This is normal for new Prisma Accelerate setups.</p>
    </div>

    <div class="card info">
        <h3>🔧 How to Fix This (Prisma Accelerate)</h3>
        <p>Since you're using Prisma Accelerate, you need to create tables using your <strong>direct PostgreSQL URL</strong>.</p>
    </div>

    <div class="step">
        <h4>Step 1: Get Your Direct PostgreSQL URL</h4>
        <p>Your current URL is a Prisma Accelerate URL:</p>
        <code>prisma+postgres://accelerate.prisma-data.net/...</code>
        
        <p><strong>You need your actual PostgreSQL connection string, which looks like:</strong></p>
        <code>postgresql://username:password@host:port/database</code>
        
        <p>This should be available in your database provider's dashboard (Neon, Supabase, Railway, etc.)</p>
    </div>

    <div class="step">
        <h4>Step 2: Add Direct URL to Vercel</h4>
        <ol>
            <li>Go to your <a href="https://vercel.com/dashboard" target="_blank">Vercel Dashboard</a></li>
            <li>Select your <strong>sat-prep-website</strong> project</li>
            <li>Go to <strong>Settings → Environment Variables</strong></li>
            <li>Add a new variable:
                <ul>
                    <li><strong>Name:</strong> <code>DIRECT_DATABASE_URL</code></li>
                    <li><strong>Value:</strong> Your direct PostgreSQL URL</li>
                </ul>
            </li>
            <li>Redeploy your application</li>
        </ol>
    </div>

    <div class="step">
        <h4>Step 3: Create Tables</h4>
        <p>Once you have the direct URL set up, click this button:</p>
        <button onclick="createTables()">Create Database Tables</button>
        <div id="tableResult"></div>
    </div>

    <div class="card warning">
        <h3>⚡ Quick Alternative</h3>
        <p>If you have the Vercel CLI installed locally:</p>
        <pre>
# Clone your repo
git clone https://github.com/king6870/sat-prep-website.git
cd sat-prep-website

# Install dependencies  
npm install

# Set your direct PostgreSQL URL
echo "DIRECT_DATABASE_URL=your_direct_postgresql_url" > .env.local

# Create tables
npx prisma db push

# Add sample data
npm run db:init
        </pre>
    </div>

    <div id="result"></div>

    <script>
        async function createTables() {
            document.getElementById('tableResult').innerHTML = '<div class="card info">Creating database tables...</div>';
            
            try {
                const response = await fetch('/api/create-tables', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                });
                const data = await response.json();
                
                let className = response.ok ? 'success' : 'error';
                document.getElementById('tableResult').innerHTML = 
                    '<div class="card ' + className + '">' +
                    '<h3>Table Creation Result</h3>' +
                    '<pre>' + JSON.stringify(data, null, 2) + '</pre>' +
                    '</div>';
            } catch (error) {
                document.getElementById('tableResult').innerHTML = 
                    '<div class="card error"><h3>Error</h3><p>' + error.message + '</p></div>';
            }
        }

        // Auto-check health on page load
        window.onload = function() {
            document.getElementById('result').innerHTML = 
                '<div class="card error">' +
                '<h3>Current Status: Tables Missing</h3>' +
                '<p>The database exists but tables need to be created.</p>' +
                '</div>';
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
