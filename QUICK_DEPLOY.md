# ⚡ Quick Deploy Guide

Fastest way to get your bot online in 5 minutes!

## 🚀 Railway (Recommended - 5 minutes)

### Step 1: Prepare GitHub Repo (Optional but Recommended)

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit"

# Create repo on GitHub, then:
git remote add origin https://github.com/yourusername/the-system-bot.git
git push -u origin main
```

### Step 2: Deploy on Railway

1. Go to [railway.app](https://railway.app)
2. Click **"Start a New Project"**
3. Select **"Deploy from GitHub repo"**
4. Authorize GitHub and select your repo
5. Railway auto-detects Node.js ✅
6. Click on your project → **"Variables"** tab
7. Add variable:
   - **Name:** `DISCORD_BOT_TOKEN`
   - **Value:** `paste_your_bot_token_here`
8. Railway auto-deploys! 🎉

**Done!** Your bot is now live. Check the "Deployments" tab to see logs.

---

## 🌐 Render (Alternative - 5 minutes)

### Step 1: Deploy

1. Go to [render.com](https://render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect GitHub repo (or upload manually)
4. Configure:
   - **Name:** `the-system-bot`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node index.js`
   - **Plan:** `Free`
5. Click **"Advanced"** → **"Add Environment Variable"**
   - **Key:** `DISCORD_BOT_TOKEN`
   - **Value:** `your_bot_token`
6. Click **"Create Web Service"**
7. Wait 2-3 minutes for deployment ✅

**Done!** Bot is online (may sleep after 15 min inactivity on free tier).

---

## 📋 Before Deploying - Don't Forget!

1. ✅ Update `config.js` with your Discord role/channel IDs
2. ✅ Create `.env` file locally (for testing)
3. ✅ Test bot locally first: `npm start`
4. ✅ Make sure your Discord server is set up (see SETUP_GUIDE.md)

---

## 🔍 Verify Deployment

After deploying, check:

1. **Bot Status:**
   - Go to your Discord server
   - Check if bot shows as "Online" (green dot)

2. **Test Verification:**
   - Go to `#verify` channel
   - Click "Verify Me" button
   - Should work!

3. **Check Logs:**
   - Railway: "Deployments" → "View Logs"
   - Render: "Logs" tab
   - Look for: `✅ THE SYSTEM Bot is online`

---

## 🆘 Troubleshooting

**Bot offline?**
- Check environment variable is set correctly
- Verify token is valid (no extra spaces)
- Check deployment logs for errors

**Bot not responding?**
- Verify bot has permissions in Discord server
- Check role/channel IDs in config.js are correct
- Restart deployment

**Need to update code?**
- Push to GitHub (if connected)
- Or upload new files and redeploy

---

## 📞 Need Help?

- Check `DEPLOYMENT.md` for detailed guides
- Check `SETUP_GUIDE.md` for Discord server setup
- Check `README.md` for general info

---

**That's it! Your bot should be live now.** 🎉
