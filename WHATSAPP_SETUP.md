# Meta WhatsApp Business Cloud API Integration Guide

This document describes the complete architecture, setup, configuration, and troubleshooting procedures for the Meta WhatsApp Business Cloud API integrated into Uttkarsh Corporation.

---

## 1. Architecture Overview

```
Customer Registration (React + Vite)
              │
              ▼  POST /api/members/register
Node.js Backend (Express)
              │
              ├── 1. Validate registration data
              ├── 2. Save member to MongoDB (User collection)
              │
              ▼ (if save succeeds)
WhatsApp Service (`services/whatsAppService.js`)
              │
              ├── 1. Normalize phone to E.164 without `+` (e.g., 919876543210)
              ├── 2. Build approved Meta template payload (with user's full name in {{1}})
              ├── 3. Send HTTPS POST to Meta Graph API
              │
              ▼
Meta WhatsApp Cloud API (`https://graph.facebook.com/{version}/{phone_id}/messages`)
              │
              ├── Success: Return Message ID (wamid...) -> Save "sent" to MongoDB User
              └── Error: Return structured Meta error -> Save "failed" to MongoDB User
```

> **Reliability Guarantee**: A temporary WhatsApp delivery failure never rolls back or cancels a successful database registration.

---

## 2. Meta WhatsApp Cloud API Setup (Step-by-Step)

### Step 1: Create Meta Developer App
1. Go to [Meta for Developers](https://developers.facebook.com/).
2. Log in and click **My Apps** > **Create App**.
3. Select **Business** or **Other** as the app type.
4. Name the application (e.g. `UtkarshCorporation`) and select your Meta Business Account.
5. In the app dashboard, locate **WhatsApp** and click **Set up**.

### Step 2: Configure WhatsApp Business
1. Under your App Dashboard navigation, expand **WhatsApp** > **API Setup**.
2. Note down:
   - **Phone Number ID** (e.g. `1251790298025321`)
   - **WhatsApp Business Account ID (WABA ID)**

### Step 3: Add / Verify WhatsApp Business Phone Number
1. In the **WhatsApp** > **API Setup** page, add your business phone number (e.g. `+91 93130 38607`).
2. Verify the number via SMS or voice call OTP.
3. Once verified, the number status in Meta will display as **CONNECTED** with **VERIFIED** name status.

### Step 4: Generate Permanent System User Access Token
Temporary access tokens expire after 24 hours. For production:
1. Go to [Meta Business Settings](https://business.facebook.com/settings).
2. Under **Users**, click **System Users**.
3. Create a System User (Role: **Admin** or **Employee**).
4. Click **Generate New Token**.
5. Select your App (`UtkarshCorporation`).
6. Select the required permissions:
   - `whatsapp_business_messaging`
   - `whatsapp_business_management`
   - `business_management`
7. Set token expiration to **Never** (Permanent token).
8. Copy the generated token securely.

### Step 5: Create and Submit WhatsApp Message Template
Meta Cloud API requires an **approved message template** for initiating outbound conversations to customers outside the 24-hour service window.

1. In **WhatsApp Manager** (via Business Settings or App Dashboard > WhatsApp > Configuration > Message Templates).
2. Click **Create Template**.
3. Fill in details:
   - **Category**: `UTILITY` or `MARKETING` (Recommended: `UTILITY`)
   - **Name**: `hello_world`
   - **Language**: `English (US)` (`en_US`)
4. **Header**: None (or optional text/media)
5. **Body**:
   ```
   Hello {{1}},

   Welcome to Uttkarsh Corporation! Your member registration has been successfully received.

   You can now log in to the member portal to view your services and updates.

   Regards,
   Uttkarsh Corporation Team
   ```
   - Parameter `{{1}}` is mapped dynamically to the customer's Full Name.
6. Click **Submit** for review. Approvals typically take 1–15 minutes.

---

## 3. Environment Variables Configuration

In `Uttkarsh-Backend/.env`:

```env
# ---------------------------------------------------------------------------
# Meta WhatsApp Cloud API Configuration
# ---------------------------------------------------------------------------

# Phone Number ID (From Meta Developer Dashboard -> WhatsApp -> API Setup)
WHATSAPP_PHONE_NUMBER_ID=1251790298025321

# WhatsApp Cloud API Permanent System User Access Token
WHATSAPP_ACCESS_TOKEN=your_system_user_access_token_here

# Meta Graph API Version (defaults to v25.0)
WHATSAPP_API_VERSION=v25.0

# Name of your approved template in Meta WhatsApp Manager
WHATSAPP_WELCOME_TEMPLATE_NAME=hello_world

# Language code of your approved template (must match Meta, e.g. en_US or en)
WHATSAPP_WELCOME_TEMPLATE_LANGUAGE=en_US
```

> **Security Note**:
> - Never prefix backend secrets with `VITE_` or expose them to React frontend code.
> - Ensure `Uttkarsh-Backend/.env` is listed in `.gitignore`.

---

## 4. Phone Number Normalization

WhatsApp Cloud API requires recipient phone numbers in international format **without** leading `+`, spaces, or hyphens.

The service provides `normalizeWhatsAppPhoneNumber(phone)`:
| User Input | Normalized Output | Description |
| :--- | :--- | :--- |
| `9876543210` | `919876543210` | Standard 10-digit Indian number prepended with country code `91` |
| `+91 98765 43210` | `919876543210` | Formatted number cleaned of `+` and spaces |
| `09876543210` | `919876543210` | 11 digits with leading `0` stripped and `91` prepended |
| `98765-43210` | `919876543210` | Hyphenated number converted to pure digits |
| `+1 (555) 123-4567` | `15551234567` | International US number formatted without `+` |
| `123` | `null` | Invalid length rejected without corrupting data |

---

## 5. Testing & Diagnostics

### 1. Automated Unit Tests
Run the standalone unit test suite:
```bash
cd Uttkarsh-Backend
node tests/whatsapp_cloud_api.test.js
```
Expected output:
```
--- Test Suite: WhatsApp Business Cloud API Integration ---
 PASS T1 - T25: All 25 test cases passing (100%)
```

### 2. Built-in Backend Diagnostic CLI
Run the diagnostic script:
```bash
cd Uttkarsh-Backend
npm run test:whatsapp
```
To send a live test template to a specific phone number:
```bash
npm run test:whatsapp -- 919876543210 "Dr. Rajesh Sharma"
```

### 3. API Endpoints for Diagnostics

#### A. Check Configuration Status
```http
GET http://localhost:1990/api/whatsapp/status
```
Response:
```json
{
  "success": true,
  "configured": true,
  "phoneNumberIdConfigured": true,
  "tokenConfigured": true,
  "apiVersion": "v25.0",
  "templateConfigured": true,
  "templateName": "hello_world",
  "templateLanguage": "en_US",
  "endpoint": "https://graph.facebook.com/v25.0/1251790298025321/messages"
}
```

#### B. Send Test Welcome Template
```http
POST http://localhost:1990/api/whatsapp/test
Content-Type: application/json

{
  "phoneNumber": "919876543210",
  "userName": "Test User"
}
```

#### C. Full Registration Flow
```http
POST http://localhost:1990/api/members/register
Content-Type: application/json

{
  "fullName": "New Member",
  "email": "member@example.com",
  "password": "Password123",
  "mobileNumber": "9876543210",
  "address": "123 Business Street",
  "city": "Ahmedabad",
  "state": "Gujarat",
  "pinCode": "380001"
}
```
Response:
```json
{
  "success": true,
  "message": "Registration successful. You can now log in and complete your personal details...",
  "whatsappMessageSent": true,
  "user": { ... }
}
```

---

## 6. Troubleshooting Common Meta Errors

| HTTP Status | Error Code | Meta Message / Cause | Solution |
| :--- | :--- | :--- | :--- |
| `400` | `100` | `(#100) Invalid parameter` | The template name configured in `.env` is either not created yet in Meta WhatsApp Manager, is awaiting review, has a different language code (`en` vs `en_US`), or parameter count doesn't match `{{1}}`. |
| `400` | `132001` | `Template name does not exist in the translation` | Ensure `WHATSAPP_WELCOME_TEMPLATE_NAME` and `WHATSAPP_WELCOME_TEMPLATE_LANGUAGE` match the approved template in Meta Business Manager. |
| `401` | `190` | `Invalid OAuth access token` | The System User access token has expired or was revoked. Generate a new permanent System User token in Meta Business Settings. |
| `400` | `131030` | `Recipient phone number not in allowed list` | If your Meta WhatsApp app is in **Development Mode**, you must add recipient phone numbers under **API Setup** > **To** dropdown before sending messages. |
| `400` | `131058` | `Hello World templates can only be sent from Public Test Numbers` | You are using a verified live business number (`+91 93130 38607`). Do not send `hello_world`; use your approved business template. |
| `400` | `131047` | `Re-engagement message: More than 24 hours have elapsed` | Triggered when attempting to send free-text messages instead of templates. The system now strictly uses approved templates. |

---

## 7. Production Deployment Requirements

1. **Set Environment Variables on Hosting (Render / VPS)**:
   Add the following variables to your hosting environment:
   - `WHATSAPP_PHONE_NUMBER_ID`
   - `WHATSAPP_ACCESS_TOKEN`
   - `WHATSAPP_API_VERSION=v25.0`
   - `WHATSAPP_WELCOME_TEMPLATE_NAME`
   - `WHATSAPP_WELCOME_TEMPLATE_LANGUAGE`
2. **Meta App Mode**:
   - In Meta Developer Dashboard, ensure your app is switched from **Development** to **Live** mode so messages can be delivered to all recipient phone numbers without pre-registering them as test recipients.
3. **Payment Method on Meta Business Manager**:
   - WhatsApp Cloud API utility template messages have a per-conversation charge after the free monthly tier. Ensure a valid credit card or payment method is attached to your Meta WhatsApp Business Account.
