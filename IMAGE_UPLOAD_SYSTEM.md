# Image Upload System Documentation

## Overview
Full-stack image upload system with React frontend, Node.js/Express backend, MongoDB storage, and Cloudinary for image hosting.

---

## Project Structure

```
src/
├── config/
│   ├── cloudinary.ts          # Cloudinary configuration
│   └── database.ts             # MongoDB connection
├── middleware/
│   └── upload.ts               # Multer file upload middleware
├── controllers/
│   └── uploadController.ts     # Upload logic handlers
├── routes/
│   └── uploadRoutes.ts         # Upload API endpoints
├── models/
│   └── Product.ts              # Product schema with thumbnail
├── components/
│   ├── ImageUpload.tsx         # Simple image upload component
│   └── ProductUploadForm.tsx   # Complete product form with image
└── server.ts                   # Express server entry point
```

---

## Setup Instructions

### 1. Install Dependencies
```bash
npm install cloudinary multer @types/multer
```

### 2. Configure Cloudinary
1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Get your credentials from the dashboard
3. Update `.env` file:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Start the Server
```bash
npm run server
```

---

## Backend Architecture

### **cloudinary.ts** - Cloudinary Configuration
Initializes Cloudinary SDK with environment variables.

### **upload.ts** - Multer Middleware
- Uses memory storage (no disk writes)
- 5MB file size limit
- Only accepts image files
- Validates file type before processing

### **uploadController.ts** - Upload Handlers
**uploadImage**: Uploads single image to Cloudinary
- Accepts file via FormData
- Uploads to "products" folder
- Optionally updates Product document
- Returns secure image URL

**createProductWithImage**: Creates product with image
- Accepts product data + image file
- Uploads image first, then creates product
- Stores Cloudinary URL in MongoDB

### **uploadRoutes.ts** - API Endpoints
- `POST /api/upload/image` - Upload single image
- `POST /api/upload/product` - Create product with image

---

## Frontend Components

### **ImageUpload.tsx** - Simple Upload Component
Features:
- File input with image validation
- Live preview before upload
- Loading spinner during upload
- Error handling with user feedback
- Display uploaded image URL
- Uses FormData API

### **ProductUploadForm.tsx** - Complete Product Form
Features:
- Full product form (name, price, description, etc.)
- Image upload with preview
- Form validation
- Loading state management
- Success/error notifications
- Resets form after successful submission

---

## API Usage Examples

### Upload Single Image
```javascript
const formData = new FormData();
formData.append("image", file);

const response = await axios.post(
  "http://localhost:5000/api/upload/image",
  formData,
  { headers: { "Content-Type": "multipart/form-data" } }
);

console.log(response.data.imageUrl); // Cloudinary URL
```

### Create Product with Image
```javascript
const formData = new FormData();
formData.append("name", "Product Name");
formData.append("price", "99.99");
formData.append("description", "Description");
formData.append("category", "Electronics");
formData.append("brand", "Brand");
formData.append("stock", "10");
formData.append("image", file);

await axios.post(
  "http://localhost:5000/api/upload/product",
  formData,
  { headers: { "Content-Type": "multipart/form-data" } }
);
```

---

## Security Features

1. **Environment Variables**: Sensitive credentials stored in `.env`
2. **File Validation**: Only image files accepted
3. **File Size Limit**: 5MB maximum
4. **Memory Storage**: Files not saved to disk
5. **CORS Configuration**: Restricted to localhost:5173
6. **Error Handling**: Proper error messages without exposing internals

---

## How It Works

### Upload Flow:
1. User selects image → Preview shown
2. User clicks upload → FormData created
3. Frontend sends POST request with file
4. Multer middleware processes file
5. Controller uploads to Cloudinary
6. Cloudinary returns secure URL
7. URL saved to MongoDB (if product)
8. Response sent to frontend
9. Frontend displays uploaded image

### Key Technologies:
- **Multer**: Handles multipart/form-data
- **Cloudinary**: Cloud image storage & CDN
- **FormData**: Browser API for file uploads
- **MongoDB**: Stores image URLs
- **React**: UI with hooks for state management

---

## Usage in Your App

### Option 1: Simple Image Upload
```tsx
import ImageUpload from './components/ImageUpload';

function App() {
  return <ImageUpload />;
}
```

### Option 2: Product Form with Image
```tsx
import ProductUploadForm from './components/ProductUploadForm';

function App() {
  return <ProductUploadForm />;
}
```

---

## Troubleshooting

**Upload fails**: Check Cloudinary credentials in `.env`
**File too large**: Increase limit in `upload.ts`
**CORS error**: Verify origin in `server.ts` matches frontend URL
**Preview not showing**: Check file type validation

---

## Next Steps

- Add image compression before upload
- Support multiple image uploads
- Add drag-and-drop functionality
- Implement image cropping
- Add progress bar for large files
