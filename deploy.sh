#!/bin/bash

# Quick deployment helper script for THE SYSTEM Discord Bot

echo "🌌 THE SYSTEM Discord Bot - Deployment Helper"
echo "=============================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found!"
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo "✅ Please edit .env and add your DISCORD_BOT_TOKEN"
    echo ""
fi

# Check if config.js has placeholder values
if grep -q "YOUR_.*_ID" config.js; then
    echo "⚠️  config.js still has placeholder values!"
    echo "Please update config.js with your Discord role and channel IDs"
    echo "See SETUP_GUIDE.md for instructions"
    echo ""
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ required. Current: $(node -v)"
    echo "Please upgrade Node.js: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version OK: $(node -v)"
echo ""

# Install dependencies
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Check if .env has token
if grep -q "your_bot_token_here" .env; then
    echo "⚠️  WARNING: Bot token not set in .env!"
    echo "Please edit .env and add your DISCORD_BOT_TOKEN"
    echo ""
    read -p "Press Enter to continue anyway, or Ctrl+C to exit..."
fi

echo "🚀 Starting bot..."
echo ""
echo "For cloud deployment, see:"
echo "  - QUICK_DEPLOY.md (fastest)"
echo "  - DEPLOYMENT.md (detailed)"
echo ""

npm start
