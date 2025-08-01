#!/bin/bash

echo "🚀 Video Calling App Deployment Script"
echo "======================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "📦 Installing dependencies..."
npm run install-all

echo "🔧 Building client..."
cd client
npm run build
cd ..

echo "✅ Build completed!"
echo ""
echo "🌐 Deployment Options:"
echo "1. Frontend (Vercel): cd client && vercel"
echo "2. Backend (Railway): Deploy server/ directory to Railway.app"
echo "3. Backend (Heroku): cd server && heroku create && git push heroku main"
echo ""
echo "📝 Don't forget to:"
echo "- Update CORS origins in server/server.js with your frontend URL"
echo "- Set REACT_APP_BACKEND_URL environment variable in Vercel"
echo "- Test the video calling functionality"
echo ""
echo "📚 See DEPLOYMENT.md for detailed instructions" 