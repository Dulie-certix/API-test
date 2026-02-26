# EmailJS Troubleshooting Guide

## Error: "Failed to submit complaint"

### Step 1: Restart Dev Server
After adding environment variables, you MUST restart your dev server:
```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
# or
yarn dev
```

### Step 2: Check Browser Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for:
   - "EmailJS Config loaded:" - Should show ✓ for all fields
   - Any error messages from EmailJS

### Step 3: Verify Environment Variables
Check if variables are loaded:
- Open browser console
- Type: `import.meta.env`
- Verify all VITE_EMAILJS_* variables are present

### Step 4: Common Issues

#### Issue: Environment variables not loading
**Solution:** 
- Make sure variable names start with `VITE_`
- Restart dev server after changing .env
- Clear browser cache

#### Issue: "User ID not found"
**Solution:**
- Check if PUBLIC_KEY is correct (not Private Key)
- Verify Service ID is active in EmailJS dashboard

#### Issue: Template not found
**Solution:**
- Verify template IDs match exactly in EmailJS dashboard
- Check template names: `template_cp5it8h` and `template_0s85ayb`

#### Issue: CORS error
**Solution:**
- EmailJS should work from localhost
- If deployed, add your domain to EmailJS allowed origins

### Step 5: Test EmailJS Directly
Add this test function to ComplaintsPage:

```typescript
const testEmailJS = async () => {
  try {
    const result = await emailjs.send(
      'service_b9wbv5l',
      'template_cp5it8h',
      {
        user_name: 'Test User',
        user_email: 'test@example.com',
        subject: 'Test',
        message: 'Test message',
      },
      'Wq6pIgeGLwEJquPq9'
    );
    console.log('Test successful:', result);
  } catch (error) {
    console.error('Test failed:', error);
  }
};
```

### Step 6: Verify EmailJS Dashboard
1. Go to https://dashboard.emailjs.com/
2. Check:
   - Service is connected and active
   - Templates exist with correct IDs
   - Email quota not exceeded (200/month free)
   - No blocked domains

### Current Configuration:
- Service ID: service_b9wbv5l
- User Template: template_cp5it8h
- Admin Template: template_0s85ayb
- Public Key: Wq6pIgeGLwEJquPq9

### Next Steps:
1. Restart your dev server
2. Open browser console
3. Try submitting a complaint
4. Share the console error message for further help
