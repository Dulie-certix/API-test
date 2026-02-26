# Admin Email Not Receiving - Fix Guide

## Problem:
Admin email එක receive වෙන්නේ නැහැ.

## Root Cause:
EmailJS template එකේ "To Email" field එක හරියට configure වෙලා නැහැ.

## Solution - Step by Step:

### Step 1: Check Admin Template Settings
1. Go to: https://dashboard.emailjs.com/admin/templates/template_0s85ayb
2. Look for "Settings" section at the top
3. Find "To Email" field

### Step 2: Configure "To Email" Field
You have 2 options:

#### Option A: Use Variable (Recommended)
- To Email: `{{to_email}}`
- This allows dynamic email from code

#### Option B: Use Fixed Email
- To Email: `sathsarani.m@botcalm.com`
- This always sends to admin email

### Step 3: Verify Template Content
Make sure your admin template has:

**Subject:**
```
New Complaint from {{from_name}}
```

**Body:**
```
New Complaint Submitted

User Name: {{from_name}}
User Email: {{from_email}}
Subject: {{subject}}

Message:
{{message}}

---
This is an automated notification from the complaint system.
```

### Step 4: Check Email Service
1. Go to: https://dashboard.emailjs.com/admin
2. Click on your service (service_b9wbv5l)
3. Make sure it's connected and active
4. Check if there are any error messages

### Step 5: Verify Email Address
Make sure `sathsarani.m@botcalm.com` is:
- Spelled correctly
- A valid email address
- Not blocked by EmailJS
- Not in spam folder

### Step 6: Test with Console Logs
Check browser console for:
```
EmailJS Config loaded:
  ADMIN_EMAIL: ✓
```

If it shows ✗, restart dev server.

## Common Issues:

### Issue 1: Template "To Email" is empty
**Fix:** Set it to `{{to_email}}` in template settings

### Issue 2: Email goes to spam
**Fix:** Check spam folder, add sender to contacts

### Issue 3: Service not connected
**Fix:** Reconnect email service in EmailJS dashboard

### Issue 4: Wrong email address
**Fix:** Verify admin email in .env file

## Current Configuration:
- Admin Email: sathsarani.m@botcalm.com
- Admin Template: template_0s85ayb
- Service: service_b9wbv5l

## Test Steps:
1. Submit a complaint
2. Check browser console for errors
3. Check EmailJS dashboard → "History" tab
4. Look for sent emails and their status
5. Check admin email inbox and spam folder
