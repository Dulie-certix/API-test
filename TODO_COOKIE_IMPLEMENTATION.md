# JWT Cookie Implementation Progress

## Backend
- [ ] 1. src/middleware/auth.ts - Check cookies first, then Authorization header
- [ ] 2. src/routes/authRoutes.ts - Add logout route

## Frontend
- [ ] 3. Create src/utils/cookies.ts - Cookie utility functions
- [ ] 4. src/pages/Login/login.tsx - Store token in cookies
- [ ] 5. src/services/authService.ts - Use cookies instead of localStorage
- [ ] 6. src/libs/axios.ts - Get token from cookies + add withCredentials
- [ ] 7. src/hooks/useAuth.ts - Use cookies instead of localStorage
- [ ] 8. src/components/ProtectedRoute.tsx - Use cookies instead of localStorage
