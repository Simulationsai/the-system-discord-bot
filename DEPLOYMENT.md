# 🚀 Deployment Guide - THE SYSTEM Discord Bot

This guide covers multiple deployment options for hosting your Discord bot 24/7.

## 📋 Pre-Deployment Checklist

- [ ] Bot token obtained from Discord Developer Portal
- [ ] Discord server created with all roles and channels
- [ ] `config.js` updated with all role and channel IDs
- [ ] `.env` file created with bot token
- [ ] Bot tested locally and working

## 🌐 Deployment Options

### Option 1: Railway (Recommended - Easiest)

**Railway** is the easiest option with free tier available.

#### Steps:

1. **Sign up** at [railway.app](https://railway.app) (use GitHub login)

2. **Create New Project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo" (or "Empty Project" if uploading manually)

3. **If using GitHub:**
   - Connect your GitHub account
   - Select your repository
   - Railway will auto-detect Node.js

4. **If uploading manually:**
   - Click "Empty Project"
   - Click "New" → "GitHub Repo" or upload files

5. **Add Environment Variable:**
   - Go to "Variables" tab
   - Add: `DISCORD_BOT_TOKEN` = `your_bot_token_here`
   - Railway will auto-deploy

6. **Deploy:**
   - Railway automatically detects `package.json`
   - Runs `npm install` and `npm start`
   - Bot should be online!

**Railway Free Tier:**
- $5 free credit monthly
- Auto-deploys on git push
- Easy environment variable management

---

### Option 2: Render

**Render** offers free tier with some limitations.

#### Steps:

1. **Sign up** at [render.com](https://render.com)

2. **Create New Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repo (or upload manually)

3. **Configure:**
   - **Name:** `the-system-bot`
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node index.js`
   - **Plan:** Free

4. **Add Environment Variable:**
   - Go to "Environment" section
   - Add: `DISCORD_BOT_TOKEN` = `your_bot_token_here`

5. **Deploy:**
   - Click "Create Web Service"
   - Wait for deployment (2-3 minutes)

**Render Free Tier:**
- Free but spins down after 15 min inactivity
- Auto-wakes on first request (may take 30s)
- For 24/7 uptime, upgrade to paid ($7/month)

---

### Option 3: Replit

**Replit** is great for beginners but less reliable for 24/7.

#### Steps:

1. **Sign up** at [replit.com](https://replit.com)

2. **Create New Repl:**
   - Click "Create Repl"
   - Select "Node.js" template
   - Name: `the-system-bot`

3. **Upload Files:**
   - Upload all project files
   - Or use GitHub import

4. **Set Secrets:**
   - Click "Secrets" tab (lock icon)
   - Add: `DISCORD_BOT_TOKEN` = `your_bot_token_here`

5. **Run:**
   - Click "Run" button
   - Bot starts automatically

**Replit Free Tier:**
- Free but may sleep after inactivity
- Use "Always On" for $5/month for 24/7

---

### Option 4: VPS (DigitalOcean, AWS, etc.)

For production use, a VPS gives you full control.

#### Steps (DigitalOcean Example):

1. **Create Droplet:**
   - Go to [digitalocean.com](https://digitalocean.com)
   - Create new Droplet
   - Choose Ubuntu 22.04
   - Minimum: $6/month (1GB RAM)

2. **SSH into Server:**
   ```bash
   ssh root@your_server_ip
   ```

3. **Install Node.js:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

4. **Install Git:**
   ```bash
   sudo apt-get install git -y
   ```

5. **Clone/Upload Project:**
   ```bash
   git clone your_repo_url
   cd your_repo_name
   # OR upload files via SFTP
   ```

6. **Install Dependencies:**
   ```bash
   npm install
   ```

7. **Create .env file:**
   ```bash
   nano .env
   # Add: DISCORD_BOT_TOKEN=your_token_here
   # Save: Ctrl+X, Y, Enter
   ```

8. **Install PM2 (Process Manager):**
   ```bash
   sudo npm install -g pm2
   ```

9. **Start Bot with PM2:**
   ```bash
   pm2 start index.js --name "the-system-bot"
   pm2 save
   pm2 startup
   ```

10. **Bot is now running 24/7!**
    - Check status: `pm2 status`
    - View logs: `pm2 logs the-system-bot`
    - Restart: `pm2 restart the-system-bot`

---

### Option 5: Heroku

**Note:** Heroku removed free tier, but still an option.

#### Steps:

1. **Install Heroku CLI:**
   ```bash
   # macOS
   brew tap heroku/brew && brew install heroku
   ```

2. **Login:**
   ```bash
   heroku login
   ```

3. **Create App:**
   ```bash
   heroku create the-system-bot
   ```

4. **Set Environment Variable:**
   ```bash
   heroku config:set DISCORD_BOT_TOKEN=your_token_here
   ```

5. **Deploy:**
   ```bash
   git push heroku main
   ```

6. **Check Logs:**
   ```bash
   heroku logs --tail
   ```

---

## 🔧 Making Bot Public (Optional)

If you want others to invite your bot:

### Steps:

1. **Go to Discord Developer Portal:**
   - [discord.com/developers/applications](https://discord.com/developers/applications)
   - Select your application

2. **Enable Public Bot:**
   - Go to "Bot" section
   - Scroll to "Public Bot"
   - Enable ✅

3. **Add Bot Description:**
   - Go to "General Information"
   - Add description, tags, etc.

4. **Submit to Discord Bot Directory (Optional):**
   - Go to "Bot" section
   - Click "Submit" under "Discord Bot Directory"
   - Fill out application form
   - Wait for approval

---

## 📝 Quick Deploy Scripts

### Railway Setup (railway.json)

Already created - see `railway.json` file.

### Render Setup (render.yaml)

Already created - see `render.yaml` file.

---

## ✅ Post-Deployment Checklist

- [ ] Bot shows as "Online" in Discord
- [ ] Bot responds to verification button
- [ ] Form submission works
- [ ] Role assignment works correctly
- [ ] XP system awards points
- [ ] Logs are being written to channels
- [ ] Security features working (link filtering, anti-scam)

---

## 🐛 Troubleshooting

### Bot shows offline:
- Check environment variable is set correctly
- Verify bot token is valid
- Check deployment logs for errors

### Bot doesn't respond:
- Check bot has necessary permissions
- Verify role/channel IDs in config.js
- Check deployment logs

### Bot crashes/restarts:
- Check logs for error messages
- Verify all dependencies installed
- Check Node.js version (needs 18+)

### Environment variables not working:
- Restart deployment after adding variables
- Verify variable name matches exactly (case-sensitive)
- Check deployment platform's env var format

---

## 📊 Monitoring

### Railway:
- View logs in "Deployments" → "View Logs"

### Render:
- View logs in "Logs" tab

### PM2 (VPS):
```bash
pm2 logs the-system-bot
pm2 monit  # Real-time monitoring
```

---

## 🔄 Updating Bot

### Railway/Render (GitHub connected):
- Just push to GitHub
- Auto-deploys automatically

### Manual update:
- Upload new files
- Restart deployment/service

### PM2:
```bash
# Pull latest code
git pull

# Restart bot
pm2 restart the-system-bot
```

---

## 💰 Cost Comparison

| Platform | Free Tier | Paid (24/7) | Best For |
|----------|-----------|-------------|----------|
| Railway | $5 credit/month | ~$5-10/month | Easiest setup |
| Render | Free (sleeps) | $7/month | Good balance |
| Replit | Free (sleeps) | $5/month | Beginners |
| VPS | None | $6+/month | Full control |
| Heroku | None | $7+/month | Enterprise |

**Recommendation:** Start with **Railway** for easiest deployment, or **Render** for free tier testing.

---

**Need help?** Check the main README.md or open an issue.
