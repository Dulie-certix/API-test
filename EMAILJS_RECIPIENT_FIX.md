# Fix: "The recipients address is empty"

## Problem:
EmailJS template doesn't have recipient email configured.

## Solution:

### For User Template (template_cp5it8h):
1. Go to https://dashboard.emailjs.com/admin/templates/template_cp5it8h
2. Find "To Email" field in template settings
3. Set it to: `{{to_email}}`
4. Save template

### For Admin Template (template_0s85ayb):
1. Go to https://dashboard.emailjs.com/admin/templates/template_0s85ayb
2. Find "To Email" field in template settings
3. Set it to: `sathsarani.m@botcalm.com` (your admin email)
4. Save template

## Template Settings Should Look Like:

### User Template:
- Template Name: User Complaint Confirmation
- To Email: `{{to_email}}`
- From Name: Support Team
- Subject: `Complaint Received - {{subject}}`

### Admin Template:
- Template Name: Admin Complaint Notification
- To Email: `sathsarani.m@botcalm.com`
- From Name: Complaint System
- Subject: `New Complaint from {{from_name}}`

## Important:
- User template uses `{{to_email}}` variable (dynamic)
- Admin template uses fixed email address
- Make sure "To Email" field is NOT empty
