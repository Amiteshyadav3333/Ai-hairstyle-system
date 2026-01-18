#!/bin/bash

echo "🚀 Setting up AI HairStyle Mirror..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Setup environment
if [ ! -f .env ]; then
    echo "📝 Creating environment file..."
    cp .env.example .env
    echo "⚠️  Please update .env with your actual values"
fi

# Generate Prisma client
echo "🗄️  Setting up database..."
npx prisma generate

# Push database schema (for development)
echo "📊 Pushing database schema..."
npx prisma db push

# Create default admin user
echo "👤 Creating default admin user..."
node -e "
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function createAdmin() {
  const prisma = new PrismaClient();
  
  try {
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    await prisma.admin.upsert({
      where: { email: 'admin@hairstyle.com' },
      update: {},
      create: {
        email: 'admin@hairstyle.com',
        password: hashedPassword
      }
    });
    
    console.log('✅ Admin user created: admin@hairstyle.com / admin123');
  } catch (error) {
    console.log('⚠️  Admin user might already exist');
  } finally {
    await prisma.\$disconnect();
  }
}

createAdmin();
"

echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Update .env with your database URL and API keys"
echo "2. Run 'npm run dev' to start development server"
echo "3. Visit http://localhost:3000"
echo "4. Admin login: admin@hairstyle.com / admin123"
echo ""
echo "📚 For production deployment:"
echo "1. Deploy to Vercel: vercel --prod"
echo "2. Setup PostgreSQL on Railway/Render"
echo "3. Configure environment variables"