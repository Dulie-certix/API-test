# EmailJS Template Variables - IMPORTANT!

## 422 Error Fix

The 422 error means template variables don't match. Use these EXACT variable names in your EmailJS templates:

## Variables sent from code:
- `{{from_name}}` - User's name
- `{{from_email}}` - User's email
- `{{to_email}}` - Recipient email
- `{{subject}}` - Complaint subject
- `{{message}}` - Complaint message

## Update Your EmailJS Templates:

### Template 1: User Confirmation (template_cp5it8h)

**Subject:** 
```
Complaint Received - {{subject}}
```

**Body:**
```
Dear {{from_name}},

Thank you for contacting us. We have received your complaint with the following details:

Subject: {{subject}}
Message: {{message}}

We will review your complaint and get back to you at {{from_email}} as soon as possible.

Best regards,
Support Team
```

### Template 2: Admin Notification (template_0s85ayb)

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

Please review and respond accordingly.
```

## Steps to Fix:

1. Go to https://dashboard.emailjs.com/admin/templates
2. Edit template_cp5it8h (User template)
3. Replace all variables with the ones above
4. Save template
5. Edit template_0s85ayb (Admin template)
6. Replace all variables with the ones above
7. Save template
8. Test again!

## Important Notes:
- Variable names are case-sensitive
- Use double curly braces: {{variable_name}}
- Don't add extra spaces inside braces
- Make sure all variables used in template are sent from code
