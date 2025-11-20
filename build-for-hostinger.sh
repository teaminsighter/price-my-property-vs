#!/bin/bash

echo "🏗️  Building Price My Property for Hostinger..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Run the build
echo "⚡ Building Next.js project..."
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo ""
    echo "📂 Your static files are in the 'out/' folder"
    echo ""
    echo "Next steps:"
    echo "1. Connect to your Hostinger FTP"
    echo "2. Upload everything from 'out/' folder to 'public_html/'"
    echo "3. Don't forget to upload your images to 'public_html/images/'"
    echo ""
    echo "📖 See DEPLOYMENT.md for detailed instructions"
else
    echo ""
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi
