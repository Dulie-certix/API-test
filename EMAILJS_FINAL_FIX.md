# EmailJS Template - FINAL CORRECT VERSION

## Error: "One or more dynamic variables are corrupted"
This means template variables don't match code variables.

## SOLUTION: Use ONLY these variables in your templates

### User Template (template_cp5it8h)

**Settings:**
- To Email: `{{to_email}}`
- From Name: Support Team
- Reply To: `{{reply_to}}`

**Subject:**
```
Complaint Received - {{subject}}
```

**Body:**
```
Dear {{to_name}},

Thank you for contacting us. We have received your complaint.

Subject: {{subject}}

Message:
{{message}}

We will review your complaint and get back to you at {{user_email}} soon.

Best regards,
Support Team
```

---

### Admin Template (template_0s85ayb)

**Settings:**
- To Email: `{{to_email}}`
- From Name: `{{from_name}}`
- Reply To: `{{reply_to}}`

**Subject:**
```
New Complaint from {{user_name}}
```

**Body:**
```
New Complaint Received

User Name: {{user_name}}
User Email: {{user_email}}
Subject: {{subject}}

Message:
{{message}}

---
Reply to: {{reply_to}}
```

---

## Variables Sent from Code:
- `{{to_name}}` - Recipient name
- `{{from_name}}` - Sender name
- `{{to_email}}` - Recipient email
- `{{reply_to}}` - Reply email
- `{{user_name}}` - User's name
- `{{user_email}}` - User's email
- `{{subject}}` - Complaint subject
- `{{message}}` - Complaint message

## IMPORTANT RULES:
1. ✅ ONLY use variables listed above
2. ✅ Use double curly braces: {{variable}}
3. ✅ No spaces inside braces
4. ✅ Variable names are case-sensitive
5. ❌ DON'T use variables not sent from code
6. ❌ DON'T add extra variables

## Steps to Fix:
1. Go to EmailJS Dashboard
2. Edit template_cp5it8h
3. Copy-paste the User Template content above
4. Save
5. Edit template_0s85ayb
6. Copy-paste the Admin Template content above
7. Save
8. Test!

## If Still Getting Error:
1. Check template for typos in variable names
2. Make sure ALL variables in template are in the list above
3. Remove any extra variables from template
4. Check for spaces inside {{variable}}
