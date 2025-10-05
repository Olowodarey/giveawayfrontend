# How to Get Your JWKS URL from Clerk

## 🔍 Step-by-Step Instructions

### 1. Go to Clerk Dashboard
Visit: [https://dashboard.clerk.com](https://dashboard.clerk.com)

### 2. Select Your Application
Click on your "content-whale-98" application (or your app name)

### 3. Navigate to API Keys
- In the left sidebar, click **"API Keys"**
- OR go directly to: `https://dashboard.clerk.com/apps/[your-app-id]/api-keys`

### 4. Find JWKS Endpoint
- Scroll down to the **"Advanced"** section
- Look for **"JWKS Endpoint"** or **"JSON Web Key Set URL"**
- It will look like:
  ```
  https://content-whale-98.clerk.accounts.dev/.well-known/jwks.json
  ```

### 5. Copy the URL
- Click the copy button or select and copy the entire URL
- Make sure it includes `/.well-known/jwks.json` at the end

---

## 📋 What to Do Next

### Configure ChipiPay Dashboard

1. Go to: [https://dashboard.chipipay.com/configure](https://dashboard.chipipay.com/configure)
2. Click on **"JWKS Endpoint"** in the left menu
3. Fill in the form:

```
┌─────────────────────────────────────────────────────┐
│ JWKS Configuration                                  │
├─────────────────────────────────────────────────────┤
│                                                     │
│ ☐ Use Firebase  (Make sure this is OFF/unchecked) │
│                                                     │
│ JWKS Endpoint URL                                   │
│ ┌─────────────────────────────────────────────────┐ │
│ │ https://content-whale-98.clerk.accounts.dev/   │ │
│ │ .well-known/jwks.json                           │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ User Identifier (the ID that will be used...)       │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Email                                      ▼    │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ JWT Token (For parsing validation rules)            │
│ ┌─────────────────────────────────────────────────┐ │
│ │ (Leave this empty)                              │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│                                    [Add] button     │
└─────────────────────────────────────────────────────┘
```

4. Click **"Add"** button to save

---

## ✅ Verification

After adding the JWKS configuration:

1. The error **"No JWKS configuration found"** should disappear
2. You should see your configuration listed
3. Try signing in and connecting wallet - it should work!

---

## 🎯 Your Clerk Details

Based on your `.env.local`:

- **Publishable Key**: `pk_test_Y29udGVudC13aGFsZS05OC5jbGVyay5hY2NvdW50cy5kZXYk`
- **App Name**: `content-whale-98`
- **Expected JWKS URL**: `https://content-whale-98.clerk.accounts.dev/.well-known/jwks.json`

---

## 🐛 Troubleshooting

### Can't find JWKS URL?
- Make sure you're in the **API Keys** section
- Look for **"Advanced"** or **"JWT Templates"** section
- The URL format is always: `https://[your-app].clerk.accounts.dev/.well-known/jwks.json`

### Still getting errors?
1. Double-check the URL is copied correctly
2. Make sure "Use Firebase" is toggled OFF
3. Verify "Email" is selected as User Identifier
4. Click "Add" to save the configuration
5. Restart your dev server: `npm run dev`

---

## 🚀 Test After Setup

```bash
# Restart dev server
npm run dev
```

Then:
1. Go to http://localhost:3000
2. Click "Sign In"
3. Create account with email
4. Click "Connect Wallet"
5. Enter PIN
6. Success! 🎉

---

**Need the exact URL?** 
Check Clerk Dashboard → API Keys → Advanced → JWKS Endpoint
