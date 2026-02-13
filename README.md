# 🌌 THE SYSTEM Discord Bot

Fully automated Discord community bot for **THE SYSTEM** - a Web3 universe with gated access, role automation, engagement-based progression, and anti-scam protection.

## ✨ Features

- ✅ **Gated Onboarding** - Multi-step verification process
- 🤖 **Role Automation** - Automatic role assignment based on capacity
- 📝 **Inbuilt Discord Forms** - Modal-based form submission (no external links)
- 🎯 **XP System** - Engagement-based progression in `#engage` channel
- 🔒 **Anti-Scam Protection** - Automatic detection and removal of suspicious content
- 📊 **Comprehensive Logging** - All actions logged to dedicated channels
- 🚫 **Link Filtering** - Only Twitter/X links allowed in engagement channel

## 📋 Prerequisites

- Node.js 18+ installed
- Discord Bot Token (from [Discord Developer Portal](https://discord.com/developers/applications))
- Discord Server with appropriate permissions

## 🚀 Quick Setup

### Option A: Local Development

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and add your bot token:

```bash
cp .env.example .env
```

Edit `.env`:
```
DISCORD_BOT_TOKEN=your_actual_bot_token_here
```

### 3. Create Discord Server Structure

#### **Roles** (Create in this exact order, top to bottom):

1. `Admin` - Server administrators
2. `Moderator` - Community moderators
3. `Early Access` - Limited to 500 members
4. `Waitlist` - Limited to 10,000 members
5. `Form Submitted` - Temporary role (hidden)
6. `Verified` - Verified members
7. `Unverified` - Default role for new members

**Important:** Set role hierarchy correctly (Admin at top, Unverified at bottom)

#### **Channels** (Create with these exact names):

**Welcome Section:**
- `#welcome` - Read-only, visible to Unverified + Verified
- `#rules` - Read-only, visible to Unverified + Verified
- `#verify` - Bot-only interaction, visible to Unverified + Verified

**Registration Section:**
- `#submit-access-form` - Visible ONLY to Verified, no text messages allowed

**Announcements:**
- `#announcements` - Visible to Early Access + Waitlist, Admin-only posting

**Community:**
- `#general` - Visible to Early Access + Waitlist

**Engagement:**
- `#engage` - Visible to Early Access + Waitlist, XP enabled, Twitter links only

**Early Access (Gated):**
- `#early-access-chat` - Visible ONLY to Early Access

**Moderation (Hidden from regular users):**
- `#logs` - Bot action logs
- `#reports` - Security reports
- `#form-logs` - Form submission logs

### 4. Configure Bot Permissions

The bot needs these permissions:
- ✅ Manage Roles
- ✅ Manage Messages
- ✅ Send Messages
- ✅ Embed Links
- ✅ Read Message History
- ✅ Timeout Members
- ✅ View Channels

**Do NOT give:** Administrator permission (security best practice)

### 5. Update Configuration

Edit `config.js` and replace all `YOUR_*_ROLE_ID` and `YOUR_*_CHANNEL_ID` with actual IDs:

**How to get IDs:**
1. Enable Developer Mode in Discord (User Settings → Advanced → Developer Mode)
2. Right-click on role/channel → Copy ID
3. Paste into `config.js`

Example:
```javascript
roles: {
  ADMIN: '123456789012345678',
  MODERATOR: '123456789012345679',
  // ... etc
}
```

### 6. Invite Bot to Server

Create invite link with these scopes:
- `bot`
- `applications.commands`

Minimum permissions: `Manage Roles`, `Manage Messages`, `Send Messages`, `Embed Links`, `Read Message History`, `Timeout Members`

### 7. Start the Bot

**Local Development:**
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

**Deploy to Cloud (24/7):**
See `QUICK_DEPLOY.md` for fastest deployment options (Railway, Render, etc.)
Or see `DEPLOYMENT.md` for detailed guides on all platforms.

## 🔄 How It Works

### Onboarding Flow

1. **User Joins** → Gets `Unverified` role automatically
2. **User Clicks Verify** → Bot checks account age (7+ days)
3. **Verification Success** → Gets `Verified` role, `Unverified` removed
4. **User Submits Form** → Gets `Form Submitted` role temporarily
5. **Role Assignment:**
   - If Early Access < 500 → Gets `Early Access` role
   - Else if Waitlist < 10,000 → Gets `Waitlist` role
   - Else → No role assigned (both full)

### XP System

- **Location:** Only in `#engage` channel
- **Requirements:** Must post valid Twitter/X link
- **XP per post:** 10 XP (configurable)
- **Cooldown:** 2 minutes between XP awards
- **Promotion:** Waitlist users with 1000+ XP can upgrade to Early Access (if space available)

### Security Features

- **Link Filtering:** Only Twitter/X links allowed in `#engage`
- **Anti-Scam:** Detects suspicious keywords and unauthorized links
- **Auto-Timeout:** Users posting suspicious content get 1-hour timeout
- **No External Forms:** All forms use Discord's built-in modal system
- **One Submission:** Each user can only submit form once

## ⚙️ Configuration Options

Edit `config.js` to customize:

- **Role Limits:** `EARLY_ACCESS_MAX` (default: 500), `WAITLIST_MAX` (default: 10,000)
- **XP Settings:** `XP_PER_POST` (default: 10), `COOLDOWN_SECONDS` (default: 120), `PROMOTION_THRESHOLD` (default: 1000)
- **Link Regex:** Twitter/X link validation pattern

## 📊 Monitoring

All actions are logged to:
- `#logs` - General bot actions (verifications, role assignments, promotions)
- `#form-logs` - Form submissions with user data
- `#reports` - Security incidents and suspicious content

## 🔧 Troubleshooting

### Bot doesn't respond
- Check if bot token is correct in `.env`
- Verify bot has necessary permissions
- Check console for error messages

### Roles not assigning
- Verify role IDs in `config.js` are correct
- Check bot's role is above roles it needs to assign
- Ensure bot has "Manage Roles" permission

### Forms not working
- Verify channel IDs in `config.js`
- Check user has `Verified` role before accessing form
- Ensure bot has permission to send messages in form channel

### XP not awarding
- Verify `#engage` channel ID is correct
- Check user has `Early Access` or `Waitlist` role
- Ensure message contains valid Twitter/X link

## 🛡️ Security Notes

- **Never share your bot token** - Keep `.env` file private
- **Staff DMs:** Bot enforces that staff never DM users first
- **Private Keys:** Form includes checkbox warning about never sharing private keys
- **No Manual Overrides:** System is fully automated - no shortcuts

## 📝 System Philosophy

- ✅ No giveaways
- ✅ No manual approvals
- ✅ No favoritism
- ✅ No shortcuts
- ✅ System decides everything
- ✅ History is permanent

## 🚨 Important Reminders

1. **Role Hierarchy:** Must be set correctly in Discord (Admin → Moderator → Early Access → Waitlist → Form Submitted → Verified → Unverified)
2. **Channel Permissions:** Configure carefully - wrong permissions break the flow
3. **Bot Role:** Bot's role must be high enough to manage all other roles
4. **Data Persistence:** Current implementation uses in-memory storage. For production, add a database (MongoDB, PostgreSQL, etc.)

## 📦 Production Deployment

For production use, consider:
- Adding a database (MongoDB/PostgreSQL) for persistent storage
- Adding error handling and retry logic
- Setting up process manager (PM2)
- Adding monitoring/alerting
- Implementing backup system for user data

## 📄 License

MIT

---

**Built for THE SYSTEM** 🌌
