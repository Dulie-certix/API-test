# Debug කරන්නේ කොහොමද - Cloudinary Upload

## 🔍 පියවර 1: Browser Console බලන්න

1. Browser එක open කරන්න (Chrome/Edge)
2. F12 press කරන්න (Developer Tools)
3. "Console" tab එක click කරන්න
4. Product add කරන්න image එකක් එක්ක
5. Console එකේ මේ messages බලන්න:

```
=== Form Submit ===
Selected file: File { name: "image.jpg", size: 12345, ... }
Adding file to FormData: image.jpg 12345
Sending request...
```

### මොකද්ද පෙන්වන්න ඕනේ:

✅ **"Selected file: File"** - File එක select වෙලා තියෙනවා
✅ **"Adding file to FormData"** - File එක FormData එකට add වෙනවා
✅ **"Sending request..."** - Request යනවා

❌ **"Selected file: null"** - File එක select වෙලා නැහැ
❌ **"No file selected"** - File input එක work කරන්නේ නැහැ

---

## 🔍 පියවර 2: Server Console බලන්න

Server terminal එකේ මේ messages බලන්න:

```
=== Product Create Request ===
File received: Yes
File size: 12345
File type: image/jpeg
Uploading to Cloudinary...
Cloudinary upload success: https://res.cloudinary.com/...
Product created: 507f1f77bcf86cd799439011
```

### මොකද්ද පෙන්වන්න ඕනේ:

✅ **"File received: Yes"** - Backend එකට file එක ආවා
✅ **"Cloudinary upload success"** - Cloudinary වලට upload වුණා
✅ **"Product created"** - Database එකේ save වුණා

❌ **"File received: No"** - Backend එකට file එක ආවේ නැහැ
❌ **"Cloudinary upload error"** - Cloudinary වලට upload වෙන්නේ නැහැ

---

## 🔧 Common Issues සහ විසඳුම්

### Issue 1: "Selected file: null"
**Problem:** File select වෙන්නේ නැහැ
**Fix:**
1. File input එක click කරන්න
2. Image එකක් select කරන්න
3. Preview එක පෙන්වනවද බලන්න

### Issue 2: "File received: No"
**Problem:** Backend එකට file එක යන්නේ නැහැ
**Fix:**
1. Browser console එකේ "Adding file to FormData" පෙන්වනවද බලන්න
2. Network tab එකේ request එක check කරන්න (F12 → Network)
3. Request payload එකේ file එක තියෙනවද බලන්න

### Issue 3: "Cloudinary upload error"
**Problem:** Cloudinary credentials වැරදියි
**Fix:**
1. `.env` file එක check කරන්න
2. Credentials හරිද verify කරන්න
3. Server restart කරන්න

---

## 📝 Debug Steps

1. **Browser Console Open කරන්න** (F12)
2. **Product add කරන්න** image එකක් එක්ක
3. **Browser console logs copy කරන්න**
4. **Server console logs copy කරන්න**
5. **මොනවද පෙන්වන්නේ කියන්න**

---

## ✅ හරි වැඩ කරන විදිය

### Browser Console:
```
=== Form Submit ===
Selected file: File { name: "test.jpg", size: 45678 }
Adding file to FormData: test.jpg 45678
Sending request...
Request successful!
```

### Server Console:
```
=== Product Create Request ===
File received: Yes
File size: 45678
File type: image/jpeg
Uploading to Cloudinary...
Cloudinary upload success: https://res.cloudinary.com/dulie/image/upload/v1234567890/products/abc123.jpg
Product created: 507f1f77bcf86cd799439011
```

---

## 🆘 තවමත් වැඩ කරන්නේ නැත්නම්

මේ දේවල් share කරන්න:

1. Browser console output (F12 → Console)
2. Server console output (terminal එකේ)
3. Network tab request details (F12 → Network → Click request → Preview/Response)

එතකොට issue එක හොයාගන්න පුළුවන්! 🚀
