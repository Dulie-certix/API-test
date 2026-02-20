# JWT Token Cookie Implementation Plan

## Backend Changes:
- [ ] 1. src/utils/jwt.ts - Add cookie options configuration
- [ ] 2. src/controllers/authController.ts - Set token in HTTP-only cookie on login, add logout function
- [ ] 3. src/middleware/auth.ts - Check cookies first, then Authorization header
- [ ] 4. src/routes/authRoutes.ts - Add logout route

## Frontend Changes:
- [ ] 5. src/services/authService.ts - Read token from cookies instead of localStorage
- [ ] 6. src/pages/Login/login.tsx - Store token in cookies
- [ ] 7. src/libs/axios.ts - Get token from cookies in interceptor
- [ ] 8. src/hooks/useAuth.ts - Use cookie-based token retrieval
- [ ] 9. src/components/ProtectedRoute.tsx - Check cookies for authentication
