# Quick Start Guide - Image Upload System

## 🚀 Get Started in 5 Minutes

### Step 1: Get Cloudinary Credentials
1. Go to https://cloudinary.com/users/register_free
2. Sign up for a free account
3. Go to Dashboard
4. Copy your credentials:
   - Cloud Name
   - API Key
   - API Secret

### Step 2: Update Environment Variables
Open `.env` file and replace with your credentials:
```env
CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
CLOUDINARY_API_KEY=your_actual_api_key
CLOUDINARY_API_SECRET=your_actual_api_secret
```

### Step 3: Start the Backend
```bash
npm run server
```
Server will run on http://localhost:5000

### Step 4: Start the Frontend
```bash
npm run dev
```
Frontend will run on http://localhost:5173

### Step 5: Test the Upload
1. Navigate to the upload demo page
2. Select an image file
3. See the preview
4. Click "Upload Image"
5. View the uploaded image from Cloudinary

---

## 📁 Files Created

### Backend:
- `src/config/cloudinary.ts` - Cloudinary setup
- `src/middleware/upload.ts` - Multer configuration
- `src/controllers/uploadController.ts` - Upload logic
- `src/routes/uploadRoutes.ts` - API routes

### Frontend:
- `src/components/ImageUpload.tsx` - Simple upload
- `src/components/ProductUploadForm.tsx` - Full product form
- `src/pages/UploadDemo.tsx` - Demo page

### Documentation:
- `IMAGE_UPLOAD_SYSTEM.md` - Complete documentation
- `QUICK_START.md` - This file

---

## 🧪 Test the API with Postman

### Upload Image Endpoint
```
POST http://localhost:5000/api/upload/image
Body: form-data
Key: image (type: File)
Value: [Select an image file]
```

### Create Product with Image
```
POST http://localhost:5000/api/upload/product
Body: form-data
Keys:
- name: "Test Product"
- price: 99.99
- description: "Test description"
- category: "Electronics"
- brand: "TestBrand"
- stock: 10
- image: [Select an image file]
```

---

## ✅ Verify Setup

1. **Backend Running**: Visit http://localhost:5000
   - Should see: "API running with TypeScript"

2. **MongoDB Connected**: Check server console
   - Should see: "MongoDB connected successfully"

3. **Cloudinary Configured**: Upload an image
   - Should return URL like: `https://res.cloudinary.com/...`

---

## 🔧 Common Issues

**"No file uploaded"**
- Ensure FormData key is "image"
- Check file input has `name="image"`

**"Upload failed"**
- Verify Cloudinary credentials in `.env`
- Restart server after updating `.env`

**CORS Error**
- Check frontend URL matches in `server.ts`
- Default is `http://localhost:5173`

**File too large**
- Current limit: 5MB
- Change in `src/middleware/upload.ts`

---

## 📚 Next Steps

1. Read `IMAGE_UPLOAD_SYSTEM.md` for detailed documentation
2. Customize the components for your needs
3. Add authentication to upload routes
4. Implement image optimization
5. Add multiple file upload support

---

## 💡 Usage Examples

### In Your Component:
```tsx
import ImageUpload from './components/ImageUpload';

function MyPage() {
  return (
    <div>
      <h1>Upload Your Image</h1>
      <ImageUpload />
    </div>
  );
}
```

### Or Use Product Form:
```tsx
import ProductUploadForm from './components/ProductUploadForm';

function AddProduct() {
  return <ProductUploadForm />;
}
```

---

## 🎉 You're All Set!

Your full-stack image upload system is ready to use. Happy coding! 🚀
