# 🔧 Final Setup Checklist - Fix "Invalid JWT token" Error

## ✅ Current Status

Based on your setup, here's what we have:

### Clerk (✅ Configured)
- ✅ Publishable Key: `pk_test_Y29udGVudC13aGFsZS05OC5jbGVyay5hY2NvdW50cy5kZXYk`
- ✅ Secret Key: `sk_test_70qh7OpXxDU3B1RPlvV8NSThM1YHMw3VjxFj9T1OpY`
- ✅ Frontend URL: `https://content-whale-98.clerk.accounts.dev`
- ✅ JWKS URL: `https://content-whale-98.clerk.accounts.dev/.well-known/jwks.json`

### ChipiPay (⚠️ Needs Configuration)
- ✅ Public Key: `pk_prod_5e5488f15194f4b7df58d3ef616461f3`
- ⚠️ Secret Key: Using placeholder (needs real key)
- ❌ JWKS Not Configured Yet

---

## 🎯 What You Need to Do

### Step 1: Get ChipiPay Secret Key (Optional but Recommended)

1. Go to [ChipiPay Dashboard](https://dashboard.chipipay.com/configure/api-keys)
2. Find your **Secret Key** (starts with `sk_prod_`)
3. Copy it
4. Update `.env.local`:
   ```env
   CHIPI_SECRET_KEY=sk_prod_your_actual_secret_key_here
   ```

**Note**: The demo secret key might work, but using the real one is more secure.

---

### Step 2: Configure JWKS in ChipiPay (CRITICAL - This Fixes the Error!)

This is the **most important step** to fix the "Invalid JWT token" error!

#### 2.1 Go to ChipiPay Dashboard
Visit: [https://dashboard.chipipay.com/configure](https://dashboard.chipipay.com/configure)

#### 2.2 Navigate to JWKS Endpoint
Click **"JWKS Endpoint"** in the left sidebar (under "Developers" section)

#### 2.3 Fill in the Configuration

```
┌──────────────────────────────────────────────────────────┐
│ JWKS Configuration                                       │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ ☐ Use Firebase                                          │
│    ↑ MAKE SURE THIS IS UNCHECKED/OFF                   │
│                                                          │
│ JWKS Endpoint URL                                        │
│ ┌────────────────────────────────────────────────────┐  │
│ │ https://content-whale-98.clerk.accounts.dev/       │  │
│ │ .well-known/jwks.json                              │  │
│ └────────────────────────────────────────────────────┘  │
│                                                          │
│ User Identifier (the ID that will be used to identify   │
│ the user)                                                │
│ ┌────────────────────────────────────────────────────┐  │
│ │ Email                                          ▼  │  │
│ └────────────────────────────────────────────────────┘  │
│                                                          │
│ JWT Token (For parsing validation rules)                │
│ ┌────────────────────────────────────────────────────┐  │
│ │ (Leave this completely empty)                      │  │
│ └────────────────────────────────────────────────────┘  │
│                                                          │
│                                          [Add] button    │
└──────────────────────────────────────────────────────────┘
```

#### 2.4 Exact Values to Enter

Copy and paste these exact values:

**JWKS Endpoint URL:**
```
https://content-whale-98.clerk.accounts.dev/.well-known/jwks.json
```

**User Identifier:**
```
Email
```

**JWT Token:**
```
(leave empty)
```

#### 2.5 Save Configuration
Click the **"Add"** button to save

---

### Step 3: Verify Configuration

After saving, you should see:
- ✅ Your JWKS configuration listed in the dashboard
- ✅ Status showing as "Active" or "Configured"
- ✅ No error message about "No JWKS configuration found"

---

### Step 4: Restart Your App

```bash
# Stop the current server (Ctrl+C if running)
# Then restart
npm run dev
```

---

### Step 5: Test the Complete Flow

1. **Go to**: http://localhost:3000 (or 3001 if 3000 is busy)

2. **Sign In**:
   - Click "Sign In" button
   - Create account with your email
   - Verify email if prompted

3. **Connect Wallet**:
   - After signing in, click "Connect Wallet"
   - Enter a PIN (e.g., "1234")
   - Wait for wallet creation

4. **Expected Result**:
   - ✅ Wallet created successfully
   - ✅ You see your wallet address
   - ✅ No "Invalid JWT token" error

5. **Create Giveaway**:
   - Go to `/create`
   - Fill in details
   - Should work without errors!

---

## 🐛 Troubleshooting

### Still Getting "Invalid JWT token"?

**Check these:**

1. **JWKS URL is correct**:
   ```
   https://content-whale-98.clerk.accounts.dev/.well-known/jwks.json
   ```
   - Must include `/.well-known/jwks.json`
   - Must match your Clerk domain exactly

2. **"Use Firebase" is OFF**:
   - The toggle must be unchecked/disabled
   - If it's on, turn it off

3. **User Identifier is "Email"**:
   - Select "Email" from the dropdown
   - Not "UID" or other options

4. **JWT Token field is empty**:
   - Don't paste anything here
   - Leave it completely blank

5. **Configuration is saved**:
   - Click "Add" button
   - See confirmation message
   - Configuration appears in list

6. **App is restarted**:
   - Stop dev server (Ctrl+C)
   - Run `npm run dev` again
   - Clear browser cache if needed

---

## 📊 How It Works

### Before JWKS Configuration:
```
User signs in → Clerk issues JWT token
     ↓
App sends token to ChipiPay
     ↓
ChipiPay: "What's JWKS? I can't validate this!"
     ↓
❌ Error: "Invalid JWT token"
```

### After JWKS Configuration:
```
User signs in → Clerk issues JWT token
     ↓
App sends token to ChipiPay
     ↓
ChipiPay: "Let me check JWKS endpoint..."
     ↓
ChipiPay validates token against Clerk's JWKS
     ↓
✅ Token valid! Create wallet!
```

---

## 🎯 Summary

**The main issue**: ChipiPay can't validate Clerk's JWT tokens without JWKS configuration.

**The solution**: Configure JWKS endpoint in ChipiPay dashboard with your Clerk JWKS URL.

**Your JWKS URL**:
```
https://content-whale-98.clerk.accounts.dev/.well-known/jwks.json
```

**After configuration**: Everything will work! ✨

---

## 📝 Quick Copy-Paste

For ChipiPay JWKS configuration:

```
JWKS Endpoint URL:
https://content-whale-98.clerk.accounts.dev/.well-known/jwks.json

User Identifier:
Email

JWT Token:
(empty)
```

---

**Go configure JWKS now and the error will be fixed!** 🚀
