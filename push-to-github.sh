#!/bin/bash

# Quick script to push code to GitHub

echo "🚀 Pushing code to GitHub..."
echo ""

# Check if remote exists
if git remote get-url origin > /dev/null 2>&1; then
    echo "✅ Remote already configured"
    REMOTE_URL=$(git remote get-url origin)
    echo "   Remote: $REMOTE_URL"
else
    echo "⚠️  No GitHub remote configured"
    echo ""
    echo "Please run:"
    echo "  git remote add origin https://github.com/YOUR_USERNAME/the-system-discord-bot.git"
    echo ""
    echo "Replace YOUR_USERNAME with your GitHub username"
    exit 1
fi

# Check if on main branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "📝 Renaming branch to main..."
    git branch -M main
fi

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo ""
    echo "Next steps:"
    echo "1. Go to https://railway.app"
    echo "2. Create new project"
    echo "3. Deploy from GitHub repo"
    echo "4. Add DISCORD_BOT_TOKEN variable"
else
    echo ""
    echo "❌ Failed to push. Check your GitHub credentials."
    echo ""
    echo "If you haven't set up GitHub remote:"
    echo "  git remote add origin https://github.com/YOUR_USERNAME/the-system-discord-bot.git"
fi
