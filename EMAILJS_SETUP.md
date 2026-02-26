# EmailJS Setup Instructions

## 1. EmailJS Account Setup
1. Go to https://www.emailjs.com/
2. Sign up or login
3. Create a new Email Service (Gmail, Outlook, etc.)
4. Note your Service ID

## 2. Create Email Templates

### Template 1: User Confirmation (TEMPLATE_ID_USER)
**Template Name:** complaint_user_confirmation

**Subject:** Complaint Received - {{subject}}

**Content:**
```
Dear {{user_name}},

Thank you for contacting us. We have received your complaint with the following details:

Subject: {{subject}}
Message: {{message}}

We will review your complaint and get back to you at {{user_email}} as soon as possible.

Best regards,
Support Team
```

### Template 2: Admin Notification (TEMPLATE_ID_ADMIN)
**Template Name:** complaint_admin_notification

**Subject:** New Complaint Received from {{user_name}}

**Content:**
```
New Complaint Submitted

User Name: {{user_name}}
User Email: {{user_email}}
Subject: {{subject}}

Message:
{{message}}

Please review and respond accordingly.
```

## 3. Update .env File
Replace the placeholder values in .env with your actual EmailJS credentials:

```
VITE_EMAILJS_SERVICE_ID=your_actual_service_id
VITE_EMAILJS_TEMPLATE_USER=complaint_user_confirmation
VITE_EMAILJS_TEMPLATE_ADMIN=complaint_admin_notification
VITE_EMAILJS_PUBLIC_KEY=your_actual_public_key
```

## 4. Get Your Public Key
1. Go to EmailJS Dashboard
2. Click on "Account" → "General"
3. Copy your Public Key

## 5. Test the Integration
1. Run your application
2. Go to Complaints page
3. Fill the form and submit
4. Check both user email and admin email for confirmation

## Template Variables Used:
- {{user_name}} - Name of the user
- {{user_email}} - Email of the user
- {{subject}} - Subject of the complaint
- {{message}} - Complaint message

## Notes:
- Make sure to verify your email service in EmailJS
- Check spam folder if emails don't arrive
- EmailJS free tier allows 200 emails/month
