# 🚀 START HERE - Quick Setup Guide

## Step 1: Bot Token Lo

1. [Discord Developer Portal](https://discord.com/developers/applications) pe jao
2. "New Application" click karo
3. Bot section mein jao aur token copy karo

## Step 2: Token Ko .env Mein Add Karo

```bash
# .env file banao/edit karo
DISCORD_BOT_TOKEN=apka_token_yahan_paste_karo
```

## Step 3: Bot Ko Server Mein Invite Karo

1. Developer Portal mein OAuth2 → URL Generator
2. Scopes: `bot` + `applications.commands`
3. Permissions: **Administrator** (temporarily setup ke liye)
4. URL copy karo aur browser mein open karo
5. Server select karo aur authorize karo

## Step 4: Automated Setup Chalao

```bash
npm install
npm run setup
```

Yeh automatically:
- ✅ Saare roles banayega
- ✅ Saare channels banayega  
- ✅ Permissions set karega
- ✅ Config.js ke liye IDs dega

## Step 5: Config.js Update Karo

Script ke output mein IDs dikhengi - unhe copy karke `config.js` mein paste karo.

## Step 6: Bot Start Karo

```bash
npm start
```

**Done!** 🎉

---

**Agar koi problem ho toh `DISCORD_SETUP.md` dekho detailed guide ke liye.**
