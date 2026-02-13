# 🚀 Discord Server Setup - Automated

Yeh guide aapko Discord server setup karne mein help karega.

## 📋 Step-by-Step Guide

### Step 1: Discord Bot Token Leni Hai

1. [Discord Developer Portal](https://discord.com/developers/applications) pe jao
2. **"New Application"** click karo
3. Name do: "THE SYSTEM Bot"
4. Left sidebar mein **"Bot"** section pe jao
5. **"Add Bot"** click karo
6. **"Token"** ke neeche **"Reset Token"** click karo
7. Token copy karo aur save karo (yeh zaroori hai!)

### Step 2: Bot Ko Server Mein Invite Karo

1. Same page pe **"OAuth2"** → **"URL Generator"** pe jao
2. Scopes select karo:
   - ✅ `bot`
   - ✅ `applications.commands`
3. Bot Permissions select karo:
   - ✅ **Administrator** (temporarily - setup ke liye zaroori hai)
   - Ya phir individually:
     - ✅ Manage Roles
     - ✅ Manage Channels
     - ✅ Manage Messages
     - ✅ Send Messages
     - ✅ Embed Links
     - ✅ Read Message History
     - ✅ Timeout Members
     - ✅ View Channels
4. Generated URL copy karo
5. Browser mein open karo
6. Apna server select karo
7. **"Authorize"** click karo

### Step 3: Environment Setup

1. `.env` file banao (agar nahi hai):
   ```bash
   cp .env.example .env
   ```

2. `.env` file edit karo aur token add karo:
   ```
   DISCORD_BOT_TOKEN=apka_bot_token_yahan_paste_karo
   ```

### Step 4: Automated Setup Run Karo

Ab automated script chalayenge jo sab kuch setup kar degi:

```bash
node setup-discord-server.js
```

Yeh script automatically:
- ✅ Saare roles create karega
- ✅ Saare channels create karega
- ✅ Permissions set karega
- ✅ Role hierarchy set karega
- ✅ Config.js ke liye IDs generate karega

### Step 5: Config.js Update Karo

Script run hone ke baad, console mein IDs dikhengi. Unhe copy karke `config.js` file mein paste karo.

Ya phir script automatically console mein complete config print karega - use copy karo.

### Step 6: Bot Start Karo

```bash
npm start
```

Bot ab online ho jayega aur sab kuch kaam karega!

### Step 7: Bot Permissions (Optional but Recommended)

Setup complete hone ke baad:
1. Server Settings → Roles
2. Bot role ko dhoondo
3. Administrator permission hata do (agar chahte ho)
4. Sirf zaroori permissions rakho:
   - Manage Roles
   - Manage Messages
   - Send Messages
   - Embed Links
   - Read Message History
   - Timeout Members

## ✅ Kya Kya Setup Hoga?

### Roles (7):
1. Admin
2. Moderator
3. Early Access
4. Waitlist
5. Form Submitted
6. Verified
7. Unverified

### Channels (11):
**Welcome:**
- #welcome
- #rules
- #verify

**Registration:**
- #submit-access-form

**Announcements:**
- #announcements

**Community:**
- #general

**Engagement:**
- #engage

**Early Access:**
- #early-access-chat

**Moderation:**
- #logs
- #reports
- #form-logs

## 🎯 Bot Ko Public Karne Ke Liye

Agar aap chahte ho ki dusre log bhi bot ko invite kar sakein:

1. [Discord Developer Portal](https://discord.com/developers/applications) pe jao
2. Apna application select karo
3. **"Bot"** section mein jao
4. **"Public Bot"** enable karo ✅
5. **"General Information"** mein description add karo

## 🚨 Important Notes

- Bot ko pehle server mein invite karna zaroori hai
- Setup script ek baar hi chalana hai
- Agar channels/roles already hain, toh script unhe skip kar degi
- Config.js update karna mat bhoolo!

## 🆘 Troubleshooting

**Script error de raha hai?**
- Check karo ki bot token sahi hai
- Check karo ki bot server mein hai
- Check karo ki bot ko Administrator permission hai (setup ke liye)

**Bot online nahi ho raha?**
- Check karo ki token sahi hai
- Check karo ki config.js mein IDs sahi hain
- Console mein errors check karo

**Channels dikhai nahi de rahe?**
- Permissions check karo
- Role hierarchy check karo
- Bot ko zaroori permissions hain ya nahi check karo

---

**Setup complete hone ke baad, aapka Discord server THE SYSTEM community ke liye ready hai!** 🎉
