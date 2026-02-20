# Full-Stack Authentication & Authorization System

## Overview
Complete JWT-based authentication system with Role-Based Access Control (RBAC) using React, Node.js, Express, and MongoDB.

## Features
- ✅ JWT Authentication with HTTP-only cookies
- ✅ Role-Based Access Control (RBAC)
- ✅ Two roles: Admin (hardcoded) and User (database)
- ✅ Protected routes on frontend and backend
- ✅ Automatic token verification
- ✅ Secure password hashing with bcrypt
- ✅ Auto-redirect after login

---

## Architecture

### Backend Structure
```
src/
├── controllers/
│   └── authController.ts       # Login, logout, verify token
├── middleware/
│   └── auth.ts                 # JWT verification & role checking
├── models/
│   └── User.ts                 # User schema with role field
├── routes/
│   ├── authRoutes.ts           # Auth endpoints
│   └── productRoutes.ts        # Protected product routes
├── utils/
│   └── jwt.ts                  # JWT generation & verification
└── server.ts                   # Express server setup
```

### Frontend Structure
```
src/
├── components/
│   ├── ProtectedRoute.tsx      # Route protection wrapper
│   └── login-form.tsx          # Login UI component
├── hooks/
│   └── useAuth.ts              # Authentication hook
├── services/
│   └── authService.ts          # Auth API calls
├── pages/
│   ├── Login/
│   │   └── login.tsx           # Login page
│   └── Products/
│       └── ProductsPage.tsx    # Role-based product management
└── types/
    └── auth.ts                 # TypeScript interfaces
```

---

## Implementation Details

### 1. User Model (Backend)
**File:** `src/models/User.ts`

```typescript
// User schema includes role field
const userSchema = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  // ... other fields
});

// Password hashing before save
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Password comparison method
userSchema.methods.comparePassword = async function(password: string) {
  return bcrypt.compare(password, this.password);
};
```

### 2. JWT Utilities (Backend)
**File:** `src/utils/jwt.ts`

```typescript
// JWT payload includes user role
export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

// Generate token with role
export const generateToken = (user: IUser): string => {
  const payload: JWTPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

// Verify token
export const verifyToken = (token: string): JWTPayload => {
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
};

// HTTP-only cookie configuration
export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/',
};
```

### 3. Authentication Middleware (Backend)
**File:** `src/middleware/auth.ts`

```typescript
// Verify JWT token from cookie or header
export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  // Check cookies first, then Authorization header
  let token = req.cookies?.[COOKIE_NAME];
  
  if (!token) {
    const authHeader = req.headers['authorization'];
    token = authHeader && authHeader.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = verifyJWT(token);
    req.user = decoded; // Attach user info to request
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// Require admin role
export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};
```

### 4. Auth Controller (Backend)
**File:** `src/controllers/authController.ts`

```typescript
// Login endpoint - supports hardcoded admin and database users
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Check hardcoded admin
  if (email === 'admin@gmail.com' && password === 'admin123') {
    const adminUser = {
      _id: 'admin',
      email: 'admin@gmail.com',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin' as const
    };
    
    const token = generateToken(adminUser as any);
    res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);
    
    return res.json({
      token,
      user: { id: adminUser._id, email: adminUser.email, 
              firstName: adminUser.firstName, lastName: adminUser.lastName, 
              role: adminUser.role }
    });
  }

  // Check database user
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = generateToken(user);
  res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);
  
  res.json({
    token,
    user: { id: user._id, email: user.email, 
            firstName: user.firstName, lastName: user.lastName, 
            role: user.role }
  });
};

// Verify token endpoint
export const verifyToken = async (req: Request, res: Response) => {
  let token = req.cookies?.[COOKIE_NAME];
  
  if (!token) {
    const authHeader = req.headers['authorization'];
    token = authHeader && authHeader.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const decoded = verifyJWT(token);
  
  // Return user data based on decoded token
  if (decoded.userId === 'admin') {
    return res.json({
      user: { id: 'admin', email: 'admin@gmail.com', 
              firstName: 'Admin', lastName: 'User', role: 'admin' }
    });
  }

  const user = await User.findById(decoded.userId);
  if (!user) {
    return res.status(401).json({ message: 'User not found' });
  }

  res.json({
    user: { id: user._id, email: user.email, 
            firstName: user.firstName, lastName: user.lastName, 
            role: user.role }
  });
};
```

### 5. Protected Routes (Backend)
**File:** `src/routes/productRoutes.ts`

```typescript
const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Create - Admin only
router.post("/", requireAdmin, async (req, res) => {
  const product = await Product.create(req.body);
  res.json(product);
});

// Read - All authenticated users
router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Update - Admin only
router.patch("/:id", requireAdmin, async (req, res) => {
  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// Delete - Admin only
router.delete("/:id", requireAdmin, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});
```

### 6. Protected Routes (Frontend)
**File:** `src/components/ProtectedRoute.tsx`

```typescript
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/verify", {
          credentials: "include", // Send cookies
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          localStorage.removeItem("user");
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    verifyToken();
  }, []);

  if (isAuthenticated === null) {
    return <LoadingSpinner />;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};
```

### 7. Role-Based UI (Frontend)
**File:** `src/pages/Products/ProductsPage.tsx`

```typescript
export default function ProductsPage() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user?.role === "admin";

  const handleEdit = (product: Product) => {
    if (!isAdmin) {
      alert("Access Denied: Only admins can edit products");
      return;
    }
    setEditProduct(product);
    setEditDialogOpen(true);
  };

  const handleDelete = async (product: Product) => {
    if (!isAdmin) {
      alert("Access Denied: Only admins can delete products");
      return;
    }
    try {
      await productService.deleteProduct(product._id);
      await fetchProducts();
    } catch (error) {
      alert("Failed to delete product. You may not have permission.");
    }
  };

  return (
    <div>
      <h1>Products</h1>
      <p>{isAdmin ? "Manage your product inventory" : "View product inventory (Read-only)"}</p>
      
      {/* Show Add button only for admin */}
      {isAdmin && (
        <Button onClick={() => setDialogOpen(true)}>
          <Plus /> Add Product
        </Button>
      )}
      
      {/* Pass isAdmin to table columns */}
      <DataTable columns={createProductColumns(handleView, handleEdit, handleDelete, isAdmin)} data={products} />
    </div>
  );
}
```

---

## Access Control Matrix

| Resource | Admin | User |
|----------|-------|------|
| Dashboard | ✅ Full Access | ✅ Full Access |
| Products - View | ✅ Yes | ✅ Yes |
| Products - Create | ✅ Yes | ❌ No |
| Products - Update | ✅ Yes | ❌ No |
| Products - Delete | ✅ Yes | ❌ No |

---

## Test Accounts

### Admin (Hardcoded)
- **Email:** admin@gmail.com
- **Password:** admin123
- **Access:** Full CRUD on products + Dashboard

### User (Database)
- **Email:** user@example.com
- **Password:** user123
- **Access:** Read-only products + Dashboard

---

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create `.env` file:
```env
MONGO_URI=mongodb://localhost:27017/your-database
JWT_SECRET=your_super_secret_jwt_key
PORT=5000
```

### 3. Create Test Users
```bash
npm run create-dummy-admin
```

### 4. Fix Existing Users (Add role field)
```bash
npm run fix-user-roles
```

### 5. Run Backend
```bash
npm run server
```

### 6. Run Frontend
```bash
npm run dev
```

---

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/logout` - Logout and clear cookie
- `GET /api/auth/verify` - Verify JWT token

### Products (Protected)
- `GET /api/products` - Get all products (Auth required)
- `GET /api/products/:id` - Get single product (Auth required)
- `POST /api/products` - Create product (Admin only)
- `PATCH /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

---

## Security Features

1. **HTTP-only Cookies:** JWT stored in HTTP-only cookie (not accessible via JavaScript)
2. **Password Hashing:** bcrypt with salt rounds of 12
3. **Token Expiration:** 7 days
4. **CORS Configuration:** Credentials enabled for specific origin
5. **Role Verification:** Both frontend and backend validate user roles
6. **Secure Cookie Options:** 
   - httpOnly: true
   - secure: true (in production)
   - sameSite: 'lax'

---

## Error Handling

### Backend
- `401 Unauthorized` - No token or invalid credentials
- `403 Forbidden` - Valid token but insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

### Frontend
- Automatic redirect to login on 401
- Alert messages for permission denied (403)
- Loading states during authentication
- Error messages for failed operations

---

## Flow Diagrams

### Login Flow
```
User enters credentials
    ↓
POST /api/auth/login
    ↓
Backend validates credentials
    ↓
Generate JWT with role
    ↓
Set HTTP-only cookie
    ↓
Return user data
    ↓
Frontend stores user in localStorage
    ↓
Redirect to Dashboard
```

### Protected Route Access
```
User navigates to protected route
    ↓
ProtectedRoute component checks auth
    ↓
GET /api/auth/verify (with cookie)
    ↓
Backend verifies JWT
    ↓
Return user data with role
    ↓
Frontend checks role for UI elements
    ↓
Render page with role-based features
```

### Product CRUD (Admin)
```
Admin clicks "Add Product"
    ↓
POST /api/products (with cookie)
    ↓
authenticateToken middleware
    ↓
requireAdmin middleware
    ↓
Create product in database
    ↓
Return success
```

### Product Read (User)
```
User views products
    ↓
GET /api/products (with cookie)
    ↓
authenticateToken middleware
    ↓
Fetch products from database
    ↓
Return products
    ↓
UI shows read-only view (no edit/delete buttons)
```

---

## Troubleshooting

### Issue: Users can't login
**Solution:** Run `npm run fix-user-roles` to add role field to existing users

### Issue: 401 on protected routes
**Solution:** Check if cookie is being sent with `credentials: 'include'`

### Issue: Admin can't perform CRUD
**Solution:** Verify JWT payload includes `role: 'admin'`

### Issue: CORS errors
**Solution:** Ensure backend CORS is configured with `credentials: true` and correct origin

---

## Best Practices Implemented

1. ✅ Separation of concerns (controllers, services, middleware)
2. ✅ TypeScript for type safety
3. ✅ Environment variables for sensitive data
4. ✅ Password hashing (never store plain text)
5. ✅ HTTP-only cookies (XSS protection)
6. ✅ Role-based access control on both frontend and backend
7. ✅ Token expiration
8. ✅ Proper error handling and status codes
9. ✅ Clean folder structure
10. ✅ Reusable components and hooks

---

## Future Enhancements

- [ ] Refresh token mechanism
- [ ] Password reset functionality
- [ ] Email verification
- [ ] Rate limiting
- [ ] Audit logging
- [ ] Multi-factor authentication (MFA)
- [ ] More granular permissions
- [ ] Session management

---

## License
MIT
