#!/bin/bash

# Quick Chrome DevTools MCP Setup Script
# This script sets up Chrome DevTools MCP for testing the Receipt Management System

echo "🚀 Setting up Chrome DevTools MCP for Receipt Management System..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm found"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing project dependencies..."
    npm install
fi

# Test MCP installation
echo "🔧 Testing Chrome DevTools MCP installation..."
npx chrome-devtools-mcp@latest --help > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Chrome DevTools MCP is ready!"
else
    echo "⚠️  Installing Chrome DevTools MCP..."
    npm install chrome-devtools-mcp@latest
fi

echo ""
echo "🎉 Setup Complete! Next steps:"
echo ""
echo "1. Start the development server:"
echo "   npm run dev"
echo ""
echo "2. Start MCP testing:"
echo "   npm run mcp:start"
echo ""
echo "3. Configure your MCP client with:"
echo "   {\"mcpServers\": {\"chrome-devtools\": {\"command\": \"npx\", \"args\": [\"chrome-devtools-mcp@latest\"]}}}"
echo ""
echo "📚 See docs/TESTING_WITH_CHROME_DEVTOOLS_MCP.md for detailed instructions"
