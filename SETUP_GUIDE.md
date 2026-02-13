# 🎯 THE SYSTEM Discord Server Setup Guide

Complete step-by-step guide to set up your Discord server for THE SYSTEM bot.

## 📋 Step 1: Create Discord Application & Bot

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click **"New Application"**
3. Name it "THE SYSTEM Bot" (or your preferred name)
4. Go to **"Bot"** section in left sidebar
5. Click **"Add Bot"** → Confirm
6. Under **"Token"**, click **"Reset Token"** → Copy the token (save it securely!)
7. Enable these **Privileged Gateway Intents**:
   - ✅ Server Members Intent
   - ✅ Message Content Intent
8. Scroll down and enable **"Public Bot"** if you want others to invite it
9. Save changes

## 📋 Step 2: Create Discord Server

1. Create a new Discord server (or use existing)
2. Name it "THE SYSTEM" (or your preferred name)

## 📋 Step 3: Create Roles (IN THIS EXACT ORDER)

**Important:** Create roles in this order to maintain proper hierarchy.

1. **Admin**
   - Color: Red (#FF0000)
   - Permissions: All permissions enabled
   - Display separately: Yes

2. **Moderator**
   - Color: Orange (#FFA500)
   - Permissions: Manage Messages, Timeout Members, View Audit Log
   - Display separately: Yes

3. **Early Access**
   - Color: Gold (#FFD700)
   - Permissions: Default permissions
   - Display separately: Yes
   - **Note:** This role will be limited to 500 members

4. **Waitlist**
   - Color: Blue (#0099FF)
   - Permissions: Default permissions
   - Display separately: Yes
   - **Note:** This role will be limited to 10,000 members

5. **Form Submitted**
   - Color: Gray (#808080)
   - Permissions: None (users can't see channels)
   - Display separately: No
   - **Note:** This is a temporary role, keep it hidden

6. **Verified**
   - Color: Green (#00FF00)
   - Permissions: Default permissions
   - Display separately: No

7. **Unverified**
   - Color: Gray (#808080)
   - Permissions: View only #welcome, #rules, #verify
   - Display separately: No
   - **Note:** This is the default role for new members

**After creating all roles:**
- Drag roles in Server Settings → Roles to match the order above (Admin at top, Unverified at bottom)
- Assign yourself the Admin role

## 📋 Step 4: Create Channels

### Welcome Section

1. **#welcome**
   - Category: Welcome (create if needed)
   - Type: Text Channel
   - Permissions:
     - @everyone: View Channel ✅, Send Messages ❌
     - Unverified: View Channel ✅, Send Messages ❌
     - Verified: View Channel ✅, Send Messages ❌
     - Bot: View Channel ✅, Send Messages ✅, Embed Links ✅

2. **#rules**
   - Category: Welcome
   - Type: Text Channel
   - Permissions: Same as #welcome
   - Add your community rules here

3. **#verify**
   - Category: Welcome
   - Type: Text Channel
   - Permissions:
     - @everyone: View Channel ❌
     - Unverified: View Channel ✅, Send Messages ❌
     - Verified: View Channel ✅, Send Messages ❌
     - Bot: View Channel ✅, Send Messages ✅, Manage Messages ✅

### Registration Section

4. **#submit-access-form**
   - Category: Registration (create new category)
   - Type: Text Channel
   - Permissions:
     - @everyone: View Channel ❌
     - Verified: View Channel ✅, Send Messages ❌
     - Bot: View Channel ✅, Send Messages ✅

### Announcements

5. **#announcements**
   - Category: Announcements (create new category)
   - Type: Text Channel
   - Permissions:
     - @everyone: View Channel ❌
     - Early Access: View Channel ✅, Send Messages ❌
     - Waitlist: View Channel ✅, Send Messages ❌
     - Admin: View Channel ✅, Send Messages ✅
     - Moderator: View Channel ✅, Send Messages ✅
     - Bot: View Channel ✅, Send Messages ✅

### Community

6. **#general**
   - Category: Community (create new category)
   - Type: Text Channel
   - Permissions:
     - @everyone: View Channel ❌
     - Early Access: View Channel ✅, Send Messages ✅
     - Waitlist: View Channel ✅, Send Messages ✅
     - Bot: View Channel ✅, Send Messages ✅

### Engagement

7. **#engage**
   - Category: Engagement (create new category)
   - Type: Text Channel
   - Permissions:
     - @everyone: View Channel ❌
     - Early Access: View Channel ✅, Send Messages ✅
     - Waitlist: View Channel ✅, Send Messages ✅
     - Bot: View Channel ✅, Send Messages ✅, Manage Messages ✅
   - **Note:** This is where XP is earned

### Early Access (Gated)

8. **#early-access-chat**
   - Category: Early Access (create new category)
   - Type: Text Channel
   - Permissions:
     - @everyone: View Channel ❌
     - Early Access: View Channel ✅, Send Messages ✅
     - Bot: View Channel ✅, Send Messages ✅

### Moderation (Hidden)

9. **#logs**
   - Category: Moderation (create new category)
   - Type: Text Channel
   - Permissions:
     - @everyone: View Channel ❌
     - Admin: View Channel ✅
     - Moderator: View Channel ✅
     - Bot: View Channel ✅, Send Messages ✅

10. **#reports**
    - Category: Moderation
    - Type: Text Channel
    - Permissions: Same as #logs

11. **#form-logs**
    - Category: Moderation
    - Type: Text Channel
    - Permissions: Same as #logs

## 📋 Step 5: Invite Bot to Server

1. Go back to [Discord Developer Portal](https://discord.com/developers/applications)
2. Select your application
3. Go to **"OAuth2"** → **"URL Generator"**
4. Select scopes:
   - ✅ `bot`
   - ✅ `applications.commands`
5. Select bot permissions:
   - ✅ Manage Roles
   - ✅ Manage Messages
   - ✅ Send Messages
   - ✅ Embed Links
   - ✅ Read Message History
   - ✅ Timeout Members
   - ✅ View Channels
6. Copy the generated URL
7. Open URL in browser and select your server
8. Authorize the bot

## 📋 Step 6: Set Bot Role Position

1. Go to Server Settings → Roles
2. Find your bot's role (usually named after your application)
3. Drag it **above** all other roles except Admin
4. This ensures bot can manage all roles

## 📋 Step 7: Get Role & Channel IDs

1. Enable Developer Mode:
   - User Settings → Advanced → Developer Mode ✅
2. Get Role IDs:
   - Right-click each role → Copy ID
   - Paste into `config.js` under `roles` section
3. Get Channel IDs:
   - Right-click each channel → Copy ID
   - Paste into `config.js` under `channels` section

**Example:**
```javascript
roles: {
  ADMIN: '123456789012345678',        // Right-click Admin role → Copy ID
  MODERATOR: '123456789012345679',    // Right-click Moderator role → Copy ID
  // ... etc
}
```

## 📋 Step 8: Configure Bot

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your bot token:
   ```
   DISCORD_BOT_TOKEN=paste_your_token_here
   ```

3. Edit `config.js` and replace all `YOUR_*_ROLE_ID` and `YOUR_*_CHANNEL_ID` with actual IDs

## 📋 Step 9: Install & Run Bot

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the bot:
   ```bash
   npm start
   ```

3. Check console for:
   - ✅ "THE SYSTEM Bot is online"
   - ✅ "Verification channel setup complete"
   - ✅ "Form channel setup complete"

## 📋 Step 10: Test the Flow

1. **Test Verification:**
   - Create a test account (or use alt account)
   - Join server → Should get Unverified role
   - Go to #verify → Click "Verify Me" button
   - Should get Verified role

2. **Test Form Submission:**
   - Go to #submit-access-form (should only see if Verified)
   - Click "Open Form" button
   - Fill form with test data
   - Submit → Should get Early Access or Waitlist role

3. **Test XP System:**
   - Post a Twitter link in #engage
   - Should get ✅ reaction and XP
   - Try posting non-Twitter link → Should be deleted

4. **Test Security:**
   - Try posting suspicious content → Should be deleted and user timed out
   - Check #reports channel for log

## ✅ Verification Checklist

- [ ] All 7 roles created in correct order
- [ ] All 11 channels created with correct permissions
- [ ] Bot invited with correct permissions
- [ ] Bot role positioned above other roles (except Admin)
- [ ] All role IDs copied to `config.js`
- [ ] All channel IDs copied to `config.js`
- [ ] Bot token added to `.env`
- [ ] Bot starts without errors
- [ ] Verification button appears in #verify
- [ ] Form button appears in #submit-access-form
- [ ] Test user can verify successfully
- [ ] Test user can submit form successfully
- [ ] Role assignment works correctly

## 🚨 Common Issues

**Bot doesn't respond:**
- Check bot is online (green status)
- Verify token is correct
- Check bot has necessary permissions

**Roles not assigning:**
- Verify bot role is high enough in hierarchy
- Check role IDs are correct in config.js
- Ensure bot has "Manage Roles" permission

**Channels not visible:**
- Check channel permissions
- Verify user has correct role
- Check channel IDs in config.js

**Forms not working:**
- Ensure user has Verified role first
- Check channel permissions
- Verify bot can send messages in form channel

---

**Need help?** Check the main README.md for troubleshooting section.
