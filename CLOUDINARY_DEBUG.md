# Cloudinary Upload Debug Guide

## 🔍 Check if Image is Uploading

### Step 1: Test Cloudinary Connection
Run this command to test if Cloudinary credentials are correct:
```bash
npx tsx src/utils/testCloudinary.ts
```

Expected output:
```
✅ Cloudinary connection successful!
```

If it fails, check your `.env` file credentials.

---

### Step 2: Check Server Logs

1. Start the server:
```bash
npm run server
```

2. Try to add a product with an image

3. Check the console output. You should see:
```
=== Product Create Request ===
File received: Yes
Uploading to Cloudinary...
File size: 12345
File type: image/jpeg
Cloudinary upload success: https://res.cloudinary.com/...
Product created: 507f1f77bcf86cd799439011
```

---

### Step 3: Common Issues & Solutions

#### Issue 1: "File received: No"
**Problem:** Image not being sent from frontend
**Solution:** 
- Check if file input has `name="thumbnail"`
- Verify FormData is being created correctly
- Check browser Network tab to see if file is in request

#### Issue 2: Cloudinary upload error
**Problem:** Invalid credentials or network issue
**Solutions:**
- Verify credentials in `.env` are correct
- Check Cloudinary dashboard: https://cloudinary.com/console
- Make sure no extra spaces in `.env` values
- Restart server after changing `.env`

#### Issue 3: "Only image files are allowed"
**Problem:** Wrong file type selected
**Solution:** Select only image files (jpg, png, gif, etc.)

#### Issue 4: File too large
**Problem:** File exceeds 5MB limit
**Solution:** 
- Compress image before upload
- Or increase limit in `src/middleware/upload.ts`

---

### Step 4: Manual Test with Postman

Test the API directly:

1. Open Postman
2. Create POST request: `http://localhost:5000/api/products`
3. Set Authorization header with your token
4. Body → form-data
5. Add fields:
   - name: "Test Product"
   - price: 99
   - description: "Test description"
   - category: "Test"
   - brand: "Test"
   - stock: 10
   - thumbnail: [Select File] → Choose an image
6. Send request

Check server console for logs.

---

### Step 5: Verify Cloudinary Dashboard

1. Go to https://cloudinary.com/console
2. Click "Media Library"
3. Look for "products" folder
4. Check if images are appearing there

---

## 🔧 Quick Fixes

### Fix 1: Restart Server
After changing `.env`, always restart:
```bash
# Stop server (Ctrl+C)
npm run server
```

### Fix 2: Check .env Format
Make sure no quotes or extra spaces:
```env
CLOUDINARY_CLOUD_NAME=dulie
CLOUDINARY_API_KEY=643891554626235
CLOUDINARY_API_SECRET=A1Azgs6_hj7ZdGiZUTt29_dhW3vk
```

NOT:
```env
CLOUDINARY_CLOUD_NAME="dulie"  ❌
CLOUDINARY_API_KEY = 643891554626235  ❌ (extra spaces)
```

### Fix 3: Verify File Input Name
In `productForm.tsx`, file input should have correct name:
```tsx
<input
  type="file"
  accept="image/*"
  onChange={handleImageUpload}
  // No name attribute needed - we use selectedFile state
/>
```

And in FormData:
```tsx
if (selectedFile) {
  data.append("thumbnail", selectedFile);  // ✅ Must be "thumbnail"
}
```

---

## 📝 Debugging Checklist

- [ ] Cloudinary credentials correct in `.env`
- [ ] Server restarted after `.env` changes
- [ ] File input working (can select file)
- [ ] Preview showing (means file selected)
- [ ] Server console shows "File received: Yes"
- [ ] Server console shows "Cloudinary upload success"
- [ ] No errors in browser console
- [ ] No errors in server console
- [ ] Image appears in Cloudinary dashboard
- [ ] Product saved with thumbnail URL in database

---

## 🎯 Expected Flow

1. User selects image → `selectedFile` state updated
2. User submits form → FormData created
3. FormData sent to backend → Multer receives file
4. Server logs: "File received: Yes"
5. File uploaded to Cloudinary → Server logs: "Cloudinary upload success"
6. Product created with thumbnail URL
7. Response sent to frontend
8. Success toast shown

---

## 🆘 Still Not Working?

Run the test script and share the output:
```bash
npx tsx src/utils/testCloudinary.ts
```

Then try adding a product and share:
1. Browser console errors (F12 → Console)
2. Server console output
3. Network tab request details (F12 → Network)
