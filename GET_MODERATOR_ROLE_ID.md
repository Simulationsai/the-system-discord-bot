# 🔍 Get Moderator Role ID

## Issue:
Moderator role ID missing in config. Need to find it.

## ✅ Solution:

### Method 1: Discord Server Se Direct (Easiest)

1. **Discord Server Mein Jao**
2. **Server Settings** → **Roles** pe jao
3. **"Moderator"** role dhoondo
4. Role pe **right-click** karo
5. **"Copy ID"** select karo (Developer Mode enable hona chahiye)
6. ID copy karo aur `config.js` mein paste karo

### Method 2: Developer Mode Enable Karo

1. **User Settings** (bottom left corner mein apna profile)
2. **Advanced** section pe jao
3. **Developer Mode** enable karo ✅
4. Ab roles/channels pe right-click karke "Copy ID" option dikhega

### Method 3: Bot Se Check Karo

Discord mein ye command type karo (agar bot online hai):
```
!get-roles
```

Ya check karo setup messages mein - Moderator role create hua hoga aur uska ID dikhna chahiye.

---

## 📝 Update Config.js:

`config.js` file mein ye line update karo:

```javascript
MODERATOR: '1471896758900000000', // Replace with actual Moderator role ID
```

---

**Moderator role ID milne ke baad config.js update karo aur bot restart karo!** 🔧
