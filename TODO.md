# Project Cleanup and Organization Plan

## Overview
This plan outlines steps to make the full-stack React + Express project clear, clean, and well-organized. Focus areas include TypeScript improvements, error handling, code organization, security, and consistency.

## Phase 1: TypeScript and Type Safety
- [ ] Create comprehensive type definitions in `src/types/`
  - [ ] Define `User` interface for frontend use (replace 'any')
  - [ ] Define `AuthUser` interface for authenticated user state
  - [ ] Define API response types for login/register
- [ ] Update components to use proper types
  - [ ] `src/App.tsx`: Replace 'any' with `AuthUser | null`
  - [ ] `src/components/Layout.tsx`: Update user prop types
  - [ ] `src/services/authService.ts`: Add return types and parameter types

## Phase 2: Backend Improvements
- [ ] Clean up `src/routes/authRoutes.ts`
  - [ ] Remove hardcoded dummy admin logic
  - [ ] Add missing JWT import
  - [ ] Simplify password handling (remove plain text support)
  - [ ] Add proper input validation middleware
  - [ ] Reduce excessive console logging
  - [ ] Add rate limiting for auth endpoints
- [ ] Add authentication middleware
  - [ ] Create `src/middleware/auth.ts` for JWT verification
  - [ ] Apply to protected routes
- [ ] Improve error handling in all routes
  - [ ] Standardize error responses
  - [ ] Add proper HTTP status codes

## Phase 3: Frontend Improvements
- [ ] Refactor `src/App.tsx`
  - [ ] Extract authentication logic to custom hook
  - [ ] Improve routing with React Router (replace activeTab state)
  - [ ] Add loading states for authentication
- [ ] Clean up components
  - [ ] Ensure consistent prop interfaces
  - [ ] Add proper error boundaries
  - [ ] Optimize re-renders with React.memo where appropriate

## Phase 4: Code Organization and Consistency
- [ ] Organize imports consistently across files
  - [ ] Group: React imports, third-party, local components/services
  - [ ] Sort alphabetically within groups
- [ ] Remove unused code and dependencies
  - [ ] Check for unused imports with ESLint
  - [ ] Remove commented-out code
- [ ] Standardize file naming and structure
  - [ ] Ensure consistent casing (PascalCase for components, camelCase for files)
- [ ] Add JSDoc comments to complex functions

## Phase 5: Security and Best Practices
- [ ] Environment variables
  - [ ] Ensure all sensitive data uses env vars
  - [ ] Add validation for required env vars
- [ ] Input validation
  - [ ] Add Zod schemas for API inputs
  - [ ] Sanitize user inputs
- [ ] CORS configuration
  - [ ] Restrict origins in production

## Phase 6: Testing and Documentation
- [ ] Add README updates
  - [ ] Document API endpoints
  - [ ] Update setup instructions
- [ ] Run existing linting and formatting
  - [ ] Fix any ESLint warnings
  - [ ] Ensure Prettier formatting

## Phase 7: Final Verification
- [ ] Test all functionality
  - [ ] Authentication flow
  - [ ] CRUD operations
  - [ ] Error scenarios
- [ ] Performance check
  - [ ] Bundle size analysis
  - [ ] Lighthouse audit

## Current Task: Call Login Page in App.tsx
- [ ] Import React Router components (BrowserRouter, Routes, Route) in src/App.tsx
- [ ] Import LoginPage from src/pages/Login/login.tsx
- [ ] Set up routing structure with route for "/login" rendering LoginPage
- [ ] Add basic route structure (e.g., default route to login if not authenticated)
- [ ] Test the app to verify login page renders correctly
